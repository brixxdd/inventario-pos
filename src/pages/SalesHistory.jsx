import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDatabase } from '../hooks/useDatabase';
import { addSale } from '../store/salesSlice';
import { 
  MagnifyingGlassIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

export default function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const sales = useSelector(state => state.sales.sales);
  const dispatch = useDispatch();
  const { getSales } = useDatabase();

  useEffect(() => {
    const loadSales = async () => {
      try {
        const salesData = await getSales();
        console.log('Datos de ventas detallados:', JSON.stringify(salesData, null, 2));
        dispatch(addSale(salesData));
      } catch (error) {
        console.error('Error al cargar ventas:', error);
      }
    };

    loadSales();
  }, [dispatch, getSales]);

  // Función para formatear el método de pago
  const getPaymentMethodBadge = (method) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    if (method === 'cash') {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
          Efectivo
        </span>
      );
    }
    return (
      <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
        <CreditCardIcon className="w-4 h-4 inline mr-1" />
        Tarjeta
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Historial de Ventas
          </h2>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Buscar venta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Todas las ventas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de ventas */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {sales && sales.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {sales.map((sale) => sale && (
              <li key={sale.id || Math.random()}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          Venta #{sale.id || 'Sin ID'}
                        </p>
                        {sale.payment_method && getPaymentMethodBadge(sale.payment_method)}
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {sale.date ? format(new Date(sale.date), "PPpp", { locale: es }) : 'Fecha no válida'}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-2xl font-semibold text-gray-900">
                        ${(sale.total || 0).toFixed(2)}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <ShoppingCartIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {sale.items?.length || 0} productos
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ventas</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se han registrado ventas aún.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 