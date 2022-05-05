import panel from "../controllers/controller-panel";
import {body} from "express-validator";
import express from "express";
import verify from '../middleware/check-user';

const router  = express.Router();

/**
 * @get
 * /get-general-data/:id
 * Get general data route
 */
router.get("/get-general-information/:id", verify.authenticateUser, panel.getGeneralInformation);

/**
 * @get
 * /get-article-visits-per-month/:id
 * Get general data route
 */
router.get("/get-article-visits-per-month/:id", verify.authenticateUser, panel.getArticleVisitsPerMonth);

export default router;
