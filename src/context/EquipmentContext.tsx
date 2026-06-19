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

const EQUIPMENT_SEED_VERSION = '10-remove-haha';

const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Mahindra 575 DI XP Plus',
    type: 'Tractor',
    description: 'Highly used in rural Andhra Pradesh. 47 HP tractor for tillage, haulage, and field operations on paddy, maize, and cotton farms.',
    ownerId: '2',
    ownerName: 'AP Rental Hub',
    pricePerDay: 9600,
    rentRate: 1200,
    rentUnit: 'hour',
    location: { lat: 14.6819, lng: 77.6006, address: 'Rural Road, Anantapur, Andhra Pradesh' },
    status: 'available',
    image: '/equipment/tractor.png',
    specifications: {
      'Horsepower': '47 HP',
      'Fuel Type': 'Diesel',
      'Lift Capacity': '1600 kg',
      'Crops': 'Paddy, Maize, Cotton, Chilli',
    },
  },
  {
    id: '2',
    name: 'Standard 6 Ton Trailer',
    type: 'Tractor Trailer',
    description: 'Standard 6-ton trailer for crop transport, grain haulage, and farm logistics across rural Andhra Pradesh.',
    ownerId: '2',
    ownerName: 'AP Rental Hub',
    pricePerDay: 5600,
    rentRate: 700,
    rentUnit: 'hour',
    location: { lat: 16.5062, lng: 80.6480, address: 'Vijayawada Farming Hub, Vijayawada, Andhra Pradesh' },
    status: 'available',
    image: '/equipment/tractor-trailer.png',
    specifications: {
      'Capacity': '6 Ton',
      'Type': 'Double Axle',
      'Compatibility': '45 HP+ Tractors',
      'Use': 'Grain & produce transport',
    },
  },
  {
    id: '3',
    name: 'Fieldking / Garud (6 Feet)',
    type: 'Rotavator',
    description: '6-feet rotavator for soil preparation, residue mixing, and seedbed cultivation before sowing.',
    ownerId: '2',
    ownerName: 'AP Rental Hub',
    pricePerDay: 1500,
    rentRate: 1500,
    rentUnit: 'acre',
    location: { lat: 15.8281, lng: 78.0373, address: 'Agricultural Fields, Kurnool, Andhra Pradesh' },
    status: 'available',
    image: '/equipment/rotavator.jpg',
    specifications: {
      'Brand': 'Fieldking / Garud',
      'Size': '6 Feet',
      'Power Required': '40-50 HP',
      'Crops': 'Paddy, Maize, Groundnut',
    },
  },
  {
    id: '4',
    name: 'Heavy Duty Cultivator',
    type: 'Cultivator',
    description: 'Heavy duty cultivator for deep tillage, soil aeration, and weed control in dryland and irrigated fields.',
    ownerId: '2',
    ownerName: 'AP Rental Hub',
    pricePerDay: 800,
    rentRate: 800,
    rentUnit: 'acre',
    location: { lat: 16.3067, lng: 80.4365, address: 'Grand Farm Fields, Guntur, Andhra Pradesh' },
    status: 'available',
    image: '/equipment/cultivator.png',
    specifications: {
      'Type': 'Heavy Duty',
      'Tynes': '9 Tynes',
      'Power Required': '35 HP+',
      'Crops': 'Cotton, Chilli, Groundnut',
    },
  },
  {
    id: '5',
    name: 'Multi Crop Seed Drill (9 Tyne)',
    type: 'Seed Drill',
    description: 'Multi crop seed drill for precise sowing of maize, groundnut, pulses, and other crops at uniform depth.',
    ownerId: '2',
    ownerName: 'AP Rental Hub',
    pricePerDay: 1200,
    rentRate: 1200,
    rentUnit: 'acre',
    location: { lat: 15.5057, lng: 80.0499, address: 'Crop Sowing Belt, Ongole, Andhra Pradesh' },
    status: 'available',
    image: '/equipment/seed-drill.png',
    specifications: {
      'Tynes': '9 Tyne',
      'Crop Compatibility': 'Maize, Groundnut, Pulses',
      'Seed Metering': 'Fluted roller',
      'Use': 'Multi crop sowing',
    },
  },
  {
    id: '6',
    name: 'Mahindra Boom Sprayer',
    type: 'Power Sprayer',
    description: 'Boom sprayer for pesticide and nutrient application over cotton, chilli, and vegetable fields.',
    ownerId: '2',
    ownerName: 'AP Rental Hub',
    pricePerDay: 600,
    rentRate: 600,
    rentUnit: 'acre',
    location: { lat: 13.6288, lng: 79.4192, address: 'Chittoor Farm District, Tirupati, Andhra Pradesh' },
    status: 'available',
    image: '/equipment/power-sprayer.jpg',
    specifications: {
      'Tank Capacity': '400 L',
      'Boom Length': '24 feet',
      'Pump': 'HTP Triplex plunger',
      'Crops': 'Cotton, Chilli, Vegetables',
    },
  },
  {
    id: '7',
    name: 'VST Shakti 130 DI Power Tiller',
    type: 'Power Tiller',
    description: 'Compact power tiller for wet land puddling, small farm tillage, and narrow-field soil preparation.',
    ownerId: '2',
    ownerName: 'AP Rental Hub',
    pricePerDay: 6400,
    rentRate: 800,
    rentUnit: 'hour',
    location: { lat: 14.4426, lng: 79.9865, address: 'Penna River Fields, Nellore, Andhra Pradesh' },
    status: 'available',
    image: '/equipment/power-tiller.jpg',
    specifications: {
      'Horsepower': '13 HP',
      'Fuel Type': 'Diesel',
      'Starting': 'Hand Crank',
      'Crops': 'Paddy, Vegetables',
    },
  },
  {
    id: '8',
    name: 'Kubota NSPU-68C',
    type: 'Paddy Transplanter',
    description: 'Riding-type paddy transplanter for automated rice seedling planting in flooded delta fields.',
    ownerId: '2',
    ownerName: 'AP Rental Hub',
    pricePerDay: 3500,
    rentRate: 3500,
    rentUnit: 'acre',
    location: { lat: 16.9891, lng: 82.2475, address: 'Konaseema Delta, Kakinada, Andhra Pradesh' },
    status: 'available',
    image: '/equipment/paddy-transplanter.jpg',
    specifications: {
      'Model': 'NSPU-68C',
      'Rows': '8 Rows',
      'Capacity': '0.8-1.2 acre/hr',
      'Crops': 'Paddy',
    },
  },
  {
    id: '9',
    name: '8 ft Mini Combine Harvester',
    type: 'Combine Harvester',
    description: 'Mini combine harvester for harvesting and threshing paddy and wheat in wet delta conditions.',
    ownerId: '2',
    ownerName: 'AP Rental Hub',
    pricePerDay: 4000,
    rentRate: 4000,
    rentUnit: 'acre',
    location: { lat: 17.0005, lng: 81.8040, address: 'Godavari Paddy Fields, Rajahmundry, Andhra Pradesh' },
    status: 'available',
    image: '/equipment/combine-harvester.jpg',
    specifications: {
      'Cutter Bar': '8 Feet',
      'Type': 'Track-type crawler',
      'Crop Compatibility': 'Paddy, Wheat',
      'Use': 'Harvest & thresh',
    },
  },
  {
    id: '10',
    name: 'Sonalika Multi Crop Thresher',
    type: 'Thresher',
    description: 'Tractor PTO operated thresher for separating grains from maize, groundnut, wheat, and pulses.',
    ownerId: '2',
    ownerName: 'AP Rental Hub',
    pricePerDay: 2000,
    rentRate: 2000,
    rentUnit: 'day',
    location: { lat: 17.6868, lng: 83.2185, address: 'Coast Farmlands, Visakhapatnam, Andhra Pradesh' },
    status: 'available',
    image: '/equipment/thresher.png',
    specifications: {
      'Brand': 'Sonalika',
      'Operation': 'Tractor PTO operated',
      'Crop Compatibility': 'Maize, Groundnut, Wheat',
      'Cleaning System': 'Double aspirator blower',
    },
  },
];

const loadEquipment = (): Equipment[] => {
  try {
    const storedVersion = localStorage.getItem('equipmentSeedVersion');
    const storedEquipment = localStorage.getItem('equipment');

    if (storedVersion === EQUIPMENT_SEED_VERSION && storedEquipment) {
      const parsed: Equipment[] = JSON.parse(storedEquipment);
      return parsed;
    }

    localStorage.setItem('equipmentSeedVersion', EQUIPMENT_SEED_VERSION);
    localStorage.setItem('equipment', JSON.stringify(mockEquipment));
    return mockEquipment;
  } catch {
    localStorage.setItem('equipmentSeedVersion', EQUIPMENT_SEED_VERSION);
    localStorage.setItem('equipment', JSON.stringify(mockEquipment));
  }
  return mockEquipment;
};

export const EquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>(loadEquipment);
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

