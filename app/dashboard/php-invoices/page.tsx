'use client';
import { Invoice1, Customer1 } from '@/app/lib/definitions';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { CreateInvoice1, DeleteInvoice1 } from '@/app/ui/invoices/buttons';

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
    font-size: 14px;
  }

  th {
    background-color: #f2f2f2;
  }

  td {
    &:first-child {
      p {
        margin-bottom: 0;
        font-weight: bold;
      }
    }
  }

  button {
    margin-right: 5px;
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
  }
`;

const Home = () => {
  const [data, setData] = useState<(Customer1 & Invoice1)[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleDelete = (customerId: string) => {
    console.log(`顧客ID ${customerId} を削除します`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await fetch('http://localhost:8000/');
        const customerData: Customer1[] = await customerResponse.json();

        const invoiceResponse = await fetch('http://localhost:8000/custermer.php');
        const invoiceData: Invoice1[] = await invoiceResponse.json();

        const mergedData = customerData.map((customer) => {
          const relatedInvoice = invoiceData.find((invoice) => invoice.Customer_id === customer.Id);
          return { ...customer, ...relatedInvoice };
        });

        const sanitizedData = mergedData.map(item => ({
          ...item,
          Customer_id: String(item.Customer_id || ''),
          Amount: item.Amount || 0,
          Date: item.Date || '',
        }));

        setData(sanitizedData);
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = data
    .filter((item) => item.Amount > 0)
    .filter((item) => item.Name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Container>
      <h1>顧客データと請求書データ</h1>
      <SearchInput
        type="text"
        placeholder="名前で検索"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <CreateInvoice1 />
      
      <StyledTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.Id}>
              <td>
                <p>{item.Name}</p>
                {item.Image_url && (
                  <Image
                    src={item.Image_url}
                    alt={`Image for ${item.Name}`}
                    width={50}
                    height={50}
                  />
                )}
              </td>
              <td>{item.Email}</td>
              <td>{item.Amount}</td>
              <td>{item.Date}</td>
              <td>{item.Status}</td>
              <td>
                <button onClick={() => handleDelete(item.Customer_id)}>Edit</button>
                <DeleteInvoice1/>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </Container>
  );
};

export default Home;
