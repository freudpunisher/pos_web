'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

interface TransactionItem {
  name: string
  quantity: number
  price: number
}

interface Transaction {
  id: string
  date: string
  amount: number
  items: TransactionItem[]
  status: string
}

interface TransactionModalProps {
  transaction: Transaction
  onClose: () => void
}

export default function TransactionModal({ transaction, onClose }: TransactionModalProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    const doc = new jsPDF()

    // Add company logo or name
    doc.setFontSize(20)
    doc.text("Your Company Name", 105, 15, { align: "center" })

    // Add invoice details
    doc.setFontSize(12)
    doc.text(`Invoice: ${transaction.id}`, 20, 30)
    doc.text(`Date: ${new Date(transaction.date).toLocaleDateString()}`, 20, 40)
    doc.text(`Status: ${transaction.status}`, 20, 50)

    // Add items table
    doc.autoTable({
      startY: 60,
      head: [['Item', 'Quantity', 'Price', 'Total']],
      body: transaction.items.map(item => [
        item.name,
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${(item.quantity * item.price).toFixed(2)}`
      ]),
      foot: [['', '', 'Total', `$${transaction.amount.toFixed(2)}`]],
    })

    // Save the PDF
    doc.save(`invoice-${transaction.id}.pdf`)
    setIsPrinting(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Transaction Details - {transaction.id}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="mb-4 flex justify-between">
            <div>
              <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {transaction.status}</p>
            </div>
            <div>
              <p><strong>Total Amount:</strong> ${transaction.amount.toFixed(2)}</p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button onClick={handlePrint} disabled={isPrinting}>
              {isPrinting ? 'Generating PDF...' : 'Print / Generate PDF'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

