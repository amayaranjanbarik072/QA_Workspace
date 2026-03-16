export type EnvName = 'qa' | 'uat' | 'prod';

export const ENV_CONFIG = {
  qa: {
    baseUrl: 'https://demo-tras.getapcs.com',
    credentials: {
      username: 'amaya@mail.com',
      password: 'amaya@123',
      unit: 'Bangalore',
    }
  },
  uat: {
    baseUrl: 'https://demo-tras.uat.getapcs.com',
    credentials: {
      username: 'amaya@mail.com',
      password: 'amaya@123',
      unit: 'Bangalore',
    }
  },
  prod: {
    baseUrl: 'https://demo-tras.getapcs.com',
    credentials: {
      username: 'amaya@mail.com',
      password: 'amaya@123',
      unit: 'Bangalore',
    }
  }
} as const;