type NavbarProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

export default function Navbar(props: NavbarProps) {
  function handleLinkClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) {
    event.preventDefault();
    props.onNavigate(path);
  }

  return (
    <header className="navbar">
      <nav className="navbar__nav">
        <a
          href="/jellie"
          className={
            props.currentPath === '/' || props.currentPath === '/jellie'
              ? 'navbar__link navbar__link--active'
              : 'navbar__link'
          }
          onClick={function (event) {
            handleLinkClick(event, '/jellie');
          }}
        >
          JELLIE
        </a>

        <a
          href="/mung"
          className={
            props.currentPath === '/mung'
              ? 'navbar__link navbar__link--active'
              : 'navbar__link'
          }
          onClick={function (event) {
            handleLinkClick(event, '/mung');
          }}
        >
          MUNG
        </a>

        <a
          href="/unknown"
          className={
            props.currentPath !== '/' &&
            props.currentPath !== '/jellie' &&
            props.currentPath !== '/mung'
              ? 'navbar__link navbar__link--active'
              : 'navbar__link'
          }
          onClick={function (event) {
            handleLinkClick(event, '/unknown');
          }}
        >
          NOT FOUND
        </a>
      </nav>
    </header>
  );
}