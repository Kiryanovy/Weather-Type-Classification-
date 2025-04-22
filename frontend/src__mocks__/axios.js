// Mock para o axios
const axios = {
    defaults: {
      headers: {
        common: {}
      }
    },
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} }))
  };
  
  export default axios;
  