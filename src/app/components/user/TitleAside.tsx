import clsx from "clsx";

export default function TitleAside({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h3 className={clsx("title-24 text-accentColor font-semibold", className)}>
      {title}
    </h3>
  );
}
