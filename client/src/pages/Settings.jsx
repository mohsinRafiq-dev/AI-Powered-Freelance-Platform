import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User, Bell, Lock, Shield, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    id: 'profile',
    icon: User,
    title: 'Profile Settings',
    description: 'Edit your profile, skills, and portfolio',
    link: '/profile/me',
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notification Preferences',
    description: 'Control what notifications you receive',
    link: null,
  },
  {
    id: 'security',
    icon: Lock,
    title: 'Password & Security',
    description: 'Change your password or reset it via email',
    link: '/forgot-password',
  },
  {
    id: 'verify',
    icon: Shield,
    title: 'Email Verification',
    description: 'Verify your email address',
    link: '/verify-email',
  },
];

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    newMessage: true,
    proposalUpdate: true,
    contractUpdate: true,
    paymentUpdate: true,
    jobRecommendation: false,
  });
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          {SECTIONS.map((section) => {
            const Icon = section.icon;

            if (section.id === 'notifications') {
              return (
                <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{section.title}</p>
                      <p className="text-sm text-gray-500">{section.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showNotifications ? 'rotate-90' : ''}`} />
                  </button>

                  {showNotifications && (
                    <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-3">
                      {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <button
                            onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
                            className={`w-11 h-6 rounded-full transition-colors ${value ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={section.id}
                to={section.link}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{section.title}</p>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            );
          })}
        </div>

        {user?.role === 'admin' && (
          <div className="mt-6">
            <Link
              to="/admin/settings"
              className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-purple-900 dark:text-purple-100">Admin Settings</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">Manage platform configuration</p>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
