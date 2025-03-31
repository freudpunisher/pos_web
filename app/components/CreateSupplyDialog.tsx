import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface CreateSupplyDialogProps {
  onSupplyCreated: () => void;
  products: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
}

export const CreateSupplyDialog: React.FC<CreateSupplyDialogProps> = ({
  onSupplyCreated,
  products,
  suppliers,
}) => {
  const generatedReference = useMemo(() => `SUP-${Date.now()}`, []);

  const [formData, setFormData] = useState({
    fournisseurId: "",
    reference: generatedReference,
    details: [{ produitId: "", quantity: "", price_per_unit: "" }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.fournisseurId) {
      toast.error("Please select a supplier");
      return;
    }
    
    const isDetailsValid = formData.details.every(
      detail => detail.produitId && detail.quantity && detail.price_per_unit
    );
    
    if (!isDetailsValid) {
      toast.error("Please fill all product details");
      return;
    }
    
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
      console.error("Error creating supply:", error);
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