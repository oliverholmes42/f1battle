'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {apiCall} from "@/lib/api";
import {getNextRace} from "@/func/home";



export default function BottomNav() {
    const pathname = usePathname()
    const [predictionBadge, setPredictionBadge] = useState(null)

    useEffect(() => {
        async function fetchData() {
            const {label, time} = await getNextRace()

            if (label && time) {
                const isFP1 = label.toLowerCase().includes('fp1')
                const sessionTime = new Date(time)
                const now = new Date()
                const diff = sessionTime.getTime() - now.getTime()
                const fourDaysMs = 4 * 24 * 60 * 60 * 1000

                if (isFP1 && diff > 0 && diff <= fourDaysMs) {
                    setPredictionBadge('Open')
                } else {
                    setPredictionBadge('Closed')
                }
            } else {
                setPredictionBadge('Closed')
            }
        }

        fetchData()
    }, [])

    const navItems = [
        {
            href: '/',
            icon: 'bi-house-fill',
        },
        {
            href: '/leaderboard',
            label: 'Leaderboard',
            icon: 'bi-trophy-fill',
        },
        ...(predictionBadge
            ? [{
                href: '/prediction',
                label: 'Prediction',
                icon: {
                    selected: '/assets/p1_purple.webp',
                    unselected: '/assets/p1_black.webp',
                },
                badge: predictionBadge,
            }]
            : []),
        {
            href: '/league',
            label: 'League',
            icon: 'bi-shield',
        },
        {
            href: '/profile',
            label: 'Profile',
            icon: 'bi-person-circle',
        },
    ]

    return (
        <nav className="fixed-bottom bg-white border-top d-flex justify-content-around py-2 d-md-none">
            {navItems.map(({ href, icon, badge }) => {
                const isActive = pathname === href

                return (
                    <Link
                        key={href}
                        href={href}
                        className={`fs-4 text-decoration-none nav-link d-flex flex-column align-items-center position-relative ${
                            isActive ? 'text-primary' : 'text-secondary'
                        }`}
                    >
                        <div className="d-flex flex-column align-items-center">
                            {icon &&
                                (typeof icon === 'string' ? (
                                    <i className={icon} />
                                ) : (
                                    <Image
                                        src={isActive ? icon.selected : icon.unselected}
                                        alt="Prediction"
                                        width={32}
                                        height={32}
                                        style={{ objectFit: 'contain' }}
                                        priority={true}
                                    />
                                ))}
                            {badge && (
                                <span
                                    className="position-absolute translate-middle-y bg-primary text-light px-2 rounded-pill"
                                    style={{
                                        fontSize: '12px',
                                        top: '-5px',
                                    }}
                                >
                                    {badge}
                                </span>
                            )}
                        </div>
                    </Link>
                )
            })}
        </nav>
    )
}
