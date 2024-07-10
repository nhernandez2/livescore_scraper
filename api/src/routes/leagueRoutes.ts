import express from 'express';

import { getTableByLeague } from '../controllers/leagueController';

const router = express.Router();

router.get('/getTableFromLeague', getTableByLeague);

export default router;