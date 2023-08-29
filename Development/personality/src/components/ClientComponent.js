"use client"
import React, { useState, useEffect } from 'react';
import getAirtableData from '../utilities/getAirtableData';

const ClientComponent = (WrappedComponent) => (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAirtableData();
      setData(data);
    }
    fetchData();
  }, []);

  return <WrappedComponent data={data} {...props} />;
};

export default ClientComponent;