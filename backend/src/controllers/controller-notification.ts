import express, {Request, Response} from "express";
import model from "../models/model-notification";

export default {

  /**
   * Add notification function
   * @param {string} title  -  Notification title
   * @param {string} message - Notification message
   * @param {string} authorId - Article author id
   */
  async addNotification(title: string, message: string, authorId: string): Promise<void> {
    model.addNotification(title, message, authorId); //Adds notification without confirmation
  },

  /**
   * Get all notifications function
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  async getAllNotifications(req: Request, res: Response): Promise<void> {
    model.getAllNotifications(req, function(dbResult: Array<any> | null) {
      if (dbResult !== null) { //If notifications were retrieved, sends "ok" message
        res.json({result: dbResult, message: "ok"});
      } else {
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

  /**
   * Get new notifications function (Long polling)
   * @param {Request} req - NodeJS express request
   * @param {Response} res -  NodeJS express response *
   */
  async checkForNewNotifications(req: Request, res: Response): Promise<void> {
    model.checkForNewNotifications(req, function(dbResult: Array<any>) {
       res.json({result: dbResult}); //Sends notifications when new notifications happen
       return;
    });
  },

  /**
   * Get number of unseen notifications function
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  async getNumberOfUnseenNotifications(req: Request, res: Response): Promise<void> {
    model.getNumberOfUnseenNotifications(req, function(dbResult: number) {
      res.json({result: dbResult}); //Sends number of unseen notifications
    });
  },

  /**
   * Update number of unseen notifications function
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  async updateNumberOfUnseenNotifications(req: Request, res: Response): Promise<void> {
    model.updateNumberOfUnseenNotifications(req, function(dbResult: any | null) {
      if (dbResult !== null && dbResult.modifiedCount >= 1) { //If number of unseen notifications was updated, sends "ok" message
        res.json({message: "ok"});
      }
    });
  }

}
