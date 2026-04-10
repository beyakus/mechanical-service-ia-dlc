import type { ReactNode } from 'react';

interface FilterBarProps {
  children: ReactNode;
  onClear?: () => void;
}

export function FilterBar({ children, onClear }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 mb-4" data-testid="filter-bar">
      {children}
      {onClear && (
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-gray-700 ml-auto"
          data-testid="filter-bar-clear"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
