import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const useTopSelling = () => {
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/products?isTopSelling=true")
      .then(res => setTopSelling(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { topSelling, loading, error };
};

export default useTopSelling;