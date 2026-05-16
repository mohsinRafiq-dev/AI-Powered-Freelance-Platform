import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Filter, Inbox } from "lucide-react";
import { useMyProposals, useWithdrawProposal } from "../hooks";
import ProposalCard from "../components/ProposalCard";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export const MyProposals = () => {
  const { proposals, loading, error, filters, updateFilters } = useMyProposals();
  const { withdraw } = useWithdrawProposal();
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(null);

  const handleWithdraw = async () => {
    if (showWithdrawConfirm) {
      await withdraw(showWithdrawConfirm);
      setShowWithdrawConfirm(null);
    }
  };

  const handleFilterChange = (status) => {
    updateFilters({ status: status === "all" ? null : status });
  };

  if (loading && !proposals.length) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">Loading your proposals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Proposals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage all your job applications
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-brand dark:text-brand-light" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter by Status</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleFilterChange("all")}
              variant={!filters.status ? "default" : "outline"}
              className={`${!filters.status ? 'bg-brand hover:bg-brand-dark text-white' : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-all`}
            >
              All
            </Button>
            <Button
              onClick={() => handleFilterChange("pending")}
              variant={filters.status === "pending" ? "default" : "outline"}
              className={`${filters.status === "pending" ? 'bg-brand hover:bg-brand-dark text-white' : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-all`}
            >
              Pending
            </Button>
            <Button
              onClick={() => handleFilterChange("accepted")}
              variant={filters.status === "accepted" ? "default" : "outline"}
              className={`${filters.status === "accepted" ? 'bg-brand hover:bg-brand-dark text-white' : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-all`}
            >
              Accepted
            </Button>
            <Button
              onClick={() => handleFilterChange("withdrawn")}
              variant={filters.status === "withdrawn" ? "default" : "outline"}
              className={`${filters.status === "withdrawn" ? 'bg-brand hover:bg-brand-dark text-white' : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-all`}
            >
              Withdrawn
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
                    <Inbox className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No proposals found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start applying to jobs to see your proposals here
                  </p>
                  <Button
                    onClick={() => window.location.href = '/jobs'}
                    className="bg-brand hover:bg-brand-dark text-white"
                  >
                    Browse Available Jobs
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            proposals.map((proposal, index) => (
              <motion.div
                key={proposal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProposalCard
                  proposal={proposal}
                  onWithdraw={(id) => setShowWithdrawConfirm(id)}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Withdraw Confirmation Modal */}
      {showWithdrawConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Confirm Withdrawal
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to withdraw this proposal? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowWithdrawConfirm(null)}
                  className="flex-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyProposals;
