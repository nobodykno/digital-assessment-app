import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import userEvent from '@testing-library/user-event';

import FileList from './file-list';
import { AuthProvider } from '../../context/auth-context';
import FileUploader from '../../components/file-uploader/file-uploader';
import DeleteButton from '../../components/file-delete-button/file-delete-button';
import DownloadButton from '../../components/file-download-button/download-button';
import VideoDownload from '../../components/video-download-button/video-download-button';

import service from '../../service';

vi.mock('../../service', async () => {
  const actual = await vi.importActual<typeof import('../../service')>(
    '../../service',
  );

  return {
    default: {
      ...actual.default,
      fileUploadService: {
        ...actual.default.fileUploadService,
        uploadFiles: vi.fn(),
      },
      fileService: {
        ...actual.default.fileService,
        getFileStatus: vi.fn(),
      },
    },
  };
});

describe('FileList integration', () => {
  beforeEach(() => {
    localStorage.setItem(
      'token',
      'fake-test-token',
    );
  });

  it('should load image files successfully', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/files/image']}>
          <Routes>
            <Route
              path="/files/:fileType"
              element={<FileList />}
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(
      await screen.findByRole('heading', {
        name: 'Image Files',
      }),
    ).toBeInTheDocument();
  });

  it('should upload an image successfully', async () => {
    const user = userEvent.setup();
    const onUploadSuccess = vi.fn();

    vi.mocked(
      service.fileUploadService.uploadFiles,
    ).mockResolvedValue({
      message: 'FIle uploaded successfully',
      result: [
        {
          id: 1,
          name: '',
          type: '',
          uploadedAt: ''
        },
      ],
    });

    vi.mocked(
      service.fileService.getFileStatus,
    ).mockResolvedValue({
      status: 'Completed',
      message: 'File processing completed',
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/files/image']}>
          <Routes>
            <Route
              path="/files/:fileType"
              element={
                <FileList
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    const file = new File(
      ['image content'],
      'test-image.jpg',
      {
        type: 'image/jpeg',
      },
    );

    const input = screen.getByLabelText(
      'Upload image files',
    );

    await user.upload(input, file);

    await waitFor(() => {
      expect(
        service.fileUploadService.uploadFiles,
      ).toHaveBeenCalled();
    });
  });

  it('should delete a file successfully', async () => {
    const user = userEvent.setup();
    const onDeleteSuccess = vi.fn();
  
    render(
      <AuthProvider>
        <DeleteButton
          fileId={1}
          onDeleteSuccess={onDeleteSuccess}
        />
      </AuthProvider>,
    );
  
    await user.click(
      screen.getByRole('button', {
        name: 'Delete file',
      }),
    );
  
    await user.click(
      await screen.findByRole('button', {
        name:'Delete',
      }),
    );
  
    await waitFor(() => {
      expect(onDeleteSuccess).toHaveBeenCalled();
    });
  });

  it('should download a file successfully', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'token',
      'fake-test-token',
    );

    vi.spyOn(
      HTMLAnchorElement.prototype,
      'click',
    ).mockImplementation(() => {});

    render(
      <DownloadButton
        fileId={1}
      />,
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Download',
      }),
    );
  });

  it('should initialize video upload successfully', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'token',
      'fake-test-token',
    );

    render(
      <FileUploader
        fileType="video"
        onUploadSuccess={vi.fn()}
      />,
    );

    const file = new File(
      ['video-content'],
      'test-video.mp4',
      {
        type: 'video/mp4',
      },
    );

    const input = screen.getByLabelText(
      'Upload video file',
    );

    await user.upload(input, file);

    await waitFor(() => {
      expect(
        screen.getByLabelText(
          'Upload video file',
        ),
      ).toBeInTheDocument();
    });
  });

  it('should download video successfully', async () => {
    localStorage.setItem(
      'token',
      'fake-test-token',
    );

    const token = localStorage.getItem('token');



    const response =
      await service.fileDownloadService.downloadVideo(
        1,
        '720p',
      );

    expect(response.url).toBe(
      'http://localhost:9000/video-720p.mp4',
    );
  });

  it('should upload a video part successfully', async () => {
    localStorage.setItem(
      'token',
      'fake-test-token',
    );

    const response =
      await service.fileUploadService.uploadPart({
        fileId: 1,
        processingId: 1,
        partNumber: 1,
        chunk: new ArrayBuffer(10),
      });

    expect(response).toEqual({
      message: 'Part uploaded successfully',
      result: {
        partNumber: 1,
        etag: 'test-etag',
      },
    });
  });

  it('should complete video upload successfully', async () => {
    localStorage.setItem(
      'token',
      'fake-test-token',
    );

    const response =
      await service.fileUploadService.completeUpload({
        fileId: 1,
        processingId: 1,
        parts: [
          {
            partNumber: 1,
            etag: 'test-etag',
          },
        ],
      });

    expect(response.message).toBe(
      'Upload completed successfully',
    );
  });
});