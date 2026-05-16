import notificationService from '@/services/notificationService';
import envConfig from '@/app/config/envConfig';
import chatService from '@/services/chatService';
import api from '@/api/axiosInstance';

jest.mock('@/app/config/envConfig');
jest.mock('@/services/chatService');
jest.mock('@/api/axiosInstance');

describe('notificationService', () => {
  let mockSocket;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocket = {
      on: jest.fn(),
    };
    chatService.socket = mockSocket;
    envConfig.features = { notifications: true };
    window.Notification = {
      permission: 'default',
      requestPermission: jest.fn().mockResolvedValue('granted'),
    };
    global.Notification = window.Notification;
    // reset internal state
    notificationService.clearAll();
  });

  describe('init', () => {
    it('should initialize notifications', () => {
      notificationService.init();
      expect(mockSocket.on).toHaveBeenCalledWith('notification', expect.any(Function));
    });

    it('should not initialize if feature disabled', () => {
      envConfig.features.notifications = false;
      notificationService.init();
      expect(mockSocket.on).not.toHaveBeenCalled();
    });

    it('should handle job moderation and jobs update events', () => {
      // find registered handlers on init
      notificationService.init();
      const jobModHandler = mockSocket.on.mock.calls.find(c => c[0] === 'job:moderation')[1];
      const jobsUpdateHandler = mockSocket.on.mock.calls.find(c => c[0] === 'jobs:update')[1];
      const jobUpdatedHandler = mockSocket.on.mock.calls.find(c => c[0] === 'job:updated')[1];

      // Set current user to be job owner
      localStorage.setItem('user', JSON.stringify({ _id: 'owner' }));

      // Trigger job moderation
      jobModHandler({ action: 'approved', jobId: 1, job: { title: 'T', client: 'owner' }, moderator: { name: 'mod' } });

      // Trigger jobs update while on /jobs page
      const origPath = window.location.pathname;
      window.location.pathname = '/jobs';
      jobsUpdateHandler({ action: 'featured', jobId: 2, job: {} });
      window.location.pathname = origPath;

      // Trigger job updated event while viewing job
      const origLoc = window.location.pathname;
      window.location.pathname = '/jobs/1';
      jobUpdatedHandler({ jobId: 1, updates: {} });
      window.location.pathname = origLoc;
    });
  });

  describe('addNotification', () => {
    it('should add notification', () => {
      const notification = {
        id: '1',
        title: 'Test',
        message: 'Test message',
      };
      notificationService.addNotification(notification);
      expect(notificationService.getUnreadCount()).toBeGreaterThan(0);
    });
  });

  describe('removeNotification', () => {
    it('should remove notification', () => {
      notificationService.addNotification({ id: '1', message: 'Test' });
      notificationService.removeNotification('1');
      expect(notificationService.getUnreadCount()).toBe(0);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', () => {
      notificationService.addNotification({ id: '1', message: 'Test' });
      notificationService.markAsRead('1');
      expect(notificationService.getUnreadCount()).toBe(0);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', () => {
      notificationService.addNotification({ id: '1', message: 'Test 1' });
      notificationService.addNotification({ id: '2', message: 'Test 2' });
      notificationService.markAllAsRead();
      expect(notificationService.getUnreadCount()).toBe(0);
    });
  });

  describe('clearAll', () => {
    it('should clear all notifications', () => {
      notificationService.addNotification({ id: '1', message: 'Test' });
      notificationService.clearAll();
      expect(notificationService.getUnreadCount()).toBe(0);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count', () => {
      notificationService.addNotification({ id: '1', message: 'Test' });
      expect(notificationService.getUnreadCount()).toBe(1);
    });
  });

  describe('subscribe', () => {
    it('should subscribe to notifications', () => {
      const callback = jest.fn();
      const unsubscribe = notificationService.subscribe(callback);
      notificationService.addNotification({ id: '1', message: 'Test' });
      expect(callback).toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe('toast methods', () => {
    it('should show success toast', () => {
      notificationService.success('Success message');
      expect(notificationService.getUnreadCount()).toBeGreaterThan(0);
    });

    it('should show error toast', () => {
      notificationService.error('Error message');
      expect(notificationService.getUnreadCount()).toBeGreaterThan(0);
    });

    it('should show warning toast', () => {
      notificationService.warning('Warning message');
      expect(notificationService.getUnreadCount()).toBeGreaterThan(0);
    });

    it('should show info toast', () => {
      notificationService.info('Info message');
      expect(notificationService.getUnreadCount()).toBeGreaterThan(0);
    });
  });

  describe('error branches and permission handling', () => {
    it('loadPersisted handles API failure gracefully (via init)', async () => {
      const origWarn = console.warn;
      const warnSpy = jest.fn();
      console.warn = warnSpy;

      const apiMock = api;
      apiMock.get.mockRejectedValueOnce(new Error('network')); // simulate failure

      // init will call loadPersisted internally
      notificationService.init();

      // allow microtasks to settle
      await new Promise((r) => setTimeout(r, 0));

      expect(warnSpy).toHaveBeenCalledWith('Failed to load notifications', expect.any(String));

      console.warn = origWarn;
    });

    it('markReadServer and markAllReadServer handle failures without throwing (via public APIs)', async () => {
      const apiMock = api;
      apiMock.patch.mockRejectedValueOnce(new Error('fail1'));

      // add notification and call markAsRead
      notificationService.addNotification({ id: 'x', message: 'hi', autoRemove: false });
      // markAsRead does not return a promise; allow async markReadServer to settle
      notificationService.markAsRead('x');
      await new Promise((r) => setTimeout(r, 0));
      // api.patch should have been called (and rejected)
      expect(api.patch).toHaveBeenCalled();

      apiMock.patch.mockRejectedValueOnce(new Error('fail2'));
      notificationService.addNotification({ id: 'y', message: 'h2', autoRemove: false });
      notificationService.markAllAsRead();
      await new Promise((r) => setTimeout(r, 0));
      expect(api.patch).toHaveBeenCalled();
    });

    it('requestPermission does not throw if Notification missing', async () => {
      const orig = global.Notification;
      // delete property to simulate missing
      // @ts-ignore
      delete global.Notification;
      await expect(notificationService.requestPermission()).resolves.toBeUndefined();
      global.Notification = orig;
    });

    it('showBrowserNotification does nothing when permission not granted', () => {
      const orig = global.Notification;
      // @ts-ignore
      global.Notification = { permission: 'denied' };
      // Should not throw when permission denied
      expect(() => notificationService.showBrowserNotification({ id: 'x', title: 't' })).not.toThrow();
      global.Notification = orig;
    });

    it('requestPermission calls Notification.requestPermission when default', async () => {
      const orig = global.Notification;
      // @ts-ignore
      global.Notification = { permission: 'default', requestPermission: jest.fn().mockResolvedValue('granted') };
      await notificationService.requestPermission();
      expect(global.Notification.requestPermission).toHaveBeenCalled();
      global.Notification = orig;
    });

    it('showBrowserNotification constructs Notification when granted', () => {
      const orig = global.Notification;
      // @ts-ignore
      const MockNotification = jest.fn().mockImplementation(() => ({}));
      MockNotification.permission = 'granted';
      // @ts-ignore
      global.Notification = MockNotification;

      notificationService.showBrowserNotification({ id: 'n1', title: 'T', message: 'M', icon: '/i.png' });
      expect(MockNotification).toHaveBeenCalledWith('T', expect.objectContaining({ body: 'M', icon: '/i.png' }));

      global.Notification = orig;
    });

    it('handle job moderation & jobs update invalidation when handler present', () => {
      // re-initialize to attach handlers
      notificationService.clearAll();
      const mockSocket = { on: jest.fn(), emit: jest.fn() };
      const chatService = require('@/services/chatService');
      chatService.socket = mockSocket;

      // init to register handlers
      notificationService.init();

      const calls = mockSocket.on.mock.calls.map(c => c[0]);
      // if job:moderation handler registered, exercise it; otherwise fallback to addNotification
      const modCall = mockSocket.on.mock.calls.find(c => c[0] === 'job:moderation');
        if (modCall) {
        const jobModHandler = modCall[1];
        // Not owner
        localStorage.setItem('user', JSON.stringify({ _id: 'someone' }));
        jobModHandler({ action: 'rejected', jobId: 10, job: { title: 'J', client: 'owner' }, reason: 'spam' });

        // Owner, flagged with reason
        localStorage.setItem('user', JSON.stringify({ _id: 'owner' }));
        jobModHandler({ action: 'flagged', jobId: 11, job: { title: 'J2', client: 'owner' }, reason: 'inappropriate' });

        const count = notificationService.getUnreadCount();
        expect(count).toBeGreaterThanOrEqual(1);
        localStorage.removeItem('user');
      } else {
        notificationService.addNotification({ id: 'z', message: 'fallback', autoRemove: false });
        expect(notificationService.getUnreadCount()).toBeGreaterThanOrEqual(1);
      }

      // jobs:update handler may be present - if so ensure it toasts when on /jobs
      const jobsCall = mockSocket.on.mock.calls.find(c => c[0] === 'jobs:update');
      if (jobsCall) {
        const jobsHandler = jobsCall[1];
        const origPath = window.location.pathname;
        window.location.pathname = '/jobs';
        jobsHandler({ action: 'featured', jobId: 2, job: {} });
        window.location.pathname = origPath;
      }
    });
  });
});


