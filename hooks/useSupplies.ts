import { useState, useEffect, useCallback } from 'react';
import { Supply, FilterState } from '../app/types';
import { toast } from 'react-toastify';

export const useSupplies = () => {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [filteredSupplies, setFilteredSupplies] = useState<Supply[]>([]);
  const [expandedSupplyId, setExpandedSupplyId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  
  const [filters, setFilters] = useState<FilterState>({
    reference: "",
    supplierId: "",
    startDate: "",
    endDate: "",
  });

  const fetchSupplies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/supplies");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSupplies(data);
      setFilteredSupplies(data);
    } catch (error) {
      toast.error("Failed to fetch supplies");
      console.error("Error fetching supplies:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSupply = async (supplyId: number) => {
    try {
      const response = await fetch(`/api/supplies/${supplyId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      
      setSupplies((prev) => prev.filter((supply) => supply.id !== supplyId));
      toast.success("Supply deleted successfully");
    } catch (error) {
      toast.error("Failed to delete supply");
      console.error("Error deleting supply:", error);
    }
  };

  const deleteSupplyDetail = async (supplyId: number, detailId: number) => {
    try {
      const response = await fetch(`/api/supplies/${supplyId}/details/${detailId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      
      fetchSupplies();
      toast.success("Supply detail deleted successfully");
    } catch (error) {
      toast.error("Failed to delete supply detail");
      console.error("Error deleting supply detail:", error);
    }
  };

  const resetFilters = () => {
    setFilters({
      reference: "",
      supplierId: "",
      startDate: "",
      endDate: "",
    });
  };

  return {
    supplies,
    filteredSupplies,
    expandedSupplyId,
    pagination,
    filters,
    isLoading,
    fetchSupplies,
    setExpandedSupplyId,
    setPagination,
    setFilters,
    deleteSupply,
    deleteSupplyDetail,
    resetFilters,
  };
};