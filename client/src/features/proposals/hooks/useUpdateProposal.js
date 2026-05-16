import { useDispatch, useSelector } from "react-redux";
import { updateProposal as updateProposalAction, clearSuccess, clearError } from "../../../store/slices/proposalSlice";
import { useEffect } from "react";

/**
 * Custom hook for updating proposals
 * @returns {Object} - { update, loading, error, success }
 */
export const useUpdateProposal = () => {
  const dispatch = useDispatch();
  const { loading, error, updateSuccess } = useSelector((state) => state.proposals);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

  const update = async (proposalId, updateData) => {
    try {
      await dispatch(updateProposalAction({ proposalId, updateData })).unwrap();
      return true;
    } catch (err) {
      console.error("Failed to update proposal:", err);
      return false;
    }
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  return {
    update,
    loading,
    error,
    success: updateSuccess,
    clearError: clearErrorMessage,
  };
};

export default useUpdateProposal;
