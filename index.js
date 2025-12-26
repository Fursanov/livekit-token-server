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

    console.log('Incoming request body:', req.body);

    if (!room || !userId || !name) {
        console.log('Missing parameters:', { room, userId, name });
        return res.status(400).json({ error: 'Missing parameters' });
    }

    // Создаем токен
    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        { identity: userId, name }
    );

    // Добавляем грант для комнаты
    token.addGrant({
        roomJoin: true,
        room: room,
        canPublish: true,
        canSubscribe: true,
    });

    const jwt = token.toJwt();
    console.log(`Generated token for user ${userId} in room ${room}:`, jwt);

    res.json({ token: jwt });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`LiveKit token server running on port ${port}`);
});
