import React from 'react';

function UserInfo() {
  const token = localStorage.getItem('token'); // Decode the JWT payload to get user info

  let userInfo = { email: '—', storage_type: '—' };

  if (token) {
    try {
      const payload = token.split('.')[1];

      const decoded = JSON.parse(atob(payload)); // atob decodes Base64 string → normal string && JSON.parse converts the JSON string → object

      userInfo = {
        email: decoded.email || '—',
        storage_type: decoded.storage_type || '—'
      };
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
  }

  return (
    <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
      <h2>User Info</h2>
      <p><strong>Email:</strong> {userInfo.email}</p>
      <p><strong>Storage Type:</strong> {userInfo.storage_type === 'file' ? 'File Storage' : 'MongoDB'}</p>
    </div>
  );
}

export default UserInfo;
