import { Router } from 'express';

import OauthController from '../controllers/oauth';

const router = Router();

router.get('/callback', OauthController.callback);

router.get('/get-code', OauthController.getCode);

export default router;
