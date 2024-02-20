'use client';
import React, { useState, useEffect } from 'react';
import { Customer1 } from '@/app/lib/definitions';

const Home = () => {
  const [data, setData] = useState<Customer1[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>顧客データ</h1>
    </div>
  );
};

export default Home;
