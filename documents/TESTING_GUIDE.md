# Contracts & Messaging System - End-to-End Testing Guide

## Overview
This guide covers testing the complete Contracts and Messaging system from proposal acceptance to contract completion with real-time messaging.

## Prerequisites
- Backend server running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`
- MongoDB connected and running
- Socket.IO connections enabled
- Two test accounts:
  - **Client Account**: Client role with at least one approved job posting
  - **Freelancer Account**: Freelancer role with verified CNIC and complete profile

---

## Test Scenario 1: Complete Contract Workflow

### Step 1: Create and Submit Proposal (Freelancer)
1. Login as **Freelancer**
2. Navigate to "Browse Jobs" or "Recommended Jobs"
3. Select a job posting
4. Click "Submit Proposal"
5. Fill in:
   - Cover letter explaining your approach
   - Proposed amount (e.g., $500)
   - Estimated duration (e.g., 2 weeks)
   - Attach portfolio samples if needed
6. Click "Submit Proposal"
7. **Expected**: Success toast, redirected to "My Proposals"

### Step 2: Review and Accept Proposal (Client)
1. Login as **Client**
2. Navigate to "My Jobs"
3. Click on the job with proposals
4. Review freelancer's proposal
5. Click "Accept Proposal"
6. **Expected**: 
   - Proposal status changes to "accepted"
   - Contract creation form appears or auto-creates

### Step 3: Create Contract from Accepted Proposal (Client)
**If not auto-created:**
1. Click "Create Contract" from accepted proposal
2. Contract pre-fills with:
   - Job title and description
   - Freelancer details
   - Proposed amount
3. Add contract details:
   - Payment type: Fixed/Hourly/Milestone-based
   - Start date
   - Deadline
   - Terms and conditions
4. **For milestone-based contracts**, add milestones:
   - Milestone 1: "Design mockups" - $150 - Due: Week 1
   - Milestone 2: "Frontend development" - $200 - Due: Week 2
   - Milestone 3: "Testing and deployment" - $150 - Due: Week 3
5. Click "Send Contract Offer"
6. **Expected**:
   - Contract created with status "pending"
   - Conversation automatically created
   - Freelancer receives notification
   - Redirected to contract details page with activity timeline

### Step 4: Review and Accept Contract (Freelancer)
1. Login as **Freelancer**
2. Navigate to "Contracts" (notification should be visible)
3. Click on pending contract
4. Review contract details:
   - Total amount
   - Payment type
   - Milestones (if applicable)
   - Terms
   - Deadline
5. Click "Accept Contract"
6. **Expected**:
   - Contract status changes to "active"
   - Activity timeline shows:
     - ✓ Proposal submitted
     - ✓ Contract offer
     - ✓ Offer acceptance
     - ✓ Contract starts
   - Start date set to current date

### Step 5: Work and Complete Milestones (Freelancer)
1. In active contract, view milestone list
2. For each milestone:
   - Click "Start" on Milestone 1
   - Status changes to "in_progress"
   - Complete work
   - Click "Complete" on milestone
   - **Expected**: Milestone marked as completed, progress bar updates
3. Repeat for all milestones
4. **Expected**: Progress shows "3 of 3 milestones completed"

### Step 6: Complete Contract (Client)
1. Login as **Client**
2. Navigate to contract details
3. Verify all milestones completed
4. Click "Mark as Complete"
5. Confirm completion
6. **Expected**:
   - Contract status changes to "completed"
   - Activity timeline shows "Contract completed" with date
   - Contract statistics updated

---

## Test Scenario 2: Real-Time Messaging

### Step 1: Start Conversation from Contract
1. Login as **Client** or **Freelancer**
2. Navigate to contract details
3. Click "Message [Freelancer/Client]" button
4. **Expected**: Redirected to `/messages` with conversation selected

### Step 2: Send Text Messages
1. In message composer, type: "Hello, I have a question about Milestone 2"
2. Press Enter or click Send button
3. **Expected**:
   - Message appears immediately in chat area
   - Message bubble styled with green background (own message)
   - Timestamp shown
   - Other user sees message in real-time (if online)

### Step 3: Test Typing Indicators
1. Start typing a message
2. **Expected on other user's screen**:
   - "User is typing..." indicator appears with animated dots
3. Stop typing for 3 seconds
4. **Expected**: Typing indicator disappears

### Step 4: Send Messages with File Attachments
1. Click paperclip icon in composer
2. Select files (images, PDFs, or documents)
3. **Limitations**: Max 5 files per message
4. Review file previews (name and size shown)
5. Add message text: "Here are the design mockups"
6. Click Send
7. **Expected**:
   - Message sent with attachments
   - Images display as thumbnails
   - Documents show as file cards with download icon
   - File metadata (name, size) visible

### Step 5: Test Read Receipts
1. Send a message from User A
2. **On User B's screen**:
   - Open the conversation
   - **Expected**: Message marked as read
3. **On User A's screen**:
   - **Expected**: "Read" indicator appears below message
   - Unread count in conversation list decreases

### Step 6: Edit and Delete Messages
1. Hover over your own message
2. Click three-dot menu (MoreVertical icon)
3. Click "Edit"
4. Modify message text
5. Press Enter or click Send
6. **Expected**:
   - Message updated in real-time
   - "(edited)" label appears
   - Other user sees edited message

7. For delete:
   - Click three-dot menu → "Delete"
   - Confirm deletion
   - **Expected**: Message removed from both users' views

### Step 7: Reply to Specific Messages
1. Hover over any message
2. Click "Reply" button
3. **Expected**: 
   - Quoted message appears at top of composer
   - Message styled with green border
4. Type reply: "Yes, that works for me"
5. Send message
6. **Expected**: Reply shows quoted context

### Step 8: Test Infinite Scroll
1. Send 30+ messages in conversation
2. Scroll to top of chat area
3. **Expected**:
   - Older messages load automatically
   - Loading indicator briefly visible
   - Scroll position maintained

---

## Test Scenario 3: Contract Cancellation and Disputes

### Step 1: Cancel Contract (Client)
1. Login as **Client** with active contract
2. Navigate to contract details
3. Click "Cancel Contract"
4. Enter reason: "Project requirements changed"
5. Confirm cancellation
6. **Expected**:
   - Contract status changes to "cancelled"
   - Activity timeline updated
   - Freelancer receives notification
   - Cancellation reason recorded

### Step 2: Decline Contract (Freelancer)
1. Login as **Freelancer** with pending contract
2. Navigate to contract details
3. Click "Decline"
4. Enter reason: "Timeline doesn't work for me"
5. Confirm decline
6. **Expected**:
   - Contract status updated
   - Client receives notification
   - Reason saved and visible to client

---

## Test Scenario 4: Multi-Conversation Management

### Step 1: Create Multiple Conversations
1. Login as **Freelancer**
2. Accept proposals from 3 different clients
3. Create contracts with each
4. **Expected**: 3 separate conversations created

### Step 2: Navigate Between Conversations
1. Navigate to `/messages`
2. **Expected**: Conversation list shows all 3
3. Click on each conversation
4. **Expected**: 
   - URL updates to `/messages/:conversationId`
   - Chat area loads correct messages
   - Header shows correct user and job title

### Step 3: Test Unread Badges
1. Have User B send messages in Conversation 1
2. As User A, don't open that conversation
3. **Expected**: 
   - Unread badge (green circle with count) on Conversation 1
   - Conversation text appears bold
4. Open Conversation 1
5. **Expected**: 
   - Badge disappears
   - Text returns to normal weight

### Step 4: Search Conversations
1. In conversation list, type in search box
2. Enter: "Design"
3. **Expected**: Only conversations with "Design" in participant name or job title shown
4. Clear search
5. **Expected**: All conversations visible again

---

## Test Scenario 5: Activity Timeline and Progress Tracking

### Step 1: View Timeline Progression
1. Navigate to contract details
2. **Expected activity timeline shows**:
   - ✓ Proposal submitted (Aug 31 or actual date)
   - ⏳ Contract offer (yellow clock if pending)
   - ✓ Offer acceptance (green checkmark if accepted)
   - ✓ Contract starts (blue icon)
   - ✓ Milestone completed × N (for each completed milestone)
   - ✓ Contract completed (if status = completed)

### Step 2: Real-Time Timeline Updates
1. Open contract in two browser windows (client and freelancer)
2. As freelancer, complete a milestone
3. **Expected on client's screen**: 
   - Timeline updates in real-time
   - New "Milestone completed" entry appears
   - Progress bar increases

---

## Test Scenario 6: Contract Statistics

### Step 1: View My Stats
1. Navigate to "Contracts" page
2. **Expected stats cards show**:
   - Total Contracts: All contracts count
   - Active: Contracts with status = "active"
   - Completed: Contracts with status = "completed"
   - Pending: Contracts with status = "pending"

### Step 2: Filter Contracts
1. Select status filter: "Active"
2. **Expected**: Only active contracts shown
3. Select role filter: "As Client"
4. **Expected**: Only contracts where you are the client

---

## Test Scenario 7: Error Handling

### Step 1: Validation Errors
1. Try sending empty message
2. **Expected**: Send button disabled
3. Try uploading 6 files
4. **Expected**: Error toast "Maximum 5 files allowed"
5. Try completing milestone without starting
6. **Expected**: Only "Start" button visible

### Step 2: Permission Errors
1. As freelancer, try to mark contract as complete
2. **Expected**: Button not visible (only client can complete)
3. As client, try to start milestone
4. **Expected**: Milestone actions not available

### Step 3: Network Error Handling
1. Disconnect internet
2. Try sending message
3. **Expected**: Error toast "Failed to send message"
4. Reconnect internet
5. **Expected**: Socket reconnects automatically

---

## Test Scenario 8: Presence and Status

### Step 1: Online/Offline Status
1. Open two browser windows
2. Login as User A in Window 1
3. **Expected**: User A shown as online (green dot)
4. Close Window 1
5. **Expected on other users' screens**: User A marked as offline

### Step 2: Away Status
1. Leave browser inactive for 5 minutes
2. **Expected**: Status changes to "away"
3. Return to browser and interact
4. **Expected**: Status returns to "online"

---

## API Endpoints Testing (Optional - Using Postman/Thunder Client)

### Contracts API
```
POST   /api/contracts/from-proposal       - Create contract from proposal
GET    /api/contracts                      - Get my contracts (with filters)
GET    /api/contracts/:id                  - Get contract details
PUT    /api/contracts/:id/respond          - Accept/decline contract
POST   /api/contracts/:id/milestones       - Add milestone
PUT    /api/contracts/:id/milestones/:mid  - Update milestone
PUT    /api/contracts/:id/complete         - Complete contract
PUT    /api/contracts/:id/cancel           - Cancel contract
GET    /api/contracts/stats                - Get contract statistics
```

### Messages API
```
GET    /api/messages/conversations         - Get all conversations
POST   /api/messages/conversations         - Create conversation
GET    /api/messages/conversations/:id     - Get conversation messages
POST   /api/messages/conversations/:id     - Send message (multipart/form-data)
PUT    /api/messages/conversations/:id/read - Mark as read
PUT    /api/messages/messages/:id          - Edit message
DELETE /api/messages/messages/:id          - Delete message
POST   /api/messages/conversations/:id/archive - Archive conversation
GET    /api/messages/unread-count          - Get unread count
GET    /api/messages/search/:id            - Search in conversation
```

---

## Socket.IO Events Testing

### Client → Server Events
```javascript
socket.emit('join_conversation', conversationId);
socket.emit('leave_conversation', conversationId);
socket.emit('typing:start', { conversationId });
socket.emit('typing:stop', { conversationId });
socket.emit('message:read', { conversationId, messageIds });
socket.emit('presence:update', { status: 'online' });
```

### Server → Client Events
```javascript
socket.on('message:new', (message) => { /* Handle new message */ });
socket.on('message:edited', ({ messageId, content }) => { /* Update message */ });
socket.on('message:deleted', ({ messageId }) => { /* Remove message */ });
socket.on('user:typing', ({ userId, conversationId }) => { /* Show typing */ });
socket.on('user:typing:stop', ({ userId }) => { /* Hide typing */ });
socket.on('presence:update', ({ userId, status }) => { /* Update status */ });
socket.on('contract:update', (contract) => { /* Refresh contract */ });
```

---

## Performance Testing

### Load Testing
1. Create 50+ messages in a conversation
2. **Expected**: Infinite scroll loads smoothly
3. Open 10+ conversations
4. **Expected**: Conversation list renders without lag

### Real-Time Latency
1. Send message from User A
2. Measure time until User B receives
3. **Expected**: < 200ms latency

---

## Known Limitations & Future Enhancements

### Current Limitations
- Max 5 file attachments per message
- File size limit: Check backend multer config
- Search only works within individual conversations
- No message reactions (like/emoji)
- No voice messages
- No video calls
- No group conversations

### Recommended Enhancements
1. Add message reactions
2. Implement global message search across all conversations
3. Add file upload progress indicators
4. Add message delivery status (sent/delivered/read)
5. Add push notifications for mobile
6. Add contract dispute resolution workflow
7. Add automated milestone reminders
8. Add contract templates
9. Add payment integration
10. Add time tracking for hourly contracts

---

## Troubleshooting

### Socket.IO Not Connecting
**Issue**: Messages not appearing in real-time
**Solutions**:
1. Check `envConfig.socketUrl` is correct
2. Verify JWT token in localStorage
3. Check browser console for WebSocket errors
4. Ensure CORS configured correctly on backend
5. Check firewall/proxy settings

### Messages Not Sending
**Issue**: Error toast appears
**Solutions**:
1. Check network tab for API errors
2. Verify user authentication
3. Check if conversation exists
4. Verify file size/type if attaching files
5. Check backend logs for validation errors

### Contract Not Creating from Proposal
**Issue**: Contract creation fails
**Solutions**:
1. Verify proposal status is "accepted"
2. Check if user has permission (must be client)
3. Verify proposal has valid job reference
4. Check backend logs for validation errors
5. Ensure MongoDB connection is active

### Typing Indicators Not Working
**Issue**: "User is typing..." not appearing
**Solutions**:
1. Check Socket.IO connection
2. Verify both users in same conversation room
3. Check `typing:start` and `typing:stop` events emitted
4. Verify conversation ID is correct
5. Check if debounce timeout is too long

---

## Success Criteria

✅ All 10 todo items completed:
1. ✅ Backend models (Contract, Conversation, Message)
2. ✅ Contracts module (9 endpoints)
3. ✅ Messages module (12 endpoints)
4. ✅ Socket.IO real-time (14 events)
5. ✅ Client API layer (contractsApi, messagesApi)
6. ✅ React Query hooks (18 hooks)
7. ✅ Messaging UI (6 components)
8. ✅ Contracts UI (5 components + 2 pages)
9. ✅ Routes wired with permissions
10. 🔄 End-to-end testing (this guide)

---

## Next Steps After Testing

1. **Deploy to Staging**: Test in staging environment
2. **User Acceptance Testing**: Have real users test workflows
3. **Performance Optimization**: Profile and optimize slow queries
4. **Security Audit**: Review authentication and authorization
5. **Documentation**: Update API docs and user guides
6. **Monitoring**: Set up logging and error tracking
7. **Backup Strategy**: Implement MongoDB backup schedule

---

## Contact & Support

For issues or questions:
- Check backend logs: `server/logs/`
- Check browser console for client errors
- Review API responses in Network tab
- Check MongoDB queries in database logs
- Refer to `CONTRACTS_MESSAGING_IMPLEMENTATION.md` for technical details

**Implementation Status**: ✅ COMPLETE - All features implemented and ready for testing
