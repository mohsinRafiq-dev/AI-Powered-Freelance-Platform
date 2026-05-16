# User Ban/Suspension System - Testing Guide

## Quick Test Steps

### Setup
1. Ensure you have at least 3 test accounts:
   - 1 Admin account
   - 1 Client account with some posted jobs
   - 1 Freelancer account with some submitted proposals

---

## Test Case 1: Ban Client User

### Steps:
1. **Login as Admin**
   ```
   Navigate to: /admin/dashboard/users
   ```

2. **Find Client User**
   - Search or browse for a client user
   - Note: Client should have at least 1 "open" job posted

3. **Ban the Client**
   - Click on user actions → Ban
   - Enter reason: "Testing ban functionality"
   - Confirm ban

4. **Verify Cascade Effect**
   - Check user's profile - should show:
     - `isBanned: true`
     - `isActive: false`
     - Ban reason visible
   
5. **Check Client's Jobs**
   - Navigate to job listings page
   - Previously visible jobs should NOT appear
   - Try accessing job directly by URL → Should get 404

6. **Test Login Prevention**
   - Logout from admin
   - Try to login as banned client with email/password
   - **Expected:** Red error toast for 6 seconds:
     ```
     "Your account has been banned. Please contact our help center for assistance."
     ```
   - Try Google OAuth (if available)
   - **Expected:** Same error message

### ✅ Success Criteria:
- [ ] User marked as banned in database
- [ ] All user's jobs status changed to "closed"
- [ ] Jobs not visible in public listings
- [ ] Direct job access returns 404
- [ ] Email login blocked with correct message
- [ ] Google OAuth login blocked with correct message

---

## Test Case 2: Ban Freelancer User

### Steps:
1. **Login as Admin**

2. **Find Freelancer User**
   - Search for a freelancer
   - Note: Freelancer should have submitted proposals

3. **Ban the Freelancer**
   - Ban user with reason

4. **Verify Cascade Effect**
   - Check user's profile → `isBanned: true`

5. **Check Freelancer's Proposals**
   - Login as a client who received proposals from this freelancer
   - Navigate to job's proposals list
   - Banned freelancer's proposals should NOT appear
   - Or show as "withdrawn"

6. **Test Login Prevention**
   - Logout
   - Try to login as banned freelancer
   - **Expected:** Ban error message

### ✅ Success Criteria:
- [ ] User marked as banned
- [ ] All pending proposals status changed to "withdrawn"
- [ ] Proposals not visible to clients
- [ ] Login blocked with correct message

---

## Test Case 3: Unban Client User

### Steps:
1. **Login as Admin**

2. **Find Previously Banned Client**
   - Go to users list
   - Filter by banned users or search

3. **Activate/Unban the Client**
   - Click actions → Activate
   - Confirm activation

4. **Verify Reverse Cascade**
   - Check user profile:
     - `isBanned: false`
     - `isActive: true`
     - Ban reason cleared

5. **Check Jobs Restored**
   - Navigate to job listings
   - Previously hidden jobs should now appear
   - Jobs should have status "open" (not "closed")
   - Access jobs by direct URL → Should work

6. **Test Login Restored**
   - Logout from admin
   - Login as unbanned client
   - **Expected:** Successful login
   - Dashboard should load normally

### ✅ Success Criteria:
- [ ] User unbanned in database
- [ ] Jobs status changed back to "open"
- [ ] Jobs visible in public listings
- [ ] Direct job access works
- [ ] Can login successfully
- [ ] Full account functionality restored

---

## Test Case 4: Unban Freelancer User

### Steps:
1. **Login as Admin**

2. **Activate Previously Banned Freelancer**
   - Find and unban the user

3. **Verify Reverse Cascade**
   - User profile shows active status

4. **Check Proposals Restored**
   - Login as client with jobs
   - View proposals on jobs
   - Previously withdrawn proposals should show as "pending" again
   - Freelancer proposals visible

5. **Test Login Restored**
   - Login as unbanned freelancer
   - Should work normally

### ✅ Success Criteria:
- [ ] User unbanned
- [ ] Proposals status changed back to "pending"
- [ ] Proposals visible to clients
- [ ] Can login successfully

---

## Test Case 5: Suspend User (Temporary Block)

### Steps:
1. **Login as Admin**

2. **Suspend a User**
   - Choose either client or freelancer
   - Click actions → Suspend
   - Enter reason: "Testing suspension"

3. **Verify Similar Behavior to Ban**
   - Jobs/proposals hidden
   - Login blocked
   - Error message shows "suspended" instead of "banned"

4. **Activate User**
   - Click actions → Activate
   - Verify everything restored

### ✅ Success Criteria:
- [ ] Suspend works same as ban
- [ ] Different error message ("suspended")
- [ ] Activation works same as unban

---

## Test Case 6: Google OAuth with Banned User

### Prerequisites:
- User must have Google OAuth account linked
- User must be banned

### Steps:
1. **Navigate to Login Page**
   ```
   /login
   ```

2. **Click "Sign in with Google"**

3. **Select Banned User's Google Account**
   - Google should show account picker
   - Choose the banned user's account

4. **Verify Error Handling**
   - **Expected:** Redirect to login with error parameter
   - Red toast should show for 6 seconds
   - Message: "Your account has been banned. Please contact our help center for assistance."

### ✅ Success Criteria:
- [ ] Google login blocked for banned user
- [ ] Error message displayed correctly
- [ ] User redirected back to login
- [ ] No token generated
- [ ] No session created

---

## Edge Cases to Test

### Edge Case 1: Ban User with Active Jobs in Different States
- Client has jobs in: draft, open, in-progress, completed
- **Expected:** Only "draft" and "open" jobs should be closed

### Edge Case 2: Ban User with Proposals in Different States
- Freelancer has proposals: pending, accepted, rejected, withdrawn
- **Expected:** Only "pending" proposals should be withdrawn

### Edge Case 3: Multiple Ban/Unban Cycles
1. Ban user → unban user
2. Ban again → unban again
3. Verify data integrity maintained

### Edge Case 4: Banned User with Direct Link Access
- Share job link before ban
- Ban user
- Try to access job with saved link
- **Expected:** 404 error

### Edge Case 5: Try API Access with Banned User Token
- Get valid JWT token
- Ban user
- Try to make API calls with token
- **Expected:** 403 Forbidden error

---

## Database Verification

### Check Ban Status in Database:
```javascript
// In MongoDB or via admin panel
db.users.findOne({ email: "test@example.com" })

// Should show:
{
  isBanned: true, // or false
  isActive: false, // or true
  banReason: "...",
  bannedAt: ISODate("..."),
  bannedBy: ObjectId("...")
}
```

### Check Job Status:
```javascript
db.jobs.find({ client: ObjectId("userId") })

// For banned client, jobs should show:
{
  status: "closed",
  suspendedByAdmin: true,
  suspendedAt: ISODate("...")
}
```

### Check Proposal Status:
```javascript
db.proposals.find({ freelancerId: ObjectId("userId") })

// For banned freelancer, proposals should show:
{
  status: "withdrawn",
  suspendedByAdmin: true,
  suspendedAt: ISODate("...")
}
```

---

## Error Log Verification

### Check Browser Console (Development):
```javascript
// Should see logs like:
[Login Mount] Token check: { hasToken: true, tokenValid: false, isAuthenticated: false }
[Login] Login failed with ban error
```

### Check Server Logs:
```
POST /api/auth/login 403 - Ban check failed for user: user@example.com
Reason: Your account has been banned...
```

---

## Performance Testing

### Test Query Performance:
1. **Create 100 users** (50 banned, 50 active)
2. **Create 500 jobs** (from various users)
3. **Query job listings**
4. **Verify:**
   - Response time < 500ms
   - Correct filtering applied
   - Pagination works correctly

---

## Automation Test Script

```javascript
// Pseudo-code for automated testing
describe('User Ban System', () => {
  test('Banned client cannot login', async () => {
    const response = await login('banned-client@test.com', 'password');
    expect(response.status).toBe(403);
    expect(response.body.error).toContain('banned');
  });

  test('Banned client jobs are hidden', async () => {
    const jobs = await getJobs();
    const bannedClientJob = jobs.find(j => j.client.isBanned);
    expect(bannedClientJob).toBeUndefined();
  });

  test('Unbanned user can access everything', async () => {
    await unbanUser(userId);
    const response = await login('unbanned@test.com', 'password');
    expect(response.status).toBe(200);
  });
});
```

---

## Rollback Plan

If issues occur:

1. **Immediate Rollback:**
   ```bash
   git revert <commit-hash>
   ```

2. **Database Cleanup (if needed):**
   ```javascript
   // Remove new fields from all jobs
   db.jobs.updateMany({}, { 
     $unset: { suspendedByAdmin: "", suspendedAt: "" } 
   });
   
   // Remove from proposals
   db.proposals.updateMany({}, { 
     $unset: { suspendedByAdmin: "", suspendedAt: "" } 
   });
   ```

3. **Reactivate All Users:**
   ```javascript
   db.users.updateMany({ isBanned: true }, {
     $set: { isBanned: false, isActive: true }
   });
   ```

---

## Success Metrics

The implementation is successful if:
- ✅ 100% of banned users cannot login
- ✅ 100% of banned users' content is hidden
- ✅ 100% of unbanned users regain full access
- ✅ 0 false positives (active users blocked)
- ✅ < 500ms query performance maintained
- ✅ Error messages are clear and user-friendly

---

## Support Contacts

For testing issues:
1. Check implementation doc: `USER_BAN_SUSPENSION_IMPLEMENTATION.md`
2. Review error logs (browser + server)
3. Verify database state directly
4. Test with clean database if persistent issues

---

## Notes

- Test in development environment first
- Use test accounts, not real user data
- Document any issues found
- Take screenshots of error messages
- Verify both frontend and backend behavior
- Test across different browsers if possible
