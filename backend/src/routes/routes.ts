import express from "express";
import panelRoutes from "./panel";
import userRoutes from "./user";
import postRoutes from "./article";
import notificationRoutes from "./notification";

const router  = express.Router();

//All routes
router.use(panelRoutes)
router.use(userRoutes);
router.use(postRoutes);
router.use(notificationRoutes);

export default router;
