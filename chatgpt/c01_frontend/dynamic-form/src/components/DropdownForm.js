import React, { useState, useEffect } from 'react';
import optionsData from './optionsData';

const DropdownForm = ({ onSubmit }) => {
  const [firstOptions, setFirstOptions] = useState([]);
  const [secondOptions, setSecondOptions] = useState([]);
  const [selectedFirstOption, setSelectedFirstOption] = useState('');
  const [selectedSecondOption, setSelectedSecondOption] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await optionsData();
      if (data) {
        setFirstOptions(data.firstOptions);
        setSecondOptions(data.secondOptions[selectedFirstOption] || []);
      }
    };

    fetchData();
  }, [selectedFirstOption]);

  const handleFirstOptionChange = (e) => {
    setSelectedFirstOption(e.target.value);
    setSelectedSecondOption('');
  };

  const handleSecondOptionChange = (e) => {
    setSelectedSecondOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    const formData = {
      firstOption: selectedFirstOption,
      secondOption: selectedSecondOption,
    };
    onSubmit(formData);
  };

  return (
    <div>
      <h2>Dropdown Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstOption">Select first option:</label>
          <select
            id="firstOption"
            name="firstOption"
            value={selectedFirstOption}
            onChange={handleFirstOptionChange}
          >
            <option value="">Select</option>
            {firstOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {selectedFirstOption && (
          <div>
            <label htmlFor="secondOption">Select second option:</label>
            <select
              id="secondOption"
              name="secondOption"
              value={selectedSecondOption}
              onChange={handleSecondOptionChange}
            >
              <option value="">Select</option>
              {secondOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" disabled={!selectedFirstOption || !selectedSecondOption}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default DropdownForm;
