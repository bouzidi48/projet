import React, { useEffect, useState } from 'react';
import { CAlert, CButton, CCardBody, CCollapse } from '@coreui/react';
import { CSmartTable } from '@coreui/react-pro';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../axiosConfig';



function Reviews(props) {
  const [details, setDetails] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reviewsData, setReviewsData] = useState([]);
  const [replyMessage, setReplyMessage] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    axiosInstance.get('/reviews', {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
      .then(response => {
        setReviewsData(response.data.data);
      })
      .catch(error => {
        console.error('There was an error fetching the reviews data!', error);
      });
  }, []);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000); // Automatically remove alert after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [alertMessage]);

  const columns = [
    { key: 'id', _style: { width: '100px', borderRight: '1px solid #e0e0e0' } },
    { key: 'ratings', _style: { width: '100px', borderRight: '1px solid #e0e0e0' } },
    { key: 'comment', _style: { width: '300px', borderRight: '1px solid #e0e0e0' } },
    { key: 'user.username', label: 'Username', _style: { width: '150px', borderRight: '1px solid #e0e0e0' } },
    { key: 'product.nameProduct', label: 'Product Name', _style: { width: '150px', borderRight: '1px solid #e0e0e0' } },
    {
      key: 'createdate',
      _style: { width: '150px' },
      filter: true,
      filterRenderer: () => (
        <div className="flex flex-col space-y-2">
          <label htmlFor="startDate">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            id="startDate"
          />
          <label htmlFor="endDate">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            id="endDate"
          />
        </div>
      ),
      filterValue: { startDate, endDate },
      filterFunction: (item, filterValue) => {
        if (!filterValue.startDate && !filterValue.endDate) return true;
        const date = new Date(item.createdate);
        return (
          (!filterValue.startDate || date >= filterValue.startDate) &&
          (!filterValue.endDate || date <= filterValue.endDate)
        );
      },
    },
    {
      key: 'show_details',
      label: '',
      _style: { width: '100px' },
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

  const deleteReview = async (item) => {
    try {
      await axiosInstance.delete(`/reviews/deleteReview/${item.id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then(response => {
        if (response.data.statusCode === 200) {

          setReviewsData(reviewsData.filter(review => review.id !== item.id));
          setAlertMessage('✅ L\'avis a été supprimé avec succès!');
          setAlertType('success');

        }
        console.log(response.data.message);
      })
        .catch(error => {
          console.error('There was an error fetching the reviews data!', error);
          setAlertMessage('❌ L\'avis n\'a pas été supprimé avec succès!');
          setAlertType('danger');
        });;

    } catch (error) {
      console.error('There was an error deleting the review!', error);
    }
  };


  return (
    <div className="container mx-auto">
      <h2 className="text-center my-4">Reviews List</h2>
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
          items={reviewsData}
          itemsPerPageSelect
          itemsPerPage={5}
          pagination
          onFilteredItemsChange={(items) => {
            console.log(items);
          }}
          onSelectedItemsChange={(items) => {
            console.log(items);
          }}
          scopedColumns={{
            id: (item) => (
              <td className="border border-gray-200">{item.id}</td>
            ),
            ratings: (item) => (
              <td className="border border-gray-200">{item.ratings}</td>
            ),
            comment: (item) => (
              <td className="border border-gray-200">{item.comment}</td>
            ),
            'user.username': (item) => (
              <td className="border border-gray-200">{item.user.username}</td>
            ),
            'product.nameProduct': (item) => (
              <td className="border border-gray-200">{item.product.nameProduct}</td>
            ),
            createdate: (item) => (
              <td className="border border-gray-200">
                {format(new Date(item.createdate), 'yyyy-MM-dd')}
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
                      <h4>Review Details</h4>
                      <p className="text-muted ml-8">
                        Date: {format(new Date(item.createdate), 'yyyy-MM-dd')}
                      </p>
                      <p className="text-muted ml-8">
                        Username: {item.user.username}
                      </p>
                      <p className="text-muted ml-8">
                        Product: {item.product.nameProduct}
                      </p>
                      <p className="text-muted ml-8">
                        Ratings: {item.ratings}
                      </p>
                      <p className="text-muted ml-8">Comment: {item.comment}</p>
                      <CButton
                        color="danger"
                        variant="outline"
                        shape="square"
                        size="sm"
                        onClick={() => {
                          deleteReview(item);
                        }}
                        className="inline-flex"
                      >
                        Delete
                      </CButton>
                    </div>
                  </div>
                </CCardBody>
              </CCollapse>
            ),
          }}
          selectable
          sorterValue={{ column: 'createdate', state: 'asc' }}
          tableFilter
          tableFilterLabel="Filter reviews: "
          tableFilterPlaceholder="Filter reviews..."
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

export default Reviews;
