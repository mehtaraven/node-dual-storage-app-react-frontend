// Renders a dropdown with options.
// JSON example: { "type": "select", "name": "role", "label": "Role", "options": ["user", "admin"] }
function DynamicSelect({ config, value, onChange }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
        {config.label || config.name}
        {config.required && <span style={{ color: 'red' }}> *</span>}
      </label>
      <select
        name={config.name}
        value={value || ''}
        onChange={(e) => onChange(config.name, e.target.value)}
        required={config.required}
        style={{ padding: '6px', width: '100%' }}
      >
        <option value="">-- Select --</option>
        {(config.options || []).map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default DynamicSelect;