import {Request} from "express";
import {connection, ObjectId} from "../config/mongo-connection";
import notification from "../controllers/controller-notification";

//Name of the MongoDB collection for the database defined in config/mongo-connection file
const COLLECTION_NAME = "posts";

export default {


/***Admin models***/

  /**
   * Create article function
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
   async createArticle(req: Request, func: any): Promise<void> {
   //Initializes connection
   const database = await connection();

   //Selects a collection
   const posts = database.collection(COLLECTION_NAME);

   //Inserts a new article
   const dbResult: any | null = await posts.insertOne({
      title: req.body.title,
      thumbnail: req.body.thumbnail,
      post: req.body.post,
      date: new Date(req.body.date),
      author: {
        _id: new ObjectId(req.body.id),
        name: req.body.name,
        email: req.body.email
      }
    });

    return func(dbResult);
  },

  /**
   * Edit article function
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
   async editArticle(req: Request, func: any): Promise<void> {
     //Initializes connection
     const database = await connection();

     //Selects a collection
     const posts = database.collection(COLLECTION_NAME);

     let query = {};

    //Checks if thumbnail is empty or not. If empty, doesn't update thumbnail field
    if (req.body.thumbnail !== "") {
      query = {
       $set:
       {
         title: req.body.title,
         thumbnail: req.body.thumbnail,
         post: req.body.post
       }
      };
    } else {
      query = {
       $set:
       {
         title: req.body.title,
         post: req.body.post
       }
      };
    }

    //Updates certain article by article id and id of the user
    const dbResult: any | null = await posts.updateOne({_id: new ObjectId(req.body.articleId), "author._id": new ObjectId(req.body.id)}, query);

    return func(dbResult);
  },

  /**
   * Get articles function. Gets all article of a certain user
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async getArticles(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const posts = database.collection(COLLECTION_NAME);

    //Creates index
    posts.createIndex({"author._id": 1});

    //Finds articles where the author is the logged in user
    const dbResult: Array<any> | null = await posts.find({"author._id": new ObjectId(req.params.id)}).toArray();

    return func(dbResult);
  },

  /**
   * Get article for edit function. Gets an article using article id and the id of the user
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async getArticleForEdit(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const posts = database.collection(COLLECTION_NAME);

    //Creates index author id
    posts.createIndex({"author._id": 1});

    //Creates index article id
    posts.createIndex({"_id": 1});

    //Finds articles where the author is the logged in user
    const dbResult: any | null = await posts.findOne({"_id": new ObjectId(req.params.articleId), "author._id": new ObjectId(req.params.id)});

    return func(dbResult);
  },

  /**
   * Delete article function. Deletes an article by id
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async deleteArticle(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const posts = database.collection(COLLECTION_NAME);

    //Creates index
    posts.createIndex({"author._id": 1});

    //Finds and deletes an article by id
    const dbResult: any | null = await posts.deleteOne({_id: new ObjectId(req.params.articleId)});

    return func(dbResult);
  },


/***Site models***/

  /**
   * Add view to article function
   * @param {Request} req - NodeJS express request
   */
  async addArticleView(req: Request): Promise<void> {
   //Initializes connection
   const database = await connection();

   //Selects a collection
   const posts = database.collection(COLLECTION_NAME);

   //Updates certain article adding a view and visits
    await posts.updateOne({_id: new ObjectId(req.params.articleId)},
      {
        //Article visits array. Each item in array means a visit
        $addToSet: {
          visits: {
            date: new Date()
          }
        }
      }
    );
  },

  /**
   * Get article function. Gets an article using the id of the article
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async getArticle(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const posts = database.collection(COLLECTION_NAME);

    //Creates index
    posts.createIndex({"_id": 1});

    //Finds article by article id
    const dbResult: any | null = await posts.findOne({"_id": new ObjectId(req.params.articleId)});

    return func(dbResult);
  },

  /**
   * Get all articles function.
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async getAllArticles(func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const posts = database.collection(COLLECTION_NAME);

    //Creates index
    posts.createIndex({"_id": 1});

    //Gets all articles
    const dbResult: Array<any> | null = await posts.find({}).toArray();

    return func(dbResult);
  },

  /**
   * Like article function
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async likeArticle(req: Request, func: any): Promise<void> {

    //Initializes connection
    const database = await connection();

    //Selects a collection
    const posts = database.collection(COLLECTION_NAME);

    //Creates let dbResult with null value
    let dbResult: any | null = null;

    //Add or remove a like in certain article checking if operation is + (add like) or - (remove like)
    if (req.body.like == "+") {
      dbResult = await posts.updateOne({_id: new ObjectId(req.body.articleId)}, {$inc:{likes: +1}});
    } else {
      dbResult = await posts.updateOne({_id: new ObjectId(req.body.articleId)}, {$inc:{likes: -1}});
    }

    //If operation is succesful and if a like was added, gets the author id and adds a notification
    if (dbResult !== null && dbResult.modifiedCount >= 1 && req.body.like == "+") {
      //Gets author id and post title by the article id
      const post = await posts.findOne({_id: new ObjectId(req.body.articleId)}, {projection: {"author._id": 1, title: 1}});

      //Adds a new notification
      notification.addNotification(
        post?.author._id.toString(), //Article author id
        `Congratulations! You got a new like on your article: <a href="../article/${req.body.articleId}">${post?.title}</a>`, //Notification message
        "Someone liked your article", //Notification title
      );
    }

    return func(dbResult);
  },

  /**
   * Add comment function
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async addComment(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const posts = database.collection(COLLECTION_NAME);

    //Adds a new comment
    const dbResult: any | null = await posts.updateOne(
      {_id: new ObjectId(req.body.articleId)},
      {
        $addToSet: {
           comments: {
           _id: new ObjectId(),
           title: req.body.title,
           date: new Date(),
           name: req.body.name,
           email: req.body.email,
           comment: req.body.comment
         }
       }
     }
   );

   //If comment was addded, sends notification
   if (dbResult !== null && dbResult.modifiedCount >= 1) {
     //Gets author id and post title by the article id
     const post = await posts.findOne({_id: new ObjectId(req.body.articleId)}, {projection: {"author._id": 1, title: 1}});
     //Adds a new notification
     notification.addNotification(
       post?.author._id.toString(), //Article author id
       `Congratulations! You got a new comment on your article: <a href="../article/${req.body.articleId}">${post?.title}</a>`, //Notification message
       "Someone commented on your article", //Notification title
     );
   }

   return func(dbResult);
  },

  /**
   * Get comments function. Gets all comments of a certiain article
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async getComments(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const posts = database.collection(COLLECTION_NAME);

    //Creates index
    posts.createIndex({"author._id": 1, _id: 1});

    //Finds comments using the article id as filter
    const dbResult: Array<any> | null = await posts.aggregate([
      {$match: {_id: new ObjectId(req.params.articleId)}}, //Selects the document by article id
      {$project:{comments: 1}}, //Fields that we want
      {$unwind: "$comments"}, //Iterates the comments array in posts document
      {$sort: {"comments.date": -1}}, //Sort by reverse order (new comments first)
      {$group: {_id: new ObjectId(req.params.articleId), comments: {$push: "$comments"}}} //"Remakes" the array
    ]).toArray();

    return func(dbResult);
  },

}
