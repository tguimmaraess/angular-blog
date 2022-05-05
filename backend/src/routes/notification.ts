import notification from "../controllers/controller-notification";
import express from "express";
import verify from '../middleware/check-user';

const router  = express.Router();

/**
 * @get
 * get-notifications/:id/
 * Get notifications route
 */
router.get("/get-notifications/:id", verify.authenticateUser, notification.getAllNotifications);

/**
 * @get
 * get-number-of-unseen-notifications/:id/
 * Get unseen notifications route
 */
router.get("/get-number-of-unseen-notifications/:id", verify.authenticateUser, notification.getNumberOfUnseenNotifications);

/**
 * @get
 * check-for-new-notifications/:id/
 * Get unseen notifications route
 */
router.get("/check-for-new-notifications/:id", verify.authenticateUser, notification.checkForNewNotifications);

/**
 * @get
 * update-number-of-unseen-notifications/:id/
 * Updates the number of unseen notifications to 0
 */
router.get("/update-number-of-unseen-notifications/:id", verify.authenticateUser, notification.updateNumberOfUnseenNotifications);

export default router;
