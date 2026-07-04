
import React from 'react';

export const BudgetInput = ({ budgetType, budgetAmount, hourlyRate, onChange }) => {
  const handleTypeChange = (type) => {
    onChange({ budgetType: type });
  };

  const handleBudgetAmountChange = (value) => {
    onChange({ budgetAmount: parseFloat(value) || 0 });
  };

  const handleHourlyRateChange = (field, value) => {
    onChange({
      hourlyRate: {
        ...hourlyRate,
        [field]: parseFloat(value) || 0
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Budget Type Toggle */}
      <div>
        <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
          Budget Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange('fixed')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              budgetType === 'fixed'
                ? 'bg-gradient-to-r from-brand to-brand-dark text-white shadow-md ring-2 ring-brand/20'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
            }`}
          >
            Fixed Price
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('hourly')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              budgetType === 'hourly'
                ? 'bg-gradient-to-r from-brand to-brand-dark text-white shadow-md ring-2 ring-brand/20'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
            }`}
          >
            Hourly Rate
          </button>
        </div>
      </div>

      {/* Fixed Budget Input */}
      {budgetType === 'fixed' && (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
            Budget Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand font-semibold text-sm">Rs</span>
            <input
              type="number"
              min="5"
              max="1000000"
              value={budgetAmount || ''}
              onChange={(e) => handleBudgetAmountChange(e.target.value)}
              placeholder="e.g., 500"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand dark:focus:border-brand-light transition-all"
              required
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand to-brand-dark rounded-full transition-all duration-300"
                style={{ width: `${Math.min((budgetAmount / 10000) * 100, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 flex items-center justify-between">
            <span>Minimum: Rs. 5</span>
            <span>Maximum: Rs. 1,000,000</span>
          </p>
        </div>
      )}

      {/* Hourly Rate Range */}
      {budgetType === 'hourly' && (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                Min Rate <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-brand font-semibold text-xs">Rs</span>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={hourlyRate?.min || ''}
                  onChange={(e) => handleHourlyRateChange('min', e.target.value)}
                  placeholder="Min"
                  className="w-full pl-9 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand dark:focus:border-brand-light transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
                Max Rate <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-brand font-semibold text-xs">Rs</span>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={hourlyRate?.max || ''}
                  onChange={(e) => handleHourlyRateChange('max', e.target.value)}
                  placeholder="Max"
                  className="w-full pl-9 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand dark:focus:border-brand-light transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Visual Range Indicator */}
          {hourlyRate?.min && hourlyRate?.max && (
            <div className="pt-2">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span>Rs. {hourlyRate.min}/hr</span>
                <span className="text-brand font-semibold">Range: Rs. {hourlyRate.max - hourlyRate.min}/hr</span>
                <span>Rs. {hourlyRate.max}/hr</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand to-brand-dark rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(((hourlyRate.max - hourlyRate.min) / 500) * 100, 100)}%`,
                    marginLeft: `${(hourlyRate.min / 500) * 100}%`
                  }}
                />
              </div>
            </div>
          )}

          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between">
            <span>Range: Rs. 5 - Rs. 500 per hour</span>
            {hourlyRate?.min && hourlyRate?.max && (
              <span className="text-brand font-semibold">Avg: Rs. {((hourlyRate.min + hourlyRate.max) / 2).toFixed(0)}/hr</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
