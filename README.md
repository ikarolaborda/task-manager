# Task Manager Frontend

A beautiful and modern Angular 18 frontend application for the Task Manager API, [Nest Task Manager](https://github.com/ikarolaborda/nest-task-manager) built with Tailwind CSS and following Angular best practices.

## Features

🚀 **Modern Angular 18** with standalone components
🎨 **Beautiful UI** with Tailwind CSS and custom design system
🔐 **JWT Authentication** with protected routes
📱 **Responsive Design** that works on all devices
🔍 **Advanced Task Management** with filtering and search
✨ **Smooth Animations** and transitions
🎯 **TypeScript** for type safety
🧪 **Component-driven Architecture** with reusable UI components

## Architecture

### Project Structure

```
src/
├── app/
│   ├── features/           # Feature modules
│   │   ├── auth/          # Authentication components
│   │   └── tasks/         # Task management components
│   ├── shared/            # Shared components
│   │   └── components/    # Reusable UI components
│   ├── services/          # API services
│   ├── models/            # TypeScript interfaces
│   ├── guards/            # Route guards
│   ├── interceptors/      # HTTP interceptors
│   └── app.routes.ts      # Application routing
├── styles.scss            # Global styles
└── main.ts                # Application bootstrap
```

### Key Components

#### Shared Components
- **ButtonComponent**: Reusable button with multiple variants and states
- **InputComponent**: Form input with validation states and accessibility
- **CardComponent**: Flexible card container with customizable styling

#### Feature Components
- **LoginComponent**: User authentication with form validation
- **SignupComponent**: User registration with password strength validation
- **TaskListComponent**: Main dashboard with filtering and search
- **TaskCardComponent**: Individual task display with status management
- **TaskFormComponent**: Modal form for creating/editing tasks

## Authentication

The application implements JWT-based authentication with:
- **AuthService**: Manages authentication state and tokens
- **AuthGuard**: Protects routes requiring authentication
- **AuthInterceptor**: Automatically adds JWT tokens to API requests

## Styling

### Design System

The application uses a comprehensive design system with:
- **Color Palette**: Primary, secondary, success, warning, and error colors
- **Typography**: Inter font family with consistent sizing
- **Spacing**: Logical spacing scale for consistent layouts
- **Components**: Pre-built component styles for rapid development

### Tailwind CSS Configuration

Custom Tailwind configuration includes:
- Extended color palette
- Custom animations and keyframes
- Responsive breakpoints
- Custom spacing utilities

## API Integration

The frontend communicates with the NestJS backend API:
- **Base URL**: `http://localhost:3000`
- **Authentication**: JWT tokens via Authorization header
- **Endpoints**: RESTful API for users, tasks, and authentication

### Services

#### AuthService
```typescript
signUp(credentials: AuthCredentials): Observable<void>
signIn(credentials: AuthCredentials): Observable<AuthResponse>
signOut(): void
isAuthenticated(): boolean
getCurrentUser(): User | null
```

#### TasksService
```typescript
getTasks(filter?: TaskFilter): Observable<Task[]>
getTaskById(id: number): Observable<Task>
createTask(taskDto: CreateTaskDto): Observable<Task>
updateTaskStatus(id: number, status: TaskStatus): Observable<Task>
deleteTask(id: number): Observable<void>
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 18+
- Task Manager API running on port 3000

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   ng serve
   ```

3. **Open application**:
   Navigate to `http://localhost:4200`

### Building for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Development

### Code Style

The project follows Angular style guide and includes:
- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode
- Component-driven architecture

### Best Practices

- **Standalone Components**: Using Angular 18 standalone components
- **Reactive Forms**: Form validation and state management
- **RxJS**: Reactive programming for async operations
- **Type Safety**: Full TypeScript typing throughout
- **Error Handling**: Proper error states and user feedback
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: OnPush change detection and lazy loading

## Component Usage

### Button Component

```html
<app-button 
  variant="primary" 
  size="md" 
  [loading]="isLoading"
  (clicked)="handleClick()">
  Click me
</app-button>
```

### Input Component

```html
<app-input
  id="username"
  label="Username"
  placeholder="Enter username"
  [required]="true"
  formControlName="username"
  [errorMessage]="getFieldError('username')">
</app-input>
```

### Card Component

```html
<app-card title="Card Title" subtitle="Card subtitle">
  <!-- Card content -->
</app-card>
```

## Routing

The application uses Angular Router with:
- **Lazy Loading**: Feature modules loaded on demand
- **Route Guards**: Protected routes for authenticated users
- **Route Parameters**: Dynamic routing for task details

### Routes

- `/auth/login` - User login
- `/auth/signup` - User registration  
- `/tasks` - Main dashboard (protected)
- `/` - Redirects to tasks

## State Management

The application uses services for state management:
- **AuthService**: User authentication state
- **TasksService**: Task data and operations
- **BehaviorSubjects**: Reactive state updates

## Testing

Run unit tests:
```bash
ng test
```

Run e2e tests:
```bash
ng e2e
```

## Browser Support

The application supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the Angular style guide
2. Write unit tests for new components
3. Use TypeScript strict mode
4. Follow the existing component structure
5. Update documentation for new features

## License

This project is private and proprietary.
