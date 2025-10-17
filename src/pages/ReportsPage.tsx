import { useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import ReportFilters from '@/components/reports/ReportFilters';
import ReportSummary from '@/components/reports/ReportSummary';
import ReportTable from '@/components/reports/ReportTable';
import ExportButtons from '@/components/reports/ExportButtons';
import { useOrders } from '@/hooks/useOrders';
import { exportToPDF, exportToCSV } from '@/lib/utils/exportUtils';
import type { ReportData, ReportSummary as ReportSummaryType } from '@/types/report.types';

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportGenerated, setReportGenerated] = useState(false);

  const { data: orders, isLoading, refetch } = useOrders({
    dateFrom,
    dateTo,
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
      filters: { dateFrom, dateTo },
      generatedAt: new Date().toISOString(),
    };
  }, [orders, dateFrom, dateTo, reportGenerated]);

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
