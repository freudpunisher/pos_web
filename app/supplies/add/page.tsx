"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus } from "lucide-react"
import Navbar from "../../components/Navbar"

interface Product {
  id: number
  nom: string
  code: string
  unite_mesures: {
    code: string
  }[]
}

interface Supplier {
  id: number
  first_name: string
  last_name: string
  company?: string
}

interface SelectedProduct {
  id: number
  name: string
  quantity: number
  unit: string
  price: number
}

export default function AddSupplyPage() {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<number>()
  const [reference, setReference] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, suppliersRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/fournisseurs")
        ])
        
        if (!productsRes.ok || !suppliersRes.ok) throw new Error("Failed to fetch data")
        
        const productsData = await productsRes.json()
        const suppliersData = await suppliersRes.json()
        
        setProducts(productsData)
        setSuppliers(suppliersData)
      } catch (err) {
        setError("Failed to load required data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAddProduct = (product: Product) => {
    const existing = selectedProducts.find(p => p.id === product.id)
    const unit = product.unite_mesures[0]?.code || 'unit'
    
    if (existing) {
      setSelectedProducts(selectedProducts.map(p => 
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      ))
    } else {
      setSelectedProducts([...selectedProducts, {
        id: product.id,
        name: product.nom,
        quantity: 1,
        unit,
        price: 0
      }])
    }
  }

  const handleQuantityChange = (id: number, delta: number) => {
    setSelectedProducts(prev => 
      prev.map(p => p.id === id ? { 
        ...p, 
        quantity: Math.max(0, p.quantity + delta) 
      } : p))
  }

  const handlePriceChange = (id: number, price: number) => {
    setSelectedProducts(prev => 
      prev.map(p => p.id === id ? { 
        ...p, 
        price: Math.max(0, price) 
      } : p))
  }

  const handleCreateSupply = async () => {
    if (!selectedSupplier || !reference || selectedProducts.length === 0) {
      setError("Please fill all required fields and select at least one product")
      return
    }

    try {
      const response = await fetch("/api/supplies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fournisseurId: selectedSupplier,
          reference,
          details: selectedProducts.map(p => ({
            produitId: p.id,
            quantity: p.quantity,
            price_per_unit: p.price
          }))
        })
      })

      if (!response.ok) throw new Error("Failed to create supply")
      
      router.push("/supplies")
    } catch (err) {
      console.error("Create supply error:", err)
      setError("Failed to create supply. Please try again.")
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Supplier and Reference Section */}
          <div className="col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Supply Information</CardTitle>
                <CardDescription>Enter supply details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Supplier *</Label>
                  <Select onValueChange={(value) => setSelectedSupplier(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={String(supplier.id)}>
                          {supplier.company || `${supplier.first_name} ${supplier.last_name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Reference Number *</Label>
                  <Input 
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Enter reference number"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Available Products</CardTitle>
              <CardDescription>Search and select products</CardDescription>
              <Input
                placeholder="Search products..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>{product.nom}</TableCell>
                        <TableCell>{product.code}</TableCell>
                        <TableCell>{product.unite_mesures[0]?.code || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            onClick={() => handleAddProduct(product)}
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Selected Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Selected Products</CardTitle>
                <CardDescription>Adjust quantities and prices</CardDescription>
              </div>
              <Button onClick={handleCreateSupply}>Create Supply</Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(product.id, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => 
                                handleQuantityChange(product.id, Number(e.target.value))
                              }
                              className="w-20 text-center"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(product.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={product.price}
                            onChange={(e) => 
                              handlePriceChange(product.id, parseFloat(e.target.value))
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          ${(product.quantity * product.price).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => 
                              setSelectedProducts(prev => 
                                prev.filter(p => p.id !== product.id))
                            }
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}