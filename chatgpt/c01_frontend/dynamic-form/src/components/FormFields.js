// components/FormFields.js
import React from 'react';

const FormFields = ({ formData, onChange }) => {
  return (
    <>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={onChange} />
      </label>
      <br />
      <label>
        Email:
        <input type="text" name="email" value={formData.email} onChange={onChange} />
      </label>
      <br />
      <label>
        Phone:
        <input type="text" name="phone" value={formData.phone} onChange={onChange} />
      </label>
      <br />
    </>
  );
};

export default FormFields;
