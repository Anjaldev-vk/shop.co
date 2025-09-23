// src/hooks/useNewArrivals.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useNewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/products?isNewArrival=true") // fetching only new arrivals
      .then(res => setNewArrivals(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { newArrivals, loading, error };
};

export default useNewArrivals;
