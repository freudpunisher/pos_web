"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Settings, Users, Store, CreditCard, Bell, FolderTree, Ruler } from "lucide-react"

const setupMenuItems = [
  { name: "General Settings", icon: Settings, description: "Configure general app settings", href: "/setup/general" },
  { name: "User Management", icon: Users, description: "Manage user accounts and permissions", href: "/setup/users" },
  { name: "Store Setup", icon: Store, description: "Set up your store details", href: "/setup/store" },
  { name: "Payment Methods", icon: CreditCard, description: "Configure payment options", href: "/setup/payments" },
  {
    name: "Notifications",
    icon: Bell,
    description: "Manage your notification preferences",
    href: "/setup/notifications",
  },
  { name: "Famille", icon: FolderTree, description: "Manage product families", href: "/parametrage/familles" },
  { name: "Unité de Mesure", icon: Ruler,  href: "/parametrage/unite" },
  {
    name: "Fournisseurs",
    icon: Bell,
    // description: "Manage your notification preferences",
    href: "/parametrage/fournisseurs",
  },
]

export default function SetupMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const router = useRouter()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="px-4 h-12 hover:bg-gray-700"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => {
            if (!activeItem) setIsOpen(false)
          }}
        >
          Setup
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        <div className="grid gap-4 py-4">
          {setupMenuItems.map((item) => (
            <HoverCard key={item.name} openDelay={0} closeDelay={0}>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onMouseEnter={() => setActiveItem(item.name)}
                  onMouseLeave={() => setActiveItem(null)}
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent
                className="w-80"
                onMouseEnter={() => setActiveItem(item.name)}
                onMouseLeave={() => setActiveItem(null)}
              >
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{item.name}</h4>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

