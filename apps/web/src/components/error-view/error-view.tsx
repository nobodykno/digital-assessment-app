import { ErrorProps } from '../../props/error-props';


const ErrorView = (error: ErrorProps) =>{
  return (
    <div className="flex items-center justify-center p-6">
      <p
        className="text-center"
        style={{
          color: 'var(--color-text-primary)',
          fontSize: 'var(--font-size-md)',
          fontWeight: 'var(--font-weight-medium)',
        }}
      >
        {error.error}
      </p>
    </div>
  );
};


export default ErrorView;