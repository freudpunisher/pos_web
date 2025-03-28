"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: number;
  nom: string;
  prix_vente: number;
  quantity: number;
  familleId: number;
}

interface Produit {
  id: number;
  code: string;
  nom: string;
  familleId: number;
  prix_achet: number;
  prix_vente: number;
  reduction: number;
  niveau_alert: number;
  type_produit: number;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Famille {
  id: number;
  nom: string;
}

export default function PosInterface() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [produits, setProduits] = useState<Produit[]>([]);
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [selectedFamille, setSelectedFamille] = useState<number | null>(null);

  // Fetch products and families from APIs on mount
  useEffect(() => {
    async function fetchData() {
      const resProduits = await fetch("/api/produits");
      const produitsData = await resProduits.json();
      setProduits(produitsData);

      const resFamilles = await fetch("/api/familles");
      const famillesData = await resFamilles.json();
      setFamilles(famillesData);
    }
    fetchData();
  }, []);

  // Filter products by search term and selected family
  const filteredProduits = produits.filter((produit) => {
    const matchesSearch = produit.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamille = selectedFamille ? produit.familleId === selectedFamille : true;
    return matchesSearch && matchesFamille;
  });

  const addToCart = (produit: Produit) => {
    const existingItem = cartItems.find((item) => item.id === produit.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === produit.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: produit.id,
          nom: produit.nom,
          prix_vente: produit.prix_vente,
          quantity: 1,
          familleId: produit.familleId,
        },
      ]);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.prix_vente * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

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
            <div
              key={item.id}
              className="flex items-center justify-between p-2 border-b"
            >
              <div className="flex items-center gap-2">
                <span className="bg-gray-200 px-2 py-1 rounded">
                  {item.quantity}
                </span>
                <span>{item.nom}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>${(item.prix_vente * item.quantity).toFixed(2)}</span>
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
            <Button className="flex-1 bg-green-500 hover:bg-green-600">
              Pay
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Products */}
      <div className="flex-1 p-4 bg-gray-50">
        {/* Famille filter buttons */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            variant={selectedFamille === null ? "default" : "outline"}
            onClick={() => setSelectedFamille(null)}
          >
            All
          </Button>
          {familles.map((famille) => (
            <Button
              key={famille.id}
              variant={selectedFamille === famille.id ? "default" : "outline"}
              onClick={() => setSelectedFamille(famille.id)}
            >
              {famille.nom}
            </Button>
          ))}
        </div>
        {/* Products grid */}
        <div className="grid grid-cols-5 gap-2">
          {filteredProduits.map((produit) => (
            <button
              key={produit.id}
              onClick={() => addToCart(produit)}
              className="p-4 text-sm rounded-lg transition-colors bg-blue-100 hover:bg-blue-200"
            >
              {produit.nom}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
