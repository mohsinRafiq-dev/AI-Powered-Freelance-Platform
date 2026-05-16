import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchProposalDetails,
  clearCurrentProposal,
  clearError,
} from "../../../store/slices/proposalSlice";

/**
 * Custom hook for fetching proposal details
 * @param {string} proposalId - Proposal ID
 * @returns {Object} - { proposal, loading, error, refetch, clear }
 */
export const useProposalDetails = (proposalId) => {
  const dispatch = useDispatch();
  const { currentProposal, loading, error } = useSelector((state) => state.proposals);

  useEffect(() => {
    if (proposalId) {
      dispatch(fetchProposalDetails(proposalId));
    }

    return () => {
      // Clear current proposal when component unmounts
      dispatch(clearCurrentProposal());
    };
  }, [proposalId, dispatch]);

  const refetch = () => {
    if (proposalId) {
      dispatch(fetchProposalDetails(proposalId));
    }
  };

  const clear = () => {
    dispatch(clearCurrentProposal());
    dispatch(clearError());
  };

  return {
    proposal: currentProposal,
    loading,
    error,
    refetch,
    clear,
  };
};

export default useProposalDetails;
