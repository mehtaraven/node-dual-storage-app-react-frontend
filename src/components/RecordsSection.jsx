import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

function RecordsSection() {
  const [records, setRecords] = useState([]);
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userStorageType, setUserStorageType] = useState('');

  useEffect(() => {
    loadRecords();
    extractUserStorageType();
  }, []);

  function extractUserStorageType() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        setUserStorageType(decoded.storage_type);
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
    }
  }

  const loadRecords = async () => {
    const result = await apiRequest('/records');
    if (result && result.ok) {
      setRecords(result.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Name is only required for file storage
    if (userStorageType === 'file' && !name.trim()) {
      setError('Record Name is required for file storage');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError('Name, First Name, and Last Name are required');
      return;
    }

    const body = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || null  // Send null if empty (optional field)
    };

    // Only include name for file storage users
    if (userStorageType === 'file') {
      body.name = name.trim();
    }

    if (editingId) {
      // UPDATE
      const result = await apiRequest(`/records/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(body)
      });

      if (result && result.ok) {
        setRecords(records.map(r => r.id === editingId ? result.data : r));
        setMessage('Record updated!');
        resetForm();
      } else if (result) {
        setError(result.data.error || 'Update failed');
      }
    } else {
      // CREATE
      console.log("create >> body", body)
      const result = await apiRequest('/records', {
        method: 'POST',
        body: JSON.stringify(body)
      });

      if (result && result.ok) {
        setRecords([...records, result.data]);
        setMessage('Record created!');
        resetForm();
      } else if (result) {
        setError(result.data.error || 'Create failed');
      }
    }
  };

  const handleEdit = (record) => {
    setName(record.name);
    setFirstName(record.firstName);
    setLastName(record.lastName);
    setPhone(record.phone || '');  // phone might be null
    setEditingId(record.id);
    setMessage('');
    setError('');
  };

  const handleDelete = async (id) => {
    setMessage('');
    setError('');

    const result = await apiRequest(`/records/${id}`, { method: 'DELETE' });

    if (result && result.ok) {
      setRecords(records.filter(r => r.id !== id));
      setMessage('Record deleted!');
      if (editingId === id) resetForm();
    } else if (result) {
      setError(result.data.error || 'Delete failed');
    }
  };

  const resetForm = () => {
    setName('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setEditingId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignContent: "center", alignItems: "center", padding: "20px", marginBottom: "50px" }}>

      <div style={{ width: "fit-content", border: '1px solid #ccc', padding: '30px', borderRadius: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Add Record</h2>

        {message && <p style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          {/* Only show Record Name for file storage users — it becomes the filename */}
          {userStorageType === 'file' && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <label style={{ width: '130px', fontWeight: 'bold' }}>Record Name:*</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                placeholder="Unique name (becomes filename)"
                disabled={!!editingId}
                style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <label style={{ width: '130px', fontWeight: 'bold' }}>First Name: *</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              maxLength={50}
              placeholder="Required"
              style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <label style={{ width: '130px', fontWeight: 'bold' }}>Last Name: *</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              maxLength={50}
              placeholder="Required"
              style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <label style={{ width: '130px', fontWeight: 'bold' }}>Phone:</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={20}
              placeholder="Optional"
              style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{ padding: '10px 20px', cursor: 'pointer', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', marginLeft: "35%" }}
            >
              {editingId ? 'Update Record' : 'Add Record'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{ padding: '10px 20px', cursor: 'pointer', background: '#666', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px' }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {editingId && <p style={{ marginTop: '10px' }}><em>Editing: {name}</em></p>}

      <table border="1" cellPadding="8" style={{ marginTop: '60px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {userStorageType === 'file' && <th>Record Name</th>}
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr><td colSpan={userStorageType === 'file' ? 5 : 4}>No records yet. Add one above!</td></tr>
          ) : (
            records.map(record => (
              <tr key={record.id}>
                {userStorageType === 'file' && <td>{record.name}</td>}
                <td>{record.firstName}</td>
                <td>{record.lastName}</td>
                <td>{record.phone || '—'}</td>
                <td>
                  <button onClick={() => handleEdit(record)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(record.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div >
  );
}

export default RecordsSection;
