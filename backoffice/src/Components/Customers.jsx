import React, { useState, useEffect } from 'react';
// Import the axios instance
import { CAlert, CBadge, CButton, CCardBody, CCollapse } from '@coreui/react';
import { CSmartTable } from '@coreui/react-pro';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../axiosConfig';

function Customers(props) {
  const [details, setDetails] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [tempRole, setTempRole] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertColor, setAlertColor] = useState('primary'); // Store user data from backend
  
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users', {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (response.status === 200) {
        setUsersData(response.data.data);
      } else {
        setAlertMessage('Failed to fetch users.');
        setAlertColor('danger');
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      setAlertMessage('Failed to fetch users.');
      setAlertColor('danger');
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      const response = await axiosInstance.put('/users/updateAdmin', 
        { id: id, role: role }, // Le corps de la requête
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      if (response.status === 200) {
        setAlertMessage('✅ Role updated successfully.');
        setAlertColor('success');
        fetchUsers(); // Refresh the users list after update
      } else {
        setAlertMessage('❌ Failed to update role.');
        setAlertColor('danger');
      }
    } catch (error) {
      console.error('Failed to update user role', error);
      setAlertMessage('❌ Failed to update role.');
      setAlertColor('danger');
    }
  };

  const handleSaveClick = () => {
    updateUserRole(editId, editRole);
    setEditId(null);
    setEditRole("");
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await axiosInstance.delete(`/users/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (response.data.statusCode === 200) {
        setUsersData(usersData.filter(user => user.id !== id));
        setAlertMessage('✅ User deleted successfully.');
        setAlertColor('success');
        fetchUsers();
      } else {
        setAlertMessage('❌Failed to delete user.');
        setAlertColor('danger');
      }
    } catch (error) {
      console.error('Failed to delete user', error);
      setAlertMessage('❌ Failed to delete user.');
      setAlertColor('danger');
    }
  };

  const columns = [
    { key: 'id', _style: { width: '16.66%',borderRight: '1px solid #e0e0e0' } },
    { key: 'username', _style: { width: '16.66%',borderRight: '1px solid #e0e0e0' } },
    { key: 'email', _style: { width: '16.66%',borderRight: '1px solid #e0e0e0' } },
    {
      key: 'createdate',
      _style: { width: '16.66%',borderRight: '1px solid #e0e0e0' },
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
    { key: 'role', _style: { width: '16.66%',borderRight: '1px solid #e0e0e0' } },
    { key: 'show_details', label: '', _style: { width: '1%' }, filter: false, sorter: false },
  ];

  const getBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'user':
        return 'success';
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

  const handleEditClick = (item) => {
    setEditId(item.id);
    setEditRole(item.role);
    setTempRole(item.role);
  };

  const handleCancelClick = () => {
    setEditId(null);
    setEditRole(tempRole);
    setTempRole("");
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-center my-4">Customer List</h2>
      <div className="overflow-x-auto">
        {alertMessage && (
          <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
            <CAlert color={alertColor} dismissible>
              {alertMessage}
            </CAlert>
          </div>
        )}
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
          items={usersData} // Use usersData from backend
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
            username: (item) => (
              <td className="border border-gray-200">{item.username}</td>
            ),
            email: (item) => (
              <td className="border border-gray-200">{item.email}</td>
            ),
            createdate: (item) => (
              <td className="border border-gray-200">
                {format(new Date(item.createdate), 'yyyy-MM-dd')}
              </td>
            ),
            role: (item) => (
              <td className="border border-gray-200">
                {editId === item.id ? (
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="form-control"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                ) : (
                  <CBadge color={getBadge(item.role)}>{item.role}</CBadge>
                )}
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
                >
                  {details.includes(item.id) ? 'Hide' : 'Show'}
                </CButton>
              </td>
            ),
            details: (item) => (
              <CCollapse visible={details.includes(item.id)}>
                <CCardBody className="p-3 border border-gray-200">
                  <h4>{item.username}</h4>
                  <p className="text-muted ml-8">Password: {'*'.repeat(item.password.length)}</p>
                  <p className="text-muted ml-8">User since: {format(new Date(item.createdate), 'yyyy-MM-dd')}</p>
                  <p className="text-muted ml-8">Email: {item.email}</p>
                  <p className="text-muted ml-8">Role: {item.role}</p>
                  <CButton size="sm" color="danger" className="ml-1" onClick={() => handleDeleteClick(item.id)}>
                    Delete
                  </CButton>
                  {editId === item.id ? (
                    <>
                      <CButton size="sm" color="success" className="ml-1" onClick={handleSaveClick}>
                        Save
                      </CButton>
                      <CButton size="sm" color="secondary" className="ml-1" onClick={handleCancelClick}>
                        Cancel
                      </CButton>
                    </>
                  ) : (
                    <CButton size="sm" color="warning" className="ml-1" onClick={() => handleEditClick(item)}>
                      Edit
                    </CButton>
                  )}
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

export default Customers;
