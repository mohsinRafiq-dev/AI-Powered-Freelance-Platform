# Linkify Server Architecture

## 📁 Project Structure

```
server/
├── src/
│   ├── core/                      # Core utilities & infrastructure
│   │   ├── errors/               # Error handling
│   │   │   ├── AppError.js       # Custom error class
│   │   │   ├── errorHandler.js   # Global error middleware
│   │   │   └── index.js
│   │   ├── middlewares/          # Reusable middlewares
│   │   │   ├── auth.middleware.js    # Authentication & authorization
│   │   │   ├── validate.middleware.js # Request validation
│   │   │   └── index.js
│   │   └── utils/                # Utility functions
│   │       ├── asyncHandler.js   # Async error wrapper
│   │       ├── responseFormatter.js # Standard API responses
│   │       └── index.js
│   │
│   ├── modules/                   # Feature modules
│   │   ├── auth/                 # Authentication module
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── jobs/                 # Jobs module
│   │   │   ├── job.controller.js
│   │   │   ├── job.service.js
│   │   │   ├── job.routes.js
│   │   │   └── job.validation.js
│   │   │
│   │   ├── freelancer/           # Freelancer module
│   │   │   └── freelancer.service.js
│   │   │
│   │   └── shared/               # Shared module utilities
│   │       ├── dtos/             # Data Transfer Objects
│   │       │   ├── UserDTO.js
│   │       │   ├── JobDTO.js
│   │       │   └── index.js
│   │       └── services/         # Shared services
│   │           ├── TokenService.js
│   │           └── index.js
│   │
│   ├── models/                    # Mongoose models
│   │   ├── User.js
│   │   └── Job.js
│   │
│   ├── config/                    # Configuration files
│   │   ├── db.js                 # Database connection
│   │   └── passport.js           # Passport OAuth config
│   │
│   ├── app.js                     # Express app setup
│   ├── server.js                  # Server entry point
│   └── index.js
│
├── .env                           # Environment variables
├── .env.example                   # Example environment file
├── package.json
└── README.md
```

## 🏗️ Architecture Principles

### 1. Feature-Based Modular Design
- Each feature is self-contained within its module
- Clear separation of concerns (controller → service → model)
- Easy to scale and maintain

### 2. Layered Architecture

**Controller Layer** (`*.controller.js`)
- Handles HTTP requests/responses
- Uses `asyncHandler` for error handling
- Delegates business logic to services
- Returns formatted responses using response utilities

**Service Layer** (`*.service.js`)
- Contains all business logic
- Interacts with database models
- Throws `AppError` for predictable errors
- Reusable across different controllers

**Route Layer** (`*.routes.js`)
- Defines API endpoints
- Applies middleware (authentication, validation)
- Maps routes to controllers

**Validation Layer** (`*.validation.js`)
- Validates request data using Joi
- Applied as middleware before controllers

### 3. Core Infrastructure

**Error Handling**
- `AppError`: Custom error class for operational errors
- `errorHandler`: Global middleware that catches all errors
- Consistent error responses across the API

**Middlewares**
- `authenticate`: Verifies JWT token and attaches user to request
- `authorize(...roles)`: Restricts access based on user roles
- `validate(schema)`: Validates request data against Joi schemas
- `asyncHandler`: Wraps async functions to catch errors

**Utilities**
- `successResponse()`: Standard success response format
- `errorResponse()`: Standard error response format
- `paginatedResponse()`: Paginated data response format

**Shared Services**
- `TokenService`: JWT token generation and verification
- More services can be added as needed

**DTOs (Data Transfer Objects)**
- `UserDTO`: Formats user data for API responses (excludes sensitive info)
- `JobDTO`: Formats job data for API responses
- Ensures consistent data structure

## 🔄 Request Flow

```
Request
   ↓
Route (with middleware: validate, authenticate, authorize)
   ↓
Controller (wrapped in asyncHandler)
   ↓
Service (business logic, database operations)
   ↓
Model (Mongoose schema)
   ↓
Service (returns data or throws AppError)
   ↓
Controller (formats response using response utilities)
   ↓
Response (JSON with standard format)
```

## 📝 Usage Examples

### Creating a New Module

1. **Create module folder** under `src/modules/`
2. **Create files**:
   - `<module>.controller.js` - HTTP handlers
   - `<module>.service.js` - Business logic
   - `<module>.routes.js` - Route definitions
   - `<module>.validation.js` - Joi schemas

3. **Example Controller**:
```javascript
import { asyncHandler, successResponse } from '../../core/utils/index.js';
import myService from './my.service.js';

export const getItems = asyncHandler(async (req, res) => {
  const items = await myService.getAllItems();
  successResponse(res, { items }, 'Items retrieved successfully');
});
```

4. **Example Service**:
```javascript
import { AppError } from '../../core/errors/index.js';
import MyModel from '../../models/MyModel.js';

class MyService {
  async getAllItems() {
    const items = await MyModel.find();
    if (!items.length) {
      throw new AppError('No items found', 404);
    }
    return items;
  }
}

export default new MyService();
```

5. **Example Routes**:
```javascript
import express from 'express';
import { getItems } from './my.controller.js';
import { authenticate, authorize } from '../../core/middlewares/index.js';

const router = express.Router();

router.get('/', authenticate, getItems);

export default router;
```

### Using Middlewares

**Authentication**:
```javascript
router.get('/profile', authenticate, getProfile);
```

**Authorization**:
```javascript
router.post('/jobs', authenticate, authorize('client'), createJob);
```

**Validation**:
```javascript
router.post('/register', validate(registerSchema), register);
```

### Response Formats

**Success Response**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response**:
```json
{
  "success": false,
  "status": "error",
  "message": "Error description"
}
```

**Paginated Response**:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🚀 Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your values
```

3. **Run development server**:
```bash
npm run dev
```

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/linkify
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLIENT_URL=http://localhost:5174
```

## 📚 Best Practices

1. **Always use asyncHandler** for async route handlers
2. **Throw AppError** for predictable errors in services
3. **Use DTOs** to format data before sending responses
4. **Keep controllers thin** - delegate logic to services
5. **Use shared services** for reusable functionality
6. **Follow naming conventions**:
   - Controllers: `verbNoun` (e.g., `getJobs`, `createJob`)
   - Services: `verbNoun` (e.g., `getAllJobs`, `updateJob`)
   - Routes: RESTful conventions
7. **Document your code** with JSDoc comments
8. **Validate all inputs** using Joi schemas
9. **Use standard response formatters** for consistency

## 🛡️ Security

- JWT authentication with HTTP-only cookies
- Role-based authorization
- Input validation with Joi
- Secure password hashing with bcrypt
- Environment variables for sensitive data
- CORS configuration
- Session management

## 📊 Module Status

- ✅ Core infrastructure (errors, middlewares, utils)
- ✅ Shared module (DTOs, services)
- ✅ Auth module (updated to new architecture)
- ✅ Jobs module (updated to new architecture)
- 🔄 Freelancer module (in progress)
- 📋 Proposals module (planned)
- 📋 Messaging module (planned)
- 📋 Payments module (planned)
- 📋 Admin module (planned)

## 🎯 Next Steps

1. Update remaining modules to follow new architecture
2. Add comprehensive API documentation
3. Implement testing (unit & integration)
4. Add logging system
5. Implement rate limiting
6. Add API versioning

---

**Built with ❤️ for Linkify - Smart Freelancing Platform**
