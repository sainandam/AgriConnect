import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEquipment } from '../context/EquipmentContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Package, DollarSign, Calendar } from 'lucide-react';
import EquipmentList from '../components/EquipmentList';
import AddEquipmentModal from '../components/AddEquipmentModal';
import BookingList from '../components/BookingList';

const OwnerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { equipment, bookings } = useEquipment();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const myEquipment = equipment.filter((eq) => eq.ownerId === user?.id);
  const myBookings = bookings.filter((booking) => booking.ownerId === user?.id);
  const totalRevenue = myBookings
    .filter((b) => b.status === 'completed' || b.status === 'active')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
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
                <p className="text-sm text-gray-600">My Equipment</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{myEquipment.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{myBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Equipment Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Equipment
          </button>
        </div>

        {/* Equipment List */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Equipment</h2>
          <EquipmentList equipment={myEquipment} userRole="owner" />
        </div>

        {/* Bookings */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bookings</h2>
          <BookingList bookings={myBookings} userRole="owner" />
        </div>

        {/* Add Equipment Modal */}
        {showAddModal && <AddEquipmentModal onClose={() => setShowAddModal(false)} />}
      </div>
    </div>
  );
};

export default OwnerDashboard;

