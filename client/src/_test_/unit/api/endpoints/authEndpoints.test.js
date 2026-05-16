// Mock axiosInstance
jest.mock('@/api/axiosInstance', () => {
  const mockInstance = {
    post: jest.fn(),
    get: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockInstance,
  };
});

import axiosInstance from '@/api/axiosInstance';
import * as auth from '@/api/endpoints/auth';

describe('auth endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('requestPasswordReset calls correct endpoint', async () => {
    const email = 'a@b.com';
    const mockRes = { data: { success: true } };
    axiosInstance.post.mockResolvedValue(mockRes);

    const res = await auth.requestPasswordReset(email);
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/forgot-password', { email });
    expect(res).toBe(mockRes);
  });

  test('verifyOTP calls correct endpoint', async () => {
    const email = 'a@b.com';
    const otp = '1234';
    const mockRes = { data: { success: true } };
    axiosInstance.post.mockResolvedValue(mockRes);

    const res = await auth.verifyOTP(email, otp);
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/verify-otp', { email, otp });
    expect(res).toBe(mockRes);
  });

  test('resetPassword calls correct endpoint', async () => {
    const mockRes = { data: { success: true } };
    axiosInstance.post.mockResolvedValue(mockRes);

    const res = await auth.resetPassword('a@b.com', '1234', 'n', 'n');
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/reset-password', {
      email: 'a@b.com',
      otp: '1234',
      newPassword: 'n',
      confirmPassword: 'n',
    });
    expect(res).toBe(mockRes);
  });

  test('uploadCNICFront uses multipart/form-data', async () => {
    const file = new Blob(['test'], { type: 'image/png' });
    const mockRes = { data: { success: true } };
    axiosInstance.post.mockResolvedValue(mockRes);

    const res = await auth.uploadCNICFront(file);
    expect(axiosInstance.post).toHaveBeenCalled();

    const [url, form, opts] = axiosInstance.post.mock.calls[0];
    expect(url).toBe('/auth/cnic/front');
    // FormData should have append function
    expect(typeof form.append).toBe('function');
    expect(opts).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });
    expect(res).toBe(mockRes);
  });

  test('uploadCNICBack uses multipart/form-data', async () => {
    const file = new Blob(['test'], { type: 'image/png' });
    const mockRes = { data: { success: true } };
    axiosInstance.post.mockResolvedValue(mockRes);

    const res = await auth.uploadCNICBack(file);
    const [url, form, opts] = axiosInstance.post.mock.calls[0];
    expect(url).toBe('/auth/cnic/back');
    expect(typeof form.append).toBe('function');
    expect(opts).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });
    expect(res).toBe(mockRes);
  });

  test('submitCNIC calls correct endpoint', async () => {
    const mockRes = { data: { success: true } };
    axiosInstance.post.mockResolvedValue(mockRes);

    const res = await auth.submitCNIC('12345');
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/cnic/submit', { cnicNumber: '12345' });
    expect(res).toBe(mockRes);
  });

  test('getCNICStatus calls correct endpoint', async () => {
    const mockRes = { data: { status: 'ok' } };
    axiosInstance.get.mockResolvedValue(mockRes);

    const res = await auth.getCNICStatus();
    expect(axiosInstance.get).toHaveBeenCalledWith('/auth/cnic/status');
    expect(res).toBe(mockRes);
  });

  test('getPendingCNICVerifications builds query', async () => {
    const mockRes = { data: { items: [] } };
    axiosInstance.get.mockResolvedValue(mockRes);

    const res = await auth.getPendingCNICVerifications(2, 50);
    expect(axiosInstance.get).toHaveBeenCalledWith('/auth/admin/cnic/pending?page=2&limit=50');
    expect(res).toBe(mockRes);
  });

  test('verifyCNIC calls correct url and body', async () => {
    const mockRes = { data: { success: true } };
    axiosInstance.post.mockResolvedValue(mockRes);

    const res = await auth.verifyCNIC('u1', 'approved', 'reason');
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/admin/cnic/verify/u1', {
      status: 'approved',
      rejectionReason: 'reason',
    });
    expect(res).toBe(mockRes);
  });
});
