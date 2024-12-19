import { Fragment, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
  HomeIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'POS', href: '/pos', icon: ShoppingCartIcon },
  { name: 'Inventario', href: '/inventory', icon: ClipboardDocumentListIcon },
  { name: 'Ventas', href: '/sales', icon: ChartBarIcon },
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex">
      {/* Sidebar para móvil */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          {/* ... Contenido del sidebar móvil ... */}
        </Dialog>
      </Transition.Root>

      {/* Sidebar estático para desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 