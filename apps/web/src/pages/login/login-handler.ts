import { http, HttpResponse } from 'msw';

export const loginHandlers = [
  http.post('*/v1/api/login', async ({ request }) => {
    const body = await request.json();
    console.log('🔥 MSW LOGIN HANDLER CALLED');
    console.log('LOGIN REQUEST:', body);

    return HttpResponse.json({
      message: 'Login successful',
      token: 'fake-test-token',
    });
  }),

  http.post('/v1/api/register', async ({ request }) => {
    const body = await request.json();

    console.log('REGISTER REQUEST:', body);

    return HttpResponse.json({
      message: 'Registration successful',
    });
  }),
];