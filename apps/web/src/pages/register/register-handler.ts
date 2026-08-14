import { http, HttpResponse } from 'msw';

export const loginHandlers = [
  http.post('/v1/api/register', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      message: 'Registration successful',
    });
  }),
];