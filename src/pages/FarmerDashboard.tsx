import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEquipment } from '../context/EquipmentContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, MapPin, Calendar, TrendingUp, Bot } from 'lucide-react';
import EquipmentList from '../components/EquipmentList';
import BookingModal from '../components/BookingModal';
import BookingList from '../components/BookingList';
import AIAdvisor from '../components/AIAdvisor';
import TrackingMap from '../components/TrackingMap';

const FarmerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { equipment, bookings } = useEquipment();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const availableEquipment = equipment.filter(
    (eq) =>
      eq.status === 'available' &&
      (eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const myBookings = bookings.filter((booking) => booking.farmerId === user?.id);
  const activeBookings = myBookings.filter((b) => b.status === 'active' || b.status === 'confirmed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Equipment</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{availableEquipment.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{activeBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{myBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowAdvisor(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Bot className="w-5 h-5" />
            AI Crop Equipment Advisor
          </button>
          <button
            onClick={() => setShowTracking(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Live Equipment Tracking
          </button>
        </div>

        {/* Andhra Pradesh Equipment Banner */}
        <div className="mb-6 bg-gradient-to-r from-green-800 to-green-700 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-5 text-white">
            <h2 className="text-xl font-bold">Top 10 Farm Equipments for Rent in Andhra Pradesh</h2>
            <p className="text-green-100 text-sm mt-1">
              Most used in rural areas for agriculture & allied activities — paddy, maize, groundnut, chilli & cotton
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Tractor', 'Rotavator', 'Seed Drill', 'Paddy Transplanter', 'Combine Harvester'].map((tag) => (
                <span key={tag} className="px-2 py-1 bg-white/15 rounded text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Equipment List */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Equipment</h2>
          <EquipmentList
            equipment={availableEquipment}
            onBook={(id) => setSelectedEquipment(id)}
            userRole="farmer"
          />
        </div>

        {/* My Bookings Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Bookings</h2>
          <BookingList bookings={myBookings} userRole="farmer" />
        </div>

        {/* Booking Modal */}
        {selectedEquipment && (
          <BookingModal
            equipmentId={selectedEquipment}
            onClose={() => setSelectedEquipment(null)}
          />
        )}

        {/* AI Advisor Modal */}
        {showAdvisor && <AIAdvisor onClose={() => setShowAdvisor(false)} />}

        {/* Tracking Map Modal */}
        {showTracking && <TrackingMap onClose={() => setShowTracking(false)} />}
      </div>
    </div>
  );
};

export default FarmerDashboard;

