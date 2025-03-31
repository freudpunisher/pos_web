import { useState, useEffect, useCallback } from 'react';
import { Supplier } from '../app/types';
import { toast } from 'react-toastify';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/fournisseurs");
      if (!res.ok) throw new Error("Network response was not ok");
      
      const data = await res.json();
      const mapped = data.map((s: any) => ({
        id: s.id.toString(),
        name: `${s.first_name} ${s.last_name}`,
      }));
      setSuppliers(mapped);
    } catch (error) {
      toast.error("Failed to fetch suppliers");
      console.error("Error fetching suppliers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return { suppliers, isLoading, fetchSuppliers };
};
