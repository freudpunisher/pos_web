'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Eye } from 'lucide-react'
import Navbar from "../components/Navbar"
import TransactionModal from "../components/TransactionModal"

// Sample data - in a real app, this would come from your database
const transactions = [
  {
    id: "INV-001",
    date: "2024-01-16",
    amount: 245.50,
    items: [
      { name: "Product A", quantity: 2, price: 50.00 },
      { name: "Product B", quantity: 1, price: 145.50 },
    ],
    status: "Completed"
  },
  {
    id: "INV-002",
    date: "2024-01-16",
    amount: 125.00,
    items: [
      { name: "Product C", quantity: 1, price: 125.00 },
    ],
    status: "Pending"
  },
  {
    id: "INV-003",
    date: "2024-01-15",
    amount: 542.75,
    items: [
      { name: "Product A", quantity: 3, price: 150.00 },
      { name: "Product B", quantity: 2, price: 291.00 },
      { name: "Product D", quantity: 1, price: 101.75 },
    ],
    status: "Completed"
  },
  {
    id: "INV-004",
    date: "2024-01-15",
    amount: 89.99,
    items: [
      { name: "Product E", quantity: 1, price: 89.99 },
    ],
    status: "Cancelled"
  },
  {
    id: "INV-005",
    date: "2024-01-14",
    amount: 328.25,
    items: [
      { name: "Product B", quantity: 1, price: 145.50 },
      { name: "Product C", quantity: 1, price: 125.00 },
      { name: "Product E", quantity: 1, price: 57.75 },
    ],
    status: "Completed"
  },
  // Add more transactions to demonstrate pagination
  ...[...Array(15)].map((_, index) => ({
    id: `INV-00${index + 6}`,
    date: "2024-01-13",
    amount: Math.random() * 500 + 50,
    items: [{ name: "Various Products", quantity: 1, price: Math.random() * 500 + 50 }],
    status: ["Completed", "Pending", "Cancelled"][Math.floor(Math.random() * 3)]
  }))
]

export default function HistoryPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null)
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    status: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const transactionsPerPage = 5

  const handleView = (id: string) => {
    const transaction = transactions.find(t => t.id === id)
    if (transaction) {
      setSelectedTransaction(transaction)
    }
  }

  const handleCloseModal = () => {
    setSelectedTransaction(null)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const applyFilters = (currentFilters: typeof filters) => {
    const filtered = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return (
        (!currentFilters.startDate || date >= new Date(currentFilters.startDate)) &&
        (!currentFilters.endDate || date <= new Date(currentFilters.endDate)) &&
        (!currentFilters.minAmount || transaction.amount >= parseFloat(currentFilters.minAmount)) &&
        (!currentFilters.maxAmount || transaction.amount <= parseFloat(currentFilters.maxAmount)) &&
        (!currentFilters.status || currentFilters.status === 'All' || transaction.status === currentFilters.status)
      );
    });
    setFilteredTransactions(filtered);
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <p className="text-gray-600">View and filter your past transactions</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                id="endDate"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <Label htmlFor="minAmount">Min Amount</Label>
              <Input
                type="number"
                id="minAmount"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <Label htmlFor="maxAmount">Max Amount</Label>
              <Input
                type="number"
                id="maxAmount"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                placeholder="1000"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="rounded-md border border-gray-200">
            <Table className="border-collapse">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Reference No.</TableHead>
                  <TableHead className="font-medium">Date</TableHead>
                  <TableHead className="font-medium">Amount</TableHead>
                  <TableHead className="font-medium">Items</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.items.length}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                        ${transaction.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'}`}>
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(transaction.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    isActive={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => {
                  if (
                    index === 0 ||
                    index === totalPages - 1 ||
                    (index >= currentPage - 2 && index <= currentPage + 2)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => setCurrentPage(index + 1)}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (index === currentPage - 3 || index === currentPage + 3) {
                    return <PaginationEllipsis key={index} />;
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    isActive={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

