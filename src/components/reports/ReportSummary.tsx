import {Card, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import type {ReportSummary as ReportSummaryType} from '@/types/report.types';

interface ReportSummaryProps {
  summary: ReportSummaryType;
}

export default function ReportSummary({ summary }: ReportSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-3xl text-primary">{summary.totalOrders}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Pending</CardDescription>
          <CardTitle className="text-3xl text-yellow-600">{summary.byStatus.pending}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>In Progress</CardDescription>
          <CardTitle className="text-3xl text-blue-600">{summary.byStatus.in_progress}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Completed</CardDescription>
          <CardTitle className="text-3xl text-green-600">{summary.byStatus.completed}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
