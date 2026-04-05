import { navigate } from "../router/navigate";

type Props = {
  id: string;
  addToCart: (item: { id: number; name: string; price: number }) => void;
};

export default function ProductDetail({ id, addToCart }: Props) {
  const productMap: Record<string, { name: string; price: number }> = {
    "1": { name: "아이폰", price: 1500000 },
    "2": { name: "맥북", price: 2200000 },
    "3": { name: "아이패드", price: 900000 },
    "4": { name: "매직키보드", price: 450000 },
  };

  const getImage = (id: string) => {
    switch (id) {
      case "1":
        return "/IPHONE.jpg";
      case "2":
        return "/MAC.png";
      case "3":
        return "/IPAD.png";
      case "4":
        return "/MAGICKEYBOARD.jpg";
      default:
        return "";
    }
  };

  const product = productMap[id];

  if (!product) return <div>상품이 없습니다.</div>;

  return (
    <div className="px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row">
        
        <div className="flex-1">
          <div className="aspect-square rounded-2xl bg-gray-100 p-8">
            <img
              src={getImage(id)}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="mt-4 text-xl text-gray-600">
            {product.price.toLocaleString()}원
          </p>

          <div className="mt-8 flex justify-center">
            <button
              className="rounded-xl bg-black px-6 py-3 text-white transition hover:opacity-80"
              onClick={() => {
                addToCart({
                  id: Number(id),
                  name: product.name,
                  price: product.price,
                });
                navigate("/cart");
              }}
            >
              장바구니 담기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}