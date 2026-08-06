import { ProgressBarProps } from '../../props/progress-bar-props';

/**
 * 
 * @param props 
 * @returns progress bar props
 */
const ProgressBar = (props: ProgressBarProps)=>{

  if(props.progress===0){

    return null;

  }

  return (
    <div className="mt-3 w-full">
      <div
        role="progressbar"
        aria-label="Upload progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={props.progress}
        aria-valuetext={`${props.progress}% uploaded`}
        className="h-2 rounded bg-gray-200"
      >
        <div
          className="h-2 rounded bg-[var(--color-primary)] transition-all"
          style={{
            width: `${props.progress}%`,
          }}
        />
      </div>
  
      <p
        className="mt-1 text-sm"
        aria-live="polite"
      >
        {props.progress}%
      </p>
    </div>
  );

};

export default ProgressBar;