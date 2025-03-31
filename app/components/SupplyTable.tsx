import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { Supply } from '../types';
import { SupplyDetailTable } from './SupplyDetailTable';

interface SupplyTableProps {
  supplies: Supply[];
  expandedSupplyId: number | null;
  onExpand: (id: number | null) => void;
  onDelete: (id: number) => Promise<void>;
  onDeleteDetail: (supplyId: number, detailId: number) => Promise<void>;
  onProductAdded: () => void;
  products: { id: string; name: string }[];
}

export const SupplyTable: React.FC<SupplyTableProps> = ({
  supplies,
  expandedSupplyId,
  onExpand,
  onDelete,
  onDeleteDetail,
  onProductAdded,
  products,
}) => {
  return (
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
        {supplies.length > 0 ? (
          supplies.map((supply) => (
            <React.Fragment key={supply.id}>
              <TableRow className="hover:bg-gray-100">
                <TableCell>{supply.id}</TableCell>
                <TableCell>{supply.reference}</TableCell>
                <TableCell>
                  {supply.fournisseur 
                    ? `${supply.fournisseur.first_name} ${supply.fournisseur.last_name}` 
                    : "N/A"}
                </TableCell>
                <TableCell>{new Date(supply.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{supply.details?.length || 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onExpand(expandedSupplyId === supply.id ? null : supply.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(supply.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {expandedSupplyId === supply.id && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <SupplyDetailTable
                      supplyId={supply.id}
                      details={supply.details || []}
                      onDeleteDetail={onDeleteDetail}
                      onProductAdded={onProductAdded}
                      products={products}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              No supplies found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
