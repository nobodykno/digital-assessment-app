import { useState } from 'react';
import useFileDelete from '../../hooks/useFileDelete';
import { DeleteButtonProps } from '../../props/video-delete-button-props';

const DeleteButton = (props: DeleteButtonProps) => {
  const { deleteFile } = useFileDelete();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteFile(props.fileId, props.onDeleteSuccess);
      setIsModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={isDeleting}
        aria-label="Delete file"
        className="
          rounded-[var(--border-radius)]
          border
          border-red-500
          px-3
          py-1
          text-red-500
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-red-500
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        Delete
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
          >
            <h2
              id="delete-dialog-title"
              className="text-lg font-semibold text-gray-900"
            >
              Delete file?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this file? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
                className="
                  rounded-[var(--border-radius)]
                  border
                  px-4
                  py-2
                  text-gray-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="
                  rounded-[var(--border-radius)]
                  bg-red-500
                  px-4
                  py-2
                  text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;