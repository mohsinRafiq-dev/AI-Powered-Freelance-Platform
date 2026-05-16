import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Sparkles, Settings, Key, CheckCircle, AlertCircle, XCircle, Wallet } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { useAdminSettings } from '@/hooks/api/useAdminSettings';
import { useEnvVars } from '@/hooks/api/useEnvVars';
import AISettingsForm from './components/AISettingsForm';
import EnvVarsForm from './components/EnvVarsForm';
import { PaymentSettingsForm } from './components/PaymentSettingsForm';
import { AdminPageHeader } from '../components';

/**
 * Admin Settings Page
 * Tab-based interface for managing platform settings
 * Styled similar to System Health Monitoring dashboard
 */
export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('ai');
  const { data: aiSettings } = useAdminSettings();
  const { data: envVars } = useEnvVars();

  // Get status for overview cards
  const aiEnabled = aiSettings?.data?.settings?.aiEnabled || false;
  const envVarCount = envVars?.data?.variables?.length || 0;
  const publicEnvVars = envVars?.data?.variables?.filter((v) => v.isPublic)?.length || 0;

  // Status helper
  const getStatusBadge = (status) => {
    const configs = {
      active: { icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Active' },
      inactive: { icon: XCircle, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', label: 'Inactive' },
      warning: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Warning' },
    };
    const config = configs[status] || configs.inactive;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // Define all available tabs
  // Easy to add more tabs by adding to this array
  const tabs = [
    {
      id: 'ai',
      label: 'AI Configuration',
      icon: Sparkles,
      component: <AISettingsForm />,
      description: 'Manage AI features and providers',
    },
    {
      id: 'env',
      label: 'Environment Variables',
      icon: Key,
      component: <EnvVarsForm />,
      description: 'Manage environment variables stored in database',
    },
    {
      id: 'payment',
      label: 'Payment Settings',
      icon: Wallet,
      component: <PaymentSettingsForm />,
      description: 'Configure payment gateways and limits',
    },
    // Future tabs can be added here easily:
    // {
    //   id: 'security',
    //   label: 'Security',
    //   icon: Shield,
    //   component: <SecuritySettingsForm />,
    //   description: 'Security and authentication settings',
    // },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Admin Settings"
        description="Manage platform settings, AI features, and environment variables"
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* AI Status Card */}
        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Sparkles className="w-8 h-8 text-brand" />
            {getStatusBadge(aiEnabled ? 'active' : 'inactive')}
          </div>
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-1">AI Features</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {aiEnabled ? 'Enabled' : 'Disabled'}
          </p>
          {aiSettings?.data?.settings && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Provider: {aiSettings.data.settings.aiProvider || 'N/A'}
              </p>
            </div>
          )}
        </Card>

        {/* Environment Variables Card */}
        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Key className="w-8 h-8 text-brand" />
            {getStatusBadge(envVarCount > 0 ? 'active' : 'inactive')}
          </div>
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-1">Environment Variables</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {envVarCount} {envVarCount === 1 ? 'variable' : 'variables'}
          </p>
          {publicEnvVars > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {publicEnvVars} {publicEnvVars === 1 ? 'is' : 'are'} public
              </p>
            </div>
          )}
        </Card>

        {/* Settings Overview Card */}
        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Settings className="w-8 h-8 text-brand" />
            {getStatusBadge('active')}
          </div>
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-1">Settings</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {tabs.length} {tabs.length === 1 ? 'category' : 'categories'}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              All systems operational
            </p>
          </div>
        </Card>
      </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} icon={Icon}>
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Contents */}
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <div className="space-y-6">
                {/* Tab Header Card */}
                <Card glass className="p-6">
                  <div className="flex items-center gap-3">
                    {tab.icon && (
                      <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-dark rounded-lg flex items-center justify-center">
                        <tab.icon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {tab.label}
                      </h2>
                      {tab.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {tab.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Tab Content */}
                {tab.component}
              </div>
            </TabsContent>
          ))}
        </Tabs>
    </div>
  );
};

export default AdminSettings;



