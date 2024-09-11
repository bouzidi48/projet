import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import Chart from 'react-apexcharts';
import axiosInstance from '../axiosConfig';

function Dashboard({ theme }) {
  const [view, setView] = useState('year');
  const [nbUsers, setNbUsers] = useState(0);
  const [nbOrders, setNbOrders] = useState(0);
  const [chiffreAffaire, setChiffreAffaire] = useState(0);
  const [chartData, setChartData] = useState({
    series: [
      { name: 'Users', data: [] },
      { name: 'Orders', data: [] },
      { name: 'Chiffre d\'Affaires', data: [] },
    ],
    categories: [],
  });

  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [leastSellingProducts, setLeastSellingProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, ordersResponse, chiffreAffaireResponse] = await Promise.all([
          axiosInstance.get('/users/nbUser'),
          axiosInstance.get('/orders/nbOrder'),
          axiosInstance.get('/orders/ChiffreAffaire'),
        ]);
  
        // Vérifier si chaque réponse n'est pas nulle avant d'affecter les valeurs
        if (usersResponse.data.data !== null) {
          setNbUsers(usersResponse.data.data);
        }
  
        if (ordersResponse.data.data !== null) {
          setNbOrders(ordersResponse.data.data);
        }
  
        if (chiffreAffaireResponse.data.data !== null) {
          setChiffreAffaire(chiffreAffaireResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        let userResponse, orderResponse, revenueResponse;
  
        switch (view) {
          case 'year':
            userResponse = await axiosInstance.get('/users/nbUserParYear');
            orderResponse = await axiosInstance.get('/orders/nbOrderParYear');
            revenueResponse = await axiosInstance.get('/orders/ChiffreAffaireParYear');
            break;
          case 'month':
            userResponse = await axiosInstance.get('/users/nbUserParMonth');
            orderResponse = await axiosInstance.get('/orders/nbOrderParMonth');
            revenueResponse = await axiosInstance.get('/orders/ChiffreAffaireParMonth');
            break;
          case 'week':
            userResponse = await axiosInstance.get('/users/nbUserParWeek');
            orderResponse = await axiosInstance.get('/orders/nbOrderParWeek');
            revenueResponse = await axiosInstance.get('/orders/ChiffreAffaireParWeek');
            break;
          default:
            break;
        }
  
        if (userResponse?.data?.data && orderResponse?.data?.data && revenueResponse?.data?.data) {
          const userSeries = Object.values(userResponse.data.data).map(item => item || 0);
          const orderSeries = Object.values(orderResponse.data.data).map(item => item || 0);
          const revenueSeries = Object.values(revenueResponse.data.data).map(item => item || 0);
  
          const categories = Object.keys(userResponse.data.data);
  
          const series = [
            { name: 'Users', data: userSeries },
            { name: 'Orders', data: orderSeries },
            { name: 'Chiffre d\'Affaires', data: revenueSeries },
          ];
  
          setChartData({ series, categories });
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
  
    fetchChartData();
  }, [view]);
  
  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [bestResponse, leastResponse] = await Promise.all([
          axiosInstance.get('/orders/productsBienVendu'),
          axiosInstance.get('/orders/productsMoinVendu'),
        ]);
  
        // Vérification avant d'affecter les valeurs
        if (bestResponse?.data?.data !== null) {
          setBestSellingProducts(bestResponse.data.data);
        }
  
        if (leastResponse?.data?.data !== null) {
          setLeastSellingProducts(leastResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
  
    fetchProductData();
  }, []);
  

  return (
    <div className='container mx-auto'>
      <div className="p-6 space-y-6 overflow-x-auto">
        <div className="grid grid-cols-3 gap-6">
          <CCard className="text-center">
            <CCardHeader className="text-blue-600">Users</CCardHeader>
            <CCardBody>{nbUsers}</CCardBody>
          </CCard>
          <CCard className="text-center">
            <CCardHeader className="text-blue-600">Orders</CCardHeader>
            <CCardBody>{nbOrders}</CCardBody>
          </CCard>
          <CCard className="text-center">
            <CCardHeader className="text-yellow-600">Chiffre d'affaires</CCardHeader>
            <CCardBody>{chiffreAffaire} DH</CCardBody>
          </CCard>
        </div>

        <div className="mt-6">
          <CCard>
            <CCardHeader>
              Traffic
              <div className="float-right">
                <CButton color="primary" size="sm" onClick={() => setView('year')} className="mr-2">
                  Year
                </CButton>
                <CButton color="primary" size="sm" onClick={() => setView('month')} className="mr-2">
                  Month
                </CButton>
                <CButton color="primary" size="sm" onClick={() => setView('week')}>
                  Week
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <Chart
                options={{
                  chart: { type: 'line' },
                  xaxis: { categories: chartData.categories },
                  stroke: { curve: 'smooth' },
                  markers: { size: 4 },
                  dataLabels: { enabled: false },
                }}
                series={chartData.series}
                type="line"
                height={300}
              />
            </CCardBody>
          </CCard>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <CCard className="border border-gray-300">
            <CCardHeader>Top 5 Best-Selling Products</CCardHeader>
            <CCardBody>
              <CTable small bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {bestSellingProducts.map(product => (
                    <CTableRow key={product.product.id}>
                      <CTableDataCell>{product.product.id}</CTableDataCell>
                      <CTableDataCell>{product.product.nameProduct}</CTableDataCell>
                      <CTableDataCell>{product.quantity}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          <CCard className="border border-gray-300">
            <CCardHeader>Top 5 Least-Selling Products</CCardHeader>
            <CCardBody>
              <CTable small bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {leastSellingProducts.map(product => (
                    <CTableRow key={product.product.id}>
                      <CTableDataCell>{product.product.id}</CTableDataCell>
                      <CTableDataCell>{product.product.nameProduct}</CTableDataCell>
                      <CTableDataCell>{product.quantity}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
