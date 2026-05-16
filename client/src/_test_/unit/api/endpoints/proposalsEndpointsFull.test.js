import PROPOSALS from '@/api/endpoints/proposals';

describe('proposals endpoint helpers (full)', () => {
  test('all endpoints produce expected paths', () => {
    expect(PROPOSALS.submitProposal).toBe('/proposals');
    expect(PROPOSALS.getMyProposals).toBe('/proposals/me');
    expect(PROPOSALS.getProposalDetails(2)).toBe('/proposals/freelancer/2');
    expect(PROPOSALS.updateProposal(3)).toBe('/proposals/3');
    expect(PROPOSALS.withdrawProposal(4)).toBe('/proposals/4');
    expect(PROPOSALS.getProposalStats).toBe('/proposals/stats');
    expect(PROPOSALS.checkIfApplied(7)).toBe('/proposals/check/7');
    expect(PROPOSALS.getJobProposals(11)).toBe('/proposals/job/11');
    expect(PROPOSALS.getClientProposalDetails(5)).toBe('/proposals/client/5');
    expect(PROPOSALS.acceptProposal(6)).toBe('/proposals/6/accept');
    expect(PROPOSALS.rejectProposal(6)).toBe('/proposals/6/reject');
    expect(PROPOSALS.getAllClientProposals).toBe('/proposals/client/all');
    expect(PROPOSALS.generateProposalDraft(8)).toBe('/proposals/draft/8');
    expect(PROPOSALS.regenerateProposalDraft(8)).toBe('/proposals/draft/8/regenerate');
  });
});