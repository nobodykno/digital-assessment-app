import { http, HttpResponse } from 'msw';

export const loginHandlers = [
  http.post('*/v1/api/login', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      message: 'Login successful',
      token: 'fake-test-token',
    });
  }),

  http.post('/v1/api/register', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      message: 'Registration successful',
    });
  }),
];