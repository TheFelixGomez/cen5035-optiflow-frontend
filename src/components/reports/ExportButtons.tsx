import { FileDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExportButtonsProps {
  onExportPDF: () => void;
  onExportCSV: () => void;
  disabled?: boolean;
}

export default function ExportButtons({ onExportPDF, onExportCSV, disabled }: ExportButtonsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={onExportPDF}
          disabled={disabled}
          variant="outline"
          className="w-full justify-start"
        >
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
        <Button
          onClick={onExportCSV}
          disabled={disabled}
          variant="outline"
          className="w-full justify-start"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export as CSV
        </Button>
      </CardContent>
    </Card>
  );
}
