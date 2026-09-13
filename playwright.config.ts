import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
 reporter: [['html', { open: 'never' }], ['list']],
  workers: 1,
  retries: 0,

  use: {

    trace: "retain-on-failure",
  },

  projects: [
    {
      name: 'api-testing',
      testDir: './tests/api-tests',
      //testMatch: 'example*',
      dependencies: [],
     
    },

    {
      name: 'ui-tests',
       testDir: './tests/ui-tests',
       use:{
        defaultBrowserType: 'chromium'
       }
    },

  ],

});
