import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as proposalsAPI from "../../api/proposalsApi";

// Async thunks
export const submitProposal = createAsyncThunk(
  "proposals/submit",
  async (proposalData, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.submitProposal(proposalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit proposal");
    }
  }
);

export const fetchMyProposals = createAsyncThunk(
  "proposals/fetchMyProposals",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getMyProposals(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch proposals");
    }
  }
);

export const fetchProposalDetails = createAsyncThunk(
  "proposals/fetchProposalDetails",
  async (proposalId, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getProposalDetails(proposalId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch proposal details");
    }
  }
);

export const updateProposal = createAsyncThunk(
  "proposals/update",
  async ({ proposalId, updateData }, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.updateProposal(proposalId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update proposal");
    }
  }
);

export const withdrawProposal = createAsyncThunk(
  "proposals/withdraw",
  async (proposalId, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.withdrawProposal(proposalId);
      return { proposalId, message: response.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to withdraw proposal");
    }
  }
);

export const fetchProposalStats = createAsyncThunk(
  "proposals/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.getProposalStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch proposal stats");
    }
  }
);

export const checkIfApplied = createAsyncThunk(
  "proposals/checkIfApplied",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await proposalsAPI.checkIfApplied(jobId);
      return { jobId, hasApplied: response.data.hasApplied };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to check application status");
    }
  }
);

const initialState = {
  proposals: [],
  currentProposal: null,
  stats: null,
  appliedJobs: {}, // Track which jobs freelancer has applied to { jobId: boolean }
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    status: null,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  loading: false,
  error: null,
  submitSuccess: false,
  updateSuccess: false,
  withdrawSuccess: false,
};

const proposalSlice = createSlice({
  name: "proposals",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.submitSuccess = false;
      state.updateSuccess = false;
      state.withdrawSuccess = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentProposal: (state) => {
      state.currentProposal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Proposal
      .addCase(submitProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(submitProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.submitSuccess = true;
        state.proposals.unshift(action.payload.proposal);
        // Mark job as applied
        if (action.payload.proposal?.jobId?._id) {
          state.appliedJobs[action.payload.proposal.jobId._id] = true;
        }
      })
      .addCase(submitProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.submitSuccess = false;
      })

      // Fetch My Proposals
      .addCase(fetchMyProposals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProposals.fulfilled, (state, action) => {
        state.loading = false;
        state.proposals = action.payload.proposals || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        // Update appliedJobs map
        if (Array.isArray(state.proposals)) {
          state.proposals.forEach((proposal) => {
            if (proposal.jobId?._id) {
              state.appliedJobs[proposal.jobId._id] = true;
            }
          });
        }
      })
      .addCase(fetchMyProposals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Proposal Details
      .addCase(fetchProposalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProposalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProposal = action.payload.proposal || action.payload;
      })
      .addCase(fetchProposalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Proposal
      .addCase(updateProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        state.currentProposal = action.payload.proposal || action.payload;
        // Update in proposals list
        const index = state.proposals.findIndex(
          (p) => p._id === state.currentProposal._id
        );
        if (index !== -1) {
          state.proposals[index] = state.currentProposal;
        }
      })
      .addCase(updateProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })

      // Withdraw Proposal
      .addCase(withdrawProposal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.withdrawSuccess = false;
      })
      .addCase(withdrawProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawSuccess = true;
        // Remove from proposals list or update status
        const index = state.proposals.findIndex((p) => p._id === action.payload.proposalId);
        if (index !== -1) {
          state.proposals[index].status = "withdrawn";
        }
        // Update current proposal if it matches
        if (state.currentProposal?._id === action.payload.proposalId) {
          state.currentProposal.status = "withdrawn";
        }
      })
      .addCase(withdrawProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.withdrawSuccess = false;
      })

      // Fetch Proposal Stats
      .addCase(fetchProposalStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProposalStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || action.payload;
      })
      .addCase(fetchProposalStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check If Applied
      .addCase(checkIfApplied.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIfApplied.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs[action.payload.jobId] = action.payload.hasApplied;
      })
      .addCase(checkIfApplied.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, setFilters, resetFilters, clearCurrentProposal } =
  proposalSlice.actions;

export default proposalSlice.reducer;
