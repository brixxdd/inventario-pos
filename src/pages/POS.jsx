import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDatabase } from '../hooks/useDatabase';
import PaymentModal from '../components/PaymentModal';
import Alert from '../components/Alert';

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { getProducts, createSale } = useDatabase();
  const [alert, setAlert] = useState({ show: false, type: '', title: '', message: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products = await getProducts();
      setProducts(products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos');
    }
  };

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        showAlert('warning', 'Stock Insuficiente', 'No hay más unidades disponibles de este producto');
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    if (newQuantity <= product.stock && newQuantity > 0) {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handlePayment = async (paymentData) => {
    try {
      await createSale({
        items: cart,
        total: calculateTotal(),
        ...paymentData
      });
      setCart([]);
      await loadProducts();
      setShowPaymentModal(false);
      showAlert('success', 'Venta Exitosa', 'La venta se ha procesado correctamente');
    } catch (error) {
      console.error('Error al procesar la venta:', error);
      showAlert('error', 'Error', 'No se pudo procesar la venta');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    product.stock > 0
  );

  return (
    <div className="h-full">
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-6rem)]">
        {/* Panel de productos */}
        <div className="col-span-8 bg-white rounded-lg shadow p-4">
          <div className="mb-4 relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar producto..."
              className="w-full pl-10 p-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 gap-4 overflow-y-auto h-[calc(100vh-16rem)]">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-2" />
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel del carrito */}
        <div className="col-span-4 bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Carrito de Compra</h2>
          <div className="flex-1 overflow-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-2 border-b">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span>Total</span>
              <span className="font-bold">${calculateTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
              className={`w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 
                ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Procesar Pago
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePayment}
        cart={cart}
        total={calculateTotal()}
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