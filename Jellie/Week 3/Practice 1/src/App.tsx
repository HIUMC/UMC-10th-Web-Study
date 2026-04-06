import { useEffect, useState } from 'react';
import Navbar from './Context/Navbar';
import JelliePage from './Context/JelliePage';
import './App.css';

function MungPage() {
  return (
    <section className="page">
      <h1 className="page__title">MUNG PAGE</h1>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="page">
      <h1 className="page__title">NOT FOUND</h1>
    </section>
  );
}

function getPathname() {
  return window.location.pathname;
}

function renderPage(pathname: string) {
  if (pathname === '/' || pathname === '/jellie') {
    return <JelliePage />;
  }

  if (pathname === '/mung') {
    return <MungPage />;
  }

  return <NotFoundPage />;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(getPathname());

  useEffect(function () {
    function handlePopState() {
      setCurrentPath(getPathname());
    }

    window.addEventListener('popstate', handlePopState);

    return function () {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  function handleNavigate(path: string) {
    if (currentPath === path) {
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
  }

  return (
    <div className="app">
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />
      <main className="app__content">{renderPage(currentPath)}</main>
    </div>
  );
}