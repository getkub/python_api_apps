// components/Form.js
import React, { useState, useEffect } from 'react';

const Form = ({ onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [existingData, setExistingData] = useState([]);

  // Function to fetch existing data
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get-data');
      const data = await response.json();
      setExistingData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);

      // Assuming onSubmit is a callback prop passed from App.js
      onSubmit();

      // Fetch updated data after submission
      fetchData();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="text" name="email" onChange={handleChange} />
        </label>
        <label>
          Phone:
          <input type="text" name="phone" onChange={handleChange} />
        </label>
        <button type="submit">Submit Form</button>
      </form>

      <h2>Existing Data:</h2>
      <ul>
        {existingData.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Form;
