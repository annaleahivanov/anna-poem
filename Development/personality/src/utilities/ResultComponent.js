import React from 'react';

const ResultComponent = ({ loading, generatedText, pairedOptions }) => {
  return (
    <div style={{ ...styles.resultContainer, minHeight: `${generatedText.length * 24}px` }}>
      {loading ? (
        <div style={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
      ) : (
        generatedText && (
          <div style={{ ...styles.resultContainer, minHeight: `${generatedText.length * 24}px` }}>
            <h3 style={styles.resultTitle}>According to our results, you are most like:</h3>
            <div style={styles.generatedText}>
              {pairedOptions.map(({ selected, notSelected }, index) => (
                <p key={index}>
                  You are more {selected} than {notSelected}
                </p>
              ))}
              {generatedText.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

const styles = {
  // Your styles here
};

export default ResultComponent;
