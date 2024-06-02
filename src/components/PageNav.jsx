import { Link, NavLink } from 'react-router-dom';
import styles from './PageNav.module.css';

import Logo from './Logo';

function PageNav() {
  return (
    <div>
      <nav className={styles.nav}>
        <Link to="/">
          <Logo />
        </Link>

        <ul>
          <li>
            <NavLink to="/pricing">Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/product">Product</NavLink>
          </li>
          <li>
            <NavLink to="/login" className={styles.ctaLink}>Login</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default PageNav;
