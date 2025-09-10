import { MauticRest as Mautic } from '../../nodes/n8n-nodes-mautic/MauticRest.node';

// Mock the GenericFunctions module
jest.mock('../../nodes/n8n-nodes-mautic/GenericFunctions', () => ({
  mauticApiRequest: jest.fn(),
  mauticApiRequestAllItems: jest.fn(),
  validateJSON: jest.fn(),
}));

import { mauticApiRequest } from '../../nodes/n8n-nodes-mautic/GenericFunctions';

describe('MauticRest Node', () => {
  let node: Mautic;
  let mockContext: any;

  beforeEach(() => {
    node = new Mautic();
    mockContext = {
      getNodeParameter: jest.fn(),
      getInputData: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        url: 'https://test.mautic.net',
        username: 'testuser',
        password: 'testpass',
      }),
      helpers: {
        constructExecutionMetaData: jest.fn().mockReturnValue([{ json: {} }]),
        returnJsonArray: jest.fn(),
        requestWithAuthentication: jest.fn(),
        requestOAuth2: jest.fn(),
      },
      continueOnFail: jest.fn().mockReturnValue(false),
      getNode: jest.fn().mockReturnValue({ name: 'test-node' }),
    };

    // Note: mauticApiRequest is mocked in jest.setup.js
  });

  describe('Node Configuration', () => {
    test('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('MauticRest');
      expect(node.description.name).toBe('mautic');
      expect(node.description.version).toBe(1);
    });

    test('should have correct icon', () => {
      expect(node.description.icon).toBe('file:mautic.svg');
    });

    test('should have correct group', () => {
      expect(node.description.group).toEqual(['output']);
    });

    test('should have correct subtitle template', () => {
      expect(node.description.subtitle).toBe('={{$parameter["operation"] + ": " + $parameter["resource"]}}');
    });

    test('should have usableAsTool enabled', () => {
      expect(node.description.usableAsTool).toBe(true);
    });
  });

  describe('Credentials Configuration', () => {
    test('should have both credential types', () => {
      expect(node.description.credentials).toHaveLength(2);
    });

    test('should have Mautic API credentials', () => {
      const mauricCreds = node.description.credentials?.find(c => c.name === 'mauticRestApi');
      expect(mauricCreds).toBeDefined();
      expect(mauricCreds?.required).toBe(true);
    });

    test('should have OAuth2 credentials', () => {
      const oauthCreds = node.description.credentials?.find(c => c.name === 'mauticOAuth2Api');
      expect(oauthCreds).toBeDefined();
      expect(oauthCreds?.required).toBe(true);
    });
  });

  describe('Resource Configuration', () => {
    test('should have 6 resources', () => {
      const resourceProperty = node.description.properties.find(p => p.name === 'resource');
      expect(resourceProperty?.options).toHaveLength(6);
    });

    test('should have contact resource', () => {
      const resourceProperty = node.description.properties.find(p => p.name === 'resource');
      const contactOption = resourceProperty?.options?.find((opt: any) => opt.value === 'contact');
      expect(contactOption).toBeDefined();
      expect(contactOption?.name).toBe('Contact');
    });

    test('should have company resource', () => {
      const resourceProperty = node.description.properties.find(p => p.name === 'resource');
      const companyOption = resourceProperty?.options?.find((opt: any) => opt.value === 'company');
      expect(companyOption).toBeDefined();
      expect(companyOption?.name).toBe('Company');
    });
  });

  describe('Load Options Methods', () => {
    test('should have getCompanies method', () => {
      expect(node.methods?.loadOptions?.getCompanies).toBeDefined();
      expect(typeof node.methods.loadOptions.getCompanies).toBe('function');
    });

    test('should have getTags method', () => {
      expect(node.methods?.loadOptions?.getTags).toBeDefined();
      expect(typeof node.methods.loadOptions.getTags).toBe('function');
    });

    test('should have getSegments method', () => {
      expect(node.methods?.loadOptions?.getSegments).toBeDefined();
      expect(typeof node.methods.loadOptions.getSegments).toBe('function');
    });

    test('should have getCampaigns method', () => {
      expect(node.methods?.loadOptions?.getCampaigns).toBeDefined();
      expect(typeof node.methods.loadOptions.getCampaigns).toBe('function');
    });
  });

  describe('Execute Method - Contact Operations', () => {
    beforeEach(() => {
      mockContext.getInputData.mockReturnValue([{ json: {} }]);
      mockContext.getNodeParameter
        .mockImplementation((key: string) => {
          const params: Record<string, any> = {
            resource: 'contact',
            operation: 'get',
            contactId: '123',
          };
          return params[key];
        });
    });

    test('should handle contact get operation', async () => {
      // Mock the mauticApiRequest function
      (mauticApiRequest as jest.Mock).mockResolvedValue({
        contact: {
          id: 123,
          fields: { all: { email: 'test@example.com' } }
        }
      });

      // Mock the options parameter
      mockContext.getNodeParameter.mockImplementation((key: string) => {
        const params: Record<string, any> = {
          resource: 'contact',
          operation: 'get',
          contactId: '123',
          options: { rawData: false },
        };
        return params[key];
      });

      await node.execute.call(mockContext);

      expect(mockContext.getNodeParameter).toHaveBeenCalledWith('resource', 0);
      expect(mockContext.getNodeParameter).toHaveBeenCalledWith('operation', 0);
      expect(mockContext.helpers.constructExecutionMetaData).toHaveBeenCalled();
    });

    test('should handle contact create operation', async () => {
      mockContext.getNodeParameter.mockImplementation((key: string) => {
        const params: Record<string, any> = {
          resource: 'contact',
          operation: 'create',
          jsonParameters: false,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          additionalFields: {},
          options: { rawData: false },
        };
        return params[key];
      });

      (mauticApiRequest as jest.Mock).mockResolvedValue({
        contact: {
          id: 123,
          fields: { all: { email: 'test@example.com', firstname: 'John', lastname: 'Doe' } }
        }
      });

      await node.execute.call(mockContext);

      expect(mauticApiRequest).toHaveBeenCalledWith(
        'POST',
        '/contacts/new',
        expect.objectContaining({
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
        })
      );
    });
  });

  describe('Execute Method - Company Operations', () => {
    beforeEach(() => {
      mockContext.getInputData.mockReturnValue([{ json: {} }]);
      mockContext.getNodeParameter
        .mockImplementation((key: string) => {
          const params: Record<string, any> = {
            resource: 'company',
            operation: 'get',
            companyId: '456',
            simple: true,
          };
          return params[key];
        });
    });

    test('should handle company get operation', async () => {
      mockContext.getNodeParameter.mockImplementation((key: string) => {
        const params: Record<string, any> = {
          resource: 'company',
          operation: 'get',
          companyId: '456',
          simple: true,
        };
        return params[key];
      });

      (mauticApiRequest as jest.Mock).mockResolvedValue({
        company: {
          id: 456,
          fields: { all: { companyname: 'Test Company' } }
        }
      });

      await node.execute.call(mockContext);

      expect(mauticApiRequest).toHaveBeenCalledWith('GET', '/companies/456');
    });
  });

  describe('Execute Method - Error Handling', () => {
    test('should handle API errors when continueOnFail is false', async () => {
      mockContext.getInputData.mockReturnValue([{ json: {} }]);
      mockContext.getNodeParameter
        .mockImplementation((key: string) => {
          const params: Record<string, any> = {
            resource: 'contact',
            operation: 'get',
            contactId: '123',
            options: { rawData: false },
          };
          return params[key];
        });

      (mauticApiRequest as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(node.execute.call(mockContext)).rejects.toThrow();
    });

    test('should continue on error when continueOnFail is true', async () => {
      mockContext.continueOnFail.mockReturnValue(true);
      mockContext.getInputData.mockReturnValue([{ json: {} }]);
      mockContext.getNodeParameter
        .mockImplementation((key: string) => {
          const params: Record<string, any> = {
            resource: 'contact',
            operation: 'get',
            contactId: '123',
            options: { rawData: false },
          };
          return params[key];
        });

      (mauticApiRequest as jest.Mock).mockRejectedValue(new Error('API Error'));

      const result = await node.execute.call(mockContext);

      // Verify that the error was caught and the node continued execution
      expect(result).toBeDefined();
      expect(result[0]).toBeDefined();
    });
  });

  describe('Authentication Method Handling', () => {
    test('should handle credentials authentication method', async () => {
      mockContext.getInputData.mockReturnValue([{ json: {} }]);
      mockContext.getNodeParameter
        .mockImplementation((key: string) => {
          const params: Record<string, any> = {
            authentication: 'credentials',
            resource: 'contact',
            operation: 'get',
            contactId: '123',
            options: { rawData: false },
          };
          return params[key];
        });

      (mauticApiRequest as jest.Mock).mockResolvedValue({
        contact: {
          id: 123,
          fields: { all: { email: 'test@example.com' } }
        }
      });

      await node.execute.call(mockContext);

      expect(mauticApiRequest).toHaveBeenCalledWith('GET', '/contacts/123');
    });

    test('should handle OAuth2 authentication method', async () => {
      mockContext.getInputData.mockReturnValue([{ json: {} }]);
      mockContext.getNodeParameter
        .mockImplementation((key: string) => {
          const params: Record<string, any> = {
            authentication: 'oAuth2',
            resource: 'contact',
            operation: 'get',
            contactId: '123',
            options: { rawData: false },
          };
          return params[key];
        });

      (mauticApiRequest as jest.Mock).mockResolvedValue({
        contact: {
          id: 123,
          fields: { all: { email: 'test@example.com' } }
        }
      });

      await node.execute.call(mockContext);

      expect(mauticApiRequest).toHaveBeenCalledWith('GET', '/contacts/123');
    });
  });
});