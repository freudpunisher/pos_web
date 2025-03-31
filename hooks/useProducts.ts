import { useState, useEffect, useCallback } from 'react';
import { Product } from '../app/types';
import { toast } from 'react-toastify';

export const useProducts = () => {
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/produits");
      if (!res.ok) throw new Error("Network response was not ok");
      
      const data = await res.json();
      const mapped = data.map((prod: any) => ({
        id: prod.id.toString(),
        name: prod.nom,
      }));
      setProducts(mapped);
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, fetchProducts };
};