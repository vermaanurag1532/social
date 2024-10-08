import classes from './Header.module.css';
import { useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [toggle, setToogle] = useState(false);

  return (
    <nav className={classes.nav}>
      <Link className={classes.logo} href="/" >
        <img src="/assets/Images/whileLogo.png" alt="While logo" />
      </Link>
      <div
        className={classes.hamburger}
        onClick={() => {
          setToogle(!toggle);
        }}
      >
        <div className={classes.line1}></div>
        <div className={classes.line2}></div>
        <div className={classes.line3}></div>
      </div>
      <ul className={clsx(classes.navlinks, toggle ? classes.open : '')}>
        <li className={clsx(toggle ? classes.fade : '')}>
          <Link className={classes.links} href="/" onClick={() => setToogle(!true)}>
            Home
          </Link>
        </li>
        <li className={clsx(toggle ? classes.fade : '')}>
          <Link className={classes.links} href="/#about" onClick={() => setToogle(!true)}>
            About Us
          </Link>
        </li>
        <li className={clsx(toggle ? classes.fade : '')}>
          <Link className={classes.links} href="/#features" onClick={() => setToogle(!true)}>
            Features
          </Link>
        </li>
        <li className={clsx(toggle ? classes.fade : '')}>
          <Link className={classes.links} href="/#goals" onClick={() => setToogle(!true)}>
            Goals
          </Link>
        </li>
        <li className={clsx(toggle ? classes.fade : '')}>
          <Link className={classes.joinbtn} href="/signin" onClick={() => setToogle(!true)}>
            SignIn
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
