# Project Architecture Rules (Non-Obvious Only)

## Hidden Coupling & Dependencies
- **API Request Dependency**: All operations depend on `mauticApiRequest` and `mauticApiRequestAllItems` functions
- **Authentication Coupling**: Dual auth methods (credentials + OAuth2) share common URL construction logic
- **Load Method Dependencies**: Dynamic dropdowns depend on specific `loadOptionsMethod` implementations

## Architectural Constraints
- **Pagination Limit**: Hard-coded 30-item limit in `mauticApiRequestAllItems` function
- **Error Handling Pattern**: Custom error checking required due to Mautic's 200-status error responses
- **Field Structure**: Assumes `response.fields.all` structure from Mautic API responses

## Performance Considerations
- **API Rate Limits**: No built-in rate limiting - depends on Mautic instance configuration
- **Pagination Strategy**: Uses start-based pagination which may be inefficient for large datasets
- **Memory Usage**: `Object.values()` conversion may impact memory for large response sets

## Security Architecture
- **OAuth2 Implementation**: Uses `includeCredentialsOnRefreshOnBody: true` for token refresh
- **URL Sanitization**: Manual trailing slash removal required for base URLs
- **Parameter Validation**: JSON validation required for user-provided JSON parameters

## Scalability Patterns
- **Modular Operations**: Each resource separated into operations and fields for maintainability
- **Generic Functions**: Shared API utilities reduce code duplication
- **Type Safety**: Extensive TypeScript usage with n8n-workflow types