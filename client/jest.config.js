export default {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/_test_/setup.unit.js'],
      testMatch: ['<rootDir>/src/_test_/unit/**/*.test.{js,jsx}'],
      collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.config.{js,jsx}',
        '!src/_test_/**',
        '!src/main.jsx',
        '!src/app/index.js',
        '!src/**/*.stories.{js,jsx}',
        '!src/**/index.js',
        '!src/__mocks__/**',
      ],
      coverageDirectory: 'coverage/unit',
      coverageReporters: ['text', 'lcov', 'html'],
      moduleFileExtensions: ['js', 'jsx', 'json'],
      testPathIgnorePatterns: ['/node_modules/'],
      transform: {
        '^.+\\.(js|jsx)$': ['babel-jest', { 
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            ['@babel/preset-react', { runtime: 'automatic' }]
          ],
          plugins: [
            ['./babel-plugin-transform-import-meta.cjs']
          ]
        }],
      },
      transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))'],
      moduleNameMapper: {
        // Mock modules that use import.meta.env - must come BEFORE @/ pattern
        '^@/app/config/envConfig$': '<rootDir>/src/__mocks__/envConfig.js',
        '^@/api/axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        '^@/utils/logger$': '<rootDir>/src/__mocks__/logger.js',
        '^@/utils/formatters$': '<rootDir>/src/__mocks__/formatters.js',
        // Relative path mocks - must match exact paths used in code
        '^../app/config/envConfig$': '<rootDir>/src/__mocks__/envConfig.js',
        '^../api/axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        '^./axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        // Match axiosInstance imports from api directory
        '^.*api/axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        // General patterns
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
    },
    {
      displayName: 'integration',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/_test_/setup.integration.js'],
      testMatch: ['<rootDir>/src/_test_/integration/**/*.test.{js,jsx}'],
      collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.config.{js,jsx}',
        '!src/_test_/**',
        '!src/main.jsx',
        '!src/app/index.js',
        '!src/**/*.stories.{js,jsx}',
        '!src/**/index.js',
        '!src/__mocks__/**',
      ],
      coverageDirectory: 'coverage/integration',
      coverageReporters: ['text', 'lcov', 'html'],
      moduleFileExtensions: ['js', 'jsx', 'json'],
      testPathIgnorePatterns: ['/node_modules/'],
      transform: {
        '^.+\\.(js|jsx)$': ['babel-jest', { 
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            ['@babel/preset-react', { runtime: 'automatic' }]
          ],
          plugins: [
            ['./babel-plugin-transform-import-meta.cjs']
          ]
        }],
      },
      transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))'],
      moduleNameMapper: {
        // Mock modules that use import.meta.env - must come BEFORE @/ pattern
        '^@/app/config/envConfig$': '<rootDir>/src/__mocks__/envConfig.js',
        '^@/api/axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        '^@/utils/logger$': '<rootDir>/src/__mocks__/logger.js',
        '^@/utils/formatters$': '<rootDir>/src/__mocks__/formatters.js',
        // Relative path mocks - must match exact paths used in code
        '^../app/config/envConfig$': '<rootDir>/src/__mocks__/envConfig.js',
        '^../api/axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        '^./axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        // Match axiosInstance imports from api directory
        '^.*api/axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        // General patterns
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
    },
    {
      displayName: 'e2e',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/_test_/setup.e2e.js'],
      testMatch: ['<rootDir>/src/_test_/e2e/**/*.test.{js,jsx}'],
      collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.config.{js,jsx}',
        '!src/_test_/**',
        '!src/main.jsx',
        '!src/app/index.js',
        '!src/**/*.stories.{js,jsx}',
        '!src/**/index.js',
        '!src/__mocks__/**',
      ],
      coverageDirectory: 'coverage/e2e',
      coverageReporters: ['text', 'lcov', 'html'],
      moduleFileExtensions: ['js', 'jsx', 'json'],
      testPathIgnorePatterns: ['/node_modules/'],
      transform: {
        '^.+\\.(js|jsx)$': ['babel-jest', { 
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            ['@babel/preset-react', { runtime: 'automatic' }]
          ],
          plugins: [
            ['./babel-plugin-transform-import-meta.cjs']
          ]
        }],
      },
      transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))'],
      moduleNameMapper: {
        // Mock modules that use import.meta.env - must come BEFORE @/ pattern
        '^@/app/config/envConfig$': '<rootDir>/src/__mocks__/envConfig.js',
        '^@/api/axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        '^@/utils/logger$': '<rootDir>/src/__mocks__/logger.js',
        '^@/utils/formatters$': '<rootDir>/src/__mocks__/formatters.js',
        // Relative path mocks - must match exact paths used in code
        '^../app/config/envConfig$': '<rootDir>/src/__mocks__/envConfig.js',
        '^../api/axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        '^./axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        // Match axiosInstance imports from api directory
        '^.*api/axiosInstance$': '<rootDir>/src/__mocks__/axiosInstance.js',
        // General patterns
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
    },
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};


