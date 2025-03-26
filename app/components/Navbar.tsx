"use client"

import Link from "next/link"
import ProfileMenu from "./ProfilMenu"
import SetupMenu from "./SetupMenu"

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="flex items-center h-12">
        <div className="flex space-x-1">
          <NavItem href="/" active>
            Dashboard
          </NavItem>
          <NavItem href="#" className="bg-green-600">
            Sell
          </NavItem>
          <NavItem href="/products">Products</NavItem>
          <NavItem href="/supplies">Supplies</NavItem>
          <NavItem href="/history">History</NavItem>
          <NavItem href="#">Customers</NavItem>
          <SetupMenu />
          <NavItem href="#">Help</NavItem>
        </div>
        <div className="ml-auto flex items-center space-x-4 px-4">
          <span>JANE</span>
          <span>ALL OUTLETS</span>
          <ProfileMenu />
        </div>
      </div>
    </nav>
  )
}

function NavItem({
  children,
  active,
  className = "",
  href,
}: {
  children: React.ReactNode
  active?: boolean
  className?: string
  href: string
}) {
  return (
    <Link
      href={href}
      className={`px-4 h-12 flex items-center hover:bg-gray-700 ${active ? "bg-gray-700" : ""} ${className}`}
    >
      {children}
    </Link>
  )
}

