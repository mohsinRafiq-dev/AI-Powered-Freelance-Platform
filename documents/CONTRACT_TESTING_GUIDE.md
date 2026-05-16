# Contract System - End-to-End Testing Guide

## Overview
This guide provides comprehensive test scenarios for the contract system, ensuring proper role-based access control, workflow, and business logic.

## Test Environment Setup

### Prerequisites
- Server running on http://localhost:5000
- Client running on http://localhost:5173
- Database seeded with test data
- Two test accounts:
  - **Client Account:** client@test.com / password123
  - **Freelancer Account:** freelancer@test.com / password123

### Test Data Preparation

```sql
-- Create test client
User: {
  email: "client@test.com",
  name: "Test Client",
  role: "client",
  password: "hashed_password"
}

-- Create test freelancer
User: {
  email: "freelancer@test.com",
  name: "Test Freelancer",
  role: "freelancer",
  password: "hashed_password"
}

-- Create test job
Job: {
  title: "Build E-commerce Website",
  client: <client_id>,
  status: "open",
  budget: { min: 40000, max: 60000, type: "fixed" }
}

-- Create test proposal
Proposal: {
  job: <job_id>,
  freelancer: <freelancer_id>,
  proposedBudget: 50000,
  status: "accepted"
}
```

## Test Scenarios

### 1. Contract Creation (Client Flow)

#### Test 1.1: Client Creates Contract from Accepted Proposal

**Steps:**
1. Login as client (client@test.com)
2. Navigate to Messages page
3. Open conversation with freelancer who submitted accepted proposal
4. Verify "Activity Timeline" is visible on the right side
5. Verify "Create Contract" button is visible
6. Click "Create Contract" button
7. Fill in contract form:
   - Title: Auto-filled from job ✓
   - Description: Auto-filled from proposal ✓
   - Total Amount: PKR 50,000
   - Payment Type: Fixed
   - Terms: "Payment upon completion"
   - Start Date: Select today's date
   - End Date: Select 30 days from today
   - Add 2 milestones:
     - Milestone 1: Design (PKR 20,000, due in 10 days)
     - Milestone 2: Development (PKR 30,000, due in 20 days)
8. Click "Create Contract"

**Expected Results:**
- ✅ Contract created successfully
- ✅ Toast notification: "Contract created successfully"
- ✅ Modal closes
- ✅ Activity Timeline updates with "Contract offer" event
- ✅ Contract status: "pending"
- ✅ Conversation shows contract is linked
- ✅ Client redirected back to messages

**Verification:**
```javascript
// Check database
db.contracts.findOne({ proposal: <proposal_id> })
// Should return contract with status: 'pending'

// Check conversation
db.conversations.findOne({ contract: <contract_id> })
// Should return conversation with contract reference
```

#### Test 1.2: Client Cannot Create Duplicate Contract

**Steps:**
1. Repeat Test 1.1 steps
2. Try to create another contract from same proposal

**Expected Results:**
- ❌ Error message: "Contract already exists for this proposal"
- ❌ Button disabled or not shown

#### Test 1.3: Client Views Their Contracts

**Steps:**
1. Login as client
2. Navigate to /contracts
3. Verify contracts list

**Expected Results:**
- ✅ Shows statistics cards (Total, Active, Pending, Completed)
- ✅ Shows only contracts where user is the CLIENT
- ✅ Does NOT show contracts from other clients
- ✅ Shows correct contract details:
  - Title, description
  - Status badge
  - Total amount
  - Client name (self)
  - Freelancer name
  - Start date
  - Progress bar (if milestones)
- ✅ Filter by status works correctly
- ❌ No "role" filter dropdown visible

### 2. Contract Acceptance (Freelancer Flow)

#### Test 2.1: Freelancer Sees Pending Contract

**Steps:**
1. Login as freelancer (freelancer@test.com)
2. Navigate to Messages
3. Open conversation with client who created contract
4. Check Activity Timeline on right side

**Expected Results:**
- ✅ Activity Timeline is visible
- ✅ Shows "Contract offer" with "Awaiting your response" description
- ✅ Shows contract details:
  - Status: Pending
  - Amount: PKR 50,000
  - Type: Fixed
  - Milestones: 0/2 completed
  - Client: Test Client
- ✅ Pending icon (clock) next to "Contract offer"

#### Test 2.2: Freelancer Accepts Contract

**Steps:**
1. Login as freelancer
2. Navigate to /contracts
3. Find pending contract
4. Click on contract card to open details
5. Verify "Accept Contract" button is visible
6. Click "Accept Contract"
7. Confirm action

**Expected Results:**
- ✅ Contract status changes to "active"
- ✅ Toast notification: "Contract accepted successfully"
- ✅ "Accept" and "Decline" buttons disappear
- ✅ Activity Timeline updates:
  - "Contract offer" shows completed ✓
  - "Offer acceptance" appears with completed ✓
  - "Contract starts" appears
- ✅ Start date set to current date/time
- ✅ Client receives real-time notification (if socket connected)

**Verification:**
```javascript
// Check database
db.contracts.findById(contract_id)
// Should have:
// - status: 'active'
// - startDate: current timestamp
```

#### Test 2.3: Freelancer Declines Contract

**Steps:**
1. Create another test contract
2. Login as freelancer
3. Open contract detail page
4. Click "Decline Contract"
5. Enter reason: "Schedule conflict"
6. Confirm

**Expected Results:**
- ✅ Contract status changes to "cancelled"
- ✅ Toast notification: "Contract declined"
- ✅ Cancellation reason stored
- ✅ cancelledBy field set to freelancer ID
- ✅ Contract appears in "Cancelled" filter
- ✅ Client sees contract as cancelled

#### Test 2.4: Freelancer Views Their Contracts

**Steps:**
1. Login as freelancer
2. Navigate to /contracts
3. Verify contracts list

**Expected Results:**
- ✅ Shows statistics cards (Total, Active, Pending, Completed)
- ✅ Shows only contracts where user is the FREELANCER
- ✅ Does NOT show contracts with other freelancers
- ✅ Shows correct contract details for each contract
- ✅ Filter by status works correctly
- ❌ No "role" filter dropdown visible

### 3. Access Control Tests

#### Test 3.1: Client Cannot See Other Clients' Contracts

**Steps:**
1. Create contract between ClientA and FreelancerA
2. Login as ClientB
3. Navigate to /contracts
4. Try to access ClientA's contract via direct URL

**Expected Results:**
- ❌ ClientB's contracts list does NOT show ClientA's contracts
- ❌ Direct URL access returns 403 Forbidden or redirects
- ✅ Only ClientB's own contracts are visible

#### Test 3.2: Freelancer Cannot See Other Freelancers' Contracts

**Steps:**
1. Create contract between Client and FreelancerA
2. Login as FreelancerB
3. Navigate to /contracts
4. Try to access FreelancerA's contract via direct URL

**Expected Results:**
- ❌ FreelancerB's contracts list does NOT show FreelancerA's contracts
- ❌ Direct URL access returns 403 Forbidden or redirects
- ✅ Only FreelancerB's own contracts are visible

#### Test 3.3: Backend API Access Control

**Test Case: GET /api/contracts**

```javascript
// As Client
GET /api/contracts
Headers: { Authorization: Bearer <client_token> }

// Expected Query
{ client: <client_id> }

// Should return only contracts where user is client

// As Freelancer
GET /api/contracts
Headers: { Authorization: Bearer <freelancer_token> }

// Expected Query
{ freelancer: <freelancer_id> }

// Should return only contracts where user is freelancer
```

**Test Case: GET /api/contracts/:id**

```javascript
// Unauthorized access attempt
GET /api/contracts/<other_user_contract_id>
Headers: { Authorization: Bearer <user_token> }

// Expected Response
Status: 403 Forbidden
Body: { message: "Unauthorized access to this contract" }
```

### 4. Contract Workflow Tests

#### Test 4.1: Complete Contract Flow

**Steps:**
1. Client creates contract → Status: pending
2. Freelancer accepts contract → Status: active
3. Update milestone 1 to "in_progress"
4. Update milestone 1 to "completed"
5. Update milestone 2 to "in_progress"
6. Update milestone 2 to "completed"
7. Client marks contract as complete

**Expected Results:**
- ✅ Each status transition works correctly
- ✅ Activity Timeline updates at each step
- ✅ Progress bar reflects milestone completions
- ✅ Final status: "completed"
- ✅ completedAt timestamp recorded

#### Test 4.2: Cancel Active Contract

**Steps:**
1. Create and activate a contract
2. Login as client
3. Open contract detail page
4. Click "Cancel Contract"
5. Enter reason: "Requirements changed"
6. Confirm

**Expected Results:**
- ✅ Contract status changes to "cancelled"
- ✅ cancelledBy field set to client ID
- ✅ cancellationReason stored
- ✅ cancelledAt timestamp recorded
- ✅ Freelancer notified
- ✅ Contract appears in "Cancelled" filter for both parties

#### Test 4.3: Invalid Status Transitions

**Test Case: Cannot complete pending contract**

```javascript
// Contract status: pending
POST /api/contracts/<id>/complete

// Expected Response
Status: 400 Bad Request
Body: { message: "Only active contracts can be completed" }
```

**Test Case: Cannot accept already active contract**

```javascript
// Contract status: active
POST /api/contracts/<id>/respond
Body: { action: "accept" }

// Expected Response
Status: 400 Bad Request
Body: { message: "Contract is not pending" }
```

### 5. Milestone Management Tests

#### Test 5.1: Client Adds Milestone to Active Contract

**Steps:**
1. Create and activate a contract
2. Login as client
3. Open contract detail page
4. Click "Add Milestone"
5. Fill milestone form:
   - Title: "Testing Phase"
   - Description: "Complete all testing"
   - Amount: PKR 10,000
   - Due Date: 15 days from now
6. Submit

**Expected Results:**
- ✅ Milestone added successfully
- ✅ Toast notification shown
- ✅ Milestone appears in list
- ✅ Progress bar updates (now 0/3 completed)

#### Test 5.2: Freelancer Cannot Add Milestones

**Steps:**
1. Login as freelancer
2. Open contract detail page
3. Check for "Add Milestone" button

**Expected Results:**
- ❌ "Add Milestone" button not visible to freelancer
- ❌ API call returns 403 if attempted directly

#### Test 5.3: Update Milestone Status

**Steps:**
1. Login as freelancer
2. Open active contract
3. Find pending milestone
4. Click "Mark In Progress"
5. Later, click "Mark Completed"
6. Add completion notes

**Expected Results:**
- ✅ Milestone status updates correctly
- ✅ Progress bar updates
- ✅ Client sees updates in real-time (if socket connected)
- ✅ Activity Timeline reflects changes

### 6. Activity Timeline Tests

#### Test 6.1: Client Sees Create Contract Button

**Pre-condition:** Proposal accepted, no contract exists

**Steps:**
1. Login as client
2. Navigate to messages
3. Open conversation with freelancer
4. Check Activity Timeline

**Expected Results:**
- ✅ "Create Contract" button visible
- ✅ Button has green background
- ✅ Plus icon displayed
- ✅ Timeline shows "Contract offer" with "Create contract to proceed"

#### Test 6.2: Freelancer Sees Activity Timeline

**Steps:**
1. Login as freelancer
2. Navigate to messages
3. Open conversation with client
4. Check Activity Timeline

**Expected Results:**
- ✅ Activity Timeline is visible
- ✅ Shows all events:
  - ✓ Proposal submitted (date)
  - ⏳ Contract offer (description based on status)
  - ⏳ Offer acceptance (if pending)
  - ✓ Contract starts (if accepted)
- ✅ Contract Details section shows:
  - Status badge
  - Amount in PKR
  - Payment type
  - Milestone progress
  - Client name

#### Test 6.3: Timeline Updates with Contract Progress

**Steps:**
1. Create contract (pending)
2. Check timeline → shows pending offer
3. Accept contract (active)
4. Check timeline → shows completed offer + acceptance + contract starts
5. Complete contract
6. Check timeline → shows completed contract

**Expected Results:**
- ✅ Timeline updates automatically at each step
- ✅ Icons change based on status (✓ for completed, ⏳ for pending)
- ✅ Colors match status (green for completed, yellow for pending)
- ✅ Dates displayed correctly

### 7. UI/UX Tests

#### Test 7.1: Contract Cards Display Correctly

**Steps:**
1. Navigate to /contracts
2. Verify card layout

**Expected Results:**
- ✅ Cards show all information clearly
- ✅ Status badge colors are correct
- ✅ Amount formatted with commas
- ✅ Progress bar visible if milestones exist
- ✅ Hover effect works
- ✅ Click navigates to detail page

#### Test 7.2: Contract Detail Page Layout

**Expected Results:**
- ✅ Header with title, status, and actions
- ✅ Contract details card with all info
- ✅ Milestones section (if applicable)
- ✅ Activity timeline (desktop) or separate section (mobile)
- ✅ Message button navigates to conversation
- ✅ Responsive on mobile devices

#### Test 7.3: Filters Work Correctly

**Steps:**
1. Create contracts with different statuses
2. Test each filter option

**Expected Results:**
- ✅ "All Statuses" shows all contracts
- ✅ "Pending" shows only pending contracts
- ✅ "Active" shows only active contracts
- ✅ "Completed" shows only completed contracts
- ✅ "Cancelled" shows only cancelled contracts
- ✅ Empty state message shows when no contracts match filter

### 8. Integration Tests

#### Test 8.1: Contract to Conversation Navigation

**Steps:**
1. Open contract detail page
2. Click "Message" button

**Expected Results:**
- ✅ Navigates to /messages
- ✅ Opens correct conversation
- ✅ Conversation shows linked contract
- ✅ Activity Timeline visible

#### Test 8.2: Conversation to Contract Navigation

**Steps:**
1. Open conversation with linked contract
2. Click on contract details or "View Contract" link

**Expected Results:**
- ✅ Navigates to contract detail page
- ✅ Shows correct contract
- ✅ All data populated

#### Test 8.3: Real-time Updates

**Pre-condition:** Two browsers/sessions open

**Steps:**
1. Browser A: Client logged in
2. Browser B: Freelancer logged in
3. Browser B: Accept contract
4. Browser A: Observe updates

**Expected Results:**
- ✅ Contract status updates in real-time for client
- ✅ Activity Timeline updates automatically
- ✅ Notification shown to client

### 9. Error Handling Tests

#### Test 9.1: Network Error Handling

**Steps:**
1. Disconnect network
2. Try to create contract
3. Try to load contracts

**Expected Results:**
- ✅ Error toast shown
- ✅ User-friendly error message
- ✅ Retry option available
- ✅ No data loss in form

#### Test 9.2: Validation Error Handling

**Test Cases:**
- Empty title → Error: "Title is required"
- Negative amount → Error: "Amount must be positive"
- Start date after end date → Error: "End date must be after start date"
- Milestone amounts exceed total → Error: "Milestone amounts exceed total"

#### Test 9.3: Authorization Error Handling

**Steps:**
1. Try to access contract without authentication
2. Try to modify another user's contract

**Expected Results:**
- ✅ Redirected to login page
- ✅ 403 error for unauthorized access
- ✅ Error message displayed

### 10. Performance Tests

#### Test 10.1: Large Dataset Handling

**Setup:** Create 100+ contracts

**Steps:**
1. Navigate to /contracts
2. Observe loading time and pagination

**Expected Results:**
- ✅ Page loads within 2 seconds
- ✅ Pagination works correctly
- ✅ Filter/sort remains performant
- ✅ No UI lag

#### Test 10.2: Database Query Performance

**Test Query Performance:**

```javascript
// Should use index: { client: 1, status: 1, createdAt: -1 }
db.contracts.find({ 
  client: ObjectId(...), 
  status: 'active' 
}).sort({ createdAt: -1 }).explain()

// Should show:
// - Index used: ✅
// - Execution time: < 10ms
```

## Test Checklist Summary

### Contract Creation
- [ ] Client can create contract from accepted proposal
- [ ] Cannot create duplicate contracts
- [ ] Form validation works correctly
- [ ] Milestones can be added during creation

### Contract Acceptance
- [ ] Freelancer can accept pending contract
- [ ] Freelancer can decline contract with reason
- [ ] Status transitions correctly
- [ ] Activity Timeline updates

### Access Control
- [ ] Clients see only their contracts (as client)
- [ ] Freelancers see only their contracts (as freelancer)
- [ ] Cannot access other users' contracts
- [ ] API enforces role-based filtering
- [ ] No role filter dropdown in UI

### Contract Workflow
- [ ] Pending → Active transition works
- [ ] Active → Completed transition works
- [ ] Cancel contract works with reason
- [ ] Invalid transitions are prevented

### Milestones
- [ ] Client can add milestones to active contract
- [ ] Freelancer cannot add milestones
- [ ] Milestone status can be updated
- [ ] Progress tracking works correctly

### Activity Timeline
- [ ] Timeline visible to both parties
- [ ] Shows correct events based on status
- [ ] Icons and colors match status
- [ ] Create Contract button shows for client when appropriate
- [ ] Contract details show for both parties

### UI/UX
- [ ] Contract cards display correctly
- [ ] Detail page layout is responsive
- [ ] Filters work correctly
- [ ] Empty states show appropriate messages
- [ ] Loading states work

### Integration
- [ ] Navigation between contracts and messages works
- [ ] Real-time updates function correctly
- [ ] Notifications sent appropriately

### Error Handling
- [ ] Network errors handled gracefully
- [ ] Validation errors display correctly
- [ ] Authorization errors redirect appropriately

### Performance
- [ ] Large datasets load quickly
- [ ] Database queries use indexes
- [ ] No UI lag or freezing

## Test Execution Report Template

```markdown
# Contract System Test Execution Report

**Test Date:** YYYY-MM-DD
**Tester:** [Name]
**Environment:** [Development/Staging/Production]

## Test Results Summary

- Total Tests: XX
- Passed: XX (XX%)
- Failed: XX (XX%)
- Skipped: XX (XX%)

## Failed Tests

| Test ID | Test Name | Expected | Actual | Priority | Notes |
|---------|-----------|----------|--------|----------|-------|
| 3.1 | Client Access Control | Should not see other contracts | Saw all contracts | HIGH | Fix query filter |

## Issues Found

1. **Issue**: [Description]
   - **Severity**: High/Medium/Low
   - **Steps to Reproduce**: [Steps]
   - **Expected**: [Expected behavior]
   - **Actual**: [Actual behavior]
   - **Fix**: [Proposed fix or ticket number]

## Recommendations

1. [Recommendation 1]
2. [Recommendation 2]

## Sign-off

- [ ] All critical tests passed
- [ ] All high-priority issues resolved
- [ ] Documentation updated
- [ ] Ready for deployment

**Tester Signature:** _______________
**Date:** _______________
```

## Automated Test Scripts

### Jest/React Testing Library Example

```javascript
// ContractsPage.test.jsx
describe('ContractsPage - Role-Based Access', () => {
  it('client sees only their contracts', async () => {
    const mockClient = { _id: 'client1', role: 'client' };
    render(<ContractsPage />, { user: mockClient });
    
    await waitFor(() => {
      expect(screen.getByText('My Contract 1')).toBeInTheDocument();
      expect(screen.queryByText('Other Client Contract')).not.toBeInTheDocument();
    });
  });

  it('freelancer sees only their contracts', async () => {
    const mockFreelancer = { _id: 'freelancer1', role: 'freelancer' };
    render(<ContractsPage />, { user: mockFreelancer });
    
    await waitFor(() => {
      expect(screen.getByText('Contract I\'m Working On')).toBeInTheDocument();
      expect(screen.queryByText('Other Freelancer Contract')).not.toBeInTheDocument();
    });
  });

  it('does not show role filter dropdown', () => {
    render(<ContractsPage />);
    expect(screen.queryByLabelText('All Roles')).not.toBeInTheDocument();
  });
});
```

## Conclusion

This testing guide ensures comprehensive coverage of the contract system's functionality, security, and performance. Execute all tests before deployment and document any issues found.
