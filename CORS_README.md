# 🌐 CORS Configuration README

## Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Implementation Details](#implementation-details)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

This application implements comprehensive **Cross-Origin Resource Sharing (CORS)** support to enable secure communication for your Next.js frontend API routes and external clients.

### What is CORS?
CORS is a security feature implemented by web browsers that blocks requests from one domain to another unless explicitly allowed. Our implementation ensures your API can be accessed safely from authorized origins.

### Current Status
✅ **Fully Configured** - Next.js API routes have CORS enabled

## Quick Start

### 1. Development Setup
No additional setup required! CORS is automatically enabled for:
- Next.js API routes: `http://localhost:3000/api/*`

### 2. Production Setup
Update the allowed origins in `middleware.ts`:
```typescript
const ALLOWED_ORIGINS = [
  'https://yourdomain.com',        // Add your production domain
  'https://api.yourdomain.com',    // Add your API domain
  // Keep localhost for development
  'http://localhost:3000',
];
```

## Configuration

### 🔧 Current Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Allowed Origins** | `localhost:3000`, `27.111.72.61:4003`, `27.111.72.61.nip.io:4003` | Domains that can make requests |
| **Methods** | `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` | Allowed HTTP methods |
| **Headers** | `Content-Type`, `Authorization`, `X-Requested-With` | Allowed request headers |
| **Credentials** | `true` | Allows cookies and authentication |
| **Max Age** | `86400` (24 hours) | Preflight cache duration |

### 📁 Files Involved

```
├── middleware.ts              # Global CORS middleware
├── lib/cors.ts               # CORS utility functions
└── app/api/contact/route.ts  # Contact API with CORS
```

## Implementation Details

### 🌐 Next.js Implementation

#### Global Middleware Approach
Our `middleware.ts` automatically handles CORS for all API routes:

```typescript
// Automatically applied to all /api/* routes
export const config = {
  matcher: ['/api/:path*'],
};
```

#### Key Features:
- ✅ **Automatic preflight handling** - OPTIONS requests handled automatically
- ✅ **Origin validation** - Only allowed domains can make requests
- ✅ **Flexible configuration** - Easy to modify for different environments
- ✅ **Security-first** - No wildcards in production



## Usage Examples

### 1. Frontend API Calls
```javascript
// From your React components
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name, email, message }),
});
```

### 2. External API Calls
```javascript
// From external applications
const response = await fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'Test', email: 'test@example.com', message: 'Hello' }),
});
```



### 3. Custom CORS Configuration
```typescript
// Using the CORS utility for specific routes
import { withCors } from '@/lib/cors';

export const POST = withCors(async (request) => {
  // Your API logic
  return NextResponse.json({ success: true });
}, {
  origin: ['https://trusted-domain.com'],
  credentials: false,
});
```

## Testing

### 🧪 Manual Testing

#### Browser Console Test
```javascript
// Test CORS from browser console
fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data' })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('CORS Error:', error));
```

#### cURL Commands
```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v http://localhost:3000/api/contact

# Test actual request
curl -X POST \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}' \
  -v http://localhost:3000/api/contact
```

### ✅ Expected Responses
- **Preflight (OPTIONS)**: Status `200` with CORS headers
- **Actual Request**: Your API response with CORS headers included

## Deployment

### 🚀 Production Checklist

1. **Update Origins**
   ```typescript
   const ALLOWED_ORIGINS = [
     'https://yourproductiondomain.com',
     'https://api.yourproductiondomain.com',
     // Remove localhost origins in production
   ];
   ```

2. **Environment Variables**
   ```typescript
   const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production' 
     ? ['https://yourproductiondomain.com']
     : ['http://localhost:3000'];
   ```

3. **Security Review**
   - ✅ No wildcard origins (`*`) in production
   - ✅ Credentials only enabled if needed
   - ✅ Minimal required headers and methods
   - ✅ Regular review of allowed origins

### 🔒 Security Best Practices

| ✅ Do | ❌ Don't |
|--------|----------|
| Use specific origins | Use wildcard `*` in production |
| Enable credentials only if needed | Enable credentials by default |
| Regularly audit allowed origins | Add origins without review |
| Use HTTPS in production | Mix HTTP/HTTPS origins |

## Troubleshooting

### 🐛 Common Issues

#### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution**: Check if request origin matches allowed origins exactly
```typescript
// Debug in middleware.ts
console.log('Request Origin:', request.headers.get('origin'));
console.log('Allowed Origins:', ALLOWED_ORIGINS);
```

#### Issue: "CORS policy: Method 'POST' not allowed"
**Solution**: Ensure POST is in allowed methods and OPTIONS handler exists
```typescript
// Check API route has OPTIONS handler
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
```

#### Issue: "CORS policy: Credentials mode"
**Solution**: Ensure both client and server have credentials configured
```javascript
// Client side
fetch(url, { credentials: 'include' })

// Server side - already configured in middleware
```



### 📋 Debug Checklist

- [ ] Request origin matches allowed origins exactly
- [ ] HTTP method is in allowed methods list
- [ ] Required headers are in allowed headers list
- [ ] OPTIONS handler exists for POST/PUT/DELETE routes

- [ ] Browser cache cleared (for preflight changes)

### 🔍 Debug Headers

Add to `middleware.ts` for debugging:
```typescript
console.log('🔍 CORS Debug:', {
  origin: request.headers.get('origin'),
  method: request.method,
  pathname: request.nextUrl.pathname,
  allowedOrigin: isAllowedOrigin(request.headers.get('origin'))
});
```

## Support

### 📚 Additional Resources
- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)


### 🔧 Configuration Files
- **Global CORS**: `middleware.ts`
- **Utility Functions**: `lib/cors.ts`

---

**Status**: ✅ **CORS Fully Configured and Ready for Production**

Last Updated: $(date)
Version: 1.0.0 