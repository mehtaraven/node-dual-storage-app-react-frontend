import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../../utils/api';
import ComponentRegistry from '../../components/dynamic/ComponentRegistry';

function DynamicForm() {
    const { type } = useParams();  // Gets "vehicle" from /forms/vehicle
    const [schema, setSchema] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Fetch the published schema on mount
    useEffect(() => {
        loadSchema();
    }, [type]);

    const loadSchema = async () => {
        setLoading(true);
        const result = await apiRequest(`/schemas/${type}`);

        if (result && result.ok) {
            setSchema(result.data);
            // Initialize form state
            const initial = {};
            result.data.components.forEach(comp => {
                if (comp.name) {
                    initial[comp.name] = comp.type === 'checkbox' ? false : '';
                }
            });
            setFormData(initial);
        } else {
            setError(result?.data?.error || `Form "${type}" not found`);
        }
        setLoading(false);
    };

    const handleFieldChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Submit the form data to the dynamic endpoint
        const result = await apiRequest(`/dynamic/${type}`, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (result && result.ok) {
            setMessage(`${type} record saved successfully!`);
            // Reset form
            const initial = {};
            schema.components.forEach(comp => {
                if (comp.name) {
                    initial[comp.name] = comp.type === 'checkbox' ? false : '';
                }
            });
            setFormData(initial);
        } else if (result) {
            setError(result.data.error || 'Failed to save');
        }
    };

    if (loading) return <p style={{ padding: '20px' }}>Loading form...</p>;
    if (error && !schema) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px' }}>
            <h2>{schema.screenName}</h2>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                {schema.components.map((comp, index) => {
                    const Component = ComponentRegistry[comp.type];

                    if (!Component) {
                        return <p key={index} style={{ color: 'orange' }}>Unknown: "{comp.type}"</p>;
                    }

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
        </div>
    );
}

export default DynamicForm;