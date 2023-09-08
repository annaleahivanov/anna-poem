'use client'
import React, { useState, useEffect } from 'react';
import GetOpenAI from '../../utilities/getOpenAI';
import Card from '../../components/Card';
import getAirtableData from '../../utilities/getAirtableData';
import styles from '../global.css'

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
    const options =
      processedData.find((record) => record.id === questionId)?.options || [];
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
    <img src="/title.png" alt="Title Image" className={styles.titleImage}/>
      
      

      {processedData.map((record) => (
        <div key={record.id}>
          <Card
            options={record.options}
            selectedOption={selectedOptions[record.id]}
            onSelect={(option) => handleCardSelect(record.id, option)}
          />
        </div>
      ))}
     <div style={{ textAlign: 'center' }}>
      <button onClick={handleSubmit} className={styles.button}>
        Submit
      </button></div>

     {/*  {submittedOptions.length > 0 && (
        <div className={styles.resultContainer}>
          <h3 className={styles.resultTitle}>Loading...</h3>
          <div className={styles.generatedText}>
            <p> Based on your selected options, you are more... </p> */}
{/*             {submittedOptions.map(({ selected, notSelected, text }, index) => (
              <p key={index}>
                You are more {selected ? text : notSelected} than{' '}
                {selected ? notSelected : text}
              </p> */}
            
         {/*  </div>
        </div>
      )}
 */}
      {submittedOptions.length > 0 && (
        <div className={styles.resultContainer}>
          <h3>Based on your selections, you are most like:</h3>
          <div className={styles.generatedText}>
            <h4>
            <GetOpenAI
              pairedOptions={submittedOptions}
              selectedOptionsArray={Object.values(selectedOptions)}
              questions={processedData}
            />
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;