import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import type { ReportData } from '@/types/report.types';
import { format } from 'date-fns';

export const exportToPDF = (data: ReportData) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text('OptiFlow Production Report', 14, 20);

  // Date range
  doc.setFontSize(10);
  doc.text(
    `Period: ${format(new Date(data.filters.dateFrom), 'MMM dd, yyyy')} - ${format(new Date(data.filters.dateTo), 'MMM dd, yyyy')}`,
    14,
    30
  );
  doc.text(`Generated: ${format(new Date(data.generatedAt), 'MMM dd, yyyy HH:mm')}`, 14, 36);

  // Summary section
  doc.setFontSize(14);
  doc.text('Summary', 14, 50);

  doc.setFontSize(10);
  let yPos = 58;
  doc.text(`Total Orders: ${data.summary.totalOrders}`, 14, yPos);
  yPos += 6;
  doc.text(`Pending: ${data.summary.byStatus.pending}`, 14, yPos);
  yPos += 6;
  doc.text(`In Progress: ${data.summary.byStatus.in_progress}`, 14, yPos);
  yPos += 6;
  doc.text(`Completed: ${data.summary.byStatus.completed}`, 14, yPos);

  // Orders table
  yPos += 12;
  doc.setFontSize(14);
  doc.text('Orders', 14, yPos);

  const tableData = data.orders.map((order) => [
    `#${order.id.slice(0, 8)}`,
    order.vendor?.name || 'Unknown',
    format(new Date(order.dueDate), 'MMM dd, yyyy'),
    order.status.replace('_', ' ').toUpperCase(),
    order.instructions.substring(0, 50) + (order.instructions.length > 50 ? '...' : ''),
  ]);

  autoTable(doc, {
    startY: yPos + 6,
    head: [['Order ID', 'Vendor', 'Due Date', 'Status', 'Instructions']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [217, 119, 6] }, // Primary color
    styles: { fontSize: 8 },
  });

  // Save
  doc.save(`optiflow-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const exportToCSV = (data: ReportData) => {
  const csvData = data.orders.map((order) => ({
    'Order ID': order.id,
    Vendor: order.vendor?.name || 'Unknown',
    'Contact Person': order.vendor?.contactPerson || '',
    'Due Date': format(new Date(order.dueDate), 'yyyy-MM-dd'),
    Status: order.status,
    Instructions: order.instructions,
    'Created At': format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm'),
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `optiflow-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
