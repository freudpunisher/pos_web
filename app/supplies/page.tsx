"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import Navbar from "../components/Navbar";

// --- Create Supply Dialog with Auto-generated Reference and Product Autocomplete ---
const CreateSupplyDialog = () => {
  // Auto-generate a reference once when the dialog mounts.
  // You could enhance this to be more unique as needed.
  const generatedReference = useMemo(() => {
    return `SUP-${Date.now()}`;
  }, []);

  const [formData, setFormData] = useState({
    fournisseurId: "",
    reference: generatedReference,
    details: [
      { produitId: "", quantity: "", price_per_unit: "" }
    ]
  });

  // State to hold product options fetched from API/produits
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);

  // Fetch products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/produits");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/supplies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Handle successful creation (e.g., refresh list, show toast)
        console.log("Supply created successfully");
      } else {
        console.error("Failed to create supply");
      }
    } catch (error) {
      console.error("Failed to create supply", error);
    }
  };

  const addDetailRow = () => {
    setFormData((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        { produitId: "", quantity: "", price_per_unit: "" }
      ]
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
              <label>Supplier ID</label>
              <Input
                type="text"
                value={formData.fournisseurId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fournisseurId: e.target.value
                  }))
                }
              />
            </div>
            <div>
              <label>Reference</label>
              <Input
                type="text"
                value={formData.reference}
                readOnly // auto-generated, not editable
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Supply Details</h3>
            {formData.details.map((detail, index) => (
              <div key={index} className="grid grid-cols-3 gap-4">
                <div>
                  <label>Product</label>
                  {/* Using a datalist for autocomplete */}
                  <Input
                    list="products-list"
                    placeholder="Select Product"
                    value={detail.produitId}
                    onChange={(e) => {
                      const newDetails = [...formData.details];
                      newDetails[index].produitId = e.target.value;
                      setFormData((prev) => ({ ...prev, details: newDetails }));
                    }}
                  />
                  <datalist id="products-list">
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label>Quantity</label>
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
                <div>
                  <label>Price per Unit</label>
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

// --- Supply Details Row Component ---
const SupplyDetailsRow = ({
  supply,
  onAddProduct
}: {
  supply: Supply;
  onAddProduct: (supplyId: number) => void;
}) => {
  return (
    <TableRow>
      <TableCell colSpan={6}>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Supply Details
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddProduct(supply.id)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
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
                {(supply.details ?? []).map((detail: any) => (
                  <TableRow key={detail.id}>
                    <TableCell>{detail.produitId}</TableCell>
                    <TableCell>{detail.produit?.name || "N/A"}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell>{detail.price_per_unit}</TableCell>
                    <TableCell>{detail.total_price}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TableCell>
    </TableRow>
  );
};

// --- Main Supplies Page ---
interface Supply {
  id: number;
  reference: string;
  fournisseur?: { name: string };
  createdAt: string;
  details?: {
    id: number;
    produitId: string;
    quantity: string;
    price_per_unit: string;
    total_price: string;
    produit?: { name: string };
  }[];
}

export default function SuppliesPage() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [expandedSupplyId, setExpandedSupplyId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    fournisseurId: "",
    minDate: "",
    maxDate: ""
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10
  });

  // Fetch supplies
  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await fetch("/api/supplies");
        const data = await response.json();
        setSupplies(data);
      } catch (error) {
        console.error("Failed to fetch supplies", error);
      }
    };
    fetchSupplies();
  }, []);

  const handleDeleteSupply = async (supplyId: number) => {
    try {
      const response = await fetch(`/api/supplies/${supplyId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setSupplies((prev) =>
          prev.filter((supply) => supply.id !== supplyId)
        );
      }
    } catch (error) {
      console.error("Failed to delete supply", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 space-y-6">
       <Navbar />
       <div className="container mx-auto p-4">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Supplies Management</h1>
        <CreateSupplyDialog />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4">
        <Select
          value={filters.fournisseurId}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, fournisseurId: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Supplier" />
          </SelectTrigger>
          <SelectContent>
            {/* Populate with actual supplier options */}
            <SelectItem value="1">Supplier 1</SelectItem>
            <SelectItem value="2">Supplier 2</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filters.minDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, minDate: e.target.value }))
          }
          placeholder="Min Date"
        />

        <Input
          type="date"
          value={filters.maxDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxDate: e.target.value }))
          }
          placeholder="Max Date"
        />
      </div>

      {/* Supplies Table */}
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
          {supplies.map((supply) => (
            <React.Fragment key={supply.id}>
              <TableRow>
                <TableCell>{supply.id}</TableCell>
                <TableCell>{supply.reference}</TableCell>
                <TableCell>
                  {supply.fournisseur?.name || "N/A"}
                </TableCell>
                <TableCell>
                  {new Date(supply.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{supply.details?.length || 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExpandedSupplyId(
                          expandedSupplyId === supply.id ? null : supply.id
                        )
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
                <SupplyDetailsRow
                  supply={supply}
                  onAddProduct={(supplyId: number) => {
                    // Implement logic to add product to supply
                    console.log("Add product to supply", supplyId);
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          disabled={pagination.page === 1}
          onClick={() =>
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
          }
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
