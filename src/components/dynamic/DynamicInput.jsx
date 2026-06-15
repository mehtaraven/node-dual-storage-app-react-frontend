// Renders a text input field.
// JSON example: { "type": "input", "name": "email", "label": "Email", "inputType": "email", "required": true }
function DynamicInput({ config, value, onChange }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
        {config.label || config.name}
        {config.required && <span style={{ color: 'red' }}> *</span>}
      </label>
      <input
        type={config.inputType || 'text'}
        name={config.name}
        value={value || ''}
        onChange={(e) => onChange(config.name, e.target.value)}
        placeholder={config.placeholder || ''}
        required={config.required}
        style={{ padding: '6px', width: '100%', boxSizing: 'border-box' }}
      />
    </div>
  );
}

export default DynamicInput;