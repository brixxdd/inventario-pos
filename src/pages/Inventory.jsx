import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProductModal from '../components/ProductModal';
import { useDatabase } from '../hooks/useDatabase';
import Alert from '../components/Alert';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { getProducts, addProduct } = useDatabase();
  const [alert, setAlert] = useState({ show: false, type: '', title: '', message: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const loadProducts = async () => {
    try {
      const products = await getProducts();
      setProducts(products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      showAlert('error', 'Error', 'No se pudieron cargar los productos');
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      await addProduct(productData);
      await loadProducts();
      setShowModal(false);
      showAlert('success', 'Éxito', 'Producto agregado correctamente');
    } catch (error) {
      console.error('Error al agregar producto:', error);
      showAlert('error', 'Error', error.message || 'No se pudo agregar el producto');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Inventario</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Agregar Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="pl-10 w-full p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Categoría
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
        onSave={handleAddProduct}
        product={selectedProduct}
      />

      <Alert
        isOpen={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
} 