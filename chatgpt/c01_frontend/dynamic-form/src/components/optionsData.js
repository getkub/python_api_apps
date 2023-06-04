import options from './options.json';

const fetchOptionsData = async () => {
  try {
    return options;
  } catch (error) {
    console.error('Error fetching options data:', error);
    return null;
  }
};

export default fetchOptionsData;
