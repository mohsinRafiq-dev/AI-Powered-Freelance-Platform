# Forgot Password System - Testing Guide

## ✅ System Status
- **Server**: Running on `http://localhost:5000` ✓
- **Client**: Running on `http://localhost:5173` ✓  
- **Email Service**: Configured and Ready ✓
- **Database**: Connected ✓

## 📧 Email Configuration
```
HOST: smtp.gmail.com
PORT: 587
USER: mehboobaliali150@gmail.com
Status: ✅ Verified and Ready
```

## 🔄 Complete Forgot Password Flow

### Step 1: Request OTP
**Endpoint**: `POST /api/auth/forgot-password`

**Test with curl** (use Git Bash or WSL):
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"your-registered-email@example.com"}'
```

**Test with PowerShell**:
```powershell
$body = @{ email = "your-registered-email@example.com" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/forgot-password" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "data": null
}
```

**Email Received**: Check `your-registered-email@example.com` for OTP code (6 digits)

---

### Step 2: Verify OTP
**Endpoint**: `POST /api/auth/verify-otp`

**Test with PowerShell**:
```powershell
$body = @{ 
    email = "your-registered-email@example.com"
    otp = "123456"  # Replace with actual OTP from email
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/verify-otp" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response**:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "verified": true
  }
}
```

---

### Step 3: Reset Password
**Endpoint**: `POST /api/auth/reset-password`

**Test with PowerShell**:
```powershell
$body = @{ 
    email = "your-registered-email@example.com"
    otp = "123456"  # Same OTP from step 2
    newPassword = "newPassword123"
    confirmPassword = "newPassword123"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/reset-password" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null
}
```

**Email Received**: Confirmation email sent to your inbox

---

## 🌐 Frontend Testing

### Using the Web Interface

1. **Go to Login Page**
   ```
   http://localhost:5173/login
   ```

2. **Click "Forgot password?"** link

3. **Enter your email** on the Forgot Password page
   - Form validates email format
   - Rate limited: 5 requests per 15 minutes

4. **Check your email inbox** for the OTP code
   - 6-digit code
   - Valid for 10 minutes
   - Professional email template

5. **Enter OTP** on the Verify OTP page
   - Countdown timer shows expiry
   - Can resend OTP if expired
   - Auto-validates 6 digits

6. **Create new password** on Reset Password page
   - Password strength indicator
   - Confirmation field validation
   - Minimum 6 characters

7. **Login with new password**
   - Redirects to login
   - Use your new password

---

## 🔒 Security Features

✅ **OTP Security**
- Hashed with bcrypt before storage
- 10-minute expiration
- Cleared after use
- Cannot be reused

✅ **Rate Limiting**
- Forgot Password: 5 requests / 15 minutes
- Verify OTP: 5 requests / 15 minutes  
- Reset Password: 3 requests / 15 minutes

✅ **Email Security**
- Only sends to registered local accounts
- Doesn't reveal if email exists
- Professional templates
- Confirmation emails

✅ **Password Security**
- Hashed with bcrypt (10 rounds)
- Validated before storage
- Old password never exposed

---

## 🐛 Troubleshooting

### Issue: "Email not sent"
**Solutions**:
1. Check email credentials in `.env`
2. Verify Gmail "App Password" is correct
3. Check server logs for email errors
4. Ensure email is a registered account

### Issue: "OTP expired"
**Solutions**:
1. Use OTP within 10 minutes
2. Click "Resend OTP" button
3. Check system clock is accurate

### Issue: "Invalid OTP"
**Solutions**:
1. Copy OTP exactly from email
2. Don't include spaces
3. Use latest OTP if you requested multiple
4. OTP is case-sensitive and numeric only

### Issue: "Rate limit exceeded"
**Solutions**:
1. Wait 15 minutes
2. Clear browser cache
3. Try from different IP (mobile data)

### Issue: "User not found"
**Solutions**:
1. Ensure email is registered
2. Check for typos in email
3. Verify account is "local" provider (not Google OAuth)

---

## 📝 Database Schema

### User Model - New Fields
```javascript
{
  resetPasswordOTP: String,        // Hashed OTP
  resetPasswordOTPExpires: Date,   // Expiry timestamp
}
```

---

## 🎯 API Endpoints Summary

| Endpoint | Method | Rate Limit | Purpose |
|----------|--------|------------|---------|
| `/api/auth/forgot-password` | POST | 5/15min | Send OTP |
| `/api/auth/verify-otp` | POST | 5/15min | Verify OTP |
| `/api/auth/reset-password` | POST | 3/15min | Reset Password |

---

## ✅ Testing Checklist

- [ ] Register a new test account
- [ ] Request OTP with valid email
- [ ] Receive OTP email within 1 minute
- [ ] Verify OTP successfully
- [ ] Reset password successfully
- [ ] Receive confirmation email
- [ ] Login with new password
- [ ] Test expired OTP (wait 10 min)
- [ ] Test resend OTP functionality
- [ ] Test rate limiting (6+ requests)
- [ ] Test invalid email format
- [ ] Test unregistered email
- [ ] Test wrong OTP
- [ ] Test password mismatch

---

## 🎨 Frontend Pages Created

1. **ForgotPassword.jsx** - Email input form
2. **VerifyOTP.jsx** - OTP verification with timer
3. **ResetPassword.jsx** - New password form

All pages include:
- Responsive design
- Loading states
- Error handling
- Professional UI with gradients
- Smooth animations
- Accessibility features

---

## 📞 Support

If you encounter any issues:
1. Check server console for errors
2. Check browser console (F12)
3. Verify `.env` file configuration
4. Ensure both servers are running
5. Test API endpoints directly first

Server Status: **✅ OPERATIONAL**  
Email Service: **✅ CONFIGURED**  
All Systems: **✅ GO**
