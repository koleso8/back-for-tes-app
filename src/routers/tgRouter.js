import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import * as controllers from '../controllers/announcements.js';
import * as validations from '../validation/announcements.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

export default router;
