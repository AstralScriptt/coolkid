const axios = require('axios');

module.exports = async (req, res) => {
    const GITHUB_PAT = process.env.GITHUB_PAT; // Set in Vercel environment variables
    const REPO_OWNER = 'liam675';
    const REPO_NAME = 'keys.json'; // Change to 'keys' if needed
    const FILE_PATH = 'keys.json';

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { keys } = req.body;
    if (!keys) {
        return res.status(400).json({ message: 'Keys data required' });
    }

    try {
        // Get current file SHA
        const getResponse = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                Authorization: `token ${GITHUB_PAT}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });
        const sha = getResponse.data.sha;

        // Update file
        const content = Buffer.from(JSON.stringify(keys, null, 2)).toString('base64');
        await axios.put(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            message: `Update keys.json at ${new Date().toISOString()}`,
            content: content,
            sha: sha
        }, {
            headers: {
                Authorization: `token ${GITHUB_PAT}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        res.status(200).json({ message: 'Keys updated successfully' });
    } catch (err) {
        console.error('API error:', err.response || err);
        res.status(err.response?.status || 500).json({ message: err.response?.data?.message || 'Failed to update keys' });
    }
};
```
