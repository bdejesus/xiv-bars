import React from 'react';
import styles from './styles.scss';

function Header() {
  return (
    <div className="container">
      <h1>XIV Bars</h1>
      <div className={styles.description}>
        <p>A Final Fantasy XIV W Cross HotBar (WXHB) Preview Tool.</p>
        <p>
          Simulate what your WXHB actions could look like when playing Final
          Fantasy XIV with a gamepad or controller. Use the Job selector to load
          actions for that class and Drag them into the hotbar slots below like
          you would in the game.
        </p>
      </div>
    </div>

  );
}

export default Header;
