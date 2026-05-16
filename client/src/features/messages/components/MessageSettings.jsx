import { useState } from 'react';
import { X, Bell, BellOff, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const MessageSettings = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    desktopNotifications: true,
    soundEnabled: true,
    showPreview: true,
  });

  if (!isOpen) return null;

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Message Settings</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Notifications</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Desktop Notifications</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications on your device</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('desktopNotifications')}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-colors',
                    settings.desktopNotifications ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform',
                      settings.desktopNotifications ? 'translate-x-6' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <BellOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Sound</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Play sound for new messages</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('soundEnabled')}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-colors',
                    settings.soundEnabled ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform',
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Message Preview</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Show message content in notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('showPreview')}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-colors',
                    settings.showPreview ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform',
                      settings.showPreview ? 'translate-x-6' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

