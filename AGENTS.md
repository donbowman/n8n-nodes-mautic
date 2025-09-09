# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build & Development

### Non-Standard Build Process
- **Icon handling**: Uses gulp to copy SVG/PNG icons from `nodes/**/` to `dist/` (not standard n8n pattern)
- **TypeScript compilation**: Includes `package.json` in compilation target (unusual)

### TypeScript Configuration
- **Catch variables**: `"useUnknownInCatchVariables": false` (non-standard, more permissive)
- **Lib includes**: Includes `es2022.error` in lib array (specific error types)
- **Target**: ES2019 with ES2020+ features enabled

## Code Patterns

### UI Configuration Patterns
- **Complex displayOptions**: Extensive use of nested conditional display logic with `/resource` and `/operation` paths
- **Collection types**: Heavy use of `fixedCollection` for structured data input (addresses, social media, custom fields)
- **Load methods**: Custom `loadOptionsMethod` functions for dynamic dropdowns (getCompanies, getTags, getStages, etc.)

### API Integration
- **Dual auth**: Supports both basic HTTP auth and OAuth2 with conditional logic
- **Error handling**: Custom error checking for Mautic API responses (checks `response.errors`)
- **Pagination**: Uses `mauticApiRequestAllItems` with 30-item limit and start-based pagination
- **Parameter conversion**: Converts camelCase to snake_case for certain API parameters (`orderBy`)

### Data Transformation
- **Response processing**: Uses `Object.values()` on API responses to convert object collections to arrays
- **Field extraction**: Accesses nested `fields.all` structure from Mautic API responses
- **JSON validation**: Custom `validateJSON` utility with try/catch error handling

## File Organization

### Separation of Concerns
- **Description files**: UI configuration separated into `*Description.ts` files (ContactDescription, CompanyDescription, etc.)
- **Generic functions**: API utilities in `GenericFunctions.ts` with shared request logic
- **Modular operations**: Each resource has separate operation and field definitions

### Import Patterns
- **Relative imports**: Uses relative paths for description files within same directory
- **Type imports**: Extensive use of `type` imports from `n8n-workflow`
- **Selective imports**: Imports specific functions from description files (`contactFields, contactOperations`)

## Testing & Quality

### Linting Rules
- **n8n-specific**: Uses `eslint-plugin-n8n-nodes-base` with custom rules
- **Parameter descriptions**: Special handling for boolean descriptions (eslint disable comments for certain patterns)

## Gotchas & Hidden Requirements

### API Behavior
- **Silent errors**: Mautic API can return 200 status with error objects in response body
- **URL construction**: Base URL handling requires trailing slash removal logic
- **Query parameters**: Some endpoints use query strings, others use path parameters

### UI Patterns
- **Conditional fields**: Many fields only appear based on `jsonParameters` boolean toggle
- **Nested collections**: Complex nested structure for address/social media/custom fields
- **Dynamic options**: Dropdowns populated via API calls with custom load methods

### Build Process
- **Missing files**: Package.json references `.eslintrc.prepublish.js` that doesn't exist
- **Icon copying**: Gulp task copies icons but only runs during build, not dev
