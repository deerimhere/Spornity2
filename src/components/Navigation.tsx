'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Newspaper, Users, User } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'News', href: '/news', icon: Newspaper },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 md:relative md:bg-transparent">
      <ul className="flex justify-around md:justify-end space-x-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex flex-col items-center text-sm ${
                  isActive ? 'text-blue-400' : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="mt-1 hidden md:inline">{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

