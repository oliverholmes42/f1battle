'use client'

import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
} from 'chart.js'

// Register the necessary Chart.js components
ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend
)

export default function ChartStandings({ data, yAxisMax }) {
    console.log('[ChartStandings] props:', { data, yAxisMax })

    // Ensure data structure exists
    if (!data || !Array.isArray(data.datasets)) {
        console.error('[ChartStandings] Invalid or missing `data.datasets`:', data)
        return <div>Error: Invalid chart data</div>
    }

    // Debugging each dataset
    console.log('[ChartStandings] datasets:', data.datasets)

    // Extract the most recent point from each dataset
    const current = data.datasets.map((dataset, idx) => {
        console.log(`[ChartStandings] dataset[${idx}]`, dataset)

        if (!dataset || !Array.isArray(dataset.data)) {
            console.warn(`[ChartStandings] dataset[${idx}] is invalid:`, dataset)
            return {
                label: 'Unknown',
                points: 0,
                color: 'gray'
            }
        }

        const label = dataset.label ?? `Unnamed ${idx}`
        const lastPoint = dataset.data[dataset.data.length - 1]
        const color = dataset.borderColor ?? 'black'

        console.log(`[ChartStandings] current: label=${label}, points=${lastPoint}, color=${color}`)

        return {
            label,
            points: lastPoint,
            color
        }
    })

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false }
            },
            y: {
                grid: { display: false },
                border: { display: false },
                min: 0,
                max: yAxisMax
            }
        }
    }

    return (
        <div>
            <div className="card">
                <h5 className="fw-semibold text-muted mb-2">Championship Watch</h5>

                <div className="d-flex justify-content-center gap-4 flex-wrap">
                    {current.map((item, index) => {
                        console.log(`[ChartStandings] rendering summary item[${index}]`, item)

                        return (
                            <div
                                key={item?.label ?? index}
                                className="d-flex flex-column align-items-center w-25"
                                style={{ color: item.color }}
                            >
                                <span className="text-uppercase fw-bold fs-5">
                                    {item?.label ?? "?"}
                                </span>
                                <span className="fs-3 fw-bold">
                                    {item?.points ?? "?"}
                                </span>
                            </div>
                        )
                    })}
                </div>

                <Line
                    data={data}
                    options={options}
                    height={200}
                />
            </div>
        </div>
    )
}
