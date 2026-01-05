import Link from "next/link";
import ErrorBlock from "./ErrorBlock";

export default function Breadcrumb({
  listBreadcrumb,
  className = "",
}: {
  listBreadcrumb: { name_page: string; url: string }[];
  className?: string;
}) {
  // cần làm lại
  const handleArrBreadcrumb = listBreadcrumb.flatMap((item, i) =>
    i < listBreadcrumb.length - 1
      ? [{ name_space: item.name_page, url: item.url }, { name_space: "/" }]
      : [{ name_space: item.name_page, url: item.url }]
  );
  console.log(handleArrBreadcrumb);
  return (
    <section className={`breadcrumb bg-[#F7F7F7] px-3 ${className}`}>
      <div className="container">
        <ul className="breadcrumb--list">
          {handleArrBreadcrumb.map((item) => (
            <li className="breadcrumb--list__item">
              {item.name_space.trim() === "/" ? (
                item.name_space
              ) : (
                <Link href={item.url!}>{item.name_space}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
