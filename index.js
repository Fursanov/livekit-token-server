import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/livekit/token', (req, res) => {
    const { room, userId, name } = req.body;

    if (!room || !userId || !name) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        { identity: userId, name }
    );

    token.addGrant({ roomJoin: true, canPublish: true, canSubscribe: true });

    res.json({ token: token.toJwt() });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`LiveKit token server running on port ${port}`);
});
