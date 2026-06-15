// Renders a checkbox with label.
// JSON example: { "type": "checkbox", "name": "active", "label": "Active User" }
// Note: value is boolean (true/false), not a string.
function DynamicCheckbox({ config, value, onChange }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label>
        <input
          type="checkbox"
          name={config.name}
          checked={!!value}
          onChange={(e) => onChange(config.name, e.target.checked)}
        />
        {' '}{config.label || config.name}
      </label>
    </div>
  );
}

export default DynamicCheckbox;