import { useDispatch, useSelector } from "react-redux";
import { submitProposal as submitProposalAction, clearSuccess, clearError } from "../../../store/slices/proposalSlice";
import { useEffect } from "react";

/**
 * Custom hook for submitting proposals
 * @returns {Object} - { submit, loading, error, success }
 */
export const useSubmitProposal = () => {
  const dispatch = useDispatch();
  const { loading, error, submitSuccess } = useSelector((state) => state.proposals);

  useEffect(() => {
    if (submitSuccess) {
      // Clear success after navigation
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, dispatch]);

  const submit = async (proposalData) => {
    try {
      await dispatch(submitProposalAction(proposalData)).unwrap();
      return true;
    } catch (err) {
      console.error("Failed to submit proposal:", err);
      return false;
    }
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  return {
    submit,
    loading,
    error,
    success: submitSuccess,
    clearError: clearErrorMessage,
  };
};

export default useSubmitProposal;
