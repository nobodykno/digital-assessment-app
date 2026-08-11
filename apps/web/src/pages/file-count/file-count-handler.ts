import { http, HttpResponse } from 'msw';

export const fileCountHandlers = [
  http.get('*/v1/api/files/count', ({ request }) => {
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      return HttpResponse.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      message: 'File count fetched successfully',
      result: {
        images: 5,
        videos: 3,
        document: 2,
      },
    });
  }),
];