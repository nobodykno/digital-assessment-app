import { Link } from 'react-router-dom';
import { IFileCountCardProps } from '../../props/file-count-card-props';

const FileCountCard = (props: IFileCountCardProps) => {
  return (
    <Link
      to={props.to}
      className="
        cursor-pointer
        rounded-[var(--border-radius)]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-6
        transition
        hover:shadow-md
      "
    >
      <h2 className="text-[var(--font-size-lg)] font-[var(--font-weight-semibold)]">
        {props.title}
      </h2>

      <p className="mt-3 text-[var(--font-size-title)] font-[var(--font-weight-bold)]">
        {props.count}
      </p>
    </Link>
  );
};

export default FileCountCard;