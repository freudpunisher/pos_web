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
import { Plus, Trash2, Edit } from "lucide-react"
import Navbar from "../../components/Navbar"

interface Famille {
  id: number
  nom: string
}

export default function FamillesPage() {
  const [familles, setFamilles] = useState<Famille[]>([])
  const [isAddFamilleOpen, setIsAddFamilleOpen] = useState(false)
  const [newFamille, setNewFamille] = useState({ nom: "" })
  const router = useRouter()

  useEffect(() => {
    fetchFamilles()
  }, [])

  const fetchFamilles = async () => {
    const response = await fetch("/api/familles")
    const data = await response.json()
    setFamilles(data)
  }

  const handleAddFamille = async () => {
    const response = await fetch("/api/familles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: newFamille.nom,
      }),
    })
    const addedFamille = await response.json()
    setFamilles([...familles, addedFamille])
    setNewFamille({ nom: "" })
    setIsAddFamilleOpen(false)
  }

  const handleDeleteFamille = async (id: number) => {
    await fetch(`/api/familles/${id}`, {
      method: "DELETE",
    })
    setFamilles(familles.filter((famille) => famille.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Product Families</CardTitle>
              <CardDescription>Manage your product families</CardDescription>
            </div>
            <Dialog open={isAddFamilleOpen} onOpenChange={setIsAddFamilleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Family
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Product Family</DialogTitle>
                  <DialogDescription>Enter the name of the new product family below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nom" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="nom"
                      value={newFamille.nom}
                      onChange={(e) => setNewFamille({ ...newFamille, nom: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddFamille}>Add Family</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {familles.map((famille) => (
                    <TableRow key={famille.id}>
                      <TableCell className="font-medium">{famille.id}</TableCell>
                      <TableCell>{famille.nom}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteFamille(famille.id)}>
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
    </div>
  )
}