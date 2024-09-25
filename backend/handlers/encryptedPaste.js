const { db, admin } = require("../utils/admin");
const { FieldValue } = admin.firestore;
const aes256 = require('aes256');

function handleError(error, res) {
    console.error(error);
    res.status(500).json({ message: 'Error saving paste', error });
}

exports.encryptedPaste = async (req, res) => {
    try {
        const content = req.body.content;
        const key = req.body.key;
        const encryptedContent = aes256.encrypt(key, content);

        
        if (!content) {
            return res.status(400).json({ message: 'Missing content in request body' });
        }

        const docRef = await db.collection('pastes').add({
            encryptedContent,
            key,
            timestamp: FieldValue.serverTimestamp() // Add server timestamp
        });

        res.json({ message: 'Encrypted Paste saved successfully!', id: docRef.id });
    } catch (error) {
        handleError(error, res);
    }
};
