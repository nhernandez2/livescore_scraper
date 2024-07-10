import express from 'express';
import { subscriptionTeam } from '../controllers/subscriptionController';

const router = express.Router();

router.post('/subscriptionTeam', subscriptionTeam);

export default router;