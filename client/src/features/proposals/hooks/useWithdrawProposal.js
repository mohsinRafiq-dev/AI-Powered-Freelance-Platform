import { useDispatch, useSelector } from "react-redux";
import { withdrawProposal as withdrawProposalAction, clearSuccess, clearError } from "../../../store/slices/proposalSlice";
import { useEffect } from "react";

/**
 * Custom hook for withdrawing proposals
 * @returns {Object} - { withdraw, loading, error, success }
 */
export const useWithdrawProposal = () => {
  const dispatch = useDispatch();
  const { loading, error, withdrawSuccess } = useSelector((state) => state.proposals);

  useEffect(() => {
    if (withdrawSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [withdrawSuccess, dispatch]);

  const withdraw = async (proposalId) => {
    try {
      await dispatch(withdrawProposalAction(proposalId)).unwrap();
      return true;
    } catch (err) {
      console.error("Failed to withdraw proposal:", err);
      return false;
    }
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  return {
    withdraw,
    loading,
    error,
    success: withdrawSuccess,
    clearError: clearErrorMessage,
  };
};

export default useWithdrawProposal;
