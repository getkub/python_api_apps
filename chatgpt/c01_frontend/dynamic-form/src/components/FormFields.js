// components/FormFields.js
import React from 'react';

const FormFields = ({ formData, setFormData }) => {
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <label>
        Name:
        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} />
      </label>
      <label>
        Email:
        <input type="text" name="email" value={formData.email || ''} onChange={handleChange} />
      </label>
      <label>
        Phone:
        <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} />
      </label>
    </div>
  );
};

export default FormFields;
