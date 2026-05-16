# 🚀 Quick Test Guide - Real-Time Job Moderation

## Quick Start Testing

### 1. Start the Application

**Terminal 1 - Server**:
```bash
cd server
npm run dev
```
✅ Look for: `[Socket] Socket.io server initialized`

**Terminal 2 - Client**:
```bash
cd client
npm run dev
```
✅ Open: http://localhost:5174

---

## Test 1: Approve Job (2 minutes)

### Setup
1. **Browser 1** (Client): 
   - Login/register as client
   - Create a new job
   - Note the job ID in URL

2. **Browser 2** (Admin):
   - Login as admin
   - Go to `/admin/dashboard`

### Test
1. Admin: Find the job → Click "Approve"
2. Client: Watch for notification (no refresh!)
   - Should see green toast: "Your job '[title]' has been approved..."
   - Browser notification appears

### ✅ Success Criteria
- Client sees notification instantly
- Job status changes without refresh
- Freelancers see job in listings

---

## Test 2: Reject Job (2 minutes)

### Setup
Same as Test 1, but job is still open

### Test
1. Admin: Click "Reject" → Enter reason: "Test rejection"
2. Client: Watch for notification
   - Should see red toast with reason
   - Job marked as rejected

### ✅ Success Criteria
- Client sees rejection reason
- Job disappears from freelancer listings
- No errors in console

---

## Test 3: Flag Job (2 minutes)

### Setup
Any approved job

### Test
1. Admin: Click "Flag" → Enter reason: "Under review"
2. Watch job owner's screen
   - Yellow warning toast appears
   - "Flagged" badge shows on job

### ✅ Success Criteria
- Job hidden from main listings
- Owner sees flag reason
- Admin sees in "Flagged Jobs"

---

## Test 4: Feature Job (1 minute)

### Setup
Any approved job

### Test
1. Admin: Toggle "Feature this Job"
2. Freelancers browsing `/jobs`:
   - Featured badge appears instantly
   - Gradient colored badge with trending icon

### ✅ Success Criteria
- Featured badge appears without refresh
- Toast notification to owner
- Job may appear in featured section

---

## Test 5: Real-Time Viewing (2 minutes)

### Setup
1. **Browser 1** (Freelancer): Open `/jobs/[job-id]`
2. **Browser 2** (Admin): Same job in admin panel

### Test
1. Admin: Approve/feature/flag the job
2. Freelancer: Keep watching job details page
   - Toast: "This job has been updated"
   - Status badges update automatically
   - No page reload

### ✅ Success Criteria
- Updates appear in <2 seconds
- No console errors
- Page doesn't reload

---

## 🐛 Quick Debug Commands

### Check Socket Connection
```javascript
// In browser console
chatService.socket.connected  // Should be true
chatService.socket.id         // Shows socket ID
```

### Check User Rooms
```javascript
// Server logs should show:
// [Socket] User {userId} joined room: user:{userId}
// [Socket] User {userId} joined room: freelancers
```

### Check Query Client
```javascript
// In browser console
window.queryClient  // Should be QueryClient instance
```

### Listen to Events
```javascript
// Add in browser console to debug
chatService.socket.on('job:moderation', (data) => {
  console.log('📡 Received:', data);
});
```

---

## ⚡ Expected Behavior

### Admin Approve
- 🎯 Target: Job owner + All freelancers
- 📢 Notification: Green success toast
- 🔄 Update: Job appears in listings

### Admin Reject
- 🎯 Target: Job owner
- 📢 Notification: Red error toast with reason
- 🔄 Update: Job hidden from listings

### Admin Flag
- 🎯 Target: Job owner
- 📢 Notification: Yellow warning toast
- 🔄 Update: "Flagged" badge, hidden from listings

### Admin Feature
- 🎯 Target: Job owner + All freelancers
- 📢 Notification: Green success toast
- 🔄 Update: Featured badge with gradient

---

## 📊 Performance Check

### Latency Targets
- ⚡ Event delivery: <500ms
- 🔄 UI update: <1 second
- 📡 Socket connection: <2 seconds

### Monitor
```javascript
// Track event timing
const start = Date.now();
chatService.socket.once('job:moderation', () => {
  console.log('Event latency:', Date.now() - start, 'ms');
});
```

---

## 🎯 Common Issues

### "Socket not connected"
- Check server is running
- Verify JWT token in localStorage
- Check CORS settings in socket server

### "Events not received"
- Verify user is in correct room (check server logs)
- Ensure event name matches exactly
- Check admin action completed (database updated)

### "React Query not updating"
- Verify `window.queryClient` exists
- Check query keys match between useQuery and invalidation
- Look for cache invalidation logs

---

## ✅ Test Completion Checklist

- [ ] Admin approve works
- [ ] Admin reject works  
- [ ] Admin flag works
- [ ] Admin feature works
- [ ] Client receives notifications
- [ ] Freelancer sees updates
- [ ] Browser notifications work
- [ ] No console errors
- [ ] Job badges display correctly
- [ ] Real-time viewing updates

---

## 🎉 Success!
If all tests pass, the real-time moderation system is working correctly!

**Next Steps**: Production deployment and monitoring
