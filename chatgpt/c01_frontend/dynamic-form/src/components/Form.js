// components/Form.js
import React, { useState } from 'react';
import FormFields from './FormFields';

const Form = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

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
    <form onSubmit={handleSubmit}>
      <FormFields formData={formData} onChange={handleChange} />
      <button type="submit">Submit Form</button>
    </form>
  );
};

export default Form;
