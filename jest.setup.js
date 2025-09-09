// Jest setup file for n8n node testing
process.env.NODE_ENV = 'test';

// Mock change-case to avoid ES module issues
jest.mock('change-case', () => ({
  snakeCase: jest.fn((str) => str.replace(/([A-Z])/g, '_$1').toLowerCase()),
}));

// Mock n8n-workflow helpers
jest.mock('n8n-workflow', () => ({
  NodeConnectionType: {
    Main: 'main'
  },
  NodeApiError: class NodeApiError extends Error {
    constructor(node, error) {
      super(error.message || 'API Error');
      this.name = 'NodeApiError';
      this.node = node;
      this.cause = error;
    }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node, message, itemIndex) {
      super(message);
      this.name = 'NodeOperationError';
      this.node = node;
      this.itemIndex = itemIndex;
    }
  }
}));

// Global test utilities
global.testUtils = {
  createMockNode: () => ({
    name: 'test-node',
    type: 'test'
  }),

  createMockContext: () => ({
    getNodeParameter: jest.fn(),
    getInputData: jest.fn(),
    getCredentials: jest.fn(),
    helpers: {
      constructExecutionMetaData: jest.fn(),
      returnJsonArray: jest.fn(),
      requestWithAuthentication: jest.fn(),
      requestOAuth2: jest.fn()
    }
  })
};