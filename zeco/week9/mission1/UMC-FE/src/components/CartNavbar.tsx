import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './CartNavbar.module.css';

export default function CartNavbar() {
  const { amount } = useSelector((state: any) => state.cart);

  return (
    <nav className={styles.navbar}>
      <Link to="/cart" className={styles.logo}>
        zeco
      </Link>
      <div className={styles.cartInfo}>
        <span>🛒</span>
        <span>{amount}</span>
      </div>
    </nav>
  );
}
