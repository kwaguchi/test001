'use client';
import { useState } from 'react';

const MyPage = () => {
  const [fetchedData, setFetchedData] = useState(null);

  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/');
      const data = await response.json();
      setFetchedData(data);
  
      
      console.log('取得したデータ:', data);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  };

  return (
    <div>
      <h1>My Page</h1>
      <button onClick={handleButtonClick}>ボタン</button>

      
      {fetchedData && (
        <div>
          <h2>取得したデータ</h2>
          <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MyPage;