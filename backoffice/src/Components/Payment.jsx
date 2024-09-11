import React, { useState, useEffect } from 'react';

import { CBadge, CButton, CCardBody, CCollapse } from '@coreui/react';
import { CSmartTable } from '@coreui/react-pro';
import { format } from 'date-fns';
import axiosInstance from '../axiosConfig';

function Payment(props) {
  const [details, setDetails] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);

  useEffect(() => {
    // Fetch payments data from the backend
    axiosInstance.get('/payments')
      .then(response => {
        setPaymentsData(response.data.data);
      })
      .catch(error => {
        console.error("There was an error fetching the payments data!", error);
      });
  }, []);

  const columns = [
    { key: 'id', _style: { width: '8%', borderRight: '1px solid #e0e0e0', textAlign: 'center' }, label: 'ID' },
    { key: 'order.id', _style: { width: '15%', borderRight: '1px solid #e0e0e0', textAlign: 'center' }, label: 'Order ID' },
    { key: 'order.total_amount', _style: { width: '15%', borderRight: '1px solid #e0e0e0', textAlign: 'center' }, label: 'Total Amount' },
    { key: 'payment_method', _style: { width: '15%', borderRight: '1px solid #e0e0e0', textAlign: 'center' }, label: 'Payment Method' },
    { key: 'payment_status', _style: { width: '12%', borderRight: '1px solid #e0e0e0', textAlign: 'center' }, label: 'Payment Status' },
    { key: 'payment_date', _style: { width: '12%', borderRight: '1px solid #e0e0e0', textAlign: 'center' }, label: 'Payment Date' },
    { key: 'created_at', _style: { width: '12%', borderRight: '1px solid #e0e0e0', textAlign: 'center' }, label: 'Created At' },
    {
      key: 'show_details',
      label: '',
      _style: { width: '11%', textAlign: 'center' },
      filter: false,
      sorter: false,
    },
  ];
  
  

  const getBadgemethod = (role) => {
    switch (role) {
      case 'card':
        return 'danger';
      case 'cash':
        return 'success';
      default:
        return 'primary';
    }
  };

  const getBadgestatus = (role) => {
    switch (role) {
      case 'failed':
        return 'info';
      case 'completed':
        return 'success';
      case 'authorized':
        return 'warning';
      case 'refunded':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-center my-4">Payments List</h2>
      <div className="overflow-x-auto">
        <CSmartTable
          striped
          className={`${
            props.theme === 'dark'
              ? 'bg-dark text-white text-center p-4 mt-auto table-auto border-collapse border border-gray-200'
              : 'bg-slate-0 text-dark text-center p-4 mt-auto table-auto border-collapse border border-gray-200'
          }`}
          activePage={1}
          cleaner
          clickableRows
          columns={columns}
          columnFilter
          columnSorter
          items={paymentsData}
          itemsPerPageSelect
          itemsPerPage={5}
          pagination
          scopedColumns={{
            id: (item) => (
              <td className="border border-gray-200">{item.id}</td>
            ),
            'order.id': (item) => (
              <td className="border border-gray-200">{item.order.id}</td>
            ),
            'order.total_amount': (item) => (
              <td className="border border-gray-200">{item.order.total_amount}</td>
            ),
            payment_method: (item) => (
              <td className="border border-gray-200"><CBadge color={getBadgemethod(item.payment_method)}>{item.payment_method}</CBadge></td>
            ),
            payment_status: (item) => (
              <td className="border border-gray-200"><CBadge color={getBadgestatus(item.payment_status)}>{item.payment_status}</CBadge></td>
            ),
            payment_date: (item) => (
              <td className="border border-gray-200">
                {format(new Date(item.payment_date), 'yyyy-MM-dd')}
              </td>
            ),
            created_at: (item) => (
              <td className="border border-gray-200">
                {format(new Date(item.created_at), 'yyyy-MM-dd')}
              </td>
            ),
            show_details: (item) => (
              <td className="py-2 text-center border border-gray-200">
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => {
                    toggleDetails(item.id);
                  }}
                  className="inline-flex"
                >
                  {details.includes(item.id) ? 'Hide' : 'Show'}
                </CButton>
              </td>
            ),
            details: (item) => (
              <CCollapse visible={details.includes(item.id)}>
                <CCardBody className="p-3 border border-gray-200">
                  <div className="space-y-2">
                    <p>Payment Method: {item.payment_method}</p>
                    <p>Payment Status: {item.payment_status}</p>
                    <p>Payment Date: {format(new Date(item.payment_date), 'yyyy-MM-dd')}</p>
                    <p>Order ID: {item.order.id}</p>
                    <p>Card Number: {item.cardNumber || 'N/A'}</p>
                    <p>Card Expiry: {item.cardExpiry || 'N/A'}</p>
                    <p>Card CVC: {item.cardCvc || 'N/A'}</p>
                    <p>Created At: {format(new Date(item.created_at), 'yyyy-MM-dd')}</p>
                  </div>
                </CCardBody>
              </CCollapse>
            ),
          }}
          selectable
          sorterValue={{ column: 'created_at', state: 'asc' }}
          tableFilter
          tableFilterLabel="Filter payments: "
          tableFilterPlaceholder="Filter payments..."
          tableProps={{
            className: 'min-w-full',
            responsive: true,
            striped: true,
            hover: true,
          }}
          tableBodyProps={{
            className: 'align-middle',
          }}
        />
      </div>
    </div>
  );
}

export default Payment;
