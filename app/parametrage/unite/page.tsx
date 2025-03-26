"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit } from "lucide-react"
import Navbar from "../../components/Navbar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UniteMesure {
  id: number
  produitId: number
  desigantion: string
  code: string
  value_piece: number
  value_rapport: number
  value_prix_vente: number
}

interface Produit {
  id: number
  nom: string
}

export default function UniteMesuresPage() {
  const [uniteMesures, setUniteMesures] = useState<UniteMesure[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [uniteMesureToDelete, setUniteMesureToDelete] = useState<number | null>(null)
  const [uniteMesureToEdit, setUniteMesureToEdit] = useState<UniteMesure | null>(null)
  const { toast } = useToast()

  const [newUniteMesure, setNewUniteMesure] = useState({
    produitId: "",
    desigantion: "",
    code: "",
    value_piece: "",
    value_rapport: "",
    value_prix_vente: "",
  })

  useEffect(() => {
    fetchUniteMesures()
    fetchProduits()
  }, [])

  const fetchUniteMesures = async () => {
    try {
      const response = await fetch("/api/unite")
      const data = await response.json()
      setUniteMesures(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch unités de mesure",
      })
    }
  }

  const fetchProduits = async () => {
    try {
      const response = await fetch("/api/produits")
      const data = await response.json()
      setProduits(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch produits",
      })
    }
  }

  const handleAddUniteMesure = async () => {
    try {
      const response = await fetch("/api/unite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produitId: parseInt(newUniteMesure.produitId),
          desigantion: newUniteMesure.desigantion,
          code: newUniteMesure.code,
          value_piece: parseFloat(newUniteMesure.value_piece),
          value_rapport: parseFloat(newUniteMesure.value_rapport),
          value_prix_vente: parseFloat(newUniteMesure.value_prix_vente),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create unité de mesure")
      }

      const addedUniteMesure = await response.json()
      setUniteMesures([...uniteMesures, addedUniteMesure])
      setNewUniteMesure({
        produitId: "",
        desigantion: "",
        code: "",
        value_piece: "",
        value_rapport: "",
        value_prix_vente: "",
      })
      setIsAddDialogOpen(false)

      toast({
        title: "Success",
        description: "Unité de mesure created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create unité de mesure. Please try again.",
      })
    }
  }

  const handleEditClick = (uniteMesure: UniteMesure) => {
    setUniteMesureToEdit(uniteMesure)
    setIsEditDialogOpen(true)
  }

  const handleEditUniteMesure = async () => {
    if (!uniteMesureToEdit) return

    try {
      const response = await fetch(`/api/unite/${uniteMesureToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produitId: parseInt(uniteMesureToEdit.produitId.toString()),
          desigantion: uniteMesureToEdit.desigantion,
          code: uniteMesureToEdit.code,
          value_piece: parseFloat(uniteMesureToEdit.value_piece.toString()),
          value_rapport: parseFloat(uniteMesureToEdit.value_rapport.toString()),
          value_prix_vente: parseFloat(uniteMesureToEdit.value_prix_vente.toString()),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update unité de mesure")
      }

      const updatedUniteMesure = await response.json()
      setUniteMesures(uniteMesures.map((um) =>
        um.id === updatedUniteMesure.id ? updatedUniteMesure : um
      ))
      setIsEditDialogOpen(false)
      setUniteMesureToEdit(null)

      toast({
        title: "Success",
        description: "Unité de mesure updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update unité de mesure. Please try again.",
      })
    }
  }

  const handleDeleteClick = (id: number) => {
    setUniteMesureToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!uniteMesureToDelete) return

    try {
      const response = await fetch(`/api/unite/${uniteMesureToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete unité de mesure")
      }

      setUniteMesures(uniteMesures.filter((um) => um.id !== uniteMesureToDelete))
      toast({
        title: "Success",
        description: "Unité de mesure deleted successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete unité de mesure. Please try again.",
      })
    }

    setIsDeleteDialogOpen(false)
    setUniteMesureToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Unités de Mesure</CardTitle>
              <CardDescription>Manage your unités de mesure</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Unité de Mesure
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Unité de Mesure</DialogTitle>
                  <DialogDescription>Enter the details of the new unité de mesure below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="produitId">Produit</Label>
                      <Select
                        value={newUniteMesure.produitId}
                        onValueChange={(value) => setNewUniteMesure({ ...newUniteMesure, produitId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {produits.map((produit) => (
                            <SelectItem key={produit.id} value={produit.id.toString()}>
                              {produit.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="desigantion">Désignation</Label>
                      <Input
                        id="desigantion"
                        value={newUniteMesure.desigantion}
                        onChange={(e) => setNewUniteMesure({ ...newUniteMesure, desigantion: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="code">Code</Label>
                      <Input
                        id="code"
                        value={newUniteMesure.code}
                        onChange={(e) => setNewUniteMesure({ ...newUniteMesure, code: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="value_prix_vente">Value Prix Vente</Label>
                      <Input
                        id="value_prix_vente"
                        type="number"
                        value={newUniteMesure.value_prix_vente}
                        onChange={(e) => setNewUniteMesure({ ...newUniteMesure, value_prix_vente: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddUniteMesure}>Add Unité de Mesure</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Désignation</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Value Prix Vente</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uniteMesures.map((um) => (
                    <TableRow key={um.id}>
                      <TableCell>{um.id}</TableCell>
                      <TableCell>
                        {produits.find((p) => p.id === um.produitId)?.nom || "Unknown"}
                      </TableCell>
                      <TableCell>{um.desigantion}</TableCell>
                      <TableCell>{um.code}</TableCell>
                      <TableCell>{um.value_prix_vente}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditClick(um)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(um.id)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Unité de Mesure</DialogTitle>
            <DialogDescription>Edit the details of the unité de mesure below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="produitId">Produit</Label>
                <Select
                  value={uniteMesureToEdit?.produitId.toString() || ""}
                  onValueChange={(value) =>
                    setUniteMesureToEdit({ ...uniteMesureToEdit!, produitId: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {produits.map((produit) => (
                      <SelectItem key={produit.id} value={produit.id.toString()}>
                        {produit.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desigantion">Désignation</Label>
                <Input
                  id="desigantion"
                  value={uniteMesureToEdit?.desigantion || ""}
                  onChange={(e) =>
                    setUniteMesureToEdit({ ...uniteMesureToEdit!, desigantion: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={uniteMesureToEdit?.code || ""}
                  onChange={(e) =>
                    setUniteMesureToEdit({ ...uniteMesureToEdit!, code: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value_prix_vente">Value Prix Vente</Label>
                <Input
                  id="value_prix_vente"
                  type="number"
                  value={uniteMesureToEdit?.value_prix_vente.toString() || ""}
                  onChange={(e) =>
                    setUniteMesureToEdit({ ...uniteMesureToEdit!, value_prix_vente: parseFloat(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditUniteMesure}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the unité de mesure.
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