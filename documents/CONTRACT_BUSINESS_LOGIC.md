# Contract Business Logic Documentation

## Overview
This document describes the complete contract business logic implementation in the Linkify platform, including role-based access control, workflow, and UI/UX considerations.

## Contract Entity Structure

### Database Schema (Contract Model)

```javascript
{
  _id: ObjectId,
  job: ObjectId (ref: Job),
  proposal: ObjectId (ref: Proposal, unique),
  client: ObjectId (ref: User),
  freelancer: ObjectId (ref: User),
  title: String,
  description: String,
  totalAmount: Number,
  status: Enum ['pending', 'active', 'completed', 'cancelled', 'disputed', 'terminated'],
  startDate: Date,
  endDate: Date,
  deadline: Date,
  milestones: [Milestone],
  terms: String,
  paymentType: Enum ['fixed', 'hourly', 'milestone'],
  hourlyRate: Number,
  estimatedHours: Number,
  actualHours: Number,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  cancelledBy: ObjectId (ref: User),
  metadata: Map,
  timestamps: { createdAt, updatedAt }
}
```

### Milestone Schema

```javascript
{
  title: String,
  description: String,
  amount: Number,
  dueDate: Date,
  status: Enum ['pending', 'in_progress', 'completed', 'disputed'],
  completedAt: Date,
  notes: String,
  timestamps: { createdAt, updatedAt }
}
```

## Business Rules

### 1. Contract Creation

**Who Can Create:**
- Only **clients** can create contracts
- Must have an **accepted proposal** from a freelancer

**Requirements:**
- Proposal must be in "accepted" status
- Client must own the job associated with the proposal
- One contract per proposal (unique constraint)

**Process:**
1. Client accepts a proposal from a freelancer
2. Client navigates to messages with that freelancer
3. In the Activity Timeline, client sees "Create Contract" button
4. Client fills contract details:
   - Title (auto-filled from job)
   - Description (auto-filled from proposal cover letter)
   - Total amount (auto-filled from proposed budget)
   - Payment type (fixed/hourly/milestone)
   - Terms and conditions
   - Start date and end date
   - Optional milestones
5. Contract is created in "pending" status
6. Conversation is linked to the contract

### 2. Contract Access Control

#### For Clients:
**What They See:**
- Only contracts where they are the **client** (contracts they created)
- They see contracts with all freelancers they hired
- Cannot see contracts from other clients

**Example Query:**
```javascript
{ client: userId }
```

#### For Freelancers:
**What They See:**
- Only contracts where they are the **freelancer**
- They see contracts from all clients who hired them
- Cannot see contracts with other freelancers

**Example Query:**
```javascript
{ freelancer: userId }
```

### 3. Contract Statuses and Workflow

#### Status Flow:

```
pending → active → completed
   ↓         ↓
cancelled  cancelled
```

#### Status Descriptions:

1. **Pending** (Initial State)
   - Contract created by client
   - Awaiting freelancer acceptance
   - Freelancer can accept or decline
   
2. **Active**
   - Freelancer has accepted the contract
   - Work is in progress
   - Milestones can be updated
   - Either party can message the other
   
3. **Completed**
   - Contract work is finished
   - Payment is processed
   - Both parties can leave reviews
   
4. **Cancelled**
   - Contract terminated before completion
   - Can be cancelled by either party
   - Requires a cancellation reason
   
5. **Disputed**
   - Conflict between client and freelancer
   - Requires admin intervention
   
6. **Terminated**
   - Contract forcefully ended by admin or system

### 4. Contract Actions by Role

#### Client Actions:

**On Pending Contract:**
- View contract details
- Cancel contract
- Send messages to freelancer

**On Active Contract:**
- View progress and milestones
- Add new milestones
- Update milestone status
- Mark contract as complete (when work is done)
- Cancel contract (with reason)
- Send messages to freelancer

**On Completed Contract:**
- View final details
- Leave review for freelancer

#### Freelancer Actions:

**On Pending Contract:**
- View contract details
- **Accept** contract (moves to active)
- **Decline** contract (moves to cancelled)
- Send messages to client

**On Active Contract:**
- View progress and milestones
- Update own work on milestones
- Mark milestones as completed (pending client approval)
- Request contract completion
- Send messages to client

**On Completed Contract:**
- View final details
- Leave review for client

## User Interface Components

### 1. Contracts Page (`/contracts`)

**Purpose:** List all contracts for the logged-in user

**Features:**
- **Filters:**
  - Status filter (All, Pending, Active, Completed, Cancelled)
  - ~~Role filter removed~~ (users only see their own contracts)
- **Statistics Cards:**
  - Total contracts
  - Active contracts
  - Pending contracts
  - Completed contracts
- **Contract Cards:**
  - Contract title and description
  - Status badge
  - Total amount
  - Client and freelancer names
  - Start date
  - Progress bar (if milestones exist)
  - Click to view details

**Access Control:**
- Clients see: contracts where `client = userId`
- Freelancers see: contracts where `freelancer = userId`

### 2. Contract Detail Page (`/contracts/:id`)

**Purpose:** View and manage a specific contract

**Sections:**
- **Header:**
  - Contract title
  - Status badge
  - Action buttons (Accept/Decline/Complete/Cancel based on role and status)
  - Message button (navigate to conversation)
  
- **Contract Details:**
  - Description
  - Total amount and payment type
  - Start date and end date
  - Terms and conditions
  - Client and freelancer information
  
- **Milestones Section:**
  - List of all milestones
  - Progress tracking
  - Status updates
  - Add milestone button (client only, if status allows)
  
- **Activity Timeline:**
  - Contract creation
  - Status changes
  - Milestone completions
  - Messages sent
  - Important events

### 3. Activity Timeline (Messages Sidebar)

**Purpose:** Show contract progress in the messaging interface

**For Clients:**
```
✓ Proposal submitted (date)
✓ Contract offer (date)
  [Create Contract Button] (if proposal accepted but no contract)
✓ Offer acceptance (date)
✓ Contract starts (date)
⏳ Contract completion (pending)

Contract Details:
- Status: Active
- Amount: PKR 50,000
- Type: Fixed
- Milestones: 2/5 completed
- Freelancer: John Doe
```

**For Freelancers:**
```
✓ Proposal submitted (date)
⏳ Contract offer (Awaiting your response)
  [Accept] [Decline] buttons
⏳ Offer acceptance (pending)
⏳ Contract starts (pending)

Contract Details:
- Status: Pending
- Amount: PKR 50,000
- Type: Fixed
- Milestones: 0/5 completed
- Client: Jane Smith
```

**Visibility Rules:**
- Both clients and freelancers see the activity timeline in messages
- Clients see "Create Contract" button when proposal is accepted
- Freelancers see contract details once contract is created
- Timeline events update automatically based on contract status

### 4. Create Contract Modal

**Triggered By:**
- Client clicks "Create Contract" button in Activity Timeline
- Only shown when proposal status is "accepted" and no contract exists

**Form Fields:**
- Title (pre-filled from job)
- Description (pre-filled from proposal)
- Total Amount (pre-filled from proposal budget)
- Payment Type (fixed/hourly/milestone)
- Terms and Conditions
- Start Date
- End Date
- Milestones (optional):
  - Title
  - Description
  - Amount
  - Due Date

**Validation:**
- All required fields must be filled
- Total amount must be positive
- Start date must be before end date
- Sum of milestone amounts should match total amount

## API Endpoints

### Contract Endpoints

```
POST   /api/contracts/from-proposal     Create contract from proposal (Client only)
GET    /api/contracts                   Get all contracts for logged-in user
GET    /api/contracts/:id               Get contract by ID
POST   /api/contracts/:id/respond       Accept/decline contract (Freelancer only)
POST   /api/contracts/:id/milestones    Add milestone (Client only)
PATCH  /api/contracts/:id/milestones/:milestoneId   Update milestone
POST   /api/contracts/:id/complete      Mark contract as complete
POST   /api/contracts/:id/cancel        Cancel contract
GET    /api/contracts/stats             Get contract statistics for user
```

### Query Parameters for GET /api/contracts

```javascript
{
  status: 'pending' | 'active' | 'completed' | 'cancelled',  // Optional
  page: 1,           // Optional, default: 1
  limit: 10,         // Optional, default: 10
  sortBy: 'createdAt',  // Optional, default: 'createdAt'
  order: 'desc'      // Optional, default: 'desc'
}
```

## Backend Service Logic

### Key Service Methods

#### 1. `createFromProposal(proposalId, clientId, contractData)`
- Validates proposal is accepted
- Validates client owns the job
- Creates contract with status "pending"
- Updates proposal status to "contracted"
- Creates/updates conversation with contract link
- Returns created contract

#### 2. `getContractsByUser(userId, filters, userRole)`
- **NEW LOGIC:** Uses userRole to determine query
- For clients: `{ client: userId }`
- For freelancers: `{ freelancer: userId }`
- Applies additional filters (status, pagination)
- Populates client, freelancer, job data
- Returns paginated results

#### 3. `respondToContract(contractId, freelancerId, action, reason)`
- Validates freelancer is the contract freelancer
- If action is "accept":
  - Updates status to "active"
  - Sets startDate to now
  - Updates conversation metadata
- If action is "decline":
  - Updates status to "cancelled"
  - Sets cancelledBy and cancellationReason
- Returns updated contract

## Integration with Other Modules

### 1. Proposals Module
- Contract creation requires accepted proposal
- Proposal status updated to "contracted" when contract created
- One-to-one relationship (unique constraint)

### 2. Jobs Module
- Contract linked to original job
- Job information displayed in contract details
- Job owner is always the client

### 3. Messages Module
- Conversation automatically created/updated when contract created
- Contract linked to conversation for easy navigation
- Activity timeline shows contract progress
- Message button in contract detail page navigates to conversation

### 4. Users Module
- Client and freelancer user data populated in contract
- User roles determine access control
- User can be client in some contracts, freelancer in others

## Security Considerations

### 1. Authorization
- All contract endpoints require authentication
- Users can only access contracts where they are client or freelancer
- Role-based actions enforced at API level

### 2. Validation
- Input validation on all create/update operations
- Business rule validation (e.g., only accepted proposals can become contracts)
- Status transition validation (e.g., can't complete a pending contract)

### 3. Data Integrity
- Unique constraint on proposal → contract relationship
- Foreign key constraints on client, freelancer, job, proposal
- Atomic operations for status updates

## Testing Checklist

### Client Flow:
- [ ] Client can see only their own contracts
- [ ] Client can create contract from accepted proposal
- [ ] Client can see "Create Contract" button in Activity Timeline
- [ ] Client can view contract details
- [ ] Client can add milestones to active contract
- [ ] Client can mark contract as complete
- [ ] Client can cancel contract with reason
- [ ] Client cannot see other clients' contracts

### Freelancer Flow:
- [ ] Freelancer can see only contracts where they are freelancer
- [ ] Freelancer can accept pending contract
- [ ] Freelancer can decline pending contract
- [ ] Freelancer sees Activity Timeline in messages
- [ ] Freelancer can view contract details
- [ ] Freelancer can update milestone status
- [ ] Freelancer can send messages to client
- [ ] Freelancer cannot see contracts with other freelancers

### Access Control:
- [ ] Backend filters contracts by user role
- [ ] Frontend doesn't show role filter dropdown
- [ ] API returns 403 for unauthorized access
- [ ] Contracts page shows correct stats for user
- [ ] Contract detail page shows correct actions based on role and status

### UI/UX:
- [ ] Activity Timeline shows correct events
- [ ] Contract cards display properly
- [ ] Status badges show correct colors
- [ ] Create Contract modal pre-fills data correctly
- [ ] Milestone progress shows accurately
- [ ] Navigation between contracts and messages works

## Database Indexes

```javascript
// For performance optimization
contractSchema.index({ client: 1, status: 1, createdAt: -1 });
contractSchema.index({ freelancer: 1, status: 1, createdAt: -1 });
contractSchema.index({ job: 1 });
contractSchema.index({ proposal: 1 }, { unique: true });
```

## Error Handling

### Common Errors:
- `CONTRACT_NOT_FOUND`: Contract ID doesn't exist
- `UNAUTHORIZED_ACCESS`: User not authorized to access contract
- `INVALID_STATUS_TRANSITION`: Cannot change from current status to requested status
- `PROPOSAL_NOT_ACCEPTED`: Cannot create contract from non-accepted proposal
- `DUPLICATE_CONTRACT`: Contract already exists for this proposal
- `INVALID_MILESTONE_DATA`: Milestone validation failed

## Summary

The contract system implements strict role-based access control:

1. **Clients** create contracts and can only see contracts they created
2. **Freelancers** accept contracts and can only see contracts where they are the freelancer
3. **Activity Timeline** is visible to both parties in the messaging interface
4. **Contract creation** is a client-only action after accepting a proposal
5. **Contract acceptance** is a freelancer action to activate the contract

This ensures data privacy, proper workflow, and clear separation of concerns between clients and freelancers.
