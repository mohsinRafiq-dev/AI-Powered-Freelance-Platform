import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDown, 
  Filter, 
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/api/axiosInstance';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [suspiciousActivities, setSuspiciousActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalVolume: 0,
    pendingWithdrawals: 0,
    suspiciousCount: 0,
  });
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    paymentMethod: '',
    userId: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 50,
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
    loadStats();
    loadSuspiciousActivities();
  }, [activeTab, filters]);

  const loadStats = async () => {
    try {
      const [transactionsRes, withdrawalsRes] = await Promise.all([
        axiosInstance.get('/admin/payments/transactions', { params: { limit: 1 } }),
        axiosInstance.get('/admin/payments/withdrawals/pending'),
      ]);
      
      const totalVolume = transactionsRes.data.data?.transactions?.reduce(
        (sum, t) => sum + (t.amount || 0), 0
      ) || 0;

      setStats({
        totalTransactions: transactionsRes.data.data?.pagination?.total || 0,
        totalVolume,
        pendingWithdrawals: withdrawalsRes.data.data?.length || 0,
        suspiciousCount: suspiciousActivities.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadSuspiciousActivities = async () => {
    try {
      // Detect suspicious patterns
      const response = await axiosInstance.get('/admin/payments/transactions', {
        params: { limit: 1000 },
      });
      
      const allTransactions = response.data.data?.transactions || [];
      
      // Detect suspicious patterns
      const suspicious = [];
      
      // Large amounts (>100k PKR)
      const largeAmounts = allTransactions.filter(t => t.amount > 100000);
      largeAmounts.forEach(t => {
        suspicious.push({
          ...t,
          reason: 'Large transaction amount',
          severity: 'high',
        });
      });
      
      // Multiple failed transactions from same user
      const failedByUser = {};
      allTransactions
        .filter(t => t.status === 'FAILED')
        .forEach(t => {
          const userId = t.userId?._id || t.userId;
          failedByUser[userId] = (failedByUser[userId] || 0) + 1;
          if (failedByUser[userId] >= 5) {
            suspicious.push({
              ...t,
              reason: 'Multiple failed transactions',
              severity: 'medium',
            });
          }
        });
      
      // Rapid transactions (same user, multiple transactions in short time)
      const rapidTransactions = {};
      allTransactions.forEach(t => {
        const userId = t.userId?._id || t.userId;
        if (!rapidTransactions[userId]) {
          rapidTransactions[userId] = [];
        }
        rapidTransactions[userId].push(t);
      });
      
      Object.values(rapidTransactions).forEach(userTxs => {
        if (userTxs.length >= 10) {
          const recent = userTxs
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);
          const timeDiff = new Date(recent[0].createdAt) - new Date(recent[9].createdAt);
          if (timeDiff < 3600000) { // Within 1 hour
            suspicious.push({
              ...recent[0],
              reason: 'Rapid transaction pattern',
              severity: 'medium',
            });
          }
        }
      });
      
      setSuspiciousActivities(suspicious.slice(0, 50)); // Limit to 50
    } catch (error) {
      console.error('Failed to load suspicious activities:', error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      if (activeTab === 'transactions') {
        const response = await axiosInstance.get('/admin/payments/transactions', {
          params: cleanFilters,
        });
        setTransactions(response.data.data?.transactions || []);
      } else if (activeTab === 'withdrawals') {
        const response = await axiosInstance.get('/admin/payments/withdrawals', {
          params: cleanFilters,
        });
        setWithdrawals(response.data.data?.withdrawals || []);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const exportTransactions = () => {
    // Export functionality
    const csv = [
      ['Date', 'Type', 'User', 'Amount', 'Status', 'Payment Method'].join(','),
      ...transactions.map(t => [
        format(new Date(t.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        t.type,
        t.user?.name || t.userId,
        t.amount,
        t.status,
        t.paymentMethod || 'N/A',
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Transactions exported successfully');
  };

  const getStatusBadge = (status) => {
    const configs = {
      SUCCESS: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle },
      PENDING: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock },
      FAILED: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: XCircle },
      CANCELLED: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', icon: XCircle },
    };
    const config = configs[status] || configs.PENDING;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const filteredTransactions = transactions.filter(t => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.user?.name?.toLowerCase().includes(query) ||
      t.user?.email?.toLowerCase().includes(query) ||
      t.type?.toLowerCase().includes(query) ||
      t._id?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor transactions, withdrawals, and detect suspicious activities
          </p>
        </div>
        {activeTab === 'transactions' && (
          <Button onClick={exportTransactions} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTransactions}</p>
              </div>
              <DollarSign className="w-8 h-8 text-brand" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalVolume)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Withdrawals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingWithdrawals}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Suspicious Activities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{suspiciousActivities.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'text-brand border-b-2 border-brand'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          All Transactions
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'withdrawals'
              ? 'text-brand border-b-2 border-brand'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Withdrawals
        </button>
        <button
          onClick={() => setActiveTab('suspicious')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'suspicious'
              ? 'text-brand border-b-2 border-brand'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Suspicious Activities
        </button>
      </div>

      {/* Filters */}
      {(activeTab === 'transactions' || activeTab === 'withdrawals') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {activeTab === 'transactions' && (
                <>
                  <div>
                    <Label>Type</Label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                    >
                      <option value="">All Types</option>
                      <option value="DEPOSIT">Deposit</option>
                      <option value="WITHDRAWAL">Withdrawal</option>
                      <option value="ESCROW_FUND">Escrow Fund</option>
                      <option value="ESCROW_RELEASE">Escrow Release</option>
                      <option value="REFUND">Refund</option>
                    </select>
                  </div>
                </>
              )}
              <div>
                <Label>Status</Label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="">All Statuses</option>
                  <option value="SUCCESS">Success</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <Label>Payment Method</Label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="">All Methods</option>
                  <option value="JAZZCASH">JazzCash</option>
                  <option value="EASYPAISA">Easypaisa</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>
              <div>
                <Label>User ID</Label>
                <Input
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                  placeholder="Search by User ID"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={loadData} className="w-full">Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      {activeTab === 'transactions' && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name, email, transaction ID..."
            className="pl-10"
          />
        </div>
      )}

      {/* Content */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => (
              <Card key={transaction._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-lg">{transaction.type}</p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">User</p>
                          <p>{transaction.user?.name || transaction.userId || 'Unknown'}</p>
                          <p className="text-xs">{transaction.user?.email}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Amount</p>
                          <p className="text-lg font-bold text-brand">{formatCurrency(transaction.amount)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Method</p>
                          <p>{transaction.paymentMethod || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Date</p>
                          <p>{format(new Date(transaction.createdAt), 'MMM dd, yyyy')}</p>
                          <p className="text-xs">{format(new Date(transaction.createdAt), 'h:mm a')}</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-4">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          ) : withdrawals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No withdrawals found</p>
              </CardContent>
            </Card>
          ) : (
            withdrawals.map((withdrawal) => (
              <Card key={withdrawal._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-lg">{withdrawal.user?.name || 'Unknown User'}</p>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Amount</p>
                          <p className="text-lg font-bold text-brand">{formatCurrency(withdrawal.amount)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Method</p>
                          <p>{withdrawal.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Requested</p>
                          <p>{format(new Date(withdrawal.createdAt), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Email</p>
                          <p className="text-xs">{withdrawal.user?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'suspicious' && (
        <div className="space-y-4">
          {suspiciousActivities.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
                <p className="text-gray-500 dark:text-gray-400">No suspicious activities detected</p>
              </CardContent>
            </Card>
          ) : (
            suspiciousActivities.map((activity, index) => (
              <Card key={index} className="border-red-200 dark:border-red-900/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <p className="font-semibold text-lg text-red-600 dark:text-red-400">
                          {activity.reason}
                        </p>
                        <Badge className={`${
                          activity.severity === 'high' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {activity.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mt-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">User</p>
                          <p>{activity.user?.name || activity.userId || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Amount</p>
                          <p className="text-lg font-bold">{formatCurrency(activity.amount)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Type</p>
                          <p>{activity.type}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Date</p>
                          <p>{format(new Date(activity.createdAt), 'MMM dd, yyyy h:mm a')}</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-4">
                      <Eye className="w-4 h-4" />
                      Investigate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
