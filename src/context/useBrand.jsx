import { useState, useEffect } from 'react';
import axios from 'axios';

const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/brands")
      .then(res => setBrands(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { brands, loading, error };
};

export default useBrands;
