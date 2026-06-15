// Renders a multi-line text area.
// JSON example: { "type": "textarea", "name": "bio", "label": "Bio", "rows": 5 }
function DynamicTextarea({ config, value, onChange }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
        {config.label || config.name}
        {config.required && <span style={{ color: 'red' }}> *</span>}
      </label>
      <textarea
        name={config.name}
        value={value || ''}
        onChange={(e) => onChange(config.name, e.target.value)}
        placeholder={config.placeholder || ''}
        rows={config.rows || 4}
        required={config.required}
        style={{ padding: '6px', width: '100%', boxSizing: 'border-box' }}
      />
    </div>
  );
}

export default DynamicTextarea;