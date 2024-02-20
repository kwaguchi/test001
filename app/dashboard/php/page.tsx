
'use client';
import { Customer1 } from '@/app/lib/definitions';
import  { useState, useEffect } from 'react';
import Image from 'next/image';

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
      <ul>
        {data.map((customerData) => (
          <li key={customerData.Id}>
            <p>ID: {customerData.Id}</p>
            <p>名前: {customerData.Name}</p>
            <p>メール: {customerData.Email}</p>
            {customerData.Image_url  ? (
              <Image
                src={customerData.Image_url }
                alt={`Image for ${customerData.Name}`}
                width={100} 
                height={100} 
              />
            ) : (
              <p>画像なし</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
