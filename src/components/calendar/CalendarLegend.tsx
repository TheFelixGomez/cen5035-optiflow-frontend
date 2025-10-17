import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CalendarLegend() {
  const statuses = [
    { label: 'Pending', color: 'bg-yellow-500' },
    { label: 'In Progress', color: 'bg-blue-500' },
    { label: 'Completed', color: 'bg-green-500' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Status Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {statuses.map((status) => (
            <div key={status.label} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded ${status.color}`} />
              <span className="text-sm text-gray-700">{status.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
