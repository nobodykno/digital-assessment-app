
import useFileDelete from '../../hooks/useFileDelete';
import { DeleteButtonProps } from '../../props/video-delete-button-props';


const DeleteButton = (props: DeleteButtonProps) => {

  const { deleteFile } = useFileDelete();


  return (
    <button
      type="button"
      onClick={() => deleteFile(props.fileId, props.onDeleteSuccess)}
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
  );
};

export default DeleteButton;