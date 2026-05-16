import notificationService, {
  handleJobModerationEvent,
  handleJobsUpdateEvent,
  handleJobUpdatedEvent,
  loadPersisted,
  markReadServer,
  markAllReadServer,
} from '@/services/notificationService';
import api from '@/api/axiosInstance';
import { toast } from 'sonner';

jest.mock('@/api/axiosInstance');
jest.mock('sonner');

describe('notificationService internals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    notificationService.clearAll();
  });

  test('loadPersisted populates notifications when items present', async () => {
    const items = [{ _id: 'n1', title: 'T1', message: 'M1', isRead: false, createdAt: 'ts' }];
    api.get.mockResolvedValue({ data: { items } });

    await loadPersisted();
    expect(notificationService.getUnreadCount()).toBeGreaterThan(0);
  });

  test('markReadServer and markAllReadServer call api', async () => {
    api.patch.mockResolvedValue({});
    await markReadServer('x');
    expect(api.patch).toHaveBeenCalledWith('/notifications/x/read');

    await markAllReadServer();
    expect(api.patch).toHaveBeenCalledWith('/notifications/read-all');
  });

  test('handleJobModerationEvent covers switch actions and invalidation', () => {
    // Ensure no user set means no browser notification
    localStorage.setItem('user', JSON.stringify({ _id: 'owner' }));
    // Set a queryClient
    window.queryClient = { invalidateQueries: jest.fn() };

    const job = { title: 'Job1', client: 'owner' };
    handleJobModerationEvent({ action: 'approved', jobId: 1, job });
    handleJobModerationEvent({ action: 'rejected', jobId: 2, job, reason: 'bad' });
    handleJobModerationEvent({ action: 'flagged', jobId: 3, job });
    handleJobModerationEvent({ action: 'featured', jobId: 4, job });
    handleJobModerationEvent({ action: 'unfeatured', jobId: 5, job });
    handleJobModerationEvent({ action: 'unknown', jobId: 6, job });

    expect(notificationService.getUnreadCount()).toBeGreaterThanOrEqual(1);
    expect(window.queryClient.invalidateQueries).toHaveBeenCalled();
    delete window.queryClient;
    localStorage.removeItem('user');
  });

  test('handleJobsUpdateEvent shows toast only on jobs page and invalidates queries', () => {
    window.queryClient = { invalidateQueries: jest.fn() };
    // not on jobs page
    window.location.pathname = '/';
    handleJobsUpdateEvent({ action: 'featured', jobId: 1, job: {} });
    expect(toast).not.toHaveBeenCalled();

    // on jobs page
    // Set a mutable location object
    delete window.location;
    // eslint-disable-next-line no-global-assign
    window.location = { pathname: '/jobs' };
    notificationService.clearAll();
    handleJobsUpdateEvent({ action: 'featured', jobId: 2, job: {} });
    // internal toast adds notifications
    expect(notificationService.getUnreadCount()).toBeGreaterThan(0);
    expect(window.queryClient.invalidateQueries).toHaveBeenCalledWith(['jobs', 'list']);
    delete window.queryClient;
  });

  test('handleJobUpdatedEvent invalidates and toasts when viewing job', () => {
    window.queryClient = { invalidateQueries: jest.fn() };
    delete window.location;
    // eslint-disable-next-line no-global-assign
    window.location = { pathname: '/jobs/10' };

    notificationService.clearAll();
    handleJobUpdatedEvent({ jobId: 10, updates: {} });
    expect(window.queryClient.invalidateQueries).toHaveBeenCalledWith(['jobs', 'detail', 10]);
    expect(notificationService.getUnreadCount()).toBeGreaterThan(0);

    delete window.queryClient;
  });
});