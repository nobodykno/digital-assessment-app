import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import FileCount from './file-count';
import FileCountView from './file-count-view';
import useFile from './useFile';

vi.mock('./useFile', () => ({
  default: vi.fn(),
}));

vi.mock('./file-count-view', () => ({
  default: vi.fn(() => <div>File Count View</div>),
}));

describe('FileCount', () => {
  it('should pass folders and loading to FileCountView', () => {
    const folders = {
      message: 'File count fetched successfully',
      result: {
        images: 10,
        videos: 5,
        document: 3,
      },
    };
    

    vi.mocked(useFile).mockReturnValue({
      folders,
      loading: false,
    });

    render(<FileCount />);

    const mockedFileCountView = vi.mocked(FileCountView);

    expect(mockedFileCountView.mock.calls[0][0]).toEqual({
      folders,
      loading: false,
    });
  });
});