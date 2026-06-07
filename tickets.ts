import { Router } from 'express';
import {
  getTickets,
  createTicket,
  deleteTicket,
} from '../controllers/ticketsController';

const router = Router();

/* ================= Routes ================= */
router.get('/', getTickets);
router.post('/', createTicket);
router.delete('/:id', deleteTicket);

/* ================= Future Safe Route Handling ================= */
// (optional safety layer for invalid routes inside this module)
router.all('*', (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Method not allowed on tickets route',
  });
});

export default router;