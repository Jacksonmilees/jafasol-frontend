# 🏢 JafaSol Multi-Tenant Architecture

## Overview

JafaSol is designed as a **leasing system** that can serve multiple schools/organizations simultaneously. Each tenant (school) gets their own isolated database and environment.

## 🏗️ Architecture Design

### **Database-Per-Tenant Model**
- Each school gets its own MongoDB database: `jafasol_<tenantId>`
- Complete data isolation between tenants
- Scalable and secure approach
- Easy backup and restore per tenant

### **Tenant Identification Methods**

1. **Subdomain**: `school1.jafasol.com`
2. **Custom Header**: `X-Tenant-ID: school1`
3. **Query Parameter**: `?tenant=school1`
4. **JWT Token**: User's tenant ID in token
5. **Development Default**: `demo` tenant for local testing

## 📊 Database Structure

```
MongoDB Atlas Cluster
├── jafasol (System Database)
│   ├── tenants (Tenant management)
│   └── system_config (Global settings)
├── jafasol_school1 (Tenant Database)
│   ├── users
│   ├── students
│   ├── teachers
│   ├── classes
│   └── ... (all tenant data)
├── jafasol_school2 (Tenant Database)
│   └── ... (isolated data)
└── jafasol_school3 (Tenant Database)
    └── ... (isolated data)
```

## 🔧 Implementation Components

### **1. Multi-Tenant Manager**
- **File**: `backend/config/multiTenant.js`
- **Purpose**: Manages tenant connections and operations
- **Features**:
  - Dynamic database connection creation
  - Tenant lifecycle management
  - Database isolation

### **2. Tenant Middleware**
- **File**: `backend/middleware/tenant.js`
- **Purpose**: Identifies and validates tenants
- **Features**:
  - Multiple tenant identification methods
  - Tenant validation and status checking
  - Tenant-specific model creation

### **3. Tenant Management API**
- **File**: `backend/routes/tenants.js`
- **Purpose**: Admin operations for tenant management
- **Endpoints**:
  - `POST /api/tenants/create` - Create new tenant
  - `GET /api/tenants/list` - List all tenants
  - `GET /api/tenants/:tenantId` - Get tenant info
  - `PUT /api/tenants/:tenantId` - Update tenant
  - `DELETE /api/tenants/:tenantId` - Delete tenant
  - `GET /api/tenants/:tenantId/stats` - Get tenant statistics

## 🚀 Usage Examples

### **Creating a New School Tenant**

```bash
# Create new tenant
curl -X POST https://api.jafasol.com/api/tenants/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "tenantId": "st-marys",
    "name": "St. Mary's High School",
    "contactEmail": "admin@stmarys.edu",
    "contactPhone": "+1234567890",
    "domain": "stmarys.jafasol.com",
    "subscriptionPlan": "premium"
  }'
```

### **Accessing Tenant-Specific Data**

```bash
# Via subdomain
curl https://stmarys.jafasol.com/api/students

# Via header
curl https://api.jafasol.com/api/students \
  -H "X-Tenant-ID: st-marys"

# Via query parameter
curl https://api.jafasol.com/api/students?tenant=st-marys
```

## 🔐 Security Features

### **Data Isolation**
- ✅ Complete database separation
- ✅ No cross-tenant data access
- ✅ Tenant-specific connections
- ✅ Isolated user sessions

### **Access Control**
- ✅ Tenant validation on every request
- ✅ Status checking (active/inactive/suspended)
- ✅ Subscription plan enforcement
- ✅ Expiration date monitoring

## 📈 Scaling Benefits

### **Performance**
- ✅ Isolated database connections
- ✅ No cross-tenant query interference
- ✅ Independent scaling per tenant
- ✅ Dedicated resources per school

### **Management**
- ✅ Independent backups per tenant
- ✅ Easy tenant migration
- ✅ Granular monitoring
- ✅ Tenant-specific analytics

## 🛠️ Development Setup

### **1. Create Demo Tenant**
```javascript
const multiTenantManager = require('./config/multiTenant');

// Create demo tenant for development
await multiTenantManager.createTenant('demo', {
  name: 'Demo School',
  contactEmail: 'demo@jafasol.com',
  subscriptionPlan: 'basic'
});
```

### **2. Seed Demo Data**
```javascript
// Seed data for demo tenant
const connection = await multiTenantManager.getTenantConnection('demo');
// ... seed data into demo tenant database
```

### **3. Test Multi-Tenancy**
```bash
# Test with demo tenant
curl http://localhost:5000/api/students?tenant=demo

# Test with different tenant
curl http://localhost:5000/api/students?tenant=school2
```

## 🌐 Production Deployment

### **Domain Configuration**
```
# Main domain
jafasol.com

# Tenant subdomains
school1.jafasol.com
school2.jafasol.com
stmarys.jafasol.com
```

### **Environment Variables**
```bash
# MongoDB URI (supports multiple databases)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jafasol

# Tenant settings
DEFAULT_TENANT=demo
TENANT_IDENTIFICATION_METHODS=subdomain,header,query
```

## 📋 Tenant Lifecycle

### **1. Onboarding**
- Create tenant record
- Initialize database
- Seed default data
- Configure settings

### **2. Active Usage**
- Regular data operations
- User management
- Feature access based on plan

### **3. Monitoring**
- Usage statistics
- Performance metrics
- Storage monitoring

### **4. Offboarding**
- Data export
- Database cleanup
- Tenant deletion

## 🎯 Benefits for Leasing Model

### **For JafaSol (Provider)**
- ✅ Single codebase, multiple customers
- ✅ Easy onboarding of new schools
- ✅ Centralized management
- ✅ Scalable revenue model

### **For Schools (Tenants)**
- ✅ Isolated, secure environment
- ✅ Customizable settings
- ✅ Independent data management
- ✅ No interference from other schools

This architecture ensures that each school gets their own secure, isolated environment while allowing JafaSol to efficiently manage multiple customers from a single platform. 