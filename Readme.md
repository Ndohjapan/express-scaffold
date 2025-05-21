# Node.js Express TypeScript Production-Ready Scaffold

A production-ready Express.js scaffold with TypeScript, featuring clean architecture, robust error handling, Redis caching, MongoDB integration, and comprehensive security features.

## 🚀 Features

### Architecture & Design
- 🏗️ Clean Architecture with proper separation of concerns
- 📁 Well-organized folder structure
- 🔄 Service Layer Pattern
- 📝 TypeScript for type safety

### Security Features
- 🛡️ Helmet.js for security headers
- 🔒 XSS Protection (xss-clean)
- 🚫 NoSQL Injection Prevention
- 🛑 Rate Limiting (IP-based and User-based)
- 🔐 CORS Configuration
- 🧹 Request Sanitization
- 🛡️ Parameter Pollution Prevention
- 📝 Request & Error Logging

### Database & Caching
- 📊 MongoDB Integration with Mongoose
- 💾 Redis Caching System
- 🔄 Connection Pool Management
- 📑 Mongoose Pagination Support

### Error Handling
- 🎯 Centralized Error Handling
- 🌐 Multi-language Support
- 🔍 Detailed Error Logging
- 📋 Request Logging

### Development Tools
- 🔧 ESLint Configuration
- 💅 Prettier Code Formatting
- 🧪 Jest Test Setup
- 🔄 Hot Reload for Development

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis
- TypeScript
- npm or yarn

## 🛠️ Quick Start

1. **Clone the template:**
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create the following .env files based on your environment:
   - `.env.development`
   - `.env.staging`
   - `.env.production`
   
   Example `.env.development`:
   ```env
   NODE_ENV=development
   PORT=8005
   DATABASE_URI=mongodb://127.0.0.1:27017/your-db-name
   REDIS_URL=redis://127.0.0.1:6379
   ROLLBAR_ACCESS_TOKEN=your-rollbar-token
   NO_CORS=true
   WHITELIST=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🏃‍♂️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run staging` - Run staging environment
- `npm run prod:local` - Run production environment locally
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app.ts              # Express app setup
├── server.ts           # Server initialization
├── config/            # Configuration files
│   └── env.ts         # Environment variables
├── connection/        # Database connections
│   ├── dbConn.ts     # MongoDB connection
│   ├── redisConn.ts  # Redis connection
│   └── loggingConn.ts # Logging setup
├── database/         # Database operations
│   ├── redisRepo.ts  # Redis operations
│   ├── dbRepo/      # MongoDB repositories
│   ├── dbService/   # Database services
│   └── models/      # Mongoose models
├── errors/          # Error handling
│   ├── errorHandler.ts
│   └── exceptions/
├── middlewares/     # Express middlewares
│   ├── errorLog.ts
│   └── requestLogs.ts
├── routes/         # API routes
├── services/       # Business logic
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## 🔒 Security Features

### Rate Limiting
- IP-based rate limiting
- User-based rate limiting
- Consecutive failed attempts tracking
- Customizable limits and durations

### Request Protection
- NoSQL injection prevention
- XSS protection
- Parameter pollution prevention
- Request size limits
- CORS configuration

## 💾 Caching System

The Redis caching system includes:

- Key-Value operations
- Hash operations
- Set operations
- List operations
- TTL support
- Automatic reconnection

## 🔍 Logging

### Request Logging
- HTTP version
- Headers (sanitized)
- Method
- URL
- Parameters
- Body (sanitized)
- IP address
- User ID (if authenticated)
- Device information

### Error Logging
- Error message
- Stack trace
- Request context
- User context
- Device information

## 🧪 Testing

Jest is configured for testing with:
- TypeScript support
- Watch mode
- File and test name filtering
- Separate test environment

## 🔄 Environment Management

Supports multiple environments:
- Development
- Staging
- Production
- Test

Each environment can have its own configuration file (`.env.{environment}`).

## 📚 Best Practices

1. **Error Handling**
   - Centralized error handling
   - Custom error classes
   - Proper error logging
   - Client-safe error messages

2. **Security**
   - Request sanitization
   - Rate limiting
   - Security headers
   - CORS configuration

3. **Performance**
   - Response compression
   - Redis caching
   - Connection pooling
   - Request size limits

4. **Code Quality**
   - TypeScript for type safety
   - ESLint for code quality
   - Prettier for formatting
   - Clean architecture

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the ISC License.
