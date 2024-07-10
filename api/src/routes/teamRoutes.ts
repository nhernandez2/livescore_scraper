import express from 'express';

import { getLastMatchByTeam } from '../controllers/teamController';

const router = express.Router();

router.get('/getLastMatchByTeam', getLastMatchByTeam);

export default router;