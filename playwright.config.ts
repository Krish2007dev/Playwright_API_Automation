import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: [['html'], ['list']],
  workers: 1,
  retries: 0,

  use: {

    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'api-testing',
      testMatch: 'example*',
      dependencies: ['smoke-test'],
     
    },

    {
      name: 'smoke-test',
      testMatch: 'smoke*',
    },

  ],

});
