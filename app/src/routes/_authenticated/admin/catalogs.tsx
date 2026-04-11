import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useServiceTypes, useReasons, useZones } from '@/hooks/useCatalogs';
import { DataTable } from '@/components/ui/DataTable';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const Route = createFileRoute('/_authenticated/admin/catalogs')({
  component: CatalogsPage,
});

type Tab = 'serviceTypes' | 'reasons' | 'zones';

function CatalogsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('serviceTypes');
  const { data: serviceTypes, isLoading: loadingST } = useServiceTypes(true);
  const { data: reasons, isLoading: loadingR } = useReasons();
  const { data: zones, isLoading: loadingZ } = useZones(true);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'serviceTypes', label: 'Tipos de Servicio' },
    { key: 'reasons', label: 'Motivos' },
    { key: 'zones', label: 'Zonas' },
  ];

  return (
    <div data-testid="catalogs-page">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Catálogos</h2>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            data-testid={`catalogs-tab-${tab.key}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'serviceTypes' && (
        loadingST ? <LoadingSpinner /> : (
          <DataTable
            columns={[
              { key: 'name', header: 'Nombre', render: (st) => st.name },
              { key: 'description', header: 'Descripción', render: (st) => st.description ?? '—' },
              { key: 'status', header: 'Estado', render: (st) => (
                <span className={`text-xs font-medium ${st.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {st.isActive ? 'Activo' : 'Inactivo'}
                </span>
              )},
            ]}
            data={serviceTypes ?? []}
          />
        )
      )}

      {activeTab === 'reasons' && (
        loadingR ? <LoadingSpinner /> : (
          <DataTable
            columns={[
              { key: 'name', header: 'Nombre', render: (r) => r.name },
              { key: 'type', header: 'Tipo', render: (r) => r.type === 'cancellation' ? 'Cancelación' : 'Reagendamiento' },
              { key: 'status', header: 'Estado', render: (r) => (
                <span className={`text-xs font-medium ${r.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {r.isActive ? 'Activo' : 'Inactivo'}
                </span>
              )},
            ]}
            data={reasons ?? []}
          />
        )
      )}

      {activeTab === 'zones' && (
        loadingZ ? <LoadingSpinner /> : (
          <DataTable
            columns={[
              { key: 'name', header: 'Nombre', render: (z) => z.name },
              { key: 'description', header: 'Descripción', render: (z) => z.description ?? '—' },
              { key: 'status', header: 'Estado', render: (z) => (
                <span className={`text-xs font-medium ${z.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {z.isActive ? 'Activo' : 'Inactivo'}
                </span>
              )},
            ]}
            data={zones ?? []}
          />
        )
      )}
    </div>
  );
}
