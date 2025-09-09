# Project Coding Rules (Non-Obvious Only)

## Custom Utilities & Patterns
- **API Request Pattern**: Always use `mauticApiRequest` or `mauticApiRequestAllItems` from `GenericFunctions.ts` - never direct HTTP calls
- **JSON Validation**: Use `validateJSON()` utility for all JSON parameter validation (prevents runtime errors)
- **Error Handling**: Check `response.errors` in API responses - Mautic returns 200 status with error objects
- **Pagination**: Use `mauticApiRequestAllItems` with 30-item limit for all list operations

## Data Transformation Rules
- **Response Processing**: Use `Object.values()` to convert Mautic's object collections to arrays
- **Field Access**: Always access `response.fields.all` for simplified data (not raw API structure)
- **Parameter Conversion**: Convert camelCase to snake_case for API parameters using `snakeCase()` utility
- **Date Formatting**: Use `new Date($value).toISOString().substr(0,10)` for date parameters

## UI Configuration Patterns
- **Display Options**: Use `/resource` and `/operation` paths for cross-field conditional logic
- **Collection Nesting**: Structure complex data using `fixedCollection` with `multipleValues: false`
- **Dynamic Dropdowns**: Implement `loadOptionsMethod` for API-populated select fields
- **JSON Toggle**: Use `jsonParameters` boolean to switch between form and JSON input modes

## Authentication Handling
- **Dual Auth Support**: Handle both `mauticApi` (credentials) and `mauticOAuth2Api` authentication methods
- **URL Construction**: Remove trailing slashes from base URLs before API calls
- **OAuth2 Flow**: Use `includeCredentialsOnRefreshOnBody: true` for OAuth2 requests

## File Organization
- **Separation Pattern**: Keep operations and fields in separate `*Description.ts` files
- **Import Strategy**: Use relative imports for description files, type imports from `n8n-workflow`
- **Modular Structure**: Group related functionality in dedicated description files