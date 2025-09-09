import { MauticOAuth2RestApi } from '../../credentials/n8n-nodes-mautic/MauticOAuth2RestApi.credentials';

describe('MauticOAuth2RestApi Credentials', () => {
  let credentials: MauticOAuth2RestApi;

  beforeEach(() => {
    credentials = new MauticOAuth2RestApi();
  });

  describe('Basic Properties', () => {
    test('should have correct name', () => {
      expect(credentials.name).toBe('mauticOAuth2RestApi');
    });

    test('should have correct display name', () => {
      expect(credentials.displayName).toBe('Mautic OAuth2 Rest API');
    });

    test('should extend oAuth2Api', () => {
      expect(credentials.extends).toEqual(['oAuth2Api']);
    });

    test('should have documentation URL', () => {
      expect(credentials.documentationUrl).toBe('mautic');
    });
  });

  describe('Properties Configuration', () => {
    test('should have 7 properties', () => {
      expect(credentials.properties).toHaveLength(7);
    });

    test('should have grant type property', () => {
      const grantTypeProperty = credentials.properties.find(prop => prop.name === 'grantType');
      expect(grantTypeProperty).toBeDefined();
      expect(grantTypeProperty?.type).toBe('hidden');
      expect(grantTypeProperty?.default).toBe('authorizationCode');
    });

    test('should have URL property', () => {
      const urlProperty = credentials.properties.find(prop => prop.name === 'url');
      expect(urlProperty).toBeDefined();
      expect(urlProperty?.displayName).toBe('URL');
      expect(urlProperty?.type).toBe('string');
      expect(urlProperty?.placeholder).toBe('https://name.mautic.net');
    });

    test('should have authorization URL property', () => {
      const authUrlProperty = credentials.properties.find(prop => prop.name === 'authUrl');
      expect(authUrlProperty).toBeDefined();
      expect(authUrlProperty?.type).toBe('hidden');
      expect(authUrlProperty?.required).toBe(true);
      expect(authUrlProperty?.default).toContain('/oauth/v2/authorize');
    });

    test('should have access token URL property', () => {
      const accessTokenUrlProperty = credentials.properties.find(prop => prop.name === 'accessTokenUrl');
      expect(accessTokenUrlProperty).toBeDefined();
      expect(accessTokenUrlProperty?.type).toBe('hidden');
      expect(accessTokenUrlProperty?.required).toBe(true);
      expect(accessTokenUrlProperty?.default).toContain('/oauth/v2/token');
    });

    test('should have scope property', () => {
      const scopeProperty = credentials.properties.find(prop => prop.name === 'scope');
      expect(scopeProperty).toBeDefined();
      expect(scopeProperty?.type).toBe('hidden');
      expect(scopeProperty?.default).toBe('');
    });

    test('should have auth query parameters property', () => {
      const authQueryParamsProperty = credentials.properties.find(prop => prop.name === 'authQueryParameters');
      expect(authQueryParamsProperty).toBeDefined();
      expect(authQueryParamsProperty?.type).toBe('hidden');
      expect(authQueryParamsProperty?.default).toBe('');
    });

    test('should have authentication property', () => {
      const authProperty = credentials.properties.find(prop => prop.name === 'authentication');
      expect(authProperty).toBeDefined();
      expect(authProperty?.type).toBe('hidden');
      expect(authProperty?.default).toBe('body');
    });
  });

  describe('URL Construction', () => {
    test('should have authorization URL template', () => {
      const authUrlProperty = credentials.properties.find(prop => prop.name === 'authUrl');
      expect(authUrlProperty?.default).toContain('/oauth/v2/authorize');
      expect(authUrlProperty?.default).toContain('$self["url"]');
    });

    test('should have access token URL template', () => {
      const accessTokenUrlProperty = credentials.properties.find(prop => prop.name === 'accessTokenUrl');
      expect(accessTokenUrlProperty?.default).toContain('/oauth/v2/token');
      expect(accessTokenUrlProperty?.default).toContain('$self["url"]');
    });

    test('should handle URL trailing slash logic', () => {
      const authUrlProperty = credentials.properties.find(prop => prop.name === 'authUrl');
      const defaultValue = authUrlProperty?.default as string;

      // Check that the template includes the trailing slash handling
      expect(defaultValue).toContain('.endsWith("/")');
      expect(defaultValue).toContain('slice(0, -1)');
    });
  });

  describe('Default Values', () => {
    test('should have appropriate defaults for all properties', () => {
      credentials.properties.forEach(property => {
        if (property.name === 'url') {
          expect(property.default).toBe('');
        } else if (property.name === 'grantType') {
          expect(property.default).toBe('authorizationCode');
        } else if (property.name === 'authentication') {
          expect(property.default).toBe('body');
        } else {
          // Hidden properties should have defaults
          expect(property.default).toBeDefined();
        }
      });
    });
  });
});