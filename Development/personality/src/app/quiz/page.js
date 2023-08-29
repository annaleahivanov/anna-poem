'use client'
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import GetOpenAI from '../../utilities/getOpenAI';
import getAirtableData from '../../utilities/getAirtableData';

const HomePage = () => {
    const [processedData, setProcessedData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [submittedOptions, setSubmittedOptions] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const handleCardSelect = (questionId, option) => {
      setSelectedOptions((prevOptions) => ({
        ...prevOptions,
        [questionId]: option,
      }));
    };
    
    const getUnselectedOptions = (questionId) => {
      const selectedOption = selectedOptions[questionId];
      const options = processedData.find((record) => record.id === questionId)?.options || [];
      return options.filter((option) => option !== selectedOption);
    };
  
    const handleSubmit = async () => {
      setLoading(true);
    
      const pairedOptions = processedData.map((record) => ({
        selected: selectedOptions[record.id],
        notSelected: getUnselectedOptions(record.id)[0], // Assuming only 2 options per question
        text: selectedOptions[record.id],
      }));
    
      console.log('Paired Options:', pairedOptions);
      setSubmittedOptions(pairedOptions);
      setLoading(false);
    };
      
    useEffect(() => {
      async function fetchData() {
        try {
          const data = await getAirtableData();
          setProcessedData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  
      fetchData();
    }, []);
  
  return (
    <div className={styles.container}>
      <img src="/title.png" alt="Title Image" className={styles.titleImage} />

      {processedData.map((record) => (
  <div key={record.id}>
    <Card
      options={record.options} // Pass options from the record object
      selectedOption={selectedOptions[record.id]}
      onSelect={(option) => handleCardSelect(record.id, option)}
    />
  </div>
))}
      <button onClick={handleSubmit} className={styles.submitButton}>
        Submit
      </button>

      {submittedOptions.length > 0 && (
        <div className={styles.resultContainer}>
          <h3 className={styles.resultTitle}>Submitted Options:</h3>
          <div className={styles.generatedText}>
            {submittedOptions.map(({ selected, notSelected, text }, index) => (
              <p key={index}>
                You are more {selected ? text : notSelected} than {selected ? notSelected : text}
              </p>
            ))}
          </div>
        </div>
      )}

      {submittedOptions.length > 0 && (
        <div className={styles.resultContainer}>
          <h3 className={styles.resultTitle}>Generated Text:</h3>
          <div className={styles.generatedText}>
            <GetOpenAI
              pairedOptions={submittedOptions}
              selectedOptionsArray={Object.values(selectedOptions)}
              questions={processedData}
            />
          </div>
        </div>
      )}
    </div>
  );
};


const styles = {
    container: {
      backgroundColor: '#f3eef7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    title2: {
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    questionContainer: {
      marginBottom: '20px',
      textAlign: 'center',
    },
    question: {
      fontSize: '24px',
      marginBottom: '10px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    button: {
      padding: '16px 32px',
      fontSize: '18px',
      backgroundColor: '#5a00a7',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      margin: '0 10px',
      cursor: 'pointer',
    },
    titleImage: {
      width: '900px',
      height: 'auto',
      marginBottom: '20px',
    },
    submitButton: {
      padding: '12px 24px',
      fontSize: '18px',
      backgroundColor: '#333',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      marginTop: '20px',
      cursor: 'pointer',
    },
    resultContainer: {
      marginTop: '20px',
    },
    resultTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    generatedText: {
      fontSize: '18px',
      textAlign: 'left',
    },
    loadingContainer: {
      marginTop: '20px',
      textAlign: 'center',
    },
  };
  export default HomePage;