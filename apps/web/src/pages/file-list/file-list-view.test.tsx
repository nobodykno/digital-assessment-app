import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import FileListView from './file-list-view';

import FileUploader from '../../components/file-uploader/file-uploader';

import FileTable from '../../components/file/file-table';

import Pagination from '../../components/file/file-pagination';

vi.mock('../../components/file-uploader/file-uploader', () => ({
  default: vi.fn(() => <button>Upload</button>),
}));

vi.mock('../../components/file/file-table', () => ({
  default: vi.fn(() => <div>File Table</div>),
}));

vi.mock('../../components/file/file-pagination', () => ({
  default: vi.fn(() => <div>Pagination</div>),
}));


describe('FileListView', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });
 
  it('should render file type heading', () => {
    
    const props = {
      loading: false,

      files:[],

      search: 'name',

      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },

      fileType: 'image',
  
      error: 'New error',

      setSearch: vi.fn(),

      setPage: vi.fn(),

      refreshFiles: vi.fn(),

    };

    render(<FileListView {...props} />);

    expect(
      screen.getByRole('heading', { name: 'Image Files' }),
    ).toBeInTheDocument();
  });

  it('should render upload button', () => {
    const refreshFiles = vi.fn();
  
    
    const props = {
      loading: false,

      files:[],

      search: 'name',

      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },

      fileType: 'image',
  
      error: 'New error',

      setSearch: vi.fn(),

      setPage: vi.fn(),

      refreshFiles: vi.fn(),

    };
  
    render(<FileListView {...props} />);
    expect(
      screen.getByRole('button', { name: 'Upload' }),
    );
  });

  it('should pass props to FileUploader', () => {
    const refreshFiles = vi.fn();
    
    const props = {
      loading: false,

      files:[],

      search: 'name',

      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },

      fileType: 'image',
  
      error: 'New error',

      setSearch: vi.fn(),

      setPage: vi.fn(),

      refreshFiles: vi.fn(),

    };
  
    render(<FileListView {...props} />);
  
    const mockedFileUploader = vi.mocked(FileUploader);
  
    expect(mockedFileUploader.mock.calls[0][0]).toEqual({
      fileType: 'image',
      onUploadSuccess: refreshFiles,
    });
  });

  it('should pass props to Pagination', () => {
    const setPage = vi.fn();
    
    const props = {
      loading: false,

      files:[],

      search: 'name',

      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },

      fileType: 'image',
  
      error: 'New error',

      setSearch: vi.fn(),

      setPage: vi.fn(),

      refreshFiles: vi.fn(),

    };
  
    render(<FileListView {...props} />);
  
    const mockedPagination = vi.mocked(Pagination);
  
    expect(mockedPagination.mock.calls[0][0]).toEqual({
      pagination: props.pagination,
      onPageChange: setPage,
    });
  });


  it('should pass props to FileTable', () => {
    const refreshFiles = vi.fn();
    
    const props = {
      loading: false,

      files:[],

      search: 'name',

      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      },

      fileType: 'image',
  
      error: 'New error',

      setSearch: vi.fn(),

      setPage: vi.fn(),

      refreshFiles: vi.fn(),

    };
  
    render(<FileListView {...props} />);
  
    const mockedFileTable = vi.mocked(FileTable);
  
    expect(mockedFileTable.mock.calls[0][0]).toEqual({
      files: [],
      loading: false,
      fileType: 'image',
      refreshFiles,
    });
  });



});