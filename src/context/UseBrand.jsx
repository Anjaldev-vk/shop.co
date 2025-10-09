import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/brands")
      .then(res => setBrands(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { brands, loading, error };
};

export default useBrands;
