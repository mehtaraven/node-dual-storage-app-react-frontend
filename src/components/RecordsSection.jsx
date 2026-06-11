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

  useEffect(() => {
    loadRecords();
  }, []);

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

    if (!name.trim() || !firstName.trim() || !lastName.trim()) {
      setError('Name, First Name, and Last Name are required');
      return;
    }

    const body = {
      name: name.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || null  // Send null if empty (optional field)
    };

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
    <div>
      <h2>Records</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Record Name: * </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            placeholder="Unique name (becomes filename)"
            disabled={!!editingId}  // Can't change name when editing (it's the ID)
          />
        </div>
        <div>
          <label>First Name: * </label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={50}
            placeholder="Required"
          />
        </div>
        <div>
          <label>Last Name: * </label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            maxLength={50}
            placeholder="Required"
          />
        </div>
        <div>
          <label>Phone: </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
            placeholder="Optional"
          />
        </div>

        <button type="submit">{editingId ? 'Update Record' : 'Add Record'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {editingId && <p><em>Editing: {name}</em></p>}

      <table border="1" cellPadding="8" style={{ marginTop: '15px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Record Name</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr><td colSpan="5">No records yet. Add one above!</td></tr>
          ) : (
            records.map(record => (
              <tr key={record.id}>
                <td>{record.name}</td>
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
    </div>
  );
}

export default RecordsSection;
