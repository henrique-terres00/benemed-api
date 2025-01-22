import express from 'express';
import { supabase } from '../config/database';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Rota pública para cadastro de parceiros
router.post('/', async (req, res) => {
  try {
    const { name, companyName, email, phone, city, state, cnpj } = req.body;

    // Validação do tamanho dos campos
    if (phone.length !== 11) {
      return res.status(400).json({ error: 'Telefone deve ter 11 dígitos' });
    }

    if (cnpj && cnpj.length !== 14) {
      return res.status(400).json({ error: 'CNPJ deve ter 14 dígitos' });
    }

    const { data, error } = await supabase
      .from('partners')
      .insert([
        { 
          name, 
          company_name: companyName, 
          email, 
          phone, 
          city, 
          state, 
          cnpj 
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rota protegida para listar parceiros (apenas admin)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error listing partners:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
