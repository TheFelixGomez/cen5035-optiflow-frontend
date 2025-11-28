import { useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import ReportFilters, { type MultiSelectConfig } from '@/components/reports/ReportFilters';
import ReportSummary from '@/components/reports/ReportSummary';
import ReportTable from '@/components/reports/ReportTable';
import ExportButtons from '@/components/reports/ExportButtons';
import { useOrders } from '@/hooks/useOrders';
import { useVendors } from '@/hooks/useVendors';
import { useUsers } from '@/hooks/useUsers';
import { exportToPDF, exportToCSV } from '@/lib/utils/exportUtils';
import type { ReportData, ReportSummary as ReportSummaryType } from '@/types/report.types';

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportGenerated, setReportGenerated] = useState(false);

  // Vendor filter state
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [allVendorsSelected, setAllVendorsSelected] = useState(true);

  // User filter state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [allUsersSelected, setAllUsersSelected] = useState(true);

  // Fetch vendors and users for filter dropdowns
  const { data: vendors } = useVendors();
  const { data: users } = useUsers();

  const { data: orders, isLoading, refetch } = useOrders({
    dateFrom,
    dateTo,
    vendorIds: allVendorsSelected ? undefined : selectedVendorIds,
    userIds: allUsersSelected ? undefined : selectedUserIds,
  });

  const reportData: ReportData | null = useMemo(() => {
    if (!orders || !reportGenerated) return null;

    const summary: ReportSummaryType = {
      totalOrders: orders.length,
      byStatus: {
        pending: orders.filter((o) => o.status === 'pending').length,
        in_progress: orders.filter((o) => o.status === 'in_progress').length,
        completed: orders.filter((o) => o.status === 'completed').length,
      },
      byVendor: orders.reduce((acc, order) => {
        const vendorName = order.vendor?.name || 'Unknown';
        acc[vendorName] = (acc[vendorName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return {
      summary,
      orders,
      filters: {
        dateFrom,
        dateTo,
        vendorIds: allVendorsSelected ? undefined : selectedVendorIds,
        userIds: allUsersSelected ? undefined : selectedUserIds,
      },
      generatedAt: new Date().toISOString(),
    };
  }, [orders, dateFrom, dateTo, selectedVendorIds, selectedUserIds, allVendorsSelected, allUsersSelected, reportGenerated]);

  const handleGenerate = () => {
    refetch();
    setReportGenerated(true);
  };

  const handleExportPDF = () => {
    if (reportData) {
      exportToPDF(reportData);
    }
  };

  const handleExportCSV = () => {
    if (reportData) {
      exportToCSV(reportData);
    }
  };

  // Vendor filter handlers
  const handleVendorToggle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedVendorIds((prev) => [...prev, id]);
    } else {
      setSelectedVendorIds((prev) => prev.filter((vid) => vid !== id));
    }
    setAllVendorsSelected(false);
  };

  const handleVendorToggleAll = (checked: boolean) => {
    setAllVendorsSelected(checked);
    if (checked) {
      setSelectedVendorIds([]);
    }
  };

  // User filter handlers
  const handleUserToggle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, id]);
    } else {
      setSelectedUserIds((prev) => prev.filter((uid) => uid !== id));
    }
    setAllUsersSelected(false);
  };

  const handleUserToggleAll = (checked: boolean) => {
    setAllUsersSelected(checked);
    if (checked) {
      setSelectedUserIds([]);
    }
  };

  // Build filter configs
  const vendorFilter: MultiSelectConfig = {
    label: 'Vendors',
    placeholder: 'Select vendors',
    options: (vendors || []).map((v) => ({ id: v.id, label: v.name })),
    selectedIds: selectedVendorIds,
    allSelected: allVendorsSelected,
    onToggle: handleVendorToggle,
    onToggleAll: handleVendorToggleAll,
  };

  const userFilter: MultiSelectConfig = {
    label: 'Users',
    placeholder: 'Select users',
    options: (users || []).map((u) => ({ id: u.id, label: u.username })),
    selectedIds: selectedUserIds,
    allSelected: allUsersSelected,
    onToggle: handleUserToggle,
    onToggleAll: handleUserToggleAll,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate and export production reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReportFilters
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onGenerate={handleGenerate}
            isGenerating={isLoading}
            vendorFilter={vendorFilter}
            userFilter={userFilter}
          />
        </div>
        <div>
          <ExportButtons
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
            disabled={!reportData}
          />
        </div>
      </div>

      {reportData && (
        <>
          <ReportSummary summary={reportData.summary} />
          <ReportTable orders={reportData.orders} />
        </>
      )}

      {reportGenerated && !reportData && (
        <div className="text-center text-gray-500 py-12">
          {isLoading ? 'Generating report...' : 'No data available for the selected period'}
        </div>
      )}
    </div>
  );
}
