import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard, Clock, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  {
    icon: Wallet,
    title: 'My Wallet',
    description: 'View balance, deposit and withdraw funds',
    link: '/wallet',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  {
    icon: Clock,
    title: 'Transaction History',
    description: 'View all past transactions',
    link: '/transactions',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Download,
    title: 'Withdrawals',
    description: 'Request a withdrawal to your bank account',
    link: '/withdrawals',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
  {
    icon: CreditCard,
    title: 'Payment Methods',
    description: 'Manage JazzCash and Easypaisa accounts',
    link: '/wallet',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  },
];

const Billing = () => {
  const navigate = useNavigate();

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
            <p className="text-sm text-gray-500">Manage your payments and transactions</p>
          </div>
        </div>

        <div className="space-y-3">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.link}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Billing;
