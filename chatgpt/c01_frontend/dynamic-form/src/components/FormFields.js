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
    <div className="form-fields">
      <div className="form-field">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
        />
      </div>
      <div className="form-field">
        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
        />
      </div>
      <div className="form-field">
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FormFields;
