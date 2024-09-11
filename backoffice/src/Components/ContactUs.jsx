import React, { useState, useEffect } from 'react';
import { CButton, CCardBody, CCollapse, CAlert, CSpinner } from '@coreui/react';
import { CSmartTable } from '@coreui/react-pro';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../axiosConfig';

function ContactUs(props) {
  const [details, setDetails] = useState([]);
  const [isUploading, setIsUploading] = useState({});
  const [contactsData, setContactsData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [replyMessage, setReplyMessage] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    axiosInstance.get('/contacts', {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
      .then((response) => {
        console.log(response.data.data);
        setContactsData(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error);
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
    { key: 'id', _style: { width: '100px',  borderRight: '1px solid #e0e0e0' } },
    { key: 'nom', _style: { width: '150px', borderRight: '1px solid #e0e0e0' } },
    { key: 'numero_commande', _style: { width: '150px', borderRight: '1px solid #e0e0e0' } },
    { key: 'email', _style: { width: '200px', borderRight: '1px solid #e0e0e0' } },
    { key: 'telephone', _style: { width: '150px', borderRight: '1px solid #e0e0e0' } },
    { key: 'message', _style: { width: '300px', borderRight: '1px solid #e0e0e0' } },
    {
      key: 'createdAt',
      _style: { width: '150px',borderRight: '1px solid #e0e0e0' },
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
        const date = new Date(item.createdAt);
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

  const handleReplyChange = (id, value) => {
    setReplyMessage((prev) => ({ ...prev, [id]: value }));
  };

  const handleReply = async (item) => {
    const message = replyMessage[item.id] || '';
    setIsUploading((prev) => ({ ...prev, [item.id]: true })); // Démarrer le chargement

    console.log(`Reply to: ${item.email}`);
    console.log(`Message: ${message}`);

    try {
      const response = await axiosInstance.post('/contacts/repondre', {
        id_contact: item.id,
        email: item.email,
        message: message,
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Response from server:', response.data);

      // Affichez l'alerte de succès
      setAlertMessage('✅ Message envoyé avec succès!');
      setAlertType('success');

      // Supprimer le message de réponse après l'envoi
      setReplyMessage((prev) => ({ ...prev, [item.id]: '' }));
      toggleDetails(item.id);

    } catch (error) {
      console.error('Error sending reply:', error);

      // Affichez l'alerte d'erreur
      setAlertMessage('❌ Échec de l\'envoi du message.');
      setAlertType('danger');
    }finally {
      setIsUploading((prev) => ({ ...prev, [item.id]: false })); // Arrêter le chargement
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-center my-4">Contact List</h2>

      {/* Afficher l'alerte si un message existe */}
      {alertMessage && (
        <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
          <CAlert color={alertType} className="small-alert" dismissible onClose={() => setAlertMessage('')}>
            {alertMessage}
          </CAlert>
        </div>
      )}

      <div className={`overflow-x-auto ${props.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
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
            numero_commande: (item) => (
              <td className="border border-gray-200">
                {item.numero_commande ? item.numero_commande : 'N/A'}
              </td>
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
            createdAt: (item) => (
              <td className="border border-gray-200">
                {format(new Date(item.createdAt), 'yyyy-MM-dd')}
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
                    {/* Section des détails du contact */}
                    <div className="flex-1 space-y-2">
                      <h4>{item.nom}</h4>
                      <p className="text-muted ml-8">
                        Contact since: {format(new Date(item.createdAt), 'yyyy-MM-dd')}
                      </p>
                      <p className="text-muted ml-8">Email: {item.email}</p>
                      <p className="text-muted ml-8">Telephone: {item.telephone}</p>
                      <p className="text-muted ml-8">Message: {item.message}</p>
                      <p className="text-muted ml-8">
                        Order Number: {item.numero_commande ? item.numero_commande : 'N/A'}
                      </p>
                    </div>
                    {/* Section de la réponse */}
                    <div className="flex-1 space-y-2">
                      <label htmlFor={`reply-${item.id}`} className="form-label">Reponse:</label>
                      <textarea
                        id={`reply-${item.id}`}
                        className="form-control w-full border border-gray-200"
                        rows="5"
                        value={replyMessage[item.id] || ''}
                        onChange={(e) => handleReplyChange(item.id, e.target.value)}
                      />
                      <CButton
                        color="success"
                        onClick={() => handleReply(item)}
                        className="mr-2"
                        disabled={isUploading[item.id]}
                      >
                        {isUploading[item.id] ? (
                          <span>
                            <CSpinner size="sm" /> Envoi...
                          </span>
                        ) : (
                          'Envoyer'
                        )}
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
          tableProps={{
            className: `min-w-full ${props.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`,
            responsive: true,
            striped: true,
            hover: true,
          }}
          tableBodyProps={{
            className: `align-middle  ${props.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`,
          }}
        />
      </div>
    </div>
  );
}

export default ContactUs;
