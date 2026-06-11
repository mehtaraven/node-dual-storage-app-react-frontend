import React from 'react';

function UserInfo() {
  // Decode the JWT payload to get user info
  // JWT structure: header.payload.signature (all Base64-encoded)
  // We split on ".", take the middle part (payload), and decode it
  const token = localStorage.getItem('token');

  let userInfo = { email: '—', storage_type: '—' };

  if (token) {
    try {
      // Split token into 3 parts, take the payload (index 1)
      const payload = token.split('.')[1];

      // atob() decodes Base64 → string (built-in browser function)
      // JSON.parse converts the JSON string → object
      const decoded = JSON.parse(atob(payload));

      userInfo = {
        email: decoded.email || '—',
        storage_type: decoded.storage_type || '—'
      };
    } catch (e) {
      // If token is malformed, just show defaults
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
