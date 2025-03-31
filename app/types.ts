export interface Product {
    id: number
    name: string
    price: number
  }
  



  export interface Supplier {
    id: string;
    first_name: string;
    last_name: string;
    name?: string; // Computed property
  }
  
  // export interface Product {
  //   id: string;
  //   nom: string;
  //   name?: string; // Computed property
  // }
  
  export interface SupplyDetail {
    id: number;
    produitId: string;
    quantity: string;
    price_per_unit: string;
    total_price: string;
    produit?: string;
  }
  
  export interface Supply {
    id: number;
    reference: string;
    fournisseur?: { 
      first_name: string;
      last_name: string;
    };
    created_at: string;
    details?: SupplyDetail[];
  }
  
  export interface FilterState {
    reference: string;
    supplierId: string;
    startDate: string;
    endDate: string;
  }
  