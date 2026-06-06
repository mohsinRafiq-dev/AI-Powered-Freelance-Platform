const PROPOSALS_ENDPOINTS = {
  // Freelancer endpoints
  submitProposal: "/proposals",
  getMyProposals: "/proposals/me",
  getProposalDetails: (id) => `/proposals/freelancer/${id}`,
  updateProposal: (id) => `/proposals/${id}`,
  withdrawProposal: (id) => `/proposals/${id}`,
  getProposalStats: "/proposals/stats",
  checkIfApplied: (jobId) => `/proposals/check/${jobId}`,
  
  // Client endpoints
  getJobProposals: (jobId) => `/proposals/job/${jobId}`,
  getClientProposalDetails: (id) => `/proposals/client/${id}`,
  acceptProposal: (id) => `/proposals/${id}/accept`,
  rejectProposal: (id) => `/proposals/${id}/reject`,
  getAllClientProposals: "/proposals/client/all",
  
  // AI proposal generation endpoints
  generateProposalDraft: (jobId) => `/proposals/draft/${jobId}`,
  regenerateProposalDraft: (jobId) => `/proposals/draft/${jobId}/regenerate`,
  scoreProposal: (jobId) => `/proposals/score/${jobId}`,
  getJobKeywords: (jobId) => `/proposals/keywords/${jobId}`,
};

export default PROPOSALS_ENDPOINTS;
