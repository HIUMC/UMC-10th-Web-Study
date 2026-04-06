import { navigate } from "../router/navigate";

export default function Header() {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        justifyContent: "flex-end",
      }}
    >
      <button onClick={() => navigate("/")}>상품목록</button>
      <button onClick={() => navigate("/cart")}>장바구니</button>
    </div>
  );
}