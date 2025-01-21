import express from 'express';
import jwt from 'jsonwebtoken';
import { validateAdminCredentials } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Rota de login administrativo
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (validateAdminCredentials(username, password)) {
    const token = jwt.sign({ isAdmin: true }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

export default router;
