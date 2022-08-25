import cn from 'classnames';
interface ProcessInfoTypes {
  label: string;
  value?: boolean;
  className?: string;
}

export default function ProcessInfo({
  label,
  value,
  className,
}: ProcessInfoTypes) {
  return (
    <div
      className={cn(
        'flex items-center justify-between dark:text-gray-300',
        className
      )}
    >
      <span className="font-medium"> ==> {label}</span>
      {/* <span>{value ? "SELECT" : "Command"}</span> */}
    </div>
  );
}
