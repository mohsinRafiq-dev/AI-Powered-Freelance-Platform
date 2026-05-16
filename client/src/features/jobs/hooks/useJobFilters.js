
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useJobFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    budgetType: searchParams.get('budgetType') || '',
    minBudget: searchParams.get('minBudget') || '',
    maxBudget: searchParams.get('maxBudget') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    locationType: searchParams.get('locationType') || '',
    duration: searchParams.get('duration') || '',
    projectSize: searchParams.get('projectSize') || '',
    skills: searchParams.get('skills')?.split(',').filter(Boolean) || [],
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
    sort: searchParams.get('sort') || '-createdAt',
  });

  // Update a single filter
  const updateFilter = (key, value, resetPage = true) => {
    const newFilters = { ...filters, [key]: value };
    // Only reset page to 1 if resetPage is true (default behavior for filters)
    // When changing pages, resetPage should be false
    if (resetPage && key !== 'page') {
      newFilters.page = 1;
    }
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  // Update multiple filters at once
  const updateFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    updateSearchParams(updated);
  };

  // Reset all filters
  const resetFilters = () => {
    const defaultFilters = {
      search: '',
      category: '',
      budgetType: '',
      minBudget: '',
      maxBudget: '',
      experienceLevel: '',
      locationType: '',
      duration: '',
      projectSize: '',
      skills: [],
      page: 1,
      limit: 10,
      sort: '-createdAt',
    };
    setFilters(defaultFilters);
    setSearchParams({});
  };

  // Update URL search params
  const updateSearchParams = (filters) => {
    const params = {};
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        params[key] = Array.isArray(value) ? value.join(',') : value.toString();
      }
    });
    setSearchParams(params);
  };

  // Build query params for API (remove empty values)
  const queryParams = useMemo(() => {
    const params = {};
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        params[key] = value;
      }
    });
    return params;
  }, [filters]);

  // Count active filters (excluding page, limit, sort)
  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter((key) => {
      if (['page', 'limit', 'sort'].includes(key)) return false;
      const value = filters[key];
      return value && value !== '' && !(Array.isArray(value) && value.length === 0);
    }).length;
  }, [filters]);

  return {
    filters,
    queryParams,
    updateFilter,
    updateFilters,
    resetFilters,
    activeFilterCount,
  };
};
