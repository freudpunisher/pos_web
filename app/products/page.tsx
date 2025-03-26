"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/toaster"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, Edit } from "lucide-react"
import Navbar from "../components/Navbar"

interface Product {
  id: number
  code: string
  nom: string
  familleId: number
  type_produit: number
  description: string
}

interface Famille {
  id: number
  nom: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [familles, setFamilles] = useState<Famille[]>([])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const { toast } = useToast()

  const [newProduct, setNewProduct] = useState({
    code: "",
    nom: "",
    familleId: "",
    type_produit: "0",
    description: "",
  })

  useEffect(() => {
    fetchProducts()
    fetchFamilles()
  }, [])

  const fetchProducts = async () => {
    const response = await fetch("/api/produits")
    const data = await response.json()
    setProducts(data)
  }

  const fetchFamilles = async () => {
    const response = await fetch("/api/familles")
    const data = await response.json()
    setFamilles(data)
  }

  const handleAddProduct = async () => {
    try {
      const response = await fetch("/api/produits/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newProduct.code,
          nom: newProduct.nom,
          familleId: parseInt(newProduct.familleId),
          type_produit: parseInt(newProduct.type_produit),
          description: newProduct.description,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create product')
      }

      const addedProduct = await response.json()
      setProducts([...products, addedProduct])
      setNewProduct({
        code: "",
        nom: "",
        familleId: "",
        type_produit: "0",
        description: "",
      })
      setIsAddProductOpen(false)
      
      toast({
        title: "Success",
        description: "Product created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product. Please try again.",
      })
    }
  }

  const handleEditClick = (product: Product) => {
    setProductToEdit(product)
    setIsEditProductOpen(true)
  }

  const handleEditProduct = async () => {
    if (!productToEdit) return

    try {
      const response = await fetch(`/api/produits/${productToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: productToEdit.code,
          nom: productToEdit.nom,
          familleId: productToEdit.familleId,
          type_produit: productToEdit.type_produit,
          description: productToEdit.description,
        }),
      })
fetchProducts();
      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      const updatedProduct = await response.json()
      setProducts(products.map((product) => 
        product.id === updatedProduct.id ? updatedProduct : product
      ))
      setIsEditProductOpen(false)
      setProductToEdit(null)
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product. Please try again.",
      })
    }
  }

  const handleDeleteClick = (productId: number) => {
    setProductToDelete(productId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    try {
      const response = await fetch(`/api/produits/${productToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      setProducts(products.filter((product) => product.id !== productToDelete))
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product. Please try again.",
      })
    }

    setIsDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </div>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Enter the details of the new product below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="code">Code</Label>
                      <Input
                        id="code"
                        value={newProduct.code}
                        onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nom">Name</Label>
                      <Input
                        id="nom"
                        value={newProduct.nom}
                        onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="famille">Family</Label>
                      <Select
                        value={newProduct.familleId}
                        onValueChange={(value) => setNewProduct({ ...newProduct, familleId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a family" />
                        </SelectTrigger>
                        <SelectContent>
                          {familles.map((famille) => (
                            <SelectItem key={famille.id} value={famille.id.toString()}>
                              {famille.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type_produit">Product Type</Label>
                      <Select
                        value={newProduct.type_produit}
                        onValueChange={(value) => setNewProduct({ ...newProduct, type_produit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Bar</SelectItem>
                          <SelectItem value="1">Resto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2 col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddProduct}>Add Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Code</TableHead>
                    <TableHead className="text-right">Name</TableHead>
                    <TableHead className="text-right">Family</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.code}</TableCell>
                      <TableCell className="text-right font-medium">{product.nom}</TableCell>
                      <TableCell className="text-right font-medium">
                        {familles.find(f => f.id === product.familleId)?.nom}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Edit the details of the product below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={productToEdit?.code || ""}
                  onChange={(e) => setProductToEdit({ ...productToEdit!, code: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nom">Name</Label>
                <Input
                  id="nom"
                  value={productToEdit?.nom || ""}
                  onChange={(e) => setProductToEdit({ ...productToEdit!, nom: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="famille">Family</Label>
                <Select
                  value={productToEdit?.familleId.toString() || ""}
                  onValueChange={(value) => setProductToEdit({ ...productToEdit!, familleId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a family" />
                  </SelectTrigger>
                  <SelectContent>
                    {familles.map((famille) => (
                      <SelectItem key={famille.id} value={famille.id.toString()}>
                        {famille.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type_produit">Product Type</Label>
                <Select
                  value={productToEdit?.type_produit.toString() || "0"}
                  onValueChange={(value) => setProductToEdit({ ...productToEdit!, type_produit: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Bar</SelectItem>
                    <SelectItem value="1">Resto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={productToEdit?.description || ""}
                  onChange={(e) => setProductToEdit({ ...productToEdit!, description: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}