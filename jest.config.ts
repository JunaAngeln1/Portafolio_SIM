import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        target: 'es2017',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'react-jsx',
        incremental: true,
        paths: { '@/*': ['./src/*'] },
      },
    }],
  },
  collectCoverageFrom: [
    'src/lib/**/*.{ts,tsx}',
    '!src/lib/types.ts',
    '!src/lib/quotationTypes.ts',
    '!src/lib/data.ts',
    '!src/lib/supabase-server.ts',
    '!src/lib/supabase-browser.ts',
  ],
};

export default config;
