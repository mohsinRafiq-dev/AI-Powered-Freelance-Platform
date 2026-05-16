# Contract System - Entity Relationship Diagram (ERD)

## Database Schema Visualization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CONTRACT SYSTEM ERD                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│      USER        │
├──────────────────┤
│ _id (PK)         │
│ name             │
│ email            │
│ password         │
│ role             │◄─────────┐
│   - client       │          │
│   - freelancer   │          │
│   - admin        │          │
│ avatar           │          │
│ isVerified       │          │
│ createdAt        │          │
│ updatedAt        │          │
└──────────────────┘          │
        ▲                     │
        │                     │
        │ posted_by           │ client
        │                     │
┌───────┴──────────┐   ┌──────┴───────────┐
│      JOB         │   │    CONTRACT      │
├──────────────────┤   ├──────────────────┤
│ _id (PK)         │   │ _id (PK)         │
│ title            │◄──┤ job (FK)         │
│ description      │   │ proposal (FK)    │───┐
│ client (FK)      │   │ client (FK)      │   │
│ category         │   │ freelancer (FK)  │───┼─────┐
│ skills[]         │   │ title            │   │     │
│ budget           │   │ description      │   │     │
│   - min          │   │ totalAmount      │   │     │
│   - max          │   │ status           │   │     │
│   - type         │   │   - pending      │   │     │
│ location         │   │   - active       │   │     │
│   - city         │   │   - completed    │   │     │
│   - country      │   │   - cancelled    │   │     │
│ deadline         │   │   - disputed     │   │     │
│ status           │   │ startDate        │   │     │
│   - open         │   │ endDate          │   │     │
│   - closed       │   │ deadline         │   │     │
│   - in_progress  │   │ milestones[]     │   │     │
│ createdAt        │   │ terms            │   │     │
│ updatedAt        │   │ paymentType      │   │     │
└──────────────────┘   │   - fixed        │   │     │
        ▲              │   - hourly       │   │     │
        │ job          │   - milestone    │   │     │
        │              │ hourlyRate       │   │     │
┌───────┴──────────┐   │ estimatedHours   │   │     │
│    PROPOSAL      │   │ actualHours      │   │     │
├──────────────────┤   │ completedAt      │   │     │
│ _id (PK)         │   │ cancelledAt      │   │     │
│ job (FK)         │   │ cancellationRsn  │   │     │
│ freelancer (FK)  │   │ cancelledBy (FK) │   │     │
│ coverLetter      │   │ metadata         │   │     │
│ proposedBudget   │   │ createdAt        │   │     │
│ estimatedTime    │   │ updatedAt        │   │     │
│ status           │   └──────────────────┘   │     │
│   - pending      │            │              │     │
│   - accepted     │            │              │     │
│   - rejected     │            │ contract     │     │
│   - contracted   │            │              │     │
│ createdAt        │   ┌────────▼──────────┐   │     │
│ updatedAt        │   │  CONVERSATION     │   │     │
└──────────────────┘   ├───────────────────┤   │     │
        │              │ _id (PK)          │   │     │
        │ proposal     │ participants[]    │◄──┼─────┘
        │              │   (FK to User)    │   │
        │              │ job (FK)          │   │
        └──────────────┤ proposal (FK)     │◄──┘
                       │ contract (FK)     │
                       │ type              │
                       │   - proposal      │
                       │   - contract      │
                       │   - general       │
                       │ lastMessage       │
                       │ lastMessageAt     │
                       │ unreadCount       │
                       │ metadata          │
                       │   - jobTitle      │
                       │   - budget        │
                       │   - proposalSub.. │
                       │   - contractSta.. │
                       │ createdAt         │
                       │ updatedAt         │
                       └───────────────────┘
                                │
                                │ conversation
                                │
                       ┌────────▼──────────┐
                       │     MESSAGE       │
                       ├───────────────────┤
                       │ _id (PK)          │
                       │ conversation (FK) │
                       │ sender (FK)       │
                       │ content           │
                       │ type              │
                       │   - text          │
                       │   - file          │
                       │   - system        │
                       │ readBy[]          │
                       │   (FK to User)    │
                       │ attachments[]     │
                       │ metadata          │
                       │ createdAt         │
                       │ updatedAt         │
                       └───────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                         MILESTONE (Embedded)                              │
├──────────────────────────────────────────────────────────────────────────┤
│ Embedded in Contract.milestones[]                                        │
│                                                                           │
│ ┌─────────────────────────────────────────────────────────────────┐     │
│ │ _id (auto-generated)                                             │     │
│ │ title                                                            │     │
│ │ description                                                      │     │
│ │ amount                                                           │     │
│ │ dueDate                                                          │     │
│ │ status (pending | in_progress | completed | disputed)           │     │
│ │ completedAt                                                      │     │
│ │ notes                                                            │     │
│ │ createdAt                                                        │     │
│ │ updatedAt                                                        │     │
│ └─────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
```

## Relationships Explained

### 1. User → Contract (as Client)
- **Type:** One-to-Many
- **Description:** A client (user with role='client') can create multiple contracts
- **Foreign Key:** Contract.client → User._id
- **Constraint:** Client must own the job associated with the proposal

### 2. User → Contract (as Freelancer)
- **Type:** One-to-Many
- **Description:** A freelancer can be hired for multiple contracts
- **Foreign Key:** Contract.freelancer → User._id
- **Constraint:** Freelancer must have submitted the accepted proposal

### 3. Job → Contract
- **Type:** One-to-Many
- **Description:** One job can result in multiple contracts (though typically one)
- **Foreign Key:** Contract.job → Job._id
- **Note:** Job belongs to the client who posts it

### 4. Proposal → Contract
- **Type:** One-to-One
- **Description:** Each contract is created from exactly one accepted proposal
- **Foreign Key:** Contract.proposal → Proposal._id
- **Constraint:** UNIQUE - one contract per proposal
- **Business Rule:** Proposal must be in "accepted" status

### 5. Contract → Conversation
- **Type:** One-to-One
- **Description:** Each contract has one associated conversation
- **Foreign Key:** Conversation.contract → Contract._id
- **Constraint:** UNIQUE sparse index
- **Note:** Conversation allows client and freelancer to communicate

### 6. Conversation → Message
- **Type:** One-to-Many
- **Description:** A conversation contains multiple messages
- **Foreign Key:** Message.conversation → Conversation._id

### 7. Contract → Milestones
- **Type:** One-to-Many (Embedded)
- **Description:** A contract can have multiple milestones
- **Implementation:** Embedded array in Contract document
- **Note:** Milestones track progress for milestone-based contracts

## Access Control Rules

### Contract Access (Query Filters)

```javascript
// CLIENT VIEW - sees only contracts they created
db.contracts.find({
  client: userId
})

// FREELANCER VIEW - sees only contracts where they are the freelancer
db.contracts.find({
  freelancer: userId
})

// ADMIN VIEW - sees all contracts
db.contracts.find({})
```

### Contract Creation Flow

```
1. Client posts Job
   ↓
2. Freelancer submits Proposal
   ↓
3. Client accepts Proposal (status → 'accepted')
   ↓
4. Client creates Contract from Proposal
   ↓
5. Contract created (status → 'pending')
   Conversation updated with contract reference
   ↓
6. Freelancer accepts Contract (status → 'active')
   ↓
7. Work progresses, milestones updated
   ↓
8. Contract completed (status → 'completed')
```

## Database Indexes (Performance Optimization)

```javascript
// User indexes
User: { email: 1 } (unique)
User: { role: 1 }

// Job indexes
Job: { client: 1, status: 1, createdAt: -1 }
Job: { category: 1, status: 1 }

// Proposal indexes
Proposal: { job: 1, status: 1 }
Proposal: { freelancer: 1, status: 1, createdAt: -1 }

// Contract indexes (MOST IMPORTANT)
Contract: { client: 1, status: 1, createdAt: -1 }
Contract: { freelancer: 1, status: 1, createdAt: -1 }
Contract: { job: 1 }
Contract: { proposal: 1 } (unique)

// Conversation indexes
Conversation: { participants: 1, lastMessageAt: -1 }
Conversation: { contract: 1 } (unique, sparse)

// Message indexes
Message: { conversation: 1, createdAt: -1 }
```

## Data Integrity Constraints

### 1. Referential Integrity
- All foreign keys must reference valid documents
- Cascade behavior on delete (application level)

### 2. Unique Constraints
- User.email must be unique
- Contract.proposal must be unique (one contract per proposal)
- Conversation.contract must be unique (one conversation per contract)

### 3. Enum Constraints
- User.role: ['client', 'freelancer', 'admin']
- Job.status: ['open', 'closed', 'in_progress', 'completed']
- Proposal.status: ['pending', 'accepted', 'rejected', 'contracted']
- Contract.status: ['pending', 'active', 'completed', 'cancelled', 'disputed', 'terminated']
- Contract.paymentType: ['fixed', 'hourly', 'milestone']
- Milestone.status: ['pending', 'in_progress', 'completed', 'disputed']

### 4. Business Logic Constraints
- Contract can only be created from accepted proposal
- Only proposal's freelancer can be the contract freelancer
- Only job's client can create the contract
- Contract status transitions follow defined workflow
- Milestones can only be added to pending/active contracts

## Query Examples

### 1. Get all contracts for a client
```javascript
db.contracts.find({ 
  client: ObjectId("client_id") 
})
.populate('freelancer', 'name email avatar')
.populate('job', 'title budget')
.sort({ createdAt: -1 })
```

### 2. Get active contracts for a freelancer
```javascript
db.contracts.find({ 
  freelancer: ObjectId("freelancer_id"),
  status: 'active'
})
.populate('client', 'name email avatar')
.populate('job', 'title budget')
.sort({ createdAt: -1 })
```

### 3. Get contract with conversation
```javascript
db.contracts.findById(contractId)
.populate('client', 'name email avatar')
.populate('freelancer', 'name email avatar')
.populate('job', 'title budget')
.populate({
  path: 'conversation',
  populate: {
    path: 'lastMessage',
    select: 'content sender createdAt'
  }
})
```

### 4. Get contracts by status for user
```javascript
db.contracts.find({
  $or: [
    { client: userId },
    { freelancer: userId }
  ],
  status: 'completed'
})
.sort({ completedAt: -1 })
```

## Summary

The Contract system ERD shows:

1. **Clear separation of concerns** between Users (clients/freelancers), Jobs, Proposals, and Contracts
2. **One-to-one relationship** between Proposal and Contract ensures contract uniqueness
3. **Role-based access control** through client and freelancer foreign keys
4. **Integrated messaging** via Conversation linking
5. **Embedded milestones** for flexible project tracking
6. **Proper indexing** for performance optimization
7. **Strong data integrity** through constraints and business rules

This schema supports the complete contract lifecycle from proposal acceptance to contract completion.
