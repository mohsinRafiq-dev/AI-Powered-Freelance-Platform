import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import axiosInstance from '@/api/axiosInstance';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        const u = res?.data?.data?.user || res?.data?.user;
        setUser(u);
        if (u?.isEmailVerified) {
          setVerified(true);
        }
      } catch {
        navigate('/login');
      }
    })();
  }, [navigate]);

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error('OTP must be a 6-digit number');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/auth/email/verify-otp', { otp });
      setVerified(true);
      toast.success('Email verified!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axiosInstance.post('/auth/email/request-otp');
      toast.success('A new OTP was sent to your email');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-3">
            {verified ? <CheckCircle className="w-7 h-7 text-green-500" /> : <Mail className="w-7 h-7 text-brand" />}
          </div>
          <CardTitle>{verified ? 'Email verified' : 'Verify your email'}</CardTitle>
          <CardDescription>
            {verified
              ? 'Your email has been confirmed. Redirecting...'
              : user?.email
                ? `We sent a 6-digit code to ${user.email}`
                : 'We sent a 6-digit code to your email'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!verified && (
            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit OTP"
                className="w-full px-4 py-3 text-center tracking-[0.4em] text-xl font-semibold rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                autoFocus
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => navigate(-1)} className="text-gray-500 hover:underline inline-flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-brand hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                  Resend code
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
