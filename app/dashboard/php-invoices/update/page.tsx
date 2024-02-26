'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import { Invoice1, Customer1 } from '@/app/lib/definitions';

const EditInvoice = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  console.log(id);

  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = useState<"pending" | "paid" | undefined>('pending');
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer1[]>([]);
  const [invoiceData, setInvoiceData] = useState<Invoice1 | null>(null);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const selectedCustomerId = customers.find(customer => customer.Name === selectedCustomer)?.Id;
  const updatedStatus = status;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetch('http://localhost:8000/');
        if (customersResponse.ok) {
          const customersData: Customer1[] = await customersResponse.json();
          setCustomers(customersData);
        } else {
          console.error('顧客データの取得に失敗しました。');
        }

        const invoicesResponse = await fetch(`http://localhost:8000/custermer.php`);
        if (invoicesResponse.ok) {
          const allInvoices: Invoice1[] = await invoicesResponse.json();
  
          const selectedInvoice = allInvoices.find(invoice => invoice.Id === id);
  
          if (selectedInvoice) {
            setInvoiceData(selectedInvoice);
            setAmount(String(selectedInvoice.Amount));
            setStatus(selectedInvoice.Status);
            setSelectedCustomer(selectedInvoice.Customer_id);
          } else {
            console.error('指定されたIDの請求書データが見つかりません。');
          }
        } else {
          console.error('請求書データの取得に失敗しました。');
        }
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleEditInvoice = async () => {
    try {
      setLoading(true);

      const updatedInvoiceData = {
        Id: id,
        Amount: parseFloat(amount), 
        Status: updatedStatus,
        Customer_id: selectedCustomer,
      };

      const response = await fetch('http://localhost:8000/updateInvoice.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInvoiceData),
      });

      if (response.ok) {
        console.log('請求書が更新されました。');
      } else {
        console.error('請求書の更新に失敗しました。');
      }
    } catch (error) {
      console.error('請求書の更新中にエラーが発生しました:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>請求書を編集する</h1>
      <label>
        顧客名:
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="inputField"
        >
          <option value="" disabled>顧客を選択</option>
          {customers.map((customer) => (
            <option key={customer.Id} value={customer.Id}>
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
        <Link href="/dashboard/php-invoices">
          <div className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
            Cancel
          </div>
        </Link>
        <Link href="/dashboard/php-invoices">
        <div className="submitButton" onClick={handleEditInvoice}>
          Edit Invoice
        </div>
        </Link>
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

export default EditInvoice;