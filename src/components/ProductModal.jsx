import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDatabase } from '../hooks/useDatabase';

export default function ProductModal({ isOpen, onClose, onSave, product = null }) {
  const { addProduct, checkSkuExists } = useDatabase();
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    status: 'active'
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      // Limpiar el formulario cuando se abre para un nuevo producto
      setFormData({
        name: '',
        sku: '',
        price: '',
        stock: '',
        category: '',
        status: 'active'
      });
    }
    // Limpiar mensaje de error al abrir/cerrar modal
    setError('');
  }, [product, isOpen]);

  // Agregar validación de SKU con debounce
  useEffect(() => {
    const validateSku = async () => {
      if (!formData.sku) return;
      
      try {
        setIsChecking(true);
        const exists = await checkSkuExists(formData.sku);
        if (exists) {
          setError('Ya existe un producto con este SKU');
        }
      } catch (error) {
        console.error('Error al validar SKU:', error);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(validateSku, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.sku]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar error previo

    try {
      if (product) {
        // Implementar actualización
      } else {
        await addProduct(formData);
      }
      onClose();
      if (onSave) onSave(formData);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      if (error.message.includes('UNIQUE constraint failed: products.sku')) {
        setError('Ya existe un producto con este SKU. Por favor, use uno diferente.');
      } else {
        setError('Error al guardar el producto. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    required
                    className={`mt-1 block w-full rounded-md border ${
                      error && error.includes('SKU') 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    } p-2`}
                    value={formData.sku}
                    onChange={(e) => {
                      setError('');
                      setFormData({...formData, sku: e.target.value});
                    }}
                  />
                  {isChecking && (
                    <p className="mt-1 text-sm text-gray-500">Verificando SKU...</p>
                  )}
                  {error && error.includes('SKU') && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Precio
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Stock
                    </label>
                    <input
                      type="number"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categoría
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="electronics">Electrónicos</option>
                    <option value="clothing">Ropa</option>
                    <option value="food">Alimentos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>

                <div className="mt-5 sm:mt-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                    disabled={!!error || isChecking}
                  >
                    {isChecking ? 'Verificando...' : (product ? 'Actualizar Producto' : 'Agregar Producto')}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 