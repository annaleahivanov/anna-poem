import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
const openai = new OpenAI(
  {apiKey: process.env.OPENAI_KEY} // Replace with your API key
);


const GetOpenAI = ({ pairedOptions, questions }) => {
  const [generatedText, setGeneratedText] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prompt1 = `If someone identifies themselves as more ${pairedOptions
      .map(({ selected, notSelected }) => `${selected} than ${notSelected}`)
      .join(', ')}, what 10 highly specific fictional characters, each with their own distinctive personalities, can you think of that would get similar results from taking this quiz and stand out from the typical preferences of most other fictional characters (no explanations needed)?`;
    console.log('Prompt:', prompt1);
    async function generateText() {
        try {
          const response = await openai.completions.create({
              model: 'text-davinci-003',
              prompt: prompt1,
              max_tokens: 500,
            },
          );
        console.log(response)
        const generatedText = response.choices[0].text.trim().split('\n');
        setGeneratedText(generatedText);
      } catch (error) {
        console.error('Error generating GPT response:', error);
      } finally {
        setLoading(false);
      }
    }

    generateText();
  }, [pairedOptions]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        generatedText.map((line, index) => <p key={index}>{line}</p>)
      )}
    </div>
  );
};

export default GetOpenAI;
