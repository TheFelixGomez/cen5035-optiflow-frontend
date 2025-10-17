import { Mail, Phone, MapPin, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Vendor } from '@/types/vendor.types';
import { format } from 'date-fns';

interface VendorDetailsProps {
  vendor: Vendor;
}

export default function VendorDetails({ vendor }: VendorDetailsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{vendor.name}</CardTitle>
          <CardDescription>Vendor Information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Contact Person</p>
              <p className="text-base">{vendor.contactPerson}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <a
                href={`mailto:${vendor.email}`}
                className="text-base text-primary hover:underline"
              >
                {vendor.email}
              </a>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <a href={`tel:${vendor.phone}`} className="text-base text-primary hover:underline">
                {vendor.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-base whitespace-pre-line">{vendor.address}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>
                Created on {format(new Date(vendor.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
