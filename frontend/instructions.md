# Frontend Code Review Guidelines & Best Practices

## Overview
This document outlines the code review standards and best practices for frontend development. Use this as a reference during code reviews to ensure consistency, quality, and maintainability across the application.

---

## 1. Code Organization & Structure

### Component Organization
- **Functional Components**: Always use functional components with React Hooks instead of class components
- **File Structure**: One component per file, organized in logical folders by feature
  ```
  src/
    components/
      common/
      features/
      layouts/
    pages/
    hooks/
    utils/
    services/
    types/
    styles/
  ```
- **Component Naming**: PascalCase for components (e.g., `UserCard.tsx`)
- **File Naming**: Same as component name or use `index.tsx` for default exports

### Naming Conventions
- Components: PascalCase (`Button`, `UserProfile`)
- Functions/Variables: camelCase (`handleClick`, `userData`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- CSS Classes: kebab-case (`.btn-primary`, `.user-card`)

---

## 2. TypeScript Best Practices

### Type Safety
- **Avoid `any`**: Always define proper types; use `unknown` if uncertain
- **Explicit Returns**: Specify return types for all functions
- **Interface over Type**: Use `interface` for object shapes, `type` for unions/primitives
- **Props Type Definition**:
  ```typescript
  interface UserCardProps {
    userId: string;
    isActive?: boolean;
    onSelect: (id: string) => void;
  }
  ```
- **Event Types**: Use specific event types (e.g., `React.MouseEvent<HTMLButtonElement>`)

### Generic Types
- Use generics for reusable components and utilities
- Define clear constraints on generics
- Document generic parameters with JSDoc

---

## 3. React Component Best Practices

### Hooks Usage
- **useEffect Dependencies**: Always include dependency array; avoid missing dependencies
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Hook Rules**: Only call hooks at the top level, not inside loops/conditions
- **useState Patterns**: Prefer state reducers for complex state management
- **useCallback/useMemo**: Use judiciously to prevent unnecessary re-renders, not for premature optimization

### Component Props
- **Prop Drilling**: Avoid excessive prop drilling; use Context API for deeply nested components
- **Spread Props**: Use spread operator for known prop patterns, but avoid blind spreading
- **Destructuring**: Destructure props at function parameters for clarity
- **Prop Defaults**: Use default values for optional props

### Rendering Patterns
- **Conditional Rendering**: Use ternary or logical operators, avoid inline functions
- **Lists**: Always use stable, unique keys (not array indices)
- **Fragment Usage**: Use `<>` fragments to avoid extra DOM nodes
- **Computed Values**: Don't compute values inside render; use useMemo or move to utils

---

## 4. Styling & CSS

### CSS Organization
- **Component-Scoped Styles**: Use CSS modules or styled-components for component isolation
- **Naming**: Use BEM (Block Element Modifier) for CSS classes
- **Responsive Design**: Mobile-first approach with Tailwind or media queries
- **Theme Consistency**: Centralize colors, spacing, and typography

### Tailwind (if used)
- Follow class ordering: Layout → Spacing → Sizing → Typography → Colors
- Avoid inline style attributes; use className exclusively
- Extract repeated utility patterns into components

---

## 5. State Management

### Best Practices
- **Prop vs State**: Only store mutable data in state; props for immutable data
- **State Scope**: Keep state as close as possible to where it's used
- **Global State**: Use Context API for global state; consider Redux only for complex flows
- **Avoid State Duplication**: Don't store derived data; compute it instead

### Performance
- **Memoization**: Use `React.memo()` for expensive child components
- **Virtual Rendering**: Implement virtualization for long lists (react-window, react-virtual)
- **Code Splitting**: Use dynamic imports for route-based code splitting

---

## 6. API Integration & Data Fetching

### Best Practices
- **Separation of Concerns**: Create service layer for API calls (e.g., `services/api.ts`)
- **Error Handling**: Always handle errors; show user-friendly messages
- **Loading States**: Display loading indicators during async operations
- **Caching**: Implement data caching to reduce API calls
- **Request/Response Types**: Define TypeScript interfaces for all API contracts
- **Timeout Handling**: Implement request timeouts and retry logic

### Example Pattern
```typescript
// services/userService.ts
export const fetchUser = async (userId: string): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};
```

---

## 7. Testing

### Coverage Requirements
- **Unit Tests**: Test utility functions and hooks (80%+ coverage)
- **Component Tests**: Test component behavior, not implementation details
- **Integration Tests**: Test component interactions and data flow
- **E2E Tests**: Critical user flows (login, payments, etc.)

### Testing Best Practices
- **Arrange-Act-Assert**: Follow AAA pattern
- **User-Centric**: Test from user perspective, not implementation
- **Mock External**: Mock API calls and external dependencies
- **Meaningful Names**: Test descriptions should describe expected behavior
- **Avoid Snapshot Tests**: Use specific assertions instead

### Tools
- Jest for unit/integration testing
- React Testing Library for component testing
- Cypress/Playwright for E2E testing

---

## 8. Error Handling

### Error Management
- **Try-Catch**: Use in async operations, not for control flow
- **Error Boundaries**: Implement for component-level error handling
- **User Feedback**: Display clear error messages to users
- **Logging**: Log errors for debugging (client-side or to service)
- **Graceful Degradation**: Fallbacks for failed operations

---

## 9. Performance Optimization

### Critical Areas
- **Bundle Size**: Monitor with webpack-bundle-analyzer
- **Image Optimization**: Use WebP format, lazy loading, proper sizing
- **Code Splitting**: Split by route and feature
- **Lazy Loading**: Defer non-critical resources
- **API Calls**: Batch requests, cache responses, debounce frequently called functions

### Metrics to Track
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

---

## 10. Accessibility (a11y)

### Requirements
- **Semantic HTML**: Use proper HTML elements (`<button>`, `<nav>`, `<main>`)
- **ARIA Attributes**: Add when semantic HTML isn't enough
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Color Contrast**: Minimum 4.5:1 for text (WCAG AA)
- **Alt Text**: Provide descriptive alt text for images
- **Focus Management**: Visual focus indicators, focus trapping in modals
- **Screen Readers**: Test with screen readers (NVDA, JAWS)

---

## 11. Security Best Practices

### Core Principles
- **Input Validation**: Validate and sanitize all user input
- **XSS Prevention**: Use React's built-in escaping; avoid `dangerouslySetInnerHTML`
- **CSRF Protection**: Include CSRF tokens in state-changing requests
- **Sensitive Data**: Never store secrets in frontend code
- **HTTPS Only**: Always use HTTPS in production
- **Dependency Audits**: Regular `npm audit` and update dependencies
- **Content Security Policy**: Implement CSP headers

---

## 12. Code Review Checklist

### Before Submitting PR
- [ ] Code follows naming conventions
- [ ] TypeScript strict mode compliant (no `any`)
- [ ] No console logs or debugger statements
- [ ] Tests written and passing
- [ ] No hardcoded values or API keys
- [ ] Responsive design tested
- [ ] Accessibility requirements met
- [ ] Performance impact assessed
- [ ] Error handling implemented
- [ ] Documentation updated if needed

### During Review
- [ ] Code is readable and maintainable
- [ ] No unnecessary complexity
- [ ] Performance considerations addressed
- [ ] Security implications reviewed
- [ ] Tests are comprehensive
- [ ] No breaking changes to public APIs
- [ ] Follows established patterns in codebase

---

## 13. Documentation

### Required Documentation
- **Inline Comments**: For complex logic, non-obvious intent
- **JSDoc**: For exported functions and components
- **README**: For features, setup instructions
- **TypeScript**: Interfaces with property descriptions
- **Storybook**: Interactive component documentation

### Example JSDoc
```typescript
/**
 * Fetches user data from the API
 * @param userId - The ID of the user to fetch
 * @returns Promise resolving to user data
 * @throws Error if user not found
 */
export const getUser = async (userId: string): Promise<User> => {
  // ...
};
```

---

## 14. Common Anti-Patterns to Avoid

- ❌ Mutating state directly
- ❌ Calling hooks conditionally
- ❌ Missing dependency arrays in useEffect
- ❌ Creating functions inside render
- ❌ Excessive prop drilling
- ❌ Using index as list key
- ❌ Not handling loading/error states
- ❌ Hardcoding API endpoints
- ❌ Large monolithic components
- ❌ Ignoring console warnings/errors

---

## 15. Tools & Linting

### Configuration
- **ESLint**: Enforce code quality standards
- **Prettier**: Auto-format code for consistency
- **TypeScript**: Strict mode enabled
- **Husky**: Pre-commit hooks for linting
- **Storybook**: Component documentation

### Pre-commit Validation
```bash
npm run lint       # ESLint check
npm run type-check # TypeScript check
npm run format     # Prettier format
npm test           # Run tests
```

---

## Quick Reference

| Aspect | Standard |
|--------|----------|
| Component Type | Functional with Hooks |
| TypeScript | Strict mode, no `any` |
| State Management | React Hooks + Context API |
| Styling | CSS Modules / Tailwind CSS |
| Testing | Jest + React Testing Library |
| Package Manager | npm |
| Code Formatting | Prettier |
| Linting | ESLint |

---

## Resources
- [React Official Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org)

---

*Last Updated: May 2026*
