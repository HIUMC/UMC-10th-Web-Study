import { navigate } from "../router/navigate";

type Props = {
  id: number;
  name: string;
  price: number;
};

export default function Product({ id, name, price }: Props) {
  const getImage = () => {
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

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="cursor-pointer"
    >
      <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <img
          src={getImage()}
          alt={name}
          className="h-full w-full object-contain p-6"
        />
      </div>

      <div className="mt-3">
        <p className="text-base font-medium">{name}</p>
        <p className="mt-1 text-sm font-semibold text-gray-700">
          {price.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}