import React from 'react';
import poemData from './poem.json';
import styles from './Poem.module.css'; // Import the CSS module with styles

function MyPoem({ title, poem, translation }) {
  return (
    <div className={styles.poemContainer}>
      <h1 className={styles.poemTitle}>{title}</h1>
      <div className={styles.poemContent}>
        <div className={styles.poemText}>
          <h2>Poem</h2>
          {poemData.poem.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div className={styles.poemTranslation}>
          <h2>Translation</h2>
          {poemData.translation.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyPoem;
