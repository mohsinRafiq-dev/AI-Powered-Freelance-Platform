import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, DollarSign, Calendar, User, Filter } from 'lucide-react';
import { useContracts } from '../../../hooks/api/useContracts';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';
import { Loader } from '../../../components/common/Loader';
import {
  STATUS_CONFIG,
  CONTRACT_STATUS,
  MILESTONE_STATUS,
  calculateProgress,
} from '../constants';

export const ContractsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: '',
  });

  const { data: contractsData, isLoading } = useContracts(filters);
  // FIX: API response shape is { success, data: [...contracts], pagination }
  // Contracts array is directly in data, NOT data.contracts
  const contracts = contractsData?.data || [];
  
  // [CONTRACTS][UI] Log page state
  console.log('\n[CONTRACTS][UI][PAGE] ContractsPage rendered');
  console.log('[CONTRACTS][UI][PAGE] Filters:', JSON.stringify(filters));
  console.log('[CONTRACTS][UI][PAGE] isLoading:', isLoading);
  console.log('[CONTRACTS][UI][PAGE] Raw API response:', contractsData);
  console.log('[CONTRACTS][UI][PAGE] Extracted contracts:', contracts);
  console.log('[CONTRACTS][UI][NORMALIZED] count:', contracts.length);
  console.log('[CONTRACTS][UI][PAGE] Contracts:', contracts.map(c => ({ id: c._id, status: c.status, title: c.title })));

  // Calculate stats using constants
  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === CONTRACT_STATUS.ACTIVE).length,
    completed: contracts.filter((c) => c.status === CONTRACT_STATUS.COMPLETED).length,
    pending: contracts.filter((c) => c.status === CONTRACT_STATUS.PENDING).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 lg:pt-24 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contracts</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your active and past contracts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Contracts</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand/10 dark:bg-brand/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/10 dark:bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">All Statuses</option>
            <option value={CONTRACT_STATUS.PENDING}>Pending</option>
            <option value={CONTRACT_STATUS.ACTIVE}>Active</option>
            <option value={CONTRACT_STATUS.COMPLETED}>Completed</option>
            <option value={CONTRACT_STATUS.CANCELLED}>Cancelled</option>
            <option value={CONTRACT_STATUS.DISPUTED}>Disputed</option>
            <option value={CONTRACT_STATUS.TERMINATED}>Terminated</option>
          </select>
        </div>

        {/* Contracts List */}
        {isLoading ? (
          <Loader />
        ) : contracts.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-800 shadow-sm">
            <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No contracts found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filters.status
                ? 'No contracts found with the selected status'
                : 'Contracts will appear here once created'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => {
              const config = STATUS_CONFIG[contract.status] || STATUS_CONFIG[CONTRACT_STATUS.PENDING];
              const progress = calculateProgress(contract.milestones);

              return (
                <div
                  key={contract._id}
                  onClick={() => navigate(`/contracts/${contract._id}`)}
                  className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 hover:border-brand/50 transition-colors cursor-pointer shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{contract.title}</h3>
                        <span
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium border',
                            config.color
                          )}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{contract.description}</p>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-brand">
                        Rs. {contract.totalAmount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{contract.paymentType}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Client: <span className="text-gray-900 dark:text-white">{contract.client?.name}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Freelancer: <span className="text-gray-900 dark:text-white">{contract.freelancer?.name}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">
                        {contract.startDate
                          ? format(new Date(contract.startDate), 'MMM d, yyyy')
                          : 'Not started'}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  {contract.milestones?.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs text-gray-400">
                          {contract.milestones.filter((m) => m.status === MILESTONE_STATUS.COMPLETED).length} of{' '}
                          {contract.milestones.length} milestones
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                        <div
                          className="bg-brand h-1.5 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsPage;
