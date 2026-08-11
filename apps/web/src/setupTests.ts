
console.log('🔥 setupTests.ts LOADED');
import '@testing-library/jest-dom';

import {
  afterAll,
  afterEach,
  beforeAll,
} from 'vitest';

import { server } from './mocks/server';
console.log('🔥 setupTests loaded');
beforeAll(() => {
  console.log('🔥 MSW server starting');
  server.listen();
});

afterEach(() => {

  server.resetHandlers();
});

afterAll(() => {
  server.close();
});