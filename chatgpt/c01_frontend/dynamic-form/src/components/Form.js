// components/Form.js
import React, { useState } from 'react';
import FormFields from './FormFields'; // Import the FormFields component

const Form = ({ onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form data before submission:', formData); // Log the form data
    try {
      const response = await fetch('http://localhost:8000/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('API response:', data); // Log the API response

      // Assuming onSubmit is a callback prop passed from App.js
      onSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <FormFields formData={formData} setFormData={setFormData} />
      <button type="submit" className="btn btn-primary mt-3">
        Submit Form
      </button>
    </form>
  );
};

export default Form;
