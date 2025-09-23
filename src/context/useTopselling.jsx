import { useState, useEffect } from 'react';
import axios from 'axios';

const useTopSelling = () => {
  const [topSelling, setTopSelling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/products?isTopSelling=true")
      .then(res => setTopSelling(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { topSelling, loading, error };
};

export default useTopSelling;