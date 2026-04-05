type Props = {
  cart: {
    id: number;
    name: string;
    price: number;
  }[];
};

export default function Cart({ cart }: Props) {
  const getImage = (name: string) => {
    switch (name) {
      case "아이폰":
        return "/IPHONE.jpg";
      case "맥북":
        return "/MAC.png";
      case "아이패드":
        return "/IPAD.png";
      case "매직키보드":
        return "/MAGICKEYBOARD.jpg";
      default:
        return "";
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">장바구니</h1>

      <div className="space-y-4">
        {cart.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 rounded-xl bg-gray-100 p-4"
          >
            <img
              src={getImage(item.name)}
              className="h-20 w-20 object-contain"
            />

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                {item.price.toLocaleString()}원
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 총합 */}
      <div className="mt-8 border-t pt-4 text-right">
        <p className="text-lg font-bold">
          총합: {total.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}