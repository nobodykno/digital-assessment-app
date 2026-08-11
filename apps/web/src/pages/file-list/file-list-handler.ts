import { http, HttpResponse } from 'msw';

const checkAuthorization = (request: Request) => {
  const authorization = request.headers.get('Authorization');

  return authorization === 'Bearer fake-test-token';
};

export const fileHandlers = [

  http.get('*/v1/api/files/count', ({ request }) => {
    if (!checkAuthorization(request)) {
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



  http.get('*/v1/api/files/:fileType', ({ request, params }) => {
    if (!checkAuthorization(request)) {
      return HttpResponse.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const fileType = params.fileType;

    return HttpResponse.json({
      message: 'Files fetched successfully',
      result: [
        {
          id: 1,
          name: `test-${fileType}.jpg`,
          mimeType: 'image/jpeg',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  }),



  http.get('*/v1/api/files/:fileId/status', ({ request, params }) => {
    if (!checkAuthorization(request)) {
      return HttpResponse.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      message: 'File status fetched successfully',
      status: 'completed',
    });
  }),



  http.get(
    '*/v1/api/files/:fileId/:quality/download/video',
    ({ request, params }) => {
      if (!checkAuthorization(request)) {
        return HttpResponse.json(
          {
            message: 'Unauthorized',
          },
          { status: 401 },
        );
      }
  
      return HttpResponse.json({
        message: 'Video download URL generated successfully',
        url: `http://localhost:9000/video-${params.quality}.mp4`,
      });
    },
  ),


  http.post('*/v1/api/files', async ({ request }) => {
    console.log('🔥 UPLOAD HANDLER CALLED');
  
    if (!checkAuthorization(request)) {
      return HttpResponse.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }
  
    const formData = await request.formData();
  
    const files = formData.getAll('files');
  
    console.log(
      '🔥 FILES RECEIVED:',
      files.length,
    );
  
    const result = files.map((file, index) => ({
      id: index + 1,
      name:
        file instanceof File
          ? file.name
          : `test-file-${index + 1}`,
      mimeType:
        file instanceof File
          ? file.type
          : 'image/jpeg',
    }));
  
    return HttpResponse.json({
      message: 'File uploaded successfully',
      result,
    });
  }),


  http.post('*/v1/api/files/upload/init', async ({ request }) => {
    if (!checkAuthorization(request)) {
      return HttpResponse.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      message: 'Upload initialized successfully',
      result: {
        fileId: 1,
        processingId: 1,
      },
    });
  }),



  http.put(
    '*/v1/api/files/:fileId/:processingId/:partNumber', async ({ request, params }) => {

  
      if (!checkAuthorization(request)) {
        return HttpResponse.json(
          { message: 'Unauthorized' },
          { status: 401 },
        );
      }

      return HttpResponse.json({
        message: 'Part uploaded successfully',
        result: {
          partNumber: Number(params.partNumber),
          etag: 'test-etag',
        },
      });
    },
  ),



  http.post(
    '*/v1/api/files/:fileId/:processingId/complete',
    async ({ request }) => {
      if (!checkAuthorization(request)) {
        return HttpResponse.json(
          {
            message: 'Unauthorized',
          },
          { status: 401 },
        );
      }

      return HttpResponse.json({
        message: 'Upload completed successfully',
        result: {
          success: true,
        },
      });
    },
  ),



  http.get('*/v1/api/files/:fileId/download', ({ request }) => {
    if (!checkAuthorization(request)) {
      return HttpResponse.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      message: 'File download URL generated successfully',
      result: {
        url: 'http://localhost:9000/test-file.jpg',
      },
    });
  }),



  http.get('*/v1/api/files/:fileId/video-status', ({ request }) => {
    if (!checkAuthorization(request)) {
      return HttpResponse.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      message: 'Video status fetched successfully',
      status: 'Completed',
    });
  }),


  http.delete(
    '*/v1/api/files/:fileId',
    ({ request, params }) => {
      if (!checkAuthorization(request)) {
        return HttpResponse.json(
          {
            message: 'Unauthorized',
          },
          { status: 401 },
        );
      }
  
      return HttpResponse.json({
        message: 'File deleted successfully',
        fileId: Number(params.fileId),
      });
    },
  ),


  http.get(
    '*/v1/api/files/:fileId/:quality/download/video',
    ({ request, params }) => {
      if (!checkAuthorization(request)) {
        return HttpResponse.json(
          {
            message: 'Unauthorized',
          },
          { status: 401 },
        );
      }
  
      return HttpResponse.json({
        message: 'Video download URL generated successfully',
        url: `http://localhost:9000/video-${params.quality}.mp4`,
      });
    },
  ),
];