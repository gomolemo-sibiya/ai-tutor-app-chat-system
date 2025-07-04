# Role-Based System Design for AI Tutor Platform

## System Overview

The AI Tutor Platform operates with three distinct roles, each with specific responsibilities and access controls:

### Role Definitions

#### 1. Admin Role
**Primary Responsibilities:**
- Centralized data management and oversight
- User account management (CRUD operations)
- File oversight and metadata validation
- System monitoring and maintenance
- Cross-role data accessibility

**Key Functions:**
- View/manage all users across roles
- Monitor file uploads and metadata
- Access comprehensive file registry
- System-wide data analytics
- User role assignment/modification

#### 2. Educator Role
**Primary Responsibilities:**
- Educational content creation and management
- File upload and metadata assignment
- Module-specific content organization
- Student progress monitoring (via files accessed)

**Key Functions:**
- Upload learning materials (documents, videos, audio, images)
- Assign metadata (module, content type, description)
- Manage personal file library
- View students associated with their modules
- Track file usage statistics

#### 3. Student Role
**Primary Responsibilities:**
- Access educational materials
- Independent chat management
- Learning activity tracking
- Module-specific content consumption

**Key Functions:**
- Browse files from associated educators
- Access materials by module enrollment
- Manage personal chat conversations independently
- Use AI tools for learning assistance
- No oversight on chat activities

## System Architecture

### Data Flow Design

```
┌─────────────┐    Upload Files    ┌─────────────┐    Centralized    ┌─────────────┐
│  Educator   │ ──────────────────→│   Admin     │ ←──────────────── │  Database   │
│             │                    │             │    Management     │             │
└─────────────┘                    └─────────────┘                   └─────────────┘
       │                                   │                                 │
       │ Module Association                │ User Management                 │
       │                                   │                                 │
       ▼                                   ▼                                 ▼
┌─────────────┐    Access Files    ┌─────────────┐    Independent    ┌─────────────┐
│   Student   │ ←──────────────────│   System    │ ──────────────────│    Chat     │
│             │                    │             │    Chat Mgmt      │   Service   │
└─────────────┘                    └─────────────┘                   └─────────────┘
```

### Access Control Matrix

| Role     | Users | Files | Chats | Modules | System Config |
|----------|-------|-------|-------|---------|---------------|
| Admin    | CRUD  | Read  | Read* | CRUD    | CRUD          |
| Educator | Read^ | CRUD+ | -     | Read    | -             |
| Student  | Read^ | Read# | CRUD  | Read    | -             |

**Legend:**
- CRUD: Create, Read, Update, Delete
- Read*: Admin can read all chats for oversight
- Read^: Only users within same modules
- CRUD+: Only own uploaded files
- Read#: Only files from associated educators
- -: No access

### Data Relationships

#### User-Module Association
```typescript
interface UserModuleRelation {
  userId: string;
  moduleCode: string;
  role: 'educator' | 'student';
  enrollmentDate: string;
  status: 'active' | 'inactive';
}
```

#### File-Educator-Student Flow
```typescript
interface FileAccessControl {
  fileId: string;
  educatorId: string;
  moduleCode: string;
  allowedStudents: string[];  // Based on module enrollment
  visibility: 'public' | 'module-only' | 'restricted';
}
```

## Implementation Strategy

### 1. Admin Centralized Data Management

**Enhanced Admin Dashboard:**
- Real-time file upload monitoring
- User enrollment tracking
- Module-file association matrix
- System usage analytics
- Data integrity validation

**Admin-Specific APIs:**
```typescript
// GET /api/admin/overview
interface AdminOverview {
  totalUsers: { educators: number; students: number; admins: number };
  totalFiles: number;
  moduleActivity: ModuleActivity[];
  recentUploads: FileItem[];
  systemHealth: SystemHealthMetrics;
}
```

### 2. Educator File Management Workflow

**File Upload Process:**
1. Educator selects file and metadata
2. System validates educator permissions for module
3. File stored with educator association
4. Metadata automatically assigned (educator ID, timestamp)
5. Admin notified of new upload
6. Students in module gain access

**Educator APIs:**
```typescript
// POST /api/educator/files/upload
interface FileUploadRequest {
  file: FormData;
  moduleCode: string;
  contentType: string;
  description: string;
  visibility: 'module-only' | 'restricted';
  targetStudents?: string[];  // For restricted files
}
```

### 3. Student Access and Independence

**Student File Access:**
- Automatic access to files from enrolled modules
- Browse by educator or module
- Filter by content type and date
- Download and view permissions

**Independent Chat Management:**
- Private chat history storage
- No admin/educator oversight
- Full CRUD operations on own chats
- Chat data isolated by student ID

**Student APIs:**
```typescript
// GET /api/student/files/available
interface StudentFileAccess {
  moduleFiles: ModuleFileGroup[];
  educatorFiles: EducatorFileGroup[];
  totalAccessibleFiles: number;
}

// POST /api/student/chat/create (Independent)
interface StudentChatRequest {
  queryType: 'general' | 'module';
  moduleCode?: string;
  title: string;
  initialMessage: string;
}
```

## Database Schema Enhancements

### Users Table Extensions
```sql
ALTER TABLE users ADD COLUMN 
  module_associations JSON,
  last_login TIMESTAMP,
  account_status ENUM('active', 'inactive', 'suspended'),
  created_by VARCHAR(255),  -- Admin who created account
  supervised_modules JSON   -- For educators
```

### Files Table Extensions
```sql
ALTER TABLE files ADD COLUMN
  educator_id VARCHAR(255) NOT NULL,
  access_control JSON,      -- Student access permissions
  download_count INT DEFAULT 0,
  last_accessed TIMESTAMP,
  approval_status ENUM('pending', 'approved', 'rejected'),
  approved_by VARCHAR(255)  -- Admin approval
```

### New: Student-Educator Associations
```sql
CREATE TABLE student_educator_associations (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  educator_id VARCHAR(255) NOT NULL,
  module_code VARCHAR(10) NOT NULL,
  association_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive') DEFAULT 'active'
);
```

## Security and Privacy

### Student Chat Independence
- Chat data encrypted per student
- No cross-student chat access
- Admin read-only for system monitoring
- Educator no access to student chats
- Chat data isolated in separate service

### File Access Security
- Module-based access control
- Educator ownership validation
- Student enrollment verification
- Download tracking and limits
- File integrity checking

### AWS Integration (Preserving Current URL)
- Chat service remains at: `https://ps30ghdj7f.execute-api.us-east-2.amazonaws.com/dev/chat`
- Additional services for file management
- DynamoDB for user/file metadata
- S3 for file storage with access policies

## Implementation Timeline

### Phase 1: Core Role Separation
- Enhanced user role validation
- Educator file ownership system
- Admin oversight dashboard
- Student access control implementation

### Phase 2: Advanced Features
- Real-time notification system
- File approval workflow
- Usage analytics and reporting
- Advanced search and filtering

### Phase 3: Optimization
- Performance enhancements
- Caching strategies
- Mobile responsiveness
- Advanced security features

This design ensures clear role boundaries while maintaining efficient data flow and user experience across all roles.
