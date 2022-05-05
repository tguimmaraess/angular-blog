import {connection} from "../config/mongo-connection";
import {Request} from "express";

//Name of the MongoDB collection for the database defined in config/mongo-connection file
const COLLECTION_NAME = "notifications";

export default {

  /**
   * Add notification function
   * @param {string} authorId - Article author id
   * @param {string} message - Notification message
   * @param {string} title  - Notification title
   */
  async addNotification(authorId: string, message: string, title: string): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const notification = database.collection(COLLECTION_NAME);

    //Adds a new notification
    const dbResult: any | null = await notification.insertOne({
        title: title,
        message: message,
        date: new Date(),
        unseen: true,
        authorId: authorId
      });
  },

  /**
   * Counts number of unseen notifications of a certain user
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async getNumberOfUnseenNotifications(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const notification = database.collection(COLLECTION_NAME);

    //Creates index
    notification.createIndex({authorid: 1});

    //Gets the count of unseen notification of a certain user
    const dbResult: number = await notification.countDocuments({authorId: req.params.id, unseen: true});

    return func(dbResult);
  },

  /**
   * Updates notification unseen to 0 meaning the user has seen the notifications
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async updateNumberOfUnseenNotifications(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const notification = database.collection(COLLECTION_NAME);

    //Updates notification unseen status to false
    const dbResult: any | null = await notification.updateMany({authorId: req.params.id, unseen: true}, {$set: {unseen: false}});

    return func(dbResult);
  },

  /**
   * Get all notifications of a certain user function
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async getAllNotifications(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const notification = database.collection(COLLECTION_NAME);

    //Gets notifications by user author id
    const dbResult: Array<any> | null = await notification.find({authorId: req.params.id}, {sort: {date: -1}}).toArray();

    return func(dbResult);
  },

  /**
   * Updates notification unseen to 0 meaning the user has seen the notifications
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async checkForNewNotifications(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const notification = database.collection(COLLECTION_NAME);

    //Listens for changes of documents related to the signed in user
    const change = await notification.watch([{$match:{"fullDocument.authorId": req.params.id}}]);

    //When change happens in collection notifications
    change.on("change", async function() {

      //Closes change stream
      change.close();

      //Selects only unseen notifications
      const dbResult: Array<any> | null = await notification.find({authorId: req.params.id, unseen: true}).toArray();

      func(dbResult);

      return;
    });
  },

}
