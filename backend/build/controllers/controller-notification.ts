import express, {Request, Response} from 'express';
import model from '../models/model-notification';

export default {

  /**
  * Add notification function
  * @param {string} title  -  Notification title
  * @param {string} message - Notification message
  * @param {string} authorId - Article author id
  */
  async addNotification(title: string, message: string, authorId: string): Promise<void> {
      //Adds a new notification
      const dbResult = await notification.insertOne({title: title, message: message, authorId: authorId});
    }

}
