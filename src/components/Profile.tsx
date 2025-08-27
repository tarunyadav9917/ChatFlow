import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Edit3, LogOut, User, Mail, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileProps {
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const { currentUser, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    username: currentUser?.username || '',
    email: currentUser?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setLoading(true);
    try {
      updateProfile(formData);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        updateProfile({ profilePicture: imageDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
        </div>
        
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Edit3 className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Picture Section */}
        <div className="p-6 text-center border-b border-gray-100">
          <div className="relative inline-block">
            <img
              src={currentUser.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            {currentUser.name}
          </h2>
          <p className="text-gray-500">@{currentUser.username}</p>
        </div>

        {/* Profile Information */}
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={isEditing ? formData.name : currentUser.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={isEditing ? formData.username : currentUser.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={isEditing ? formData.email : currentUser.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-3 p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;