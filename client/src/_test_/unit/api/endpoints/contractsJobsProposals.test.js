import CONTRACTS from '@/api/endpoints/contracts';
import JOBS from '@/api/endpoints/jobs';
import PROPOSALS from '@/api/endpoints/proposals';

describe('contracts endpoints constants', () => {
  test('string constants and functions', () => {
    expect(CONTRACTS.CONTRACTS.BASE).toBe('/contracts');
    expect(CONTRACTS.MESSAGES.GET_UNREAD_COUNT).toBe('/messages/unread-count');
    expect(CONTRACTS.CONTRACTS.GET_CONTRACT(5)).toBe('/contracts/5');
    expect(CONTRACTS.MESSAGES.SEND_MESSAGE(10)).toBe('/messages/conversations/10/messages');

    // cover remaining message helpers
    expect(CONTRACTS.MESSAGES.GET_CONVERSATION(12)).toBe('/messages/conversations/12');
    expect(CONTRACTS.MESSAGES.EDIT_MESSAGE(1,2)).toBe('/messages/conversations/1/messages/2');
    expect(CONTRACTS.MESSAGES.SEARCH_MESSAGES(3)).toBe('/messages/conversations/3/search');

    // cover remaining contract helpers
    expect(CONTRACTS.CONTRACTS.CREATE_FROM_PROPOSAL).toBe('/contracts/from-proposal');
    expect(CONTRACTS.CONTRACTS.GET_MY_STATS).toBe('/contracts/stats/me');
    expect(CONTRACTS.CONTRACTS.ADD_MILESTONE(5)).toBe('/contracts/5/milestones');
    expect(CONTRACTS.CONTRACTS.UPDATE_MILESTONE(5, 2)).toBe('/contracts/5/milestones/2');
    expect(CONTRACTS.CONTRACTS.COMPLETE_CONTRACT(8)).toBe('/contracts/8/complete');
    expect(CONTRACTS.CONTRACTS.CANCEL_CONTRACT(9)).toBe('/contracts/9/cancel');
  });
});

describe('jobs endpoints', () => {
  test('job functions produce urls', () => {
    expect(JOBS.getJobById(9)).toBe('/jobs/9');
    expect(JOBS.updateJob(1)).toBe('/jobs/1');
    expect(JOBS.closeJob(5)).toBe('/jobs/5/close');
    expect(JOBS.getRecommendedFreelancers(11)).toBe('/jobs/11/recommended-freelancers');
  });
});

describe('proposals endpoints', () => {
  test('proposal urls', () => {
    expect(PROPOSALS.getProposalDetails(4)).toBe('/proposals/freelancer/4');
    expect(PROPOSALS.getJobProposals(7)).toBe('/proposals/job/7');
    expect(PROPOSALS.generateProposalDraft(8)).toBe('/proposals/draft/8');
    expect(PROPOSALS.acceptProposal(2)).toBe('/proposals/2/accept');
    expect(PROPOSALS.getClientProposalDetails(3)).toBe('/proposals/client/3');
  });
});
