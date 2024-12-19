import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function PaymentModal({ isOpen, onClose, onConfirm, cart, total }) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validaciones
      if (paymentMethod === 'cash') {
        if (!receivedAmount || parseFloat(receivedAmount) < total) {
          alert('El monto recibido debe ser mayor o igual al total');
          return;
        }
      }

      // Preparar datos de la venta
      const saleData = {
        paymentMethod,
        receivedAmount: parseFloat(receivedAmount || total),
        change: paymentMethod === 'cash' ? parseFloat(receivedAmount) - total : 0
      };

      await onConfirm(saleData);
      setReceivedAmount('');
      setPaymentMethod('cash');
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button onClick={onClose}>
                  <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Procesar Pago
                </Dialog.Title>

                {/* Método de pago */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`p-4 border rounded-lg flex flex-col items-center ${
                      paymentMethod === 'cash' ? 'border-indigo-600 bg-indigo-50' : ''
                    }`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <BanknotesIcon className="h-8 w-8 text-gray-600" />
                    <span>Efectivo</span>
                  </button>
                  <button
                    className={`p-4 border rounded-lg flex flex-col items-center ${
                      paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50' : ''
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCardIcon className="h-8 w-8 text-gray-600" />
                    <span>Tarjeta</span>
                  </button>
                </div>

                {/* Monto recibido (solo para efectivo) */}
                {paymentMethod === 'cash' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Monto Recibido
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                    />
                    {receivedAmount && (
                      <div className="mt-2 text-sm">
                        Cambio: ${(parseFloat(receivedAmount) - total).toFixed(2)}
                      </div>
                    )}
                  </div>
                )}

                {/* Resumen de la venta */}
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Total a pagar</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botón de procesar */}
                <button
                  onClick={handleSubmit}
                  disabled={loading || (paymentMethod === 'cash' && parseFloat(receivedAmount) < total)}
                  className={`w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 
                    ${loading || (paymentMethod === 'cash' && parseFloat(receivedAmount) < total) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''}`}
                >
                  {loading ? 'Procesando...' : 'Confirmar Pago'}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 