'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TopBar() {
    const pathname = usePathname()
    const isChat = pathname === '/chat'
    const isNotifications = pathname === '/notifications'

    return (
        <div className="fixed-top bg-white border-bottom shadow-sm d-flex align-items-center justify-content-between px-3 py-2 d-md-none">
            {/* Left: Logo / Name */}
            <div className="fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '1.1rem' }}>
                P1 Battle
            </div>

            <div className="d-flex">
            {/* Right: Chat icon */}
                <Link
                    href=""
                    className={`fs-4 nav-link d-flex align-items-center justify-content-center position-relative ${
                        isNotifications ? 'text-primary' : 'text-secondary'
                    }`}
                    style={{ width: '36px', height: '36px' }}
                    aria-label="Chat"
                >
                    <i className={`bi ${isNotifications ? "bi-bell-fill" : "bi-bell" }`} />
                </Link>

                {/* Right: Chat icon */}
                <Link
                    href=""
                    className={`fs-4 nav-link d-flex align-items-center justify-content-center position-relative ${
                        isChat ? 'text-primary' : 'text-secondary'
                    }`}
                    style={{ width: '36px', height: '36px' }}
                    aria-label="Chat"
                >
                    <i className={`bi ${isChat ?"bi-chat-fill": "bi-chat"}`} />
                </Link>
            </div>
        </div>
    )
}
