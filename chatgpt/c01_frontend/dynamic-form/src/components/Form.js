// components/Form.js
import React, { useState } from 'react';

const Form = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({ field: '' });
  const [response, setResponse] = useState(null);

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

      const responseData = await response.json();
      console.log(responseData);

      // Set the response state to display it in the UI
      setResponse(responseData);

      // Assuming onFormSubmit is a callback prop passed from App.js
      onFormSubmit();
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
          Form Field:
          <input
            type="text"
            name="field"
            value={formData.field}
            onChange={handleChange}
            placeholder="Enter a value"
          />
        </label>
        <button type="submit">Submit Form</button>
      </form>

      {response && (
        <div>
          <h2>Response from Server:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Form;
