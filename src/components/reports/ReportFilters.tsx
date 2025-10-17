import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportFiltersProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export default function ReportFilters({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onGenerate,
  isGenerating,
}: ReportFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom">From Date</Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTo">To Date</Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={onGenerate} disabled={isGenerating} className="w-full">
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </CardContent>
    </Card>
  );
}
