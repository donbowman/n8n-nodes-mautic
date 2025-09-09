# Project Documentation Rules (Non-Obvious Only)

## Hidden Context & Organization
- **Counterintuitive Structure**: `nodes/n8n-nodes-mautic/` contains n8n node code, not Mautic application code
- **Description Files**: UI configuration separated into `*Description.ts` files (ContactDescription, CompanyDescription, etc.)
- **Generic Functions**: API utilities in `GenericFunctions.ts` with shared request logic

## Misleading Patterns
- **File Naming**: `*Description.ts` files contain UI field definitions, not API descriptions
- **Import Strategy**: Relative imports for description files, absolute imports for n8n-workflow types
- **Resource Organization**: Each Mautic resource (contacts, companies) has separate operation and field definitions

## Documentation Gaps
- **API Behavior**: Mautic API returns 200 status with error objects - not documented in standard API docs
- **Authentication**: Dual auth support (credentials + OAuth2) with conditional logic not clearly documented
- **Field Mapping**: Complex field mapping between n8n UI and Mautic API not explicitly documented

## Build Process Context
- **Gulp Usage**: Non-standard gulp for icon copying (most n8n nodes don't use gulp)
- **TypeScript Config**: Includes `package.json` in compilation - unusual for n8n nodes
- **Missing Files**: `.eslintrc.prepublish.js` referenced but doesn't exist