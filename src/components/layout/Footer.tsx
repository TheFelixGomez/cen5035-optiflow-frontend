import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>© {currentYear} OptiFlow.</span>
            <span className="hidden sm:inline">Production Order Management System.</span>
          </div>

          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>using React & TypeScript</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span>Version 1.0.0</span>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">
              Documentation
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">
              Support
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
