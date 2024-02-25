// components/Form.js
import React, { useState, useEffect } from 'react';

const Form = ({ onSubmit, onDataUpdate }) => {
  const [formData, setFormData] = useState({});
  const [existingData, setExistingData] = useState([]);

  useEffect(() => {
    // Fetch existing data when the component mounts
    fetchData();
  }, []); // Empty dependency array ensures this effect runs once on mount

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/get-data');
      const data = await response.json();
      console.log('Existing Data:', data);
      setExistingData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
      console.log('Form submitted successfully', data);

      // Trigger data update
      fetchData();
      onDataUpdate();

      // Reset form data
      setFormData({});
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
        {/* Your form fields here */}
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

      {/* Display existing data in a table */}
      <h2>Existing Data</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {existingData.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Form;
