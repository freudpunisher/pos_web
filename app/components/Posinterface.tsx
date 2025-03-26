"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

const productCategories = [
  { name: "Clothing", items: ["Silk Dress", "Cotton Dress", "Midi Dress", "Stripe Dress", "Red Dress"] },
  { name: "Tops", items: ["White Tee", "Blue Tee", "Black Tee", "Stripe Tee", "Grey Tee"] },
  { name: "Accessories", items: ["Ring", "Bracelet", "Earring", "Necklace", "Bangle"] },
  { name: "Bags", items: ["Hoop", "Stud", "Handbag", "Tote Bag", "Clutch"] },
  { name: "Scarves", items: ["Scarf", "Throw", "Pashmina", "Purse", "Coil"] },
  { name: "Shoes", items: ["Pumps", "Heels", "Sand Shoes", "Sandals", "Boots"] },
  { name: "Bottoms", items: ["Jeans", "Capri", "Chinos", "Leggings", "Trousers"] },
  { name: "Eyewear", items: ["Sunglasses", "Opticals"] },
]

export default function PosInterface() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const addToCart = (name: string) => {
    const price = Math.floor(Math.random() * 100) + 20 // Simulate random prices
    const existingItem = cartItems.find((item) => item.name === name)

    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.name === name ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCartItems([
        ...cartItems,
        {
          id: Date.now(),
          name,
          price,
          quantity: 1,
        },
      ])
    }
  }

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  return (
    <div className="flex h-[calc(100vh-50px)]">
    {/* Left Panel - Cart */}
    <div className="w-1/3 p-4 border-r">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search products"
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
  
      <div className="h-[calc(100vh-400px)] mb-4 overflow-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center gap-2">
              <span className="bg-gray-200 px-2 py-1 rounded">{item.quantity}</span>
              <span>{item.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item.id)}>
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
  
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between mb-2">
          <span>Sub-total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>TOTAL</span>
          <span>${total.toFixed(2)}</span>
        </div>
  
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex-1">
            Void
          </Button>
          <Button variant="outline" className="flex-1">
            Park
          </Button>
          <Button variant="outline" className="flex-1">
            Note
          </Button>
          <Button variant="outline" className="flex-1">
            Discount
          </Button>
          <Button className="flex-1 bg-green-500 hover:bg-green-600">Pay</Button>
        </div>
      </div>
    </div>
  
    {/* Right Panel - Products */}
    <div className="flex-1 p-4 bg-gray-50">
      <div className="grid grid-cols-5 gap-2">
        {productCategories.map((category, categoryIndex) =>
          category.items
            .filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((item, itemIndex) => (
              <button
                key={`${categoryIndex}-${itemIndex}`}
                onClick={() => addToCart(item)}
                className={`p-4 text-sm rounded-lg transition-colors
                    ${
                      categoryIndex === 0
                        ? "bg-green-100 hover:bg-green-200"
                        : categoryIndex === 1
                        ? "bg-blue-100 hover:bg-blue-200"
                        : categoryIndex === 2
                        ? "bg-yellow-100 hover:bg-yellow-200"
                        : categoryIndex === 3
                        ? "bg-purple-100 hover:bg-purple-200"
                        : categoryIndex === 4
                        ? "bg-pink-100 hover:bg-pink-200"
                        : categoryIndex === 5
                        ? "bg-orange-100 hover:bg-orange-200"
                        : categoryIndex === 6
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-red-100 hover:bg-red-200"
                    }`}
              >
                {item}
              </button>
            )),
        )}
      </div>
    </div>
  </div>
  
  )
}

