# ✅ CNIC Verification System - End-to-End Complete

## Overview
Complete CNIC (National ID Card) verification system for Pakistan users. Users submit CNIC images, admins review and approve/reject submissions.

---

## 🎯 System Flow

### User Side
1. User navigates to `/cnic/verify`
2. Uploads CNIC front image
3. Uploads CNIC back image
4. Submits both images together
5. Status changes to "Pending"
6. Waits for admin review

### Admin Side
1. Admin logs into admin portal at `/admin/dashboard`
2. Navigates to "CNIC Verification" at `/admin/cnic`
3. Views pending CNIC submissions
4. Clicks on a submission to view details
5. Approves with CNIC data OR Rejects with reason
6. User's CNIC status updated immediately

---

## 📂 File Structure

### Backend (Server)

#### API Routes: `/api/cnic/*`
**File**: `server/src/modules/cnic/cnic.routes.js`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/cnic/submit` | User | Submit CNIC with both images |
| GET | `/api/cnic/status` | User | Get my CNIC status |
| GET | `/api/cnic/admin/stats` | Admin | Get CNIC statistics |
| GET | `/api/cnic/admin/pending` | Admin | Get pending submissions |
| GET | `/api/cnic/admin/:userId` | Admin | Get specific user's CNIC |
| PUT | `/api/cnic/admin/:userId/approve` | Admin | Approve CNIC |
| PUT | `/api/cnic/admin/:userId/reject` | Admin | Reject CNIC |
| PUT | `/api/cnic/admin/:userId/reupload` | Admin | Request re-upload |

#### Service Layer
**File**: `server/src/modules/cnic/cnic.service.js`

**Functions**:
- `submitCNIC(userId, files)` - Process and save CNIC images
- `getMyCNICStatus(userId)` - Get user's CNIC status
- `getPendingCNICs(filters)` - Get pending submissions with pagination
- `getCNICDetails(userId)` - Get specific user's CNIC details
- `approveCNIC(userId, adminId, cnicData)` - Approve with extracted data
- `rejectCNIC(userId, adminId, reason)` - Reject with reason
- `requestReupload(userId, adminId, reason)` - Request better images
- `getCNICStats()` - Get count by status

#### Controller Layer
**File**: `server/src/modules/cnic/cnic.controller.js`

Handles HTTP requests/responses and calls service functions.

#### User Model CNIC Schema
**File**: `server/src/models/User.js`

```javascript
cnic: {
  number: String,           // Format: XXXXX-XXXXXXX-X
  fullName: String,         // Name on CNIC
  dateOfBirth: Date,        // DOB from CNIC
  issueDate: Date,          // Issue date
  expiryDate: Date,         // Expiry date
  frontImage: String,       // URL to front image
  backImage: String,        // URL to back image
  status: {
    type: String,
    enum: ['not_submitted', 'pending', 'under_review', 'verified', 'rejected', 'reupload_requested'],
    default: 'not_submitted'
  },
  rejectionReason: String,
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: ObjectId,     // Admin who reviewed
}
```

---

### Frontend (Client)

#### API Client
**File**: `client/src/api/cnicApi.js`

All CNIC API calls using axios:
- `submitCNIC(formData)` - Upload both images
- `getMyCNICStatus()` - Get user's status
- `getPendingCNICs(filters)` - Admin: Get pending list
- `getCNICDetails(userId)` - Admin: Get details
- `approveCNIC(userId, cnicData)` - Admin: Approve
- `rejectCNIC(userId, reason)` - Admin: Reject
- `requestReupload(userId, reason)` - Admin: Request reupload
- `getCNICStats()` - Admin: Get statistics

#### React Query Hooks
**File**: `client/src/features/auth/hooks/useCNICVerification.js`

- `useSubmitCNIC()` - Submit CNIC mutation
- `useCNICStatus()` - Get status query
- `usePendingCNICVerifications(filters)` - Admin: Get pending query
- `useApproveCNIC()` - Admin: Approve mutation
- `useRejectCNIC()` - Admin: Reject mutation

**File**: `client/src/hooks/admin/useCNICVerification.js`

- `usePendingCNICs(filters)` - Admin: Get pending CNICs
- `useCNICDetails(userId)` - Admin: Get user details
- `useApproveCNIC()` - Admin: Approve CNIC
- `useRejectCNIC()` - Admin: Reject CNIC
- `useRequestReupload()` - Admin: Request reupload
- `useCNICStats()` - Admin: Get statistics

#### User CNIC Submission Page
**File**: `client/src/features/auth/pages/CNICVerification.jsx`

**Route**: `/cnic/verify`

**Features**:
- Upload front image preview
- Upload back image preview
- Image validation (type, size)
- Submit both images together
- Status badges (Pending, Verified, Rejected)
- Rejection reason display
- Reupload on rejection

#### Admin CNIC Panel
**File**: `client/src/features/admin/cnic/CNICVerification.jsx`

**Route**: `/admin/cnic`

**Features**:
- Statistics cards by status
- Filterable table (status, search)
- Pagination
- View CNIC details modal
- Approve/Reject actions
- Request reupload

**File**: `client/src/features/admin/cnic/CNICDetailsModal.jsx`

Modal to view and approve/reject CNIC submissions.

---

## 🔧 Technical Implementation

### File Upload Configuration
**File**: `server/src/config/multer.js`

```javascript
export const uploadCNIC = multer({
  storage: multer.diskStorage({
    destination: 'uploads/cnic/',
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.random()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});
```

### Image Processing
**File**: `server/src/core/utils/imageProcessor.js`

Functions:
- `processCNICImage(imagePath)` - Optimize and compress image
- `deleteCNICImages(frontPath, backPath)` - Clean up old images

---

## 🚀 How to Test

### 1. User Submits CNIC

**Steps**:
1. Login as a regular user (client or freelancer)
2. Navigate to `/cnic/verify`
3. Click "Upload Front Image" → Select CNIC front image
4. Click "Upload Back Image" → Select CNIC back image
5. Click "Submit for Verification"
6. Should see success toast: "CNIC submitted successfully! Waiting for admin review."
7. Status should show "Pending Review" badge

**Expected API Call**:
```
POST /api/cnic/submit
Content-Type: multipart/form-data

FormData {
  frontImage: File,
  backImage: File
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "CNIC submitted successfully and is now pending admin review",
  "data": {
    "cnicStatus": "pending"
  }
}
```

---

### 2. Admin Views Pending CNICs

**Steps**:
1. Login as admin
2. Navigate to `/admin/dashboard`
3. Click "CNIC Verification" in sidebar
4. Should see pending submissions table
5. Statistics cards should show counts

**Expected API Call**:
```
GET /api/cnic/admin/pending?page=1&limit=20&status=pending
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "userId",
        "name": "John Doe",
        "email": "john@example.com",
        "cnic": {
          "status": "pending",
          "frontImage": "/uploads/cnic/front.jpg",
          "backImage": "/uploads/cnic/back.jpg",
          "submittedAt": "2025-12-16T10:00:00Z"
        }
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "pages": 1,
      "limit": 20
    }
  }
}
```

---

### 3. Admin Approves CNIC

**Steps**:
1. In admin CNIC panel, click on a pending submission
2. Modal opens showing CNIC images
3. Enter CNIC details:
   - CNIC Number: 12345-1234567-1
   - Full Name: John Doe
   - Date of Birth: 1990-01-01
   - Issue Date: 2020-01-01
   - Expiry Date: 2030-01-01
4. Click "Approve CNIC"
5. Should see success toast: "CNIC approved successfully! ✅"
6. User disappears from pending list
7. User's CNIC status updated to "verified"

**Expected API Call**:
```
PUT /api/cnic/admin/{userId}/approve

{
  "number": "12345-1234567-1",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-01",
  "issueDate": "2020-01-01",
  "expiryDate": "2030-01-01"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "CNIC approved successfully",
  "data": {
    "user": {
      "_id": "userId",
      "name": "John Doe",
      "cnic": {
        "status": "verified",
        "number": "12345-1234567-1",
        ...
      }
    }
  }
}
```

---

### 4. Admin Rejects CNIC

**Steps**:
1. In admin CNIC panel, click on a pending submission
2. Click "Reject" button
3. Enter rejection reason: "Images are blurry, please resubmit clear images"
4. Click "Reject CNIC"
5. Should see success toast: "CNIC rejected successfully."
6. User sees rejected status with reason

**Expected API Call**:
```
PUT /api/cnic/admin/{userId}/reject

{
  "reason": "Images are blurry, please resubmit clear images"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "CNIC rejected successfully",
  "data": {
    "user": {
      "_id": "userId",
      "cnic": {
        "status": "rejected",
        "rejectionReason": "Images are blurry, please resubmit clear images"
      }
    }
  }
}
```

---

### 5. User Resubmits After Rejection

**Steps**:
1. User logs in and goes to `/cnic/verify`
2. Sees "Rejected" badge with reason
3. Uploads new front and back images
4. Submits again
5. Status changes back to "Pending"
6. Old rejection reason cleared

---

## 🔐 Security & Validation

### Server-Side Validation

1. **File Type**: Only images allowed (jpg, png, jpeg)
2. **File Size**: Max 5MB per image
3. **Authentication**: JWT required for all endpoints
4. **Authorization**: 
   - Users can only submit/view their own CNIC
   - Admins need `VIEW_CNIC`, `VERIFY_CNIC`, `REJECT_CNIC` permissions
5. **Image Processing**: Images compressed and optimized
6. **Old Image Cleanup**: Previous images deleted on resubmission

### Client-Side Validation

1. **File Type Check**: Only image/* accepted
2. **File Size Check**: Max 5MB
3. **Image Preview**: Show preview before submission
4. **Form Validation**: Both images required before submit
5. **Status-Based Disabling**: Prevent resubmission if pending

---

## 📊 Database Indexes

```javascript
// User model indexes for efficient CNIC queries
userSchema.index({ 'cnic.number': 1 }, { sparse: true });
userSchema.index({ 'cnic.status': 1 });
userSchema.index({ role: 1, isActive: 1 });
```

---

## 🎨 UI States

### User Page Status Badges

| Status | Color | Icon | Description |
|--------|-------|------|-------------|
| not_submitted | Gray | AlertCircle | Not yet submitted |
| pending | Yellow | Clock | Awaiting admin review |
| under_review | Blue | Eye | Admin is reviewing |
| verified | Green | CheckCircle | Approved ✅ |
| rejected | Red | XCircle | Rejected with reason |
| reupload_requested | Orange | RefreshCw | Admin requested better images |

### Admin Panel Features

- **Statistics Cards**: Count by status
- **Filterable Table**: Filter by status, search by name/email
- **Pagination**: 20 items per page
- **Quick Actions**: Approve, Reject, Request Reupload
- **Image Viewer**: Full-size CNIC image modal
- **Audit Trail**: Track who approved/rejected and when

---

## 🐛 Troubleshooting

### Issue: "Please use /api/cnic/* routes for CNIC operations"

**Cause**: Old auth routes at `/api/auth/cnic/*` are deprecated.

**Solution**: Update frontend API calls to use `/api/cnic/*` instead.

**Fixed Files**:
- `client/src/features/auth/hooks/useCNICVerification.js` ✅
- Now imports from `cnicApi.js` instead of `endpoints/auth.js`

---

### Issue: Image Upload Fails

**Checks**:
1. File size < 5MB?
2. File type is image?
3. `uploads/cnic/` directory exists?
4. Proper permissions on uploads folder?

**Debug**:
```bash
# Check directory
ls -la uploads/cnic/

# Create if missing
mkdir -p uploads/cnic
chmod 755 uploads/cnic
```

---

### Issue: Admin Can't Approve CNIC

**Checks**:
1. Admin has `VERIFY_CNIC` permission?
2. CNIC data validation passing?
3. Check browser console for errors

**Verify Permissions**:
```javascript
// In admin user document
permissions: [
  'VIEW_CNIC',
  'VERIFY_CNIC',
  'REJECT_CNIC'
]
```

---

## ✅ Testing Checklist

### User Flow
- [ ] User can upload front image
- [ ] User can upload back image
- [ ] Preview shows correctly
- [ ] Submit button works
- [ ] Success toast appears
- [ ] Status changes to "Pending"
- [ ] Can't resubmit while pending
- [ ] Can resubmit after rejection

### Admin Flow
- [ ] Pending list loads correctly
- [ ] Statistics show correct counts
- [ ] Filter by status works
- [ ] Search works
- [ ] Pagination works
- [ ] Modal opens with CNIC images
- [ ] Approve saves data correctly
- [ ] Reject saves reason
- [ ] User status updates immediately
- [ ] Audit log created (if implemented)

### Edge Cases
- [ ] Upload non-image file (should fail)
- [ ] Upload file > 5MB (should fail)
- [ ] Submit without both images (should fail)
- [ ] Submit while already pending (should fail)
- [ ] Admin approves with invalid CNIC number (should fail)
- [ ] Concurrent admin actions handled

---

## 📝 API Documentation

### POST /api/cnic/submit
Submit CNIC for verification

**Auth**: Required (User)

**Body**: multipart/form-data
- `frontImage`: File (required, max 5MB)
- `backImage`: File (required, max 5MB)

**Response**: 201 Created
```json
{
  "success": true,
  "message": "CNIC submitted successfully",
  "data": {
    "message": "...",
    "cnicStatus": "pending"
  }
}
```

---

### GET /api/cnic/status
Get my CNIC status

**Auth**: Required (User)

**Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "cnic": {
      "status": "pending",
      "frontImage": "/uploads/cnic/...",
      "backImage": "/uploads/cnic/...",
      "submittedAt": "2025-12-16T10:00:00Z"
    }
  }
}
```

---

### GET /api/cnic/admin/pending
Get pending CNIC submissions

**Auth**: Required (Admin + VIEW_CNIC permission)

**Query Params**:
- `page`: Number (default: 1)
- `limit`: Number (default: 20)
- `status`: String (default: 'pending')
- `search`: String (optional)

**Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 3,
      "limit": 20
    }
  }
}
```

---

### PUT /api/cnic/admin/:userId/approve
Approve CNIC

**Auth**: Required (Admin + VERIFY_CNIC permission)

**Body**:
```json
{
  "number": "12345-1234567-1",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-01",
  "issueDate": "2020-01-01",
  "expiryDate": "2030-01-01"
}
```

**Response**: 200 OK

---

### PUT /api/cnic/admin/:userId/reject
Reject CNIC

**Auth**: Required (Admin + REJECT_CNIC permission)

**Body**:
```json
{
  "reason": "Images are not clear"
}
```

**Response**: 200 OK

---

## 🎉 Implementation Complete!

All CNIC verification features are implemented and ready for testing. The system provides a complete flow from user submission to admin approval/rejection.

**Key Features**:
✅ User uploads CNIC images  
✅ Admin reviews and approves/rejects  
✅ Proper permissions and security  
✅ Image optimization and storage  
✅ Status tracking and audit trail  
✅ Responsive UI with real-time updates  
✅ Comprehensive error handling  

**Next Steps**:
1. Test user submission flow
2. Test admin approval flow
3. Test admin rejection flow
4. Verify permissions work correctly
5. Check image storage and cleanup
