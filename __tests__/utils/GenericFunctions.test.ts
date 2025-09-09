import { mauticApiRequest, mauticApiRequestAllItems, validateJSON } from '../../nodes/n8n-nodes-mautic/GenericFunctions';

describe('GenericFunctions', () => {
  const mockContext = {
    getNodeParameter: jest.fn(),
    getCredentials: jest.fn(),
    getNode: jest.fn().mockReturnValue({ name: 'test-node' }),
    helpers: {
      requestWithAuthentication: jest.fn(),
      requestOAuth2: jest.fn(),
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateJSON', () => {
    test('should return parsed JSON for valid JSON string', () => {
      const validJson = '{"key": "value", "number": 123}';
      const result = validateJSON(validJson);
      expect(result).toEqual({ key: 'value', number: 123 });
    });

    test('should return undefined for invalid JSON string', () => {
      const invalidJson = '{"key": "value", invalid}';
      const result = validateJSON(invalidJson);
      expect(result).toBeUndefined();
    });

    test('should return undefined for null input', () => {
      const result = validateJSON(null as any);
      expect(result).toBeUndefined();
    });

    test('should return undefined for undefined input', () => {
      const result = validateJSON(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('mauticApiRequest', () => {
    const baseUrl = 'https://test.mautic.net';
    const endpoint = '/api/contacts';
    const method = 'GET';

    beforeEach(() => {
      mockContext.getNodeParameter.mockReturnValue('credentials');
      mockContext.getCredentials.mockResolvedValue({
        url: baseUrl,
        username: 'testuser',
        password: 'testpass',
      });
      mockContext.helpers.requestWithAuthentication.mockResolvedValue({ success: true });
    });

    test('should construct correct URL without trailing slash', async () => {
      await mauticApiRequest.call(mockContext, method, endpoint);

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'mauticApi',
        expect.objectContaining({
          uri: `${baseUrl}/api${endpoint}`,
        })
      );
    });

    test('should handle URL with trailing slash', async () => {
      mockContext.getCredentials.mockResolvedValue({
        url: `${baseUrl}/`,
        username: 'testuser',
        password: 'testpass',
      });

      await mauticApiRequest.call(mockContext, method, endpoint);

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'mauticApi',
        expect.objectContaining({
          uri: `${baseUrl}/api${endpoint}`,
        })
      );
    });

    test('should include query parameters', async () => {
      const query = { limit: 10, search: 'test' };
      await mauticApiRequest.call(mockContext, method, endpoint, {}, query);

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'mauticApi',
        expect.objectContaining({
          qs: query,
        })
      );
    });

    test('should include body for POST requests', async () => {
      const body = { name: 'Test Contact' };
      await mauticApiRequest.call(mockContext, 'POST', endpoint, body);

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'mauticApi',
        expect.objectContaining({
          body,
          method: 'POST',
        })
      );
    });

    test('should use OAuth2 when authentication method is oAuth2', async () => {
      mockContext.getNodeParameter.mockReturnValue('oAuth2');
      mockContext.getCredentials.mockResolvedValue({
        url: baseUrl,
      });
      mockContext.helpers.requestOAuth2.mockResolvedValue({ success: true });

      await mauticApiRequest.call(mockContext, method, endpoint);

      expect(mockContext.helpers.requestOAuth2).toHaveBeenCalledWith(
        'mauticOAuth2RestApi',
        expect.any(Object),
        { includeCredentialsOnRefreshOnBody: true }
      );
    });

    test('should handle API errors', async () => {
      const errorResponse = { errors: [{ message: 'Invalid request' }] };
      mockContext.helpers.requestWithAuthentication.mockResolvedValue(errorResponse);

      await expect(mauticApiRequest.call(mockContext, method, endpoint))
        .rejects.toThrow('API Error');
    });

    test('should handle network errors', async () => {
      const networkError = new Error('Network timeout');
      mockContext.helpers.requestWithAuthentication.mockRejectedValue(networkError);

      await expect(mauticApiRequest.call(mockContext, method, endpoint))
        .rejects.toThrow('Network timeout');
    });
  });

  describe('mauticApiRequestAllItems', () => {
    const propertyName = 'contacts';
    const endpoint = '/api/contacts';

    beforeEach(() => {
      mockContext.getNodeParameter.mockReturnValue('credentials');
      mockContext.getCredentials.mockResolvedValue({
        url: 'https://test.mautic.net',
        username: 'testuser',
        password: 'testpass',
      });
    });

    test('should return all items across multiple pages', async () => {
      const mockResponse1 = {
        contacts: { item1: { id: 1 }, item2: { id: 2 } },
        total: 5,
      };
      const mockResponse2 = {
        contacts: { item3: { id: 3 }, item4: { id: 4 }, item5: { id: 5 } },
        total: 5,
      };

      mockContext.helpers.requestWithAuthentication
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const result = await mauticApiRequestAllItems.call(
        mockContext,
        propertyName,
        'GET',
        endpoint
      );

      expect(result).toHaveLength(5);
      expect(result).toEqual([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ]);
    });

    test('should handle single page response', async () => {
      const mockResponse = {
        contacts: { item1: { id: 1 }, item2: { id: 2 } },
        total: 2,
      };

      mockContext.helpers.requestWithAuthentication.mockResolvedValue(mockResponse);

      const result = await mauticApiRequestAllItems.call(
        mockContext,
        propertyName,
        'GET',
        endpoint
      );

      expect(result).toHaveLength(2);
      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledTimes(1);
    });

    test('should apply query parameters', async () => {
      const query = { search: 'test' };
      const mockResponse = {
        contacts: { item1: { id: 1 } },
        total: 1,
      };

      mockContext.helpers.requestWithAuthentication.mockResolvedValue(mockResponse);

      await mauticApiRequestAllItems.call(
        mockContext,
        propertyName,
        'GET',
        endpoint,
        {},
        query
      );

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'mauticApi',
        expect.objectContaining({
          qs: expect.objectContaining({ ...query, limit: 30 }),
        })
      );
    });

    test('should include body in requests', async () => {
      const body = { filter: 'active' };
      const mockResponse = {
        contacts: { item1: { id: 1 } },
        total: 1,
      };

      mockContext.helpers.requestWithAuthentication.mockResolvedValue(mockResponse);

      await mauticApiRequestAllItems.call(
        mockContext,
        propertyName,
        'POST',
        endpoint,
        body
      );

      expect(mockContext.helpers.requestWithAuthentication).toHaveBeenCalledWith(
        'mauticApi',
        expect.objectContaining({
          body,
          method: 'POST',
        })
      );
    });
  });
});