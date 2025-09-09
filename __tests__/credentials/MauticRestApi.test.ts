import { MauticRestApi } from '../../credentials/n8n-nodes-mautic/MauticRestApi.credentials';

describe('MauticRestApi Credentials', () => {
  let credentials: MauticRestApi;

  beforeEach(() => {
    credentials = new MauticRestApi();
  });

  describe('Basic Properties', () => {
    test('should have correct name', () => {
      expect(credentials.name).toBe('mauticRestApi');
    });

    test('should have correct display name', () => {
      expect(credentials.displayName).toBe('Mautic Rest API');
    });

    test('should have documentation URL', () => {
      expect(credentials.documentationUrl).toBe('mautic');
    });
  });

  describe('Properties Configuration', () => {
    test('should have 3 properties', () => {
      expect(credentials.properties).toHaveLength(3);
    });

    test('should have URL property', () => {
      const urlProperty = credentials.properties.find(prop => prop.name === 'url');
      expect(urlProperty).toBeDefined();
      expect(urlProperty?.displayName).toBe('URL');
      expect(urlProperty?.type).toBe('string');
      expect(urlProperty?.placeholder).toBe('https://name.mautic.net');
    });

    test('should have username property', () => {
      const usernameProperty = credentials.properties.find(prop => prop.name === 'username');
      expect(usernameProperty).toBeDefined();
      expect(usernameProperty?.displayName).toBe('Username');
      expect(usernameProperty?.type).toBe('string');
    });

    test('should have password property', () => {
      const passwordProperty = credentials.properties.find(prop => prop.name === 'password');
      expect(passwordProperty).toBeDefined();
      expect(passwordProperty?.displayName).toBe('Password');
      expect(passwordProperty?.type).toBe('string');
      expect(passwordProperty?.typeOptions?.password).toBe(true);
    });
  });

  describe('Authentication Configuration', () => {
    test('should have generic authentication type', () => {
      expect(credentials.authenticate.type).toBe('generic');
    });

    test('should have basic auth configuration', () => {
      expect(credentials.authenticate.properties.auth).toBeDefined();
      expect(credentials.authenticate.properties.auth!.username).toBe('={{$credentials.username}}');
      expect(credentials.authenticate.properties.auth!.password).toBe('={{$credentials.password}}');
    });
  });

  describe('Test Request Configuration', () => {
    test('should have test request configuration', () => {
      expect(credentials.test).toBeDefined();
      expect(credentials.test.request).toBeDefined();
    });

    test('should have correct baseURL with trailing slash removal', () => {
      expect(credentials.test.request.baseURL).toBe('={{$credentials.url.replace(new RegExp("/$"), "")}}');
    });

    test('should have correct test endpoint', () => {
      expect(credentials.test.request.url).toBe('/api/users/self');
    });
  });

  describe('Default Values', () => {
    test('should have empty defaults for all properties', () => {
      credentials.properties.forEach(property => {
        expect(property.default).toBe('');
      });
    });
  });
});