import React, { createContext, useContext, useState, useEffect } from 'react';
import { Equipment, Booking, EquipmentTracking } from '../types';

interface EquipmentContextType {
  equipment: Equipment[];
  bookings: Booking[];
  tracking: EquipmentTracking[];
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  updateTracking: (equipmentId: string, location: { lat: number; lng: number }) => void;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};

const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'John Deere Tractor 5075E',
    type: 'Tractor',
    description: '75 HP tractor perfect for medium-sized farms',
    ownerId: '2',
    ownerName: 'Jane Owner',
    pricePerDay: 150,
    location: { lat: 40.7128, lng: -74.0060, address: '123 Farm Road, New York' },
    status: 'available',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
    specifications: {
      'Horsepower': '75 HP',
      'Fuel Type': 'Diesel',
      'Transmission': 'Hydrostatic',
      'Year': '2022',
    },
  },
  {
    id: '2',
    name: 'Combine Harvester CX6',
    type: 'Harvester',
    description: 'Efficient combine harvester for grain crops',
    ownerId: '2',
    ownerName: 'Jane Owner',
    pricePerDay: 300,
    location: { lat: 40.7580, lng: -73.9855, address: '456 Harvest Lane, New York' },
    status: 'available',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
    specifications: {
      'Cutting Width': '20 feet',
      'Capacity': '200 bushels',
      'Fuel Type': 'Diesel',
      'Year': '2021',
    },
  },
  {
    id: '3',
    name: 'Rotary Tiller RT-500',
    type: 'Tiller',
    description: 'Heavy-duty rotary tiller for soil preparation',
    ownerId: '2',
    ownerName: 'Jane Owner',
    pricePerDay: 80,
    location: { lat: 40.7282, lng: -73.9942, address: '789 Field Street, New York' },
    status: 'rented',
    specifications: {
      'Width': '6 feet',
      'Depth': '8 inches',
      'Power Required': '50 HP',
      'Year': '2023',
    },
  },
];

export const EquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    // Initialize from localStorage or use mock data
    const storedEquipment = localStorage.getItem('equipment');
    if (storedEquipment) {
      try {
        return JSON.parse(storedEquipment);
      } catch {
        return mockEquipment;
      }
    }
    return mockEquipment;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      try {
        return JSON.parse(storedBookings);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [tracking, setTracking] = useState<EquipmentTracking[]>(() => {
    const storedTracking = localStorage.getItem('tracking');
    if (storedTracking) {
      try {
        return JSON.parse(storedTracking);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    // Simulate live tracking updates
    const interval = setInterval(() => {
      setTracking((prev) => {
        return prev.map((track) => ({
          ...track,
          location: {
            ...track.location,
            lat: track.location.lat + (Math.random() - 0.5) * 0.001,
            lng: track.location.lng + (Math.random() - 0.5) * 0.001,
            timestamp: new Date().toISOString(),
          },
        }));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('equipment', JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('tracking', JSON.stringify(tracking));
  }, [tracking]);

  const addEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const equipmentWithId: Equipment = {
      ...newEquipment,
      id: Date.now().toString(),
    };
    setEquipment((prev) => [...prev, equipmentWithId]);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment((prev) => prev.map((eq) => (eq.id === id ? { ...eq, ...updates } : eq)));
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setBookings((prev) => [...prev, newBooking]);
    
    // Initialize tracking for rented equipment
    setEquipment((prev) => {
      const equipmentItem = prev.find((eq) => eq.id === bookingData.equipmentId);
      if (equipmentItem) {
        setTracking((trackPrev) => [
          ...trackPrev,
          {
            equipmentId: bookingData.equipmentId,
            location: {
              ...equipmentItem.location,
              timestamp: new Date().toISOString(),
            },
            status: 'idle',
          },
        ]);
      }
      return prev;
    });
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) => {
      const updated = prev.map((booking) => (booking.id === id ? { ...booking, ...updates } : booking));
      
      // Update equipment status based on booking status
      if (updates.status === 'confirmed' || updates.status === 'active') {
        const booking = updated.find((b) => b.id === id);
        if (booking) {
          updateEquipment(booking.equipmentId, { status: 'rented' });
        }
      }
      
      return updated;
    });
  };

  const updateTracking = (equipmentId: string, location: { lat: number; lng: number }) => {
    setTracking((prev) => {
      const existing = prev.find((t) => t.equipmentId === equipmentId);
      if (existing) {
        return prev.map((t) =>
          t.equipmentId === equipmentId
            ? {
                ...t,
                location: {
                  ...location,
                  timestamp: new Date().toISOString(),
                },
              }
            : t
        );
      }
      return [
        ...prev,
        {
          equipmentId,
          location: {
            ...location,
            timestamp: new Date().toISOString(),
          },
          status: 'idle',
        },
      ];
    });
  };

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        bookings,
        tracking,
        addEquipment,
        updateEquipment,
        createBooking,
        updateBooking,
        updateTracking,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

