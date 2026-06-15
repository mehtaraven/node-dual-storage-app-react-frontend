// Renders a submit button.
// JSON example: { "type": "button", "label": "Create" }
// Buttons don't hold state — no value/onChange needed.
function DynamicButton({ config }) {
  return (
    <div style={{ marginTop: '15px' }}>
      <button type="submit" style={{ padding: '8px 20px', cursor: 'pointer' }}>
        {config.label || 'Submit'}
      </button>
    </div>
  );
}

export default DynamicButton;