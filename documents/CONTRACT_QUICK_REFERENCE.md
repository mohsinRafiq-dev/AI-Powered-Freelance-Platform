# Contract Module - Quick Developer Reference

## Status Constants

```javascript
import { CONTRACT_STATUS, MILESTONE_STATUS } from './contract.constants.js';

CONTRACT_STATUS.PENDING      // Initial state
CONTRACT_STATUS.ACTIVE       // Work in progress
CONTRACT_STATUS.COMPLETED    // ⛔ Terminal
CONTRACT_STATUS.CANCELLED    // ⛔ Terminal
CONTRACT_STATUS.DISPUTED     // Needs resolution
CONTRACT_STATUS.TERMINATED   // ⛔ Terminal

MILESTONE_STATUS.PENDING
MILESTONE_STATUS.IN_PROGRESS
MILESTONE_STATUS.COMPLETED
MILESTONE_STATUS.DISPUTED
```

## Allowed Status Transitions

```javascript
pending → active, cancelled
active → completed, cancelled, disputed, terminated
disputed → active, terminated
completed → ❌ (terminal)
cancelled → ❌ (terminal)
terminated → ❌ (terminal)
```

## Authorization Rules

| Operation | Client | Freelancer |
|-----------|--------|------------|
| Create contract | ✅ | ❌ |
| Accept contract | ❌ | ✅ |
| Decline contract | ❌ | ✅ |
| Add milestone | ✅ | ❌ |
| Update milestone | ✅ | ✅ |
| Complete contract | ✅ | ❌ |
| Cancel contract | ✅ | ❌ |
| View contract | ✅ | ✅ |

## Contract Model Methods

```javascript
// Authorization
contract.canBeModifiedBy(userId)  // Returns boolean
contract.isClient(userId)         // Returns boolean
contract.isFreelancer(userId)     // Returns boolean

// Status validation
contract.canTransitionTo(newStatus)  // Returns boolean
contract.isActive()                  // Returns boolean
contract.canAddMilestone()           // Returns boolean

// Progress
contract.calculateProgress()  // Returns percentage (0-100)
```

## Service Methods

```javascript
import contractService from './contract.service.js';

// Create
await contractService.createFromProposal(proposalId, clientId, {
  terms: 'Contract terms...',
  deadline: new Date('2025-12-31'),
  milestones: [{ title: '...', amount: 1000, dueDate: '...' }]
});

// Respond
await contractService.respondToContract(contractId, userId, 'accept', reason);

// Milestones
await contractService.addMilestone(contractId, userId, milestoneData);
await contractService.updateMilestone(contractId, milestoneId, userId, updates);

// Status changes
await contractService.completeContract(contractId, userId);
await contractService.cancelContract(contractId, userId, reason);

// Queries
await contractService.getContractById(contractId, userId);
await contractService.getContractsByUser(userId, filters, userRole);
await contractService.getContractStats(userId);
```

## Common Validation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid status transition" | Trying to change status illegally | Check ALLOWED_STATUS_TRANSITIONS |
| "Cannot add milestone..." | Contract not pending/active | Only add milestones to pending/active |
| "Only the client can..." | Freelancer trying client action | Check authorization rules |
| "Only the freelancer can..." | Client trying freelancer action | Use correct endpoint |
| "Milestone due date cannot be in the past" | Invalid date | Use future date |
| "Cancellation reason is required" | Missing reason | Provide reason (min 10 chars) |

## Business Rule Examples

### Creating a Contract
```javascript
// ✅ Valid
- Proposal is accepted
- User is job owner (client)
- No existing contract for proposal
- Client ≠ Freelancer

// ❌ Invalid
- Proposal is pending/rejected
- User is not job owner
- Contract already exists
- Client and freelancer are same user
```

### Adding Milestones
```javascript
// ✅ Valid
- Contract status: pending or active
- User is client
- Due date is in future
- Due date ≤ contract deadline

// ❌ Invalid
- Contract status: completed, cancelled, terminated
- User is freelancer
- Due date is in past
- Due date > contract deadline
```

### Updating Milestones
```javascript
// ✅ Valid
- Contract status: pending, active, or disputed
- User is client or freelancer
- Valid status transition
- Valid due date

// ❌ Invalid
- Contract status: completed, cancelled, terminated
- User has no access
- Invalid milestone status
```

## Auto-Populated Fields

```javascript
// When status → active
contract.startDate = new Date()  // Auto-set by pre-save hook

// When status → completed
contract.completedAt = new Date()  // Auto-set by pre-save hook

// When milestone status → completed
milestone.completedAt = new Date()  // Auto-set by pre-save hook
```

## Error Handling Pattern

```javascript
try {
  const contract = await contractService.createFromProposal(...);
  // Success
} catch (error) {
  if (error.statusCode === 400) {
    // Validation error or business rule violation
  } else if (error.statusCode === 403) {
    // Authorization error
  } else if (error.statusCode === 404) {
    // Resource not found
  }
  // Handle error
}
```

## Testing Tips

```javascript
// Test status transitions
const contract = await Contract.findById(contractId);
expect(contract.canTransitionTo(CONTRACT_STATUS.ACTIVE)).toBe(true);
expect(contract.canTransitionTo(CONTRACT_STATUS.COMPLETED)).toBe(false);

// Test authorization
expect(contract.isClient(clientId)).toBe(true);
expect(contract.isFreelancer(clientId)).toBe(false);

// Test milestone rules
expect(contract.canAddMilestone()).toBe(true);
contract.status = CONTRACT_STATUS.COMPLETED;
expect(contract.canAddMilestone()).toBe(false);
```

## Database Indexes

```javascript
// Performance-optimized queries
{ client: 1, status: 1, createdAt: -1 }
{ freelancer: 1, status: 1, createdAt: -1 }
{ job: 1 }
{ proposal: 1 } // unique
```

## API Response Format

```javascript
// Success
{
  success: true,
  data: {
    contract: {
      _id: '...',
      status: 'active',
      client: { name: '...', email: '...' },
      freelancer: { name: '...', email: '...' },
      milestones: [...],
      // ... other fields
    }
  },
  message: 'Contract created successfully'
}

// Error
{
  success: false,
  message: 'Invalid status transition',
  statusCode: 400
}
```

## Frontend Integration

```javascript
// Check if user can perform action
const canComplete = contract.status === 'active' && isClient;
const canAddMilestone = ['pending', 'active'].includes(contract.status) && isClient;
const canRespond = contract.status === 'pending' && isFreelancer;

// Display status badge
const statusColors = {
  pending: 'yellow',
  active: 'green',
  completed: 'blue',
  cancelled: 'red',
  disputed: 'orange',
  terminated: 'red'
};

// Show milestone progress
const progress = (contract.milestones.filter(m => m.status === 'completed').length / 
                  contract.milestones.length) * 100;
```

## Common Patterns

### Create Contract Flow
```
1. Client posts job
2. Freelancer submits proposal
3. Client accepts proposal → proposal.status = 'accepted'
4. Client creates contract → POST /api/contracts/from-proposal
5. Contract created with status = 'pending'
6. Freelancer accepts → POST /api/contracts/:id/respond { action: 'accept' }
7. Contract status → 'active', startDate auto-set
8. Work begins...
```

### Complete Contract Flow
```
1. Contract is active
2. Work is done
3. Client marks milestones complete → PATCH /api/contracts/:id/milestones/:mid
4. Client completes contract → POST /api/contracts/:id/complete
5. Contract status → 'completed', completedAt and endDate auto-set
```

### Cancel Contract Flow
```
1. Contract is pending or active
2. Client cancels → POST /api/contracts/:id/cancel { reason: '...' }
3. Contract status → 'cancelled', cancellationReason and cancelledAt set
```

---

**Last Updated:** December 17, 2025  
**Module Version:** 2.0 (Hardened)
