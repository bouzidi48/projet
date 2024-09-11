import React, { useEffect, useState } from 'react';
import { CAlert, CBadge, CButton, CCardBody, CCollapse } from '@coreui/react';
import { CSmartTable } from '@coreui/react-pro';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../axiosConfig';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

function Orders(props) {
  const [details, setDetails] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const colorMapping = (nameCouleur) => {
    // Liste des couleurs avec leurs codes hexadécimaux
    const colors = {
      '#FF0000': '#FF0000',
      '#FF4500': '#FF4500',
      '#FFD700': '#FFD700',
      '#9ACD32': '#9ACD32',
      '#00FA9A': '#00FA9A',
      '#00CED1': '#00CED1',
      '#1E90FF': '#1E90FF',
      '#000080': '#000080',
      '#4B0082': '#4B0082',
      '#800080': '#800080',
      '#FFFFFF': '#FFFFFF',
      '#000000': '#000000',
    };

    // Retourne la couleur correspondant au nomCouleur ou une couleur par défaut si non trouvée
    return colors[nameCouleur] || '#000000'; // Noir par défaut si la couleur n'est pas trouvée
  };
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000); // Automatically remove alert after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [alertMessage]);

  useEffect(() => {
    axiosInstance.get('/orders', {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
      .then(response => {
        setOrdersData(response.data.data);
      })
      .catch(error => {
        console.error('There was an error fetching the orders data!', error);
      });
    console.log(ordersData);
  }, []);

  const columns = [
    { key: 'id', _style: { width: '100px', borderRight: '1px solid #e0e0e0' } },
    { key: 'total_amount', _style: { width: '150px', borderRight: '1px solid #e0e0e0' } },
    { key: 'total_reduction', _style: { width: '150px', borderRight: '1px solid #e0e0e0' } },
    { key: 'order_date', _style: { width: '200px', borderRight: '1px solid #e0e0e0' } },
    { key: 'status', _style: { width: '150px', borderRight: '1px solid #e0e0e0' } },
    { key: 'shipping_address', label: 'Shipping Address', _style: { width: '300px', borderRight: '1px solid #e0e0e0' } },
    { key: 'user.username', label: 'Username', _style: { width: '150px', borderRight: '1px solid #e0e0e0' } },
    {
      key: 'show_details',
      label: '',
      _style: { width: '100px', borderRight: '1px solid #e0e0e0' },
      filter: false,
      sorter: false,
    },
  ];

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

  const getBadge = (status) => {
    switch (status) {
      case 'cancelled':
        return 'danger'; // Red
      case 'processing':
        return 'warning'; // Yellow
      case 'shipped':
        return 'info'; // Blue
      case 'delivered':
        return 'success'; // Green
      default:
        return 'secondary'; // Grey
    }
  };

  const handleAccepterClick = async (id) => {
    try {
      const response = await axiosInstance.put(`/orders/update/${id}`, { status: 'shipped' }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })

      setOrdersData(ordersData.filter(order => order.id !== id));
      setOrdersData(prevOrdersData => [...prevOrdersData, response.data.data]);
      console.log(response.data.data);
      console.log(ordersData);
      toggleDetails(id);
      setAlertMessage('✅Commande Accept avec succès!');
      setAlertType('success');
    }
    catch (error) {
      console.error('There was an error updating the order!', error);
      setAlertMessage('❌Échec de Acceptation.');
      setAlertType('danger');
    }

  };

  const handleRefuserClick = async (id) => {
    try {
      const response = await axiosInstance.put(`/orders/cancel/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })


      setOrdersData(ordersData.filter(order => order.id !== id));
      setOrdersData(prevOrdersData => [...prevOrdersData, response.data.data]);
      toggleDetails(id);
      setAlertMessage('✅Commande Annule avec succès!');
      setAlertType('success');
    }
    catch (error) {
      console.error('There was an error updating the order!', error);
      setAlertMessage('❌Échec de Annulation.');
      setAlertType('danger');
    }

  };
  const isStockAvailable = (orderItems) => {
    return !orderItems.some(orderItem => orderItem.quantity > orderItem.size.stockQuantity);
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-center my-4">Order List</h2>
      {/* Afficher l'alerte si un message existe */}
      {alertMessage && (
        <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
          <CAlert color={alertType} className="small-alert" dismissible onClose={() => setAlertMessage('')}>
            {alertMessage}
          </CAlert>
        </div>
      )}
      <div className="overflow-x-auto">
        <CSmartTable
          striped
          className={`${props.theme === 'dark'
            ? 'bg-dark text-white text-center p-4 mt-auto table-auto border-collapse border border-gray-200'
            : 'bg-slate-0 text-dark text-center p-4 mt-auto table-auto border-collapse border border-gray-200'
            }`}
          activePage={1}
          cleaner
          clickableRows
          columns={columns}
          columnFilter
          columnSorter
          items={ordersData}
          itemsPerPageSelect
          itemsPerPage={5}
          pagination
          scopedColumns={{
            id: (item) => (
              <td className="border border-gray-200">{item.id}</td>
            ),
            total_amount: (item) => (
              <td className="border border-gray-200">{item.total_amount}</td>
            ),
            total_reduction: (item) => (
              <td className="border border-gray-200">{item.total_reduction}</td>
            ),
            'user.username': (item) => (
              <td className="border border-gray-200">{item.user.username}</td>
            ),
            order_date: (item) => (
              <td className="border border-gray-200">{format(new Date(item.order_date), 'yyyy-MM-dd')}</td>
            ),
            status: (item) => (
              <td className="border border-gray-200">
                <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
              </td>
            ),
            shipping_address: (item) => (
              <td className="border border-gray-200">
                {item.shipping_address.address + ', ' + item.shipping_address.city + ', ' + item.shipping_address.country + ', ' + item.shipping_address.postalCode}
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
                  <div className="flex space-x-4">
                    <div className="flex-1 space-y-2">
                      <h4>Order Details</h4>
                      <p className="text-muted ml-8">Order Date: {format(new Date(item.order_date), 'yyyy-MM-dd')}</p>
                      <p className="text-muted ml-8">Status: {item.status ? item.status : 'N/A'}</p>
                      <p className="text-muted ml-8">Shipping Address: {item.shipping_address ? item.shipping_address.address + ',' + item.shipping_address.city + ',' + item.shipping_address.country + ',' + item.shipping_address.postalCode : 'N/A'}</p>
                      <p className="text-muted ml-8">Billing Address: {item.billing_address ? item.billing_address : 'N/A'}</p>
                      <p className="text-muted ml-8">Shipped At: {item.ShippeAt ? format(new Date(item.ShippeAt), 'yyyy-MM-dd') : 'N/A'}</p>
                      <p className="text-muted ml-8">Delivered: {item.delivered ? format(new Date(item.delivered), 'yyyy-MM-dd') : 'N/A'}</p>
                      <p className="text-muted ml-8">Created At: {format(new Date(item.created_at), 'yyyy-MM-dd')}</p>
                      <p className="text-muted ml-8">User: {item.user.username}</p>
                      <p className="text-muted ml-8">Payment Status: {item.payment ? item.payment.payment_status : 'N/A'}</p>
                      <div className="flex-1 space-y-2">
                        <h4>Order Items</h4>
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left border">Product Name</th>
                              <th className="px-4 py-2 text-left border">Size</th>
                              <th className="px-4 py-2 text-left border">Color</th>
                              <th className="px-4 py-2 text-left border">Quantity</th>
                              <th className="px-4 py-2 text-left border">Unit Price</th>
                              <th className="px-4 py-2 text-left border">Total Price</th>
                              <th className="px-4 py-2 text-left border">Stock Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.orderItems.map((orderItem) => (
                              <tr key={orderItem.id}>
                                <td className="border px-4 py-2">{orderItem.product.nameProduct}</td>
                                <td className="border px-4 py-2">{orderItem.size.typeSize}</td>
                                <td className="border px-4 py-2">
                                  <div
                                    style={{
                                      backgroundColor: colorMapping(orderItem.couleur.nameCouleur),
                                      width: '30px',
                                      height: '30px',
                                      cursor: 'pointer',
                                      border: '1px solid #ccc',
                                      borderRadius: '4px',
                                    }}
                                  ></div>
                                </td>
                                <td
                                  className={`border px-4 py-2 ${orderItem.quantity > orderItem.size.stockQuantity ? 'text-red-500' : 'text-green-500'}`}
                                >
                                  {orderItem.quantity}
                                </td>
                                <td className="border px-4 py-2">{orderItem.product.price}</td>
                                <td className="border px-4 py-2">{orderItem.price}</td>
                                <td className="border px-4 py-2 text-center">
                                  {orderItem.quantity <= orderItem.size.stockQuantity ? (
                                    <FaCheckCircle className="text-green-500 lg" />
                                  ) : (
                                    <FaTimesCircle className="text-red-500 lg" />
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                      </div>
                    </div>
                  </div>
                  <CButton
                    size="sm"
                    color="info"
                    onClick={() => handleAccepterClick(item.id)}
                    className="mt-2"
                    disabled={!isStockAvailable(item.orderItems) || (item.status === 'cancelled') || (item.status === 'delivered') || (item.status === 'shipped')} // Désactiver le bouton si la condition n'est pas remplie
                  >
                    Accept Order
                  </CButton>
                  <CButton
                    size="sm"
                    color="danger"
                    onClick={() => handleRefuserClick(item.id)}
                    className="mt-2"
                    disabled={(item.status === 'cancelled') || (item.status === 'delivered')}
                  >
                    Reject Order
                  </CButton>
                </CCardBody>
              </CCollapse>
            ),
          }}
          selectable
          sorterValue={{ column: 'role', state: 'asc' }}
          tableFilter
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

export default Orders;
