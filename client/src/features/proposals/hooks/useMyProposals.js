import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchMyProposals, setFilters, resetFilters } from "../../../store/slices/proposalSlice";

/**
 * Custom hook for fetching freelancer's proposals
 * @returns {Object} - { proposals, loading, error, pagination, filters, fetchProposals, updateFilters, clearFilters }
 */
export const useMyProposals = () => {
  const dispatch = useDispatch();
  const { proposals, loading, error, pagination, filters } = useSelector((state) => state.proposals);

  useEffect(() => {
    // Fetch proposals on mount with current filters
    dispatch(fetchMyProposals(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, filters.status, filters.sortBy, filters.sortOrder, pagination.page]);

  const fetchProposals = (customFilters = {}) => {
    dispatch(fetchMyProposals({ ...filters, ...customFilters }));
  };

  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const clearFilters = () => {
    dispatch(resetFilters());
  };

  return {
    proposals,
    loading,
    error,
    pagination,
    filters,
    fetchProposals,
    updateFilters,
    clearFilters,
  };
};

export default useMyProposals;
