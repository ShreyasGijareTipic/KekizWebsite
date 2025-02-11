import React, { useEffect } from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { CBadge } from '@coreui/react';

function All_Tables({ selectedOption, salesData, expenseData, pnlData }) {
  useEffect(() => {
    console.log("Sales Data:", salesData);
    console.log("Expense Data:", expenseData);
    console.log("P&L Data:", pnlData);
  }, [salesData, expenseData, pnlData]);

  const salesColumns = [
    { accessorKey: 'invoiceDate', header: 'Invoice Date' },
    { accessorKey: 'totalAmount', header: 'Total Amount', Cell: ({ cell }) => `₹${parseFloat(cell.getValue() || 0).toFixed(2)}` },
    { accessorKey: 'paidAmount', header: 'Paid Amount', Cell: ({ cell }) => `₹${parseFloat(cell.getValue() || 0).toFixed(2)}` },
    { accessorKey: 'balanceAmount', header: 'Balance Amount', Cell: ({ cell }) => `₹${parseFloat(cell.getValue() || 0).toFixed(2)}` },
  ];


  const expenseColumns = [
    { accessorKey: 'expense_date', header: 'Date' },
    { accessorKey: 'name', header: 'Details' },
    { accessorKey: 'qty', header: 'Quantity' },
    { accessorKey: 'price', header: 'Price Per Unit', Cell: ({ cell }) => `₹${parseFloat(cell.getValue() || 0).toFixed(2)}` },
    { accessorKey: 'total_price', header: 'Total Cost', Cell: ({ cell }) => `₹${parseFloat(cell.getValue() || 0).toFixed(2)}` },
  ];

  
  const pnlColumns = [
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'totalSales', header: 'Total Sales', Cell: ({ cell }) => `₹${parseFloat(cell.getValue() || 0).toFixed(2)}` },
    { accessorKey: 'totalExpenses', header: 'Total Expenses', Cell: ({ cell }) => `₹${parseFloat(cell.getValue() || 0).toFixed(2)}` },
    {
      accessorKey: 'profitOrLoss',
      header: 'Profit/Loss',
      Cell: ({ row }) => {
        const profitOrLoss = parseFloat(row.original.totalSales || 0) - parseFloat(row.original.totalExpenses || 0);
        return (
          <CBadge color={profitOrLoss >= 0 ? 'success' : 'danger'}>
            ₹{profitOrLoss.toFixed(2)}
          </CBadge>
        );
      },
    },
  ];

  return (
    <div>
      {selectedOption === '1' && (
        <MantineReactTable 
          columns={salesColumns} 
          data={salesData?.data?.length ? salesData.data : []}  
          emptyContentMessage="No sales data available."
        />
      )}
      {selectedOption === '2' && (
        <MantineReactTable 
          columns={expenseColumns} 
          data={expenseData?.data?.length ? expenseData.data : []} 
          emptyContentMessage="No expense data available."
        />
      )}
      {selectedOption === '3' && (
        <MantineReactTable 
          columns={pnlColumns} 
          data={pnlData?.data?.length ? pnlData.data : []} 
          emptyContentMessage="No profit/loss data available."
        />
      )}
    </div>
  );
}

export default All_Tables;
