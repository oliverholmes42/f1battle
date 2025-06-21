'use client'
import { useEffect, useState } from 'react'


const radius = 40
const stroke = 6
const normalizedRadius = radius - stroke / 2
const circumference = normalizedRadius * 2 * Math.PI

function CircleProgress({
                            value,
                            max = 31,
                            label
                        }) {
    const strokeDashoffset =
        circumference - (value / max) * circumference

    const size = radius * 2 + stroke * 2 // Add padding for stroke
    const center = size / 2

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Outer border circle */}
            <circle
                stroke="var(--bs-secondary)"
                fill="transparent"
                strokeWidth={stroke + 1}
                r={normalizedRadius}
                cx={center}
                cy={center}
            />
            {/* Inner white ring */}
            <circle
                stroke="var(--bs-white)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={center}
                cy={center}
            />
            {/* Progress circle */}
            <circle
                stroke="var(--bs-primary)"
                fill="transparent"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                r={normalizedRadius}
                cx={center}
                cy={center}
                transform={`rotate(-90 ${center} ${center})`}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            {/* Centered Text */}
            <text
                x="50%"
                y="45%"
                textAnchor="middle"
                fill="var(--bs-primary)"
                fontSize="18"
                fontWeight="bold"
                dominantBaseline="middle"
            >
                {value}
            </text>
            <text
                x="50%"
                y="65%"
                textAnchor="middle"
                fill="var(--bs-dark)"
                fontSize="10"
                dominantBaseline="middle"
                style={{ letterSpacing: '1px' }}
            >
                {label}
            </text>
        </svg>
    )
}


export default function Countdown({time}) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        const update = () => {
            const now = new Date()
            const target = new Date(time)
            const diff = target.getTime() - now.getTime()

            if (diff <= 0) {
                setTimeLeft({days: 0, hours: 0, minutes: 0, seconds: 0})
                return
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60)
            })
        }

        update()
        const interval = setInterval(update, 1000)
        return () => clearInterval(interval)
    }, [time])

    return (
        <div className="d-flex gap-6 justify-content-evenly items-center mt-2">
            <CircleProgress value={timeLeft.days} max={100} label="DAYS"/>
            <CircleProgress value={timeLeft.hours} max={24} label="HOURS"/>
            <CircleProgress value={timeLeft.minutes} max={60} label="MINUTES" />
            <CircleProgress value={timeLeft.seconds} max={60} label="SECONDS" />
        </div>
    )
}
