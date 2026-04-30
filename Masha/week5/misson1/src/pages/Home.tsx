import { Link } from "react-router-dom";

const Home = () => {
  const cardStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "#243044",
    padding: "42px 28px",
    borderRadius: "30px",
    boxShadow: "0 18px 40px rgba(20, 30, 48, 0.18)",
    transition: "0.2s",
    border: "3px solid rgba(255,255,255,0.7)",
    minHeight: "210px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "translateY(0) scale(1)";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #ffd6e8 0, transparent 28%), radial-gradient(circle at top right, #c7f9ff 0, transparent 30%), linear-gradient(135deg, #fef3c7, #dbeafe 45%, #ede9fe)",
        padding: "32px 24px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "980px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              color: "white",
              padding: "14px 26px",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            로그인
          </Link>
        </div>

        <p
          style={{
            display: "inline-block",
            padding: "10px 24px",
            borderRadius: "999px",
            backgroundColor: "rgba(255,255,255,0.8)",
            color: "#7c3aed",
            fontWeight: 800,
            margin: "40px 0 20px",
            fontSize: "18px",
          }}
        >
          즐거움의 시작!
        </p>

        <h1
          style={{
            fontSize: "64px",
            margin: "0 0 10px",
            color: "#111827",
            lineHeight: 1.1,
          }}
        >
          Soomflix
        </h1>

        <p style={{ fontSize: "22px", color: "#555", margin: 0 }}>
          무료는 누구나, 유료는 로그인 후 이용 가능
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(260px, 1fr))",
            gap: "30px",
            marginTop: "70px",
          }}
        >
          <Link
            to="/free"
            style={{ ...cardStyle, backgroundColor: "#fff" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={{ fontSize: "54px", lineHeight: 1 }}>🎬</div>
            <h2 style={{ fontSize: "30px", margin: 0, lineHeight: 1.2 }}>
              무료 영화
            </h2>
            <p style={{ fontSize: "18px", margin: 0, color: "#475569" }}>
              로그인 없이 감상
            </p>
          </Link>

          <Link
            to="/paid"
            style={{ ...cardStyle, backgroundColor: "#ffe08a" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={{ fontSize: "54px", lineHeight: 1 }}>💎</div>
            <h2 style={{ fontSize: "30px", margin: 0, lineHeight: 1.2 }}>
              유료 영화
            </h2>
            <p style={{ fontSize: "18px", margin: 0, color: "#475569" }}>
              로그인 후 이용
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;