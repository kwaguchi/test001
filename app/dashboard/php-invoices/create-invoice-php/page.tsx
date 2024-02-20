'use client';
import React, { useState, useEffect } from 'react';
import { Customer1 } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

const CreateInvoice = () => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer1[]>([]);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const selectedCustomerId = customers.find(customer => customer.Name === selectedCustomer)?.Id;
  const updatedStatus = `${status} - ${year}-${month}-${day}`;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8000/customers');
        const jsonData = await response.json();
        setCustomers(jsonData);
      } catch (error) {
        console.error('顧客データの取得中にエラーが発生しました:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleCreateInvoice = async () => {
    try {
      setLoading(true);

      if (!selectedCustomer || !amount) {
        console.error('顧客と金額は必須');
        return;
      }

      const response = await fetch('http://localhost:8000/createInvoice.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          Customer_id: selectedCustomerId,
          amount,
          status: updatedStatus,
        }),
      });

      if (response.ok) {
        console.log('請求書が正常に作成されました！');
        setSelectedCustomer('');
        setAmount('');
        setStatus('pending');
      } else {
        console.error('請求書の作成に失敗しました。サーバーがエラーを返しました。');
      }
    } catch (error) {
      console.error('請求書の作成中にエラーが発生しました:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>新しい請求書を作成する</h1>
      <label>
        顧客名:
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="inputField"
        >
          <option value="" disabled>顧客を選択</option>
          {customers.map((customer) => (
            <option key={customer.Id} value={customer.Name}>
              {customer.Name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        金額:
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="inputField"
        />
      </label>
      <br />
      <fieldset>
        <legend>請求書ステータス:</legend>
        <label>
          保留中
          <input
            type="radio"
            value="pending"
            checked={status === 'pending'}
            onChange={() => setStatus('pending')}
          />
        </label>
        <label>
          支払済み
          <input
            type="radio"
            value="paid"
            checked={status === 'paid'}
            onChange={() => setStatus('paid')}
          />
        </label>
      </fieldset>
      <br />
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/php-invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" onClick={handleCreateInvoice}>Create Invoice</Button>
      </div>

      <style jsx>{`
        .container {
          max-width: 400px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .inputField {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
        }

        .submitButton {
          background-color: #4caf50;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .submitButton:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default CreateInvoice;
