# Project Debug Rules (Non-Obvious Only)

## Hidden Error Patterns
- **Silent API Errors**: Mautic API returns 200 status with error objects in response body - always check `response.errors`
- **OAuth2 Failures**: OAuth2 errors may not throw exceptions but return error objects in response
- **URL Construction**: Base URL trailing slash removal is critical - missing this causes silent failures

## Debugging Gotchas
- **Conditional Fields**: Many UI fields only appear based on `jsonParameters` boolean toggle
- **Load Methods**: Dynamic dropdowns fail silently if `loadOptionsMethod` functions throw errors
- **TypeScript Compilation**: `package.json` inclusion in tsconfig can cause unexpected compilation issues

## Testing Challenges
- **API Dependencies**: All tests require valid Mautic credentials and accessible instance
- **Pagination Logic**: `mauticApiRequestAllItems` may fail silently on large datasets
- **Authentication Switching**: Switching between credentials and OAuth2 requires complete restart

## Build Process Issues
- **Missing Lint Config**: `.eslintrc.prepublish.js` referenced in package.json but doesn't exist
- **Icon Copying**: Gulp icon copying only runs during build, not dev mode
- **TypeScript Target**: ES2019 target with ES2020+ features may cause compatibility issues