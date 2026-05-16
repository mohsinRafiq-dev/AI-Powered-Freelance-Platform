import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import {
  Activity,
  Server,
  Cpu,
  Database,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  Clock,
  BarChart3,
} from 'lucide-react';
import { useHealthDashboard, useResetCircuitBreaker } from '@/hooks/api/useHealth';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const SystemHealthMonitoring = () => {
  const { data, isLoading, isError, refetch } = useHealthDashboard({ refetchInterval: 10000 });
  const { mutate: resetCircuitBreaker, isLoading: isResetting } = useResetCircuitBreaker();
  const [autoRefresh, setAutoRefresh] = useState(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading health data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Health Data</h2>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  const { system, ai, circuitBreaker } = data?.data || {};

  // Status helpers
  const getStatusBadge = (status) => {
    const configs = {
      healthy: { icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Healthy' },
      degraded: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Degraded' },
      unhealthy: { icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Unhealthy' },
    };
    const config = configs[status] || configs.unhealthy;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getCircuitState = (state) => {
    const configs = {
      CLOSED: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', label: 'Closed' },
      OPEN: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', label: 'Open' },
      HALF_OPEN: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Half Open' },
    };
    const config = configs[state] || configs.CLOSED;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Health Monitoring</h1>
            <p className="text-gray-600 dark:text-gray-400">Real-time system and AI status</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'border-brand text-brand' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh {autoRefresh ? 'On' : 'Off'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Database Status */}
        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Database className="w-8 h-8 text-brand" />
            {getStatusBadge(system?.database?.status)}
          </div>
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-1">Database</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{system?.database?.state}</p>
        </Card>

        {/* System Memory */}
        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Cpu className="w-8 h-8 text-brand" />
            {getStatusBadge('healthy')}
          </div>
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-1">Memory</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {system?.memory?.heapUsed} / {system?.memory?.heapTotal} MB
          </p>
        </Card>

        {/* AI Status */}
        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-brand" />
            {getStatusBadge(ai?.status)}
          </div>
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-1">AI Service</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{ai?.enabled ? 'Enabled' : 'Disabled'}</p>
        </Card>

        {/* Uptime */}
        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-brand" />
            {getStatusBadge('healthy')}
          </div>
          <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-1">Uptime</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {Math.floor(system?.uptime / 3600)}h {Math.floor((system?.uptime % 3600) / 60)}m
          </p>
        </Card>
      </div>

      {/* AI Service Details */}
      <Card glass className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-brand" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Service Status</h2>
          </div>
          {getStatusBadge(ai?.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Provider */}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Provider</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{ai?.provider || 'N/A'}</p>
          </div>

          {/* Cache */}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Cache</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {ai?.cache?.size || 0} entries ({ai?.cache?.enabled ? 'Enabled' : 'Disabled'})
            </p>
          </div>

          {/* Features Enabled */}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {ai?.features?.proposalGeneration && <Badge variant="outline" className="text-xs">Proposals</Badge>}
              {ai?.features?.jobRecommendations && <Badge variant="outline" className="text-xs">Jobs</Badge>}
              {ai?.features?.freelancerRecommendations && <Badge variant="outline" className="text-xs">Freelancers</Badge>}
              {ai?.features?.matchScoreEnhancement && <Badge variant="outline" className="text-xs">Match Score</Badge>}
            </div>
          </div>
        </div>
      </Card>

      {/* Circuit Breaker */}
      <Card glass className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-brand" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Circuit Breaker Status</h2>
          </div>
          <div className="flex items-center gap-3">
            {getCircuitState(circuitBreaker?.state)}
            {circuitBreaker?.state === 'OPEN' && (
              <Button
                size="sm"
                onClick={() => resetCircuitBreaker()}
                disabled={isResetting}
                variant="destructive"
              >
                {isResetting ? 'Resetting...' : 'Reset Circuit'}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{circuitBreaker?.totalCalls || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Calls</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{circuitBreaker?.successCalls || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Success</p>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">{circuitBreaker?.failureCalls || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Failures</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
              {((circuitBreaker?.errorRate || 0) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Error Rate</p>
          </div>
        </div>

        {circuitBreaker?.lastStateChange && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Last state change: {formatDistanceToNow(new Date(circuitBreaker.lastStateChange), { addSuffix: true })}
          </p>
        )}
      </Card>

      {/* System Details */}
      <Card glass className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Server className="w-6 h-6 text-brand" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Resources</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Memory Usage */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Memory Usage</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Heap Used</span>
                <span className="font-medium text-gray-900 dark:text-white">{system?.memory?.heapUsed} MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Heap Total</span>
                <span className="font-medium text-gray-900 dark:text-white">{system?.memory?.heapTotal} MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">System Free</span>
                <span className="font-medium text-gray-900 dark:text-white">{system?.memory?.systemFree} GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">System Total</span>
                <span className="font-medium text-gray-900 dark:text-white">{system?.memory?.systemTotal} GB</span>
              </div>
            </div>
          </div>

          {/* Database Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Database</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">{system?.database?.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">State</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">{system?.database?.state}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SystemHealthMonitoring;
