// src/hooks/useNewArrivals.js
import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const useNewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/products?isNewArrival=true")
      .then(res => setNewArrivals(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { newArrivals, loading, error };
};

export default useNewArrivals;
