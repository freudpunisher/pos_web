import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';

interface AddProductToSupplyDialogProps {
  supplyId: number;
  onProductAdded: () => void;
  products: { id: string; name: string }[];
}

export const AddProductToSupplyDialog: React.FC<AddProductToSupplyDialogProps> = ({
  supplyId,
  onProductAdded,
  products,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    produitId: "",
    quantity: "",
    price_per_unit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.produitId || !formData.quantity || !formData.price_per_unit) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      const response = await fetch(`/api/supplyDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplyId: supplyId,
          produitId: parseInt(formData.produitId),
          quantity: parseFloat(formData.quantity),
          price_per_unit: parseFloat(formData.price_per_unit),
          total_price: parseFloat(formData.quantity) * parseFloat(formData.price_per_unit),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to supply");
      }

      toast.success("Product added to supply successfully");
      onProductAdded();
      setFormData({
        produitId: "",
        quantity: "",
        price_per_unit: "",
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add product to supply");
      console.error("Error adding product to supply:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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