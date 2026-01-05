import clsx from "clsx";

export default function MessageBlock({
  content = "Hiện không có!",
  className,
}: {
  content?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "message--block px-6 py-9 bg-primaryColor rounded-md border border-bd-primary text-lg font-medium text-center text-accentColor",
        className
      )}
    >
      {content}
    </div>
  );
}
