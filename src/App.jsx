```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [keys, setKeys] = useState({});
    const [newUsername, setNewUsername] = useState('');
    const [newHwid, setNewHwid] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [editHwid, setEditHwid] = useState('');
    const [editingKey, setEditingKey] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const RAW_URL = 'https://raw.githubusercontent.com/liam675/keys.json/main/keys.json';

    const fetchKeys = async () => {
        try {
            const response = await axios.get(RAW_URL);
            setKeys(response.data);
            setError('');
        } catch (err) {
            setError(`Failed to fetch keys: ${err.message}`);
            console.error('Fetch error:', err);
        }
    };

    const addKey = async () => {
        if (!newUsername || !newHwid) {
            setError('Enter both username and HWID');
            return;
        }
        try {
            const newKeys = { ...keys, [newUsername]: newHwid };
            const response = await axios.post('/api/update-keys', { keys: newKeys });
            setKeys(newKeys);
            setNewUsername('');
            setNewHwid('');
            setSuccess('Key added!');
            setError('');
        } catch (err) {
            setError(`Failed to add key: ${err.response?.data?.message || err.message}`);
            console.error('Add error:', err.response || err);
        }
    };

    const deleteKey = async (username) => {
        try {
            const newKeys = { ...keys };
            delete newKeys[username];
            const response = await axios.post('/api/update-keys', { keys: newKeys });
            setKeys(newKeys);
            setSuccess('Key deleted!');
            setError('');
        } catch (err) {
            setError(`Failed to delete key: ${err.response?.data?.message || err.message}`);
            console.error('Delete error:', err.response || err);
        }
    };

    const startEdit = (username, hwid) => {
        setEditingKey(username);
        setEditUsername(username);
        setEditHwid(hwid);
    };

    const saveEdit = async () => {
        if (!editUsername || !editHwid) {
            setError('Enter both username and HWID');
            return;
        }
        try {
            const newKeys = { ...keys };
            if (editUsername !== editingKey) {
                delete newKeys[editingKey];
            }
            newKeys[editUsername] = editHwid;
            const response = await axios.post('/api/update-keys', { keys: newKeys });
            setKeys(newKeys);
            setEditingKey(null);
            setEditUsername('');
            setEditHwid('');
            setSuccess('Key updated!');
            setError('');
        } catch (err) {
            setError(`Failed to update key: ${err.response?.data?.message || err.message}`);
            console.error('Update error:', err.response || err);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">HWID Manager</h1>
            
            {error && (
                <div className="bg-red-500 text-white p-3 rounded mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-500 text-white p-3 rounded mb-4">
                    {success}
                    {setTimeout(() => setSuccess(''), 3000)}
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Add Key</h2>
                <div className="flex gap-3 mb-3">
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="bg-gray-800 text-white p-2 rounded w-1/3"
                    />
                    <input
                        type="text"
                        placeholder="HWID"
                        value={newHwid}
                        onChange={(e) => setNewHwid(e.target.value)}
                        className="bg-gray-800 text-white p-2 rounded w-1/3"
                    />
                    <button
                        onClick={addKey}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Keys</h2>
                <div className="grid gap-3">
                    {Object.entries(keys).map(([username, hwid]) => (
                        <div key={username} className="bg-gray-800 p-3 rounded flex items-center justify-between">
                            {editingKey === username ? (
                                <div className="flex gap-3 w-full">
                                    <input
                                        type="text"
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                        className="bg-gray-700 text-white p-2 rounded w-1/3"
                                    />
                                    <input
                                        type="text"
                                        value={editHwid}
                                        onChange={(e) => setEditHwid(e.target.value)}
                                        className="bg-gray-700 text-white p-2 rounded w-1/3"
                                    />
                                    <div>
                                        <button
                                            onClick={saveEdit}
                                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded mr-2"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingKey(null)}
                                            className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <span className="font-semibold">Username:</span> {username}
                                        <br />
                                        <span className="font-semibold">HWID:</span> {hwid}
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => startEdit(username, hwid)}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteKey(username)}
                                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
```

#### 3. React Entry Point (`src/index.js`)
This renders the React app.

<xaiArtifact artifact_id="94065936-23f2-43fb-857d-abdd30942a0c" artifact_version_id="292eefe3-4d20-4125-a776-4a52fac1f8ce" title="index.js" contentType="text/javascript">
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```
