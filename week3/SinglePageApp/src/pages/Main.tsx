import Product from "../components/Product";

export default function Main() {
  const products = [
    { id: 1, name: "아이폰", price: 1500000 },
    { id: 2, name: "맥북", price: 2200000 },
    { id: 3, name: "아이패드", price: 900000 },
    { id: 4, name: "매직키보드", price: 450000 },
  ];

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">상품 목록</h1>

      <div className="grid grid-cols-2 gap-6">
        {products.map((p) => (
          <Product key={p.id} id={p.id} name={p.name} price={p.price} />
        ))}
      </div>
    </div>
  );
}