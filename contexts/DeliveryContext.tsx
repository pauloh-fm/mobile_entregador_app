import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Delivery, Route } from '@/types/delivery';

interface DeliveryState {
  deliveries: Delivery[];
  currentRoute: Route | null;
  isLoading: boolean;
}

interface DeliveryContextType extends DeliveryState {
  loadDeliveries: () => void;
  updateDeliveryStatus: (deliveryId: string, status: Delivery['status']) => void;
  startRoute: () => void;
  completeDelivery: (deliveryId: string, photo?: string, signature?: string) => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

type DeliveryAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DELIVERIES'; payload: Delivery[] }
  | { type: 'SET_ROUTE'; payload: Route | null }
  | { type: 'UPDATE_DELIVERY'; payload: { id: string; delivery: Partial<Delivery> } };

function deliveryReducer(state: DeliveryState, action: DeliveryAction): DeliveryState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_DELIVERIES':
      return { ...state, deliveries: action.payload, isLoading: false };
    case 'SET_ROUTE':
      return { ...state, currentRoute: action.payload };
    case 'UPDATE_DELIVERY':
      return {
        ...state,
        deliveries: state.deliveries.map(delivery =>
          delivery.id === action.payload.id
            ? { ...delivery, ...action.payload.delivery, updatedAt: new Date() }
            : delivery
        ),
      };
    default:
      return state;
  }
}

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    customerName: 'Maria Santos',
    customerPhone: '(11) 99999-1111',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    coordinates: { latitude: -23.5505, longitude: -46.6333 },
    items: [
      { id: '1', name: 'Água Mineral 20L', quantity: 2, unitPrice: 12.50, returnContainer: true },
      { id: '2', name: 'Água com Gás 20L', quantity: 1, unitPrice: 15.00, returnContainer: true }
    ],
    totalAmount: 40.00,
    status: 'pending',
    priority: 'high',
    scheduledDate: new Date(),
    notes: 'Entregar no portão principal',
    bottleReturn: 2,
    paymentMethod: 'money',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    customerName: 'João Silva',
    customerPhone: '(11) 99999-2222',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    coordinates: { latitude: -23.5615, longitude: -46.6565 },
    items: [
      { id: '3', name: 'Água Mineral 20L', quantity: 3, unitPrice: 12.50, returnContainer: true },
    ],
    totalAmount: 37.50,
    status: 'in_transit',
    priority: 'medium',
    scheduledDate: new Date(),
    notes: 'Apartamento 15B - Interfone',
    bottleReturn: 1,
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(),
  },
  {
    id: '3',
    customerName: 'Ana Costa',
    customerPhone: '(11) 99999-3333',
    address: 'Rua Augusta, 500',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01305-000',
    coordinates: { latitude: -23.5570, longitude: -46.6623 },
    items: [
      { id: '4', name: 'Água Mineral 20L', quantity: 1, unitPrice: 12.50, returnContainer: true },
      { id: '5', name: 'Água Saborizada 20L', quantity: 1, unitPrice: 18.00, returnContainer: false }
    ],
    totalAmount: 30.50,
    status: 'delivered',
    priority: 'low',
    scheduledDate: new Date(Date.now() - 172800000), // 2 days ago
    notes: 'Cliente preferencial',
    bottleReturn: 2,
    paymentMethod: 'pix',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
    deliveredAt: new Date(Date.now() - 86400000),
  },
  {
    id: '4',
    customerName: 'Carlos Oliveira',
    customerPhone: '(11) 99999-4444',
    address: 'Rua da Consolação, 800',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01302-907',
    coordinates: { latitude: -23.5580, longitude: -46.6540 },
    items: [
      { id: '6', name: 'Água Mineral 20L', quantity: 4, unitPrice: 12.50, returnContainer: true },
    ],
    totalAmount: 50.00,
    status: 'pending',
    priority: 'high',
    scheduledDate: new Date(),
    notes: 'Escritório - horário comercial',
    bottleReturn: 3,
    paymentMethod: 'money',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    customerName: 'Fernanda Lima',
    customerPhone: '(11) 99999-5555',
    address: 'Alameda Santos, 200',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01418-000',
    coordinates: { latitude: -23.5629, longitude: -46.6544 },
    items: [
      { id: '7', name: 'Água com Gás 20L', quantity: 2, unitPrice: 15.00, returnContainer: true },
    ],
    totalAmount: 30.00,
    status: 'cancelled',
    priority: 'medium',
    scheduledDate: new Date(Date.now() - 86400000),
    notes: 'Cliente cancelou - reagendar',
    bottleReturn: 0,
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(),
  },
];

const mockRoute: Route = {
  id: 'route-1',
  deliveryIds: ['1', '2', '4'],
  startLocation: { latitude: -23.5505, longitude: -46.6333 },
  currentLocation: { latitude: -23.5505, longitude: -46.6333 },
  status: 'active',
  estimatedDuration: 180, // 3 hours in minutes
  actualDuration: 45, // 45 minutes elapsed
  distance: 25.5, // km
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function DeliveryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(deliveryReducer, {
    deliveries: [],
    currentRoute: null,
    isLoading: true,
  });

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    setTimeout(() => {
      dispatch({ type: 'SET_DELIVERIES', payload: mockDeliveries });
      dispatch({ type: 'SET_ROUTE', payload: mockRoute });
    }, 1000);
  };

  const updateDeliveryStatus = (deliveryId: string, status: Delivery['status']) => {
    dispatch({
      type: 'UPDATE_DELIVERY',
      payload: {
        id: deliveryId,
        delivery: { status }
      }
    });
  };

  const startRoute = () => {
    if (!state.currentRoute) {
      dispatch({ type: 'SET_ROUTE', payload: { ...mockRoute, startTime: new Date(), status: 'active' } });
    } else {
      dispatch({
        type: 'SET_ROUTE',
        payload: { ...state.currentRoute, startTime: new Date(), status: 'active' }
      });
    }
  };

  const completeDelivery = (deliveryId: string, photo?: string, signature?: string) => {
    dispatch({
      type: 'UPDATE_DELIVERY',
      payload: {
        id: deliveryId,
        delivery: {
          status: 'delivered',
          deliveredAt: new Date(),
          photo,
          signature
        }
      }
    });
  };

  return (
    <DeliveryContext.Provider value={{
      ...state,
      loadDeliveries,
      updateDeliveryStatus,
      startRoute,
      completeDelivery,
    }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}