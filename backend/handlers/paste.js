const { db, admin } = require("../utils/admin");
const { FieldValue } = admin.firestore;

function handleError(error, res) {
    console.error(error);
    res.status(500).json({ message: 'Error saving paste', error });
}

exports.paste = async (req, res) => {
    try {
        const content = req.body.content;

        
        if (!content) {
            return res.status(400).json({ message: 'Missing content in request body' });
        }

        const docRef = await db.collection('pastes').add({
            content,
            timestamp: FieldValue.serverTimestamp() // Add server timestamp
        });

        res.json({ message: 'Paste saved successfully!', id: docRef.id });
    } catch (error) {
        handleError(error, res);
    }
};
