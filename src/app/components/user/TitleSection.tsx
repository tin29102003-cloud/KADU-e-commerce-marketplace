export default function TitleSection({ title }: { title: string }) {
  return (
    <h2 className="inline-block title-32 pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[45%] after:bg-accentColor after:h-[3.5px] after:clip-line-title">
      {title}
    </h2>
  );
}
