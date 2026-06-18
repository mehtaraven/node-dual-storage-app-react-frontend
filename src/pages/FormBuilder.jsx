// FORM BUILDER PAGE

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComponentRegistry from '../components/dynamic/ComponentRegistry';
import { apiRequest } from '../utils/api';

// Sample JSON shown when the page first loads (so it's not empty)
const SAMPLE_JSON = JSON.stringify({
  screenName: "user",
  components: [
    { type: "input", name: "firstName", label: "First Name", required: true },
    { type: "input", name: "lastName", label: "Last Name", required: true },
    { type: "input", name: "email", label: "Email", inputType: "email" },
    { type: "checkbox", name: "active", label: "Active User" },
    { type: "select", name: "role", label: "Role", options: ["user", "admin"] },
    { type: "button", label: "Create" }
  ]
}, null, 2);

function FormBuilder() {
  // ─── STATE ───
  const [jsonText, setJsonText] = useState(SAMPLE_JSON);  // Raw text in the editor
  const [parsedConfig, setParsedConfig] = useState(null);  // null = nothing rendered yet
  const [error, setError] = useState('');                  // Parse error message
  const [formData, setFormData] = useState({});            // Dynamic form field values
  const [submitted, setSubmitted] = useState(null);        // Shows submitted data
  const [publishMessage, setPublishMessage] = useState('');

  const navigate = useNavigate();

  // Check if user is admin (decode JWT)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handlePublish = async () => {
    if (!parsedConfig) return;

    const result = await apiRequest('/schemas', {
      method: 'POST',
      body: JSON.stringify(parsedConfig)
    });

    if (result && result.ok) {
      setPublishMessage(`Published! Users can access at: /forms/${parsedConfig.screenName}`);
    } else if (result) {
      setPublishMessage(`Error: ${result.data.error}`);
    }
  };

  // ─── PROCESS BUTTON HANDLER ───
  const handleProcess = () => {
    setError('');
    setSubmitted(null);

    try {
      // Step 1: Try to parse the JSON text
      console.log("jsonText", jsonText);
      const parsed = JSON.parse(jsonText);
      console.log("parsed", parsed);
      // Step 2: Basic validation — must have a components array
      if (!parsed.components || !Array.isArray(parsed.components)) {
        setError('"components" must be an array');
        return;
      }
      // Step 3: Initialize form state — create an empty value for each field
      // This is like creating an empty HashMap with keys for each field name
      const initialData = {};
      parsed.components.forEach(comp => {
        if (comp.name) {  // Buttons don't have names — skip them
          initialData[comp.name] = comp.type === 'checkbox' ? false : '';
        }
      });
      console.log("initialData", initialData);
      // Step 4: Set the config — this triggers React to render the right panel
      setParsedConfig(parsed);
      setFormData(initialData);

    } catch (e) {
      // JSON.parse failed — show the error
      setError('Invalid JSON: ' + e.message);
      setParsedConfig(null);  // Clear the right panel
    }
  };

  // ─── FILE UPLOAD ───
  // Reads a .json file from the user's computer and puts it in the textarea
  const handleFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setJsonText(e.target.result);
    reader.readAsText(file);
  };

  // ─── DRAG & DROP ───
  const handleDragOver = (e) => {
    e.preventDefault();  // Required to allow drop
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
      handleFileUpload(file);
    } else {
      setError('Please drop a .json file');
    }
  };

  // ─── FORM FIELD CHANGE ───
  // Called by each dynamic component when user types/clicks in the rendered form
  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ─── FORM SUBMIT ───
  // When user clicks the rendered form's submit button
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(formData);
  };

  // ─── RENDER ───
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dynamic Form Builder</h1>
      <p>Write or upload JSON on the left. Click Process. See the form on the right.</p>

      {/* Three-column layout: Left | Middle | Right */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '15px' }}>

        {/* ═══════════ LEFT PANEL — JSON Editor ═══════════ */}
        <div style={{ flex: 1 }}>
          <h3>JSON Schema</h3>

          {/* File upload button */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ cursor: 'pointer', padding: '5px 10px', border: '1px solid #666', borderRadius: '4px' }}>
              📂 Upload .json
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </label>
            <span style={{ marginLeft: '10px', color: '#666', fontSize: '12px' }}>
              or drag a .json file onto the editor
            </span>
          </div>

          {/* JSON textarea (also a drop zone) */}
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              width: '100%',
              height: '500px',
              fontFamily: 'monospace',
              fontSize: '13px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical'
            }}
            spellCheck={false}
          />
        </div>
        {/* middle button */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '500px',
          padding: '0 10px',
          marginLeft: '20px',
          marginTop: '90px'
        }}>
          <button
            onClick={handleProcess}
            style={{
              padding: '15px 25px',
              fontSize: '16px',
              cursor: 'pointer',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            Process →
          </button>

          {/* Error shows below the button */}
          {error && (
            <p style={{
              color: 'red',
              marginTop: '10px',
              fontSize: '13px',
              textAlign: 'center',
              maxWidth: '140px'
            }}>
              {error}
            </p>
          )}
        </div>

        {/* ═══════════ RIGHT PANEL — Rendered Form ═══════════ */}
        <div style={{ flex: 1 }}>
          <h3>
            Rendered Form
            {parsedConfig?.screenName && ` — "${parsedConfig.screenName}"`}
          </h3>

          <div style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '20px',
            minHeight: '500px',
            background: '#fafafa',
            marginTop: '53px'
          }}>
            {parsedConfig ? (
              // ─── THE RENDERING ENGINE ───
              // This is where the JSON becomes a real form.
              // We loop through the components array and render each one.
              <form onSubmit={handleFormSubmit}>
                {parsedConfig.components.map((comp, index) => {
                  // Step 1: Look up the component type in the registry
                  const Component = ComponentRegistry[comp.type];

                  // Step 2: If type is unknown, show a warning (don't crash)
                  if (!Component) {
                    return (
                      <p key={index} style={{ color: 'orange' }}>
                        ⚠️ Unknown type: "{comp.type}"
                      </p>
                    );
                  }

                  // Step 3: Render the matched component with its config
                  return (
                    <Component
                      key={comp.name || index}
                      config={comp}
                      value={formData[comp.name]}
                      onChange={handleFieldChange}
                    />
                  );
                })}
              </form>
            ) : (
              // Nothing processed yet — show placeholder
              <p style={{ color: '#999', textAlign: 'center', marginTop: '200px' }}>
                Write JSON on the left and click "Process" to render the form here
              </p>
            )}

            {parsedConfig && (
              <button
                onClick={handlePublish}
                style={{
                  marginTop: '15px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}
              >
                📤 Publish
              </button>
            )}

            {publishMessage && (
              <p style={{ marginTop: '10px', fontSize: '12px', textAlign: 'center', maxWidth: '160px', color: '#4caf50' }}>
                {publishMessage}
              </p>
            )}

            {/* Show submitted data when form is submitted */}
            {submitted && (
              <div style={{ marginTop: '20px', padding: '10px', background: '#e8f5e9', borderRadius: '4px' }}>
                <h4>Submitted Data:</h4>
                <pre style={{ fontSize: '12px' }}>{JSON.stringify(submitted, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormBuilder;