import express from 'express';
import { searchTeams, searchLeague} from '../controllers/liveScoreController';

const router = express.Router();

router.get('/searchTeams', searchTeams);
router.get('/searchLeague', searchLeague);

export default router;