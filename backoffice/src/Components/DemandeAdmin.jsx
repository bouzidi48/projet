import React, { useState, useEffect } from 'react';
import { CBadge, CButton, CCardBody, CCollapse, CAlert, CSpinner } from '@coreui/react';
import { CSmartTable } from '@coreui/react-pro';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../axiosConfig'; // Assuming you have axiosInstance configured

function DemandeAdmin(props) {
  const [details, setDetails] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [isUploadingAccepter, setIsUploadingAccepter] = useState({});
  const [isUploadingRefuser, setIsUploadingRefuser] = useState({});
  const [endDate, setEndDate] = useState(null);
  const [contactsData, setContactsData] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertColor, setAlertColor] = useState('primary');

  useEffect(() => {
    // Fetching all admin requests from the backend
    axiosInstance.get('/demande-admin')
      .then((response) => {
        setContactsData(response.data.data); // Assuming the response is an array of admin requests
      })
      .catch((error) => {
        console.error('Error fetching admin requests:', error);
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
    { key: 'id', _style: { width: '12.5%',borderRight: '1px solid #e0e0e0' } },
    { key: 'nom', _style: { width: '12.5%',borderRight: '1px solid #e0e0e0' } },
    { key: 'email', _style: { width: '12.5%',borderRight: '1px solid #e0e0e0' } },
    { key: 'telephone', _style: { width: '12.5%',borderRight: '1px solid #e0e0e0' } },
    { key: 'message', _style: { width: '12.5%',borderRight: '1px solid #e0e0e0' } },
    { key: 'status', _style: { width: '12.5%',borderRight: '1px solid #e0e0e0' } },
    {
      key: 'createdate',
      _style: { width: '12.5%',borderRight: '1px solid #e0e0e0' },
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
      _style: { width: '1%' },
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
      case 'accepter':
        return 'success';
      case 'refuser':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleAccept = (item) => {
    setIsUploadingAccepter((prev) => ({ ...prev, [item.id]: true }));
    axiosInstance.post('/demande-admin/accepter', {
      id: item.id,
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
      .then((response) => {
        console.log('Request accepted:', response.data);
        if (response.data.statusCode === 200) {
          // Update the state to reflect the accepted status
          setContactsData(contactsData.map(contact => contact.id === item.id ? { ...contact, status: 'accepter' } : contact));
          // Show success alert
          setAlertMessage(`✅ Vous avez accepté ${item.nom}.`);
          setAlertColor('success');
        }
      })
      .catch((error) => {
        console.error('Error accepting request:', error);
        // Show error alert
        setAlertMessage(`❌ Erreur lors de l'acceptation de ${item.nom}.`);
        setAlertColor('danger');
      }).finally(() => {
        setIsUploadingAccepter((prev) => ({ ...prev, [item.id]: false }));
      });
  };

  const handleRefuse = (item) => {
    setIsUploadingRefuser((prev) => ({ ...prev, [item.id]: true }));
    axiosInstance.post('/demande-admin/refuser', {
      id: item.id,
      email: item.email,
    })
      .then((response) => {
        console.log('Request refused:', response.data);
        // Update the state to reflect the refused status
        setContactsData(contactsData.map(contact => contact.id === item.id ? { ...contact, status: 'refuser' } : contact));
        // Show success alert
        setAlertMessage(`✅ Vous avez refusé ${item.nom}.`);
        setAlertColor('danger');
      })
      .catch((error) => {
        console.error('Error refusing request:', error);
        // Show error alert
        setAlertMessage(`❌ Erreur lors du refus de ${item.nom}.`);
        setAlertColor('danger');
      }).finally(() => {
        setIsUploadingRefuser((prev) => ({ ...prev, [item.id]: false }));
      })
      ;
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-center my-4">Demande être Admin List</h2>
      <div className="overflow-x-auto">
        {alertMessage && (
          <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
            <CAlert color={alertColor} className="small-alert" dismissible>
              {alertMessage}
            </CAlert>
          </div>
        )}

        <CSmartTable
          striped
          className={props.theme === 'dark' ? 'bg-dark text-white text-center p-4 mt-auto border' : 'bg-slate-0 text-dark text-center p-4 mt-auto border'}
          activePage={1}
          cleaner
          clickableRows
          columns={columns}
          columnFilter
          columnSorter
          items={contactsData}
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
            nom: (item) => (
              <td className="border border-gray-200">{item.nom}</td>
            ),
            email: (item) => (
              <td className="border border-gray-200">{item.email}</td>
            ),
            telephone: (item) => (
              <td className="border border-gray-200">{item.telephone}</td>
            ),
            message: (item) => (
              <td className="border border-gray-200">{item.message}</td>
            ),
            createdate: (item) => (
              <td className="border border-gray-200">{format(new Date(item.createdate), 'yyyy-MM-dd')}</td>
            ),
            status: (item) => (
              <td className="border border-gray-200">
                <CBadge className="p-2 max-w-20" color={getBadge(item.status)}>{item.status}</CBadge>
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
                  <h4>{item.nom}</h4>
                  <p className="text-muted ml-8">Contact since: {format(new Date(item.createdate), 'yyyy-MM-dd')}</p>
                  <p className="text-muted ml-8">Email: {item.email}</p>
                  <p className="text-muted ml-8">Telephone: {item.telephone}</p>
                  <p className="text-muted ml-8">Message: {item.message}</p>
                  <p className="text-muted ml-8">Status: {item.status}</p>
                  <div className="flex space-x-2">
                    <CButton
                      size="sm"
                      color="success"
                      onClick={() => handleAccept(item)}
                      disabled={item.status !== 'en_cours' ||isUploadingAccepter[item.id]}
                    >
                      {isUploadingAccepter[item.id] ? (
                          <span>
                            <CSpinner size="sm" /> Accept...
                          </span>
                        ) : (
                          'Accepter'
                        )}
                    </CButton>
                    <CButton
                      size="sm"
                      color="danger"
                      onClick={() => handleRefuse(item)}
                      disabled={item.status !== 'en_cours'||isUploadingRefuser[item.id]}
                    >
                      {isUploadingRefuser[item.id] ? (
                          <span>
                            <CSpinner size="sm" /> Reffuse...
                          </span>
                        ) : (
                          'Reffuser'
                        )}
                    </CButton>
                  </div>
                </CCardBody>
              </CCollapse>
            ),
          }}
          selectable
          sorterValue={{ column: 'createdate', state: 'asc' }}
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

export default DemandeAdmin;
