export default async function Product({
  params,
}: {
  params: { slug: string };
}) {
  // slug nếu có
  const { slug } = await params;
  return (
    <>
      <section className="section--product section-py">
        <div className="container">đây là all sản phẩm {slug}</div>
      </section>
    </>
  );
}
