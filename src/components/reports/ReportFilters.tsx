import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDown } from 'lucide-react';

export type FilterOption = {
  id: string;
  label: string;
};

export type MultiSelectConfig = {
  label: string;
  placeholder: string;
  options: FilterOption[];
  selectedIds: string[];
  allSelected: boolean;
  onToggle: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
};

interface ReportFiltersProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  vendorFilter: MultiSelectConfig;
  userFilter: MultiSelectConfig;
}

export default function ReportFilters({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onGenerate,
  isGenerating,
  vendorFilter,
  userFilter,
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiSelectDropdown {...vendorFilter} />
          <MultiSelectDropdown {...userFilter} />
        </div>

        <Button onClick={onGenerate} disabled={isGenerating} className="w-full">
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </CardContent>
    </Card>
  );
}

function MultiSelectDropdown({
  label,
  placeholder,
  options,
  selectedIds,
  allSelected,
  onToggle,
  onToggleAll,
}: MultiSelectConfig) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const query = search.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, search]);

  const displayValue = allSelected
    ? `All ${label}`
    : selectedIds.length === 0
      ? `No ${label} selected`
      : `${selectedIds.length} selected`;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-left font-normal"
          >
            <span className="truncate">{displayValue || placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-0" onCloseAutoFocus={(e) => e.preventDefault()}>
          <div className="p-2 border-b border-gray-200">
            <Input
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            <DropdownMenuCheckboxItem
              checked={allSelected}
              onCheckedChange={(checked) => {
                if (checked) {
                  onToggleAll(true);
                } else {
                  onToggleAll(false);
                }
              }}
              onSelect={(e) => e.preventDefault()}
              className="capitalize"
            >
              All {label.toLowerCase()}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
            )}
            {filteredOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.id}
                checked={allSelected || selectedIds.includes(option.id)}
                onCheckedChange={(checked) => {
                  onToggle(option.id, Boolean(checked));
                }}
                onSelect={(e) => e.preventDefault()}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
          <div className="p-2 border-t border-gray-200">
            <Button
              size="sm"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
