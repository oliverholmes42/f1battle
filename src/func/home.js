import {f1api} from "@/lib/api";

import { supabase } from '@/lib/supabaseClient';

let cachedRace = null;

export async function getNextRace() {
    const now = new Date();

    // If no cached race or race date passed, fetch new one
    if (!cachedRace || new Date(cachedRace.date) <= now) {
        const { data: races, error } = await supabase
            .from('races')
            .select('*')
            .gt('date', now.toISOString())
            .order('date', { ascending: true })
            .limit(1);

        if (error || !races || races.length === 0) {
            cachedRace = null;
            return null;
        }

        const race = races[0];

        // Fetch race sessions from F1 API
        const { MRData: { RaceTable: { Races } } } = await f1api(`${now.getFullYear()}/${race.round}`);
        const sessions = Races[0] || {};

        cachedRace = { ...race, ...sessions };
    }

    if (!cachedRace) return null;

    // Map full session names to short codes
    const sessionLabelMap = {
        FirstPractice: 'FP1',
        SecondPractice: 'FP2',
        ThirdPractice: 'FP3',
        Qualifying: 'QUALIFYING',
        Sprint: 'SPRINT',
        SprintQualifying: 'SPRINT SHOOTOUT',
    };

    const sessionLabels = ['FirstPractice', 'SecondPractice', 'ThirdPractice', 'Qualifying', 'Sprint', 'SprintQualifying'];

    // Gather future sessions with their mapped labels
    const futureSessions = sessionLabels
        .map(label => {
            const session = cachedRace[label];
            if (session && session.date && session.time) {
                const dt = new Date(`${session.date}T${session.time}`);
                return dt > now ? { label: sessionLabelMap[label] || label, dt } : null;
            }
            return null;
        })
        .filter(Boolean);

    if (futureSessions.length === 0) {
        cachedRace = null;
        return null;
    }

    // Find the soonest session
    const nextSession = futureSessions.reduce((a, b) => (a.dt < b.dt ? a : b));

    return {
        label: `${cachedRace.name} – ${nextSession.label}`,
        time: nextSession.dt.toISOString(),
        raceid: cachedRace.id,
    };
}


export async function getChartJsRaceData() {
    const { data: rows, error } = await supabase
        .from('host_scores')
        .select(`
      total_score,
      races (
        id,
        name,
        date
      ),
      hosts (
        id,
        name
      )
    `);

    if (error) {
        console.error('Server Failed to fetch chart data:', error);
        return null;
    }

    if (!rows) return null;

    // Sort by race date on client side (Supabase cannot order by related table column)
    rows.sort((a, b) => new Date(a.races.date) - new Date(b.races.date));

    // Prepare data structures
    const raceCodes = [];
    const hostNames = new Set();
    const scoreMap = {};

    for (const { races, hosts, total_score } of rows) {
        if (!races || !hosts) continue;

        const raceName = races.name;
        const hostName = hosts.name;

        // Create race code: first 3 letters uppercase, letters only
        const raceCode = raceName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();

        if (!scoreMap[raceCode]) {
            scoreMap[raceCode] = {};
            raceCodes.push(raceCode);
        }

        hostNames.add(hostName);

        if (total_score != null) {
            scoreMap[raceCode][hostName] = total_score;
        }
    }

    // Labels start with empty string (for chart baseline), then race codes
    const labels = [''].concat(raceCodes);

    const colors = {
        Matt: '#FF4136',
        Tommy: '#1E90FF',
    };

    let globalMax = 0;

    const datasets = Array.from(hostNames).map((host) => {
        let total = 0;
        const data = [0]; // initial zero for start row

        for (const race of raceCodes) {
            total += scoreMap[race]?.[host] ?? 0;
            data.push(total);
        }

        globalMax = Math.max(globalMax, total);

        const pointCount = data.length;

        return {
            label: host,
            data,
            fill: false,
            borderColor: colors[host] || '#888',
            backgroundColor: colors[host] || '#888',
            tension: 0,
            borderWidth: 3,
            pointRadius: Array(pointCount).fill(0).map((_, i) => (i === pointCount - 1 ? 5 : 0)),
            pointHoverRadius: Array(pointCount).fill(0),
        };
    });

    return {
        labels,
        datasets,
        yAxisMax: Math.ceil(globalMax * 1.2), // 20% buffer for y-axis
    };
}


