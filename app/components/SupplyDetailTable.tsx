import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { SupplyDetail } from '../types';
import { AddProductToSupplyDialog } from './AddProductToSuppllyDialog';

interface SupplyDetailTableProps {
  supplyId: number;
  details: SupplyDetail[];
  onDeleteDetail: (supplyId: number, detailId: number) => Promise<void>;
  onProductAdded: () => void;
  products: { id: string; name: string }[];
}

export const SupplyDetailTable: React.FC<SupplyDetailTableProps> = ({
  supplyId,
  details,
  onDeleteDetail,
  onProductAdded,
  products,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Supply Details
          <AddProductToSupplyDialog 
            supplyId={supplyId} 
            onProductAdded={onProductAdded}
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
            {(details ?? []).map((detail, index) => (
              <TableRow key={detail.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{detail.produit || "N/A"}</TableCell>
                <TableCell>{detail.quantity}</TableCell>
                <TableCell>{Number(detail.price_per_unit).toFixed(2)}</TableCell>
                <TableCell>{(Number(detail.price_per_unit) * Number(detail.quantity)).toFixed(2)}</TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDeleteDetail(supplyId, detail.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {details.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No products added to this supply yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};