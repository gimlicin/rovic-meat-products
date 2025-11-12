import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  initialValue = '', 
  placeholder = 'Search products...',
  className = ''
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue || '');
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue || '');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery !== initialValue) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleSearch = useCallback((query: string) => {
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    if (query.trim()) {
      params.set('search', query.trim());
    } else {
      params.delete('search');
    }

    // Navigate to products page with search query
    router.get(`/products?${params.toString()}`, {}, {
      preserveState: true,
      preserveScroll: true,
    });
  }, []);

  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);
    params.delete('search');
    
    router.get(`/products?${params.toString()}`, {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex w-full items-center ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full pl-10 pr-10 rounded-r-none border-r-0"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button
        type="submit"
        className="h-10 rounded-l-none bg-orange-500 hover:bg-orange-600 px-6"
      >
        Search
      </Button>
    </form>
  );
}
