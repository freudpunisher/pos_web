"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Eye, X, Search, Filter } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

interface Supply {
  id: number;
  reference: string;
  fournisseur?: { first_name: string,

    last_name: string };
   
  createdAt: string;
  details?: {
    id: number;
    produitId: string;
    quantity: string;
    price_per_unit: string;
    total_price: string;
    produit?: string;
  }[];
}

const AddProductToSupplyDialog = ({
  supplyId,
  onProductAdded,
  products,
}: {
  supplyId: number;
  onProductAdded: () => void;
  products: { id: string; name: string }[];
}) => {
  const [formData, setFormData] = useState({
    produitId: "",
    quantity: "",
    price_per_unit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/supplies/${supplyId}/details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produitId: parseInt(formData.produitId),
          quantity: parseFloat(formData.quantity),
          price_per_unit: parseFloat(formData.price_per_unit),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to supply");
      }

      toast.success("Product added to supply successfully");
      onProductAdded();
    } catch (error) {
      toast.error("Failed to add product to supply");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Product to Supply</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Product</label>
            <Select
              value={formData.produitId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, produitId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((prod) => (
                  <SelectItem key={prod.id} value={prod.id}>
                    {prod.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Quantity</label>
            <Input
              type="number"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quantity: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Price per Unit</label>
            <Input
              type="number"
              placeholder="Enter price per unit"
              value={formData.price_per_unit}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price_per_unit: e.target.value }))
              }
            />
          </div>
          <Button type="submit" className="w-full">
            Add Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function SuppliesPage() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [filteredSupplies, setFilteredSupplies] = useState<Supply[]>([]);
  const [expandedSupplyId, setExpandedSupplyId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    reference: "",
    supplierId: "",
    startDate: "",
    endDate: "",
  });

  const fetchSupplies = async () => {
    try {
      const response = await fetch("/api/supplies");
      const data = await response.json();
      setSupplies(data);
      setFilteredSupplies(data);
    } catch (error) {
      toast.error("Failed to fetch supplies");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/produits");
      const data = await res.json();
      const mapped = data.map((prod: any) => ({
        id: prod.id.toString(),
        name: prod.nom,
      }));
      setProducts(mapped);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("/api/fournisseurs");
      const data = await res.json();
      const mapped = data.map((s: any) => ({
        id: s.id.toString(),
        name: `${s.first_name} ${s.last_name}`,
      }));
      setSuppliers(mapped);
    } catch (error) {
      toast.error("Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    fetchSupplies();
    fetchProducts();
    fetchSuppliers();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...supplies];

    if (filters.reference) {
      result = result.filter(supply => 
        supply.reference.toLowerCase().includes(filters.reference.toLowerCase())
      );
    }

    if (filters.supplierId) {
      result = result.filter(supply => 
        supply.fournisseur?.first_name === 
        suppliers.find(s => s.id === filters.supplierId)?.name
      );
    }

    if (filters.startDate) {
      result = result.filter(supply => 
        new Date(supply.createdAt) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      result = result.filter(supply => 
        new Date(supply.createdAt) <= new Date(filters.endDate)
      );
    }

    setFilteredSupplies(result);
  }, [filters, supplies, suppliers]);

  const handleDeleteSupply = async (supplyId: number) => {
    try {
      const response = await fetch(`/api/supplies/${supplyId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSupplies((prev) => prev.filter((supply) => supply.id !== supplyId));
        toast.success("Supply deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete supply");
    }
  };

  const handleDeleteSupplyDetail = async (supplyId: number, detailId: number) => {
    try {
      const response = await fetch(`/api/supplies/${supplyId}/details/${detailId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchSupplies();
        toast.success("Supply detail deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete supply detail");
    }
  };

  const handleResetFilters = () => {
    setFilters({
      reference: "",
      supplierId: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Supplies Management</h1>
          <CreateSupplyDialog onSupplyCreated={fetchSupplies} />
        </div>

        {/* Filters Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Reference</label>
                <Input
                  placeholder="Search reference"
                  value={filters.reference}
                  onChange={(e) => 
                    setFilters(prev => ({ ...prev, reference: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Supplier</label>
                <Select
                  value={filters.supplierId}
                  onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, supplierId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => 
                    setFilters(prev => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => 
                    setFilters(prev => ({ ...prev, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="mt-4"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Products</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupplies.map((supply) => (
                  <React.Fragment key={supply.id}>
                    <TableRow className="hover:bg-gray-100">
                      <TableCell>{supply.id}</TableCell>
                      <TableCell>{supply.reference}</TableCell>
                      <TableCell>{supply.fournisseur?.first_name + " " + supply.fournisseur?.last_name || "N/A"}</TableCell>
                      <TableCell>{new Date(supply.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{supply.details?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setExpandedSupplyId(expandedSupplyId === supply.id ? null : supply.id)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSupply(supply.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedSupplyId === supply.id && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex justify-between items-center">
                                Supply Details
                                <AddProductToSupplyDialog 
                                  supplyId={supply.id} 
                                  onProductAdded={() => {
                                    fetchSupplies();
                                    setExpandedSupplyId(supply.id);
                                  }}
                                  products={products}
                                />
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product ID</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price per Unit</TableHead>
                                    <TableHead>Total Price</TableHead>
                                    <TableHead>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {(supply.details ?? []).map((detail: any, index) => (
                                    <TableRow key={detail.id}>
                                      <TableCell>{index + 1}</TableCell>
                                      <TableCell>{detail.produit || "N/A"}</TableCell>
                                      <TableCell>{detail.quantity}</TableCell>
                                      <TableCell>{Number(detail.price_per_unit)}</TableCell>
                                      <TableCell>{Number(detail.price_per_unit) * Number(detail.quantity)}</TableCell>
                                      <TableCell>
                                        <Button 
                                          variant="destructive" 
                                          size="sm"
                                          onClick={() => handleDeleteSupplyDetail(supply.id, detail.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <span>Page {pagination.page}</span>
          <Button
            variant="outline"
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// Reuse the CreateSupplyDialog from the previous implementation
const CreateSupplyDialog = ({ onSupplyCreated }: { onSupplyCreated: () => void }) => {
  const generatedReference = useMemo(() => `SUP-${Date.now()}`, []);

  const [formData, setFormData] = useState({
    fournisseurId: "",
    reference: generatedReference,
    details: [{ produitId: "", quantity: "", price_per_unit: "" }],
  });

  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/produits");
        const data = await res.json();
        const mapped = data.map((prod: any) => ({
          id: prod.id.toString(),
          name: prod.nom,
        }));
        setProducts(mapped);
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };

    const fetchSuppliers = async () => {
      try {
        const res = await fetch("/api/fournisseurs");
        const data = await res.json();
        const mapped = data.map((s: any) => ({
          id: s.id.toString(),
          name: `${s.first_name} ${s.last_name}`,
        }));
        setSuppliers(mapped);
      } catch (error) {
        toast.error("Failed to fetch suppliers");
      }
    };

    fetchProducts();
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/supplies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fournisseurId: parseInt(formData.fournisseurId),
          reference: formData.reference,
          details: formData.details.map((detail) => ({
            produitId: parseInt(detail.produitId),
            quantity: parseFloat(detail.quantity),
            price_per_unit: parseFloat(detail.price_per_unit),
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create supply");
      }

      toast.success("Supply created successfully");
      setFormData({
        fournisseurId: "",
        reference: `SUP-${Date.now()}`,
        details: [{ produitId: "", quantity: "", price_per_unit: "" }],
      });
      onSupplyCreated();
    } catch (error) {
      toast.error("Failed to create supply");
    }
  };

  const addDetailRow = () => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, { produitId: "", quantity: "", price_per_unit: "" }],
    }));
  };

  const removeDetailRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Supply
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Supply</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Supplier</label>
              <Select
                value={formData.fournisseurId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, fournisseurId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Reference</label>
              <Input type="text" value={formData.reference} readOnly />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Supply Details</h3>
            {formData.details.map((detail, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block mb-2 text-sm font-medium">Product</label>
                  <Select
                    value={detail.produitId}
                    onValueChange={(value) => {
                      const newDetails = [...formData.details];
                      newDetails[index].produitId = value;
                      setFormData((prev) => ({ ...prev, details: newDetails }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((prod) => (
                        <SelectItem key={prod.id} value={prod.id}>
                          {prod.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Quantity</label>
                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={detail.quantity}
                    onChange={(e) => {
                      const newDetails = [...formData.details];
                      newDetails[index].quantity = e.target.value;
                      setFormData((prev) => ({ ...prev, details: newDetails }));
                    }}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-grow">
                    <label className="block mb-2 text-sm font-medium">Price per Unit</label>
                    <Input
                      placeholder="Price per Unit"
                      type="number"
                      value={detail.price_per_unit}
                      onChange={(e) => {
                        const newDetails = [...formData.details];
                        newDetails[index].price_per_unit = e.target.value;
                        setFormData((prev) => ({ ...prev, details: newDetails }));
                      }}
                    />
                  </div>
                  {formData.details.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeDetailRow(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addDetailRow}
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>

          <Button type="submit" className="w-full">
            Create Supply
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};