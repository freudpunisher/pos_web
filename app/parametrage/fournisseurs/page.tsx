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
import { Plus, Trash2, Edit } from "lucide-react"
import Navbar from "../../components/Navbar"

interface Fournisseur {
  id: number
  first_name: string
  last_name: string
  address: string
  contact_person: string
  email: string
  phone_number: string
  created_at: string
  updated_at: string
}

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [isAddFournisseurOpen, setIsAddFournisseurOpen] = useState(false)
  const [isEditFournisseurOpen, setIsEditFournisseurOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [fournisseurToDelete, setFournisseurToDelete] = useState<number | null>(null)
  const [fournisseurToEdit, setFournisseurToEdit] = useState<Fournisseur | null>(null)
  const { toast } = useToast()

  const [newFournisseur, setNewFournisseur] = useState({
    first_name: "",
    last_name: "",
    address: "",
    contact_person: "",
    email: "",
    phone_number: "",
  })

  useEffect(() => {
    fetchFournisseurs()
  }, [])

  const fetchFournisseurs = async () => {
    try {
      const response = await fetch("/api/fournisseurs")
      const data = await response.json()
      setFournisseurs(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch fournisseurs",
      })
    }
  }

  const handleAddFournisseur = async () => {
    try {
      const response = await fetch("/api/fournisseurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFournisseur),
      })

      if (!response.ok) {
        throw new Error("Failed to create fournisseur")
      }

      const addedFournisseur = await response.json()
      setFournisseurs([...fournisseurs, addedFournisseur])
      setNewFournisseur({
        first_name: "",
        last_name: "",
        address: "",
        contact_person: "",
        email: "",
        phone_number: "",
      })
      setIsAddFournisseurOpen(false)
      toast({
        title: "Success",
        description: "Fournisseur created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create fournisseur. Please try again.",
      })
    }
  }

  const handleEditClick = (fournisseur: Fournisseur) => {
    setFournisseurToEdit(fournisseur)
    setIsEditFournisseurOpen(true)
  }

  const handleEditFournisseur = async () => {
    if (!fournisseurToEdit) return

    try {
      const response = await fetch(`/api/fournisseurs/${fournisseurToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fournisseurToEdit),
      })

      if (!response.ok) {
        throw new Error("Failed to update fournisseur")
      }

      const updatedFournisseur = await response.json()
      setFournisseurs(
        fournisseurs.map((f) =>
          f.id === updatedFournisseur.id ? updatedFournisseur : f
        )
      )
      setIsEditFournisseurOpen(false)
      setFournisseurToEdit(null)
      toast({
        title: "Success",
        description: "Fournisseur updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update fournisseur. Please try again.",
      })
    }
  }

  const handleDeleteClick = (fournisseurId: number) => {
    setFournisseurToDelete(fournisseurId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!fournisseurToDelete) return

    try {
      const response = await fetch(`/api/fournisseurs/${fournisseurToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete fournisseur")
      }

      setFournisseurs(fournisseurs.filter((f) => f.id !== fournisseurToDelete))
      toast({
        title: "Success",
        description: "Fournisseur deleted successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete fournisseur. Please try again.",
      })
    }

    setIsDeleteDialogOpen(false)
    setFournisseurToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Fournisseurs</CardTitle>
              <CardDescription>Manage your fournisseurs</CardDescription>
            </div>
            <Dialog open={isAddFournisseurOpen} onOpenChange={setIsAddFournisseurOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Fournisseur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Fournisseur</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new fournisseur below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={newFournisseur.first_name}
                        onChange={(e) =>
                          setNewFournisseur({ ...newFournisseur, first_name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={newFournisseur.last_name}
                        onChange={(e) =>
                          setNewFournisseur({ ...newFournisseur, last_name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2 col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newFournisseur.address}
                        onChange={(e) =>
                          setNewFournisseur({ ...newFournisseur, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact_person">Contact Person</Label>
                      <Input
                        id="contact_person"
                        value={newFournisseur.contact_person}
                        onChange={(e) =>
                          setNewFournisseur({ ...newFournisseur, contact_person: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={newFournisseur.email}
                        onChange={(e) =>
                          setNewFournisseur({ ...newFournisseur, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone_number">Phone Number</Label>
                      <Input
                        id="phone_number"
                        value={newFournisseur.phone_number}
                        onChange={(e) =>
                          setNewFournisseur({ ...newFournisseur, phone_number: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddFournisseur}>Add Fournisseur</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fournisseurs.map((fournisseur) => (
                    <TableRow key={fournisseur.id}>
                      <TableCell className="font-medium">{fournisseur.first_name}</TableCell>
                      <TableCell className="font-medium">{fournisseur.last_name}</TableCell>
                      <TableCell className="font-medium">{fournisseur.email}</TableCell>
                      <TableCell className="font-medium">{fournisseur.phone_number}</TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditClick(fournisseur)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(fournisseur.id)}
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

      {/* Edit Fournisseur Dialog */}
      <Dialog open={isEditFournisseurOpen} onOpenChange={setIsEditFournisseurOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Fournisseur</DialogTitle>
            <DialogDescription>Edit the details for the fournisseur below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_first_name">First Name</Label>
                <Input
                  id="edit_first_name"
                  value={fournisseurToEdit?.first_name || ""}
                  onChange={(e) =>
                    setFournisseurToEdit({ ...fournisseurToEdit!, first_name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_last_name">Last Name</Label>
                <Input
                  id="edit_last_name"
                  value={fournisseurToEdit?.last_name || ""}
                  onChange={(e) =>
                    setFournisseurToEdit({ ...fournisseurToEdit!, last_name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="edit_address">Address</Label>
                <Input
                  id="edit_address"
                  value={fournisseurToEdit?.address || ""}
                  onChange={(e) =>
                    setFournisseurToEdit({ ...fournisseurToEdit!, address: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_contact_person">Contact Person</Label>
                <Input
                  id="edit_contact_person"
                  value={fournisseurToEdit?.contact_person || ""}
                  onChange={(e) =>
                    setFournisseurToEdit({ ...fournisseurToEdit!, contact_person: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  value={fournisseurToEdit?.email || ""}
                  onChange={(e) =>
                    setFournisseurToEdit({ ...fournisseurToEdit!, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_phone_number">Phone Number</Label>
                <Input
                  id="edit_phone_number"
                  value={fournisseurToEdit?.phone_number || ""}
                  onChange={(e) =>
                    setFournisseurToEdit({ ...fournisseurToEdit!, phone_number: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditFournisseur}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the fournisseur.
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
