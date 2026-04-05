import { useState, useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function getPage(path: string) {
  if (path === "/") return <Home />;
  if (path === "/about") return <About />;
  return <NotFound />;
}

function navigate(path: string) {
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  return (
    <div>
      <nav>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          홈
        </a>
        {" | "}
        <a
          href="/about"
          onClick={(e) => {
            e.preventDefault();
            navigate("/about");
          }}
        >
          어바웃
        </a>
      </nav>
      {getPage(path)}
    </div>
  );
}
