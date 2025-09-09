# n8n-nodes-mautic

[![n8n.io](https://img.shields.io/badge/Node%20Style-programmatic-ffa500)](https://docs.n8n.io/integrations/creating-nodes/build/programmatic-style-node/)
[![n8n.io](https://img.shields.io/badge/Node%20Version-1.0.0-blue)](https://docs.n8n.io/integrations/creating-nodes/build/programmatic-style-node/)

This is an n8n community node for [Mautic](https://mautic.org/), the world's largest open-source marketing automation platform. It provides comprehensive integration with Mautic's REST API, allowing you to automate marketing workflows, manage contacts, companies, campaigns, segments, and more.

## Prerequisites

- **n8n**: >= 1.0.0
- **Node.js**: >= 20.15.0

## Installation

### Via npm (recommended)

```bash
npm install n8n-nodes-mautic
```

### Manual Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Link the package:
   ```bash
   npm link
   ```

## Credentials

### Mautic API Credentials

To use this node, you need to set up authentication with your Mautic instance:

1. **Basic Authentication (Username/Password)**:
   - URL: Your Mautic instance URL (e.g., `https://your-mautic-instance.com`)
   - Username: Your Mautic username
   - Password: Your Mautic password

2. **OAuth2 Authentication**:
   - Configure OAuth2 credentials in your Mautic instance
   - Set up the OAuth2 flow in n8n

## Resources

This node provides access to the following Mautic resources:

### 📧 Contacts
- Create, update, get, and delete contacts
- Search contacts by email
- Send emails to individual contacts
- Manage contact points and DNC (Do Not Contact) lists

### 🏢 Companies
- Create, update, get, and delete companies
- Associate contacts with companies
- Manage company fields and custom data

### 🎯 Campaigns
- Add/remove contacts from campaigns
- Send campaign emails

### 👥 Segments
- Add/remove contacts from segments
- Send emails to entire segments

### 📧 Emails
- Send emails to segments or individual contacts
- Access campaign and template emails

## Operations

### Contacts
- **Create**: Create a new contact with custom fields
- **Update**: Update existing contact information
- **Get**: Retrieve contact details by ID
- **Get By Email**: Find contact by email address
- **Get All**: List all contacts with filtering options
- **Delete**: Remove a contact
- **Send Email**: Send an email to a specific contact
- **Edit Do Not Contact**: Add/remove from DNC list
- **Edit Contact Points**: Add or subtract contact points

### Companies
- **Create**: Create a new company
- **Update**: Update company information
- **Get**: Get company details
- **Get All**: List all companies
- **Delete**: Delete a company

### Company Contacts
- **Add**: Associate a contact with a company
- **Remove**: Remove contact from company

### Campaign Contacts
- **Add**: Add contact to a campaign
- **Remove**: Remove contact from campaign

### Contact Segments
- **Add**: Add contact to a segment
- **Remove**: Remove contact from segment

### Segment Emails
- **Send**: Send email to an entire segment

## Usage Examples

### Creating a Contact
```javascript
// Basic contact creation
{
  "email": "john.doe@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "company": "Example Corp"
}
```

### Sending Email to Segment
```javascript
// Send email to segment
{
  "segmentEmailId": "123",
  "additionalFields": {
    "tokens": {
      "contact.firstname": "John"
    }
  }
}
```

### Managing Campaigns
```javascript
// Add contact to campaign
{
  "contactId": "456",
  "campaignId": "789"
}
```

## Node Configuration

### Authentication
Choose between:
- **Credentials**: Basic HTTP authentication
- **OAuth2**: OAuth2 flow for enhanced security

### Additional Fields
Most operations support additional fields for extended functionality:
- Custom fields
- Address information
- Social media profiles
- Tags and stages

### Options
- **Raw Data**: Return raw API response instead of simplified data
- **Return All**: Retrieve all results (for list operations)
- **Limit**: Set result limit for list operations

## API Reference

This node integrates with Mautic's REST API. For detailed API documentation, visit:
- [Mautic Developer Documentation](https://developer.mautic.org/)
- [Mautic API Reference](https://developer.mautic.org/#rest-api)

## Development

### Building
```bash
npm run build
```

### Testing
```bash
npm run lint
npm run lintfix
```

### Local Development
```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Support

- [Mautic Community Forums](https://forum.mautic.org/)
- [n8n Community](https://community.n8n.io/)
- [GitHub Issues](https://github.com/Agilicus/n8n-nodes-mautic/issues)

## Changelog

### Version 0.1.0
- Initial release
- Support for all major Mautic resources
- Basic and OAuth2 authentication
- Comprehensive contact, company, and campaign management
- Email sending capabilities
- Segment management

---

Built with ❤️ for the Mautic and n8n communities.