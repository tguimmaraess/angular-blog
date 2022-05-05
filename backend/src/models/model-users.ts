import {Request} from "express";
import {connection, ObjectId} from "../config/mongo-connection";
const bcrypt = require("bcrypt");

const COLLECTION_NAME = "users";

export default {

/***Admin models***/

  /**
   * Update user function. Updates a user information and settings and returns the new document
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async updateUser(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const user = database.collection(COLLECTION_NAME);

    //Finds a document with a given email address where the id isn't the signed in user's id
    const emailExists: any | null = await user.findOne({email: req.body.email, _id: {$ne: new ObjectId(req.body.id)}});

    //If emailExists variable isn't null, it means the email exists in the system and returns an error.
    if (emailExists !== null) {
      const error: boolean = true;
      return func(error, "");
    } else {
      //If email doesn't exist, finds a document with the id of the logged user and updates it
      const dbResult: any | null = await user.findOneAndUpdate(
          {
            _id: new ObjectId(req.body.id) //Finds the document by user id
          },
          {
            $set: //Updates the document with new values
            {
              name: req.body.name,
              email: req.body.email,
              "settings.notificationSound": req.body.notificationSound
            }
         },
         {
           returnDocument: "after",  //Returns the document after updated
           projection: {password: 0} //Excludes the password field
         }
      );

      //Updates author object in posts documents with new data where the author is the signed in user
      await database.collection("posts").updateMany(
         {
           "author._id": new ObjectId(req.body.id)
         },
         {
           $set: {
             "author.email": req.body.email
          }
        }
      );

      return func("", dbResult);
    }
  },

  /**
   * Get user function. Gets user to edit
   * @param {string} id - User id
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async getUser(id: string, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const user = database.collection(COLLECTION_NAME);

    //Finds a document with the id of the logged user
    const dbResult: any | null = await user.findOne({_id: new ObjectId(id)});

    return func(dbResult);
  },

  /**
   * User signin function. Gets email and password from database and compares the password with bcrypt
   * @param {Request} req -  NodeJS express request
   * @param {function} func  - Callback
   * @returns {function} - Callback with result of the verification of email and password
   */
  async userSignin(req: Request, func: any): Promise<void> {

     const inputPassword = req.body.password;
     const inputEmail = req.body.email;

     //Initializes connection
     const database = await connection();

     //Selects a collection
     const user = database.collection(COLLECTION_NAME);

     //Finds a document with a given email address
     const dbResult: any | null = await user.findOne({email: inputEmail});

     //If a document with the given email is found, proceeds to compare the input password with the password
     //that is stored in the database that belongs to the given email.
     if (dbResult !== null) {
      bcrypt.compare(inputPassword, dbResult.password, function(error: any | undefined, compared: boolean) {
        return func(error, compared, dbResult); //Callback function with error, compared (true or false) and data from db.
      });
    } else {
      return func("", "", dbResult);
     }
  },

  /**
   * Delete account.
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async deleteAccount(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const user = database.collection(COLLECTION_NAME);

    //Finds a document with the id of the user
    const dbResult: any | null = await user.findOne({_id: new ObjectId(req.body.id)});

    //If a document with the given id is found, proceeds to compare the input password with the password
    //that is stored in the database that belongs to the given id
    if (dbResult !== null) {
     bcrypt.compare(req.body.password, dbResult.password,  async function(error: any, compared: boolean) {
       //If password matches, deletes the account
       if (compared !== false) {
         const dbResult: any | null = await user.deleteOne({_id: new ObjectId(req.body.id)});
         if (dbResult !== null && dbResult.deletedCount >= 1) { //If account was deleted
           //Deletes all articles of the user
           await database.collection("posts").deleteMany({"author._id": new ObjectId(req.body.id)});
           //Deletes all notifications of the user
           await database.collection("notifications").deleteMany({"author._id": new ObjectId(req.body.id)});

           return func(error, compared, dbResult); //Callback function with error, compared (true or false) and database deletetion result
         }
       } else {
         return func(error, compared, ""); //Callback function with error, compared (true or false)
       }
     });
    } else {
     return func(dbResult);
    }
  },


/***Site models***/

  /**
   * Create account function. Adds a new user to the database
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
   async createAccount(req: Request, func: any): Promise<void> {

     const inputPassword = req.body.password;
     const inputEmail = req.body.email;

     //Initializes connection
     const database = await connection();

     //Selects a collection
     const user = database.collection(COLLECTION_NAME);

     //Finds a document with the given email address
     const dbResult: any | null = await user.findOne({email: inputEmail});

     //Checks if the email address already exists, if exists returns an error
     if (dbResult !== null) {
      const error: boolean = true;
      return func(error, "");
     } else {
       //Hashes password and saves to database if email doesn't exist
       bcrypt.genSalt(10, function(error: Error, salt: string) {
         bcrypt.hash(inputPassword, salt, async function(error: Error, hash: string): Promise<void> {
          const dbResult = await user.insertOne(
            {
              name: req.body.name,
              email: inputEmail,
              password: hash,
              settings: {
                notificationSound: "yes"
              }
            }
          );
          return func("", dbResult);
        });
      });
    }
  },

  /**
   * Save forgot password link function - Inserts a document with email, hash (password link) and date
   * @param {string} hash - hash that was generated
   * @param {string} email - user email
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async saveForgotPasswordLink(hash: string, email: string, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects usersForgotPassword collection
    const user = database.collection("usersForgotPassword");

    //Inserts email, hash and date in database
    const dbResult: any | null = await user.insertOne({email: email, hash: hash, date: new Date()});

    return func("", dbResult);
  },

  /**
  * Gets forgot password document for a given hash (recover password link)
  * @param {string} hash - hash in the link
  * @param {function} func - Callback
  * @returns {function} - Callback with result
  */
  async getForgotPasswordLink(hash: string, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects usersForgotPassword collection
    const user = database.collection("usersForgotPassword");

    //Gets email, hash and date in database using aggregate to get the hash, email and time difference in minutes
    const dbResult: Array<any> | null = await user.aggregate(
      [
        {
          $match:
            {
              hash: hash
            }
        },
        {
          $project:
          {
            email: 1,
            hash: 1,
            dateDifference:
            {
              $dateDiff:
              {
                startDate: "$date",
                endDate: "$$NOW",
                unit: "minute"
              }
            }
          }
        }
      ]
    ).toArray();

    return func("", dbResult);
  },

  /**
   * Deletes request new password document for a given hash (recover password link)
   * @param {string} hash - hash in the link
   */
  async removeForgotPasswordLink(hash: string): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects usersForgotPassword collection
    const user = database.collection("usersForgotPassword");

    //Deletes a hash in usersForgotPassword collection
    await user.deleteOne({hash: hash});
  },

  /**
   * Creates new password
   * @param {string} password - New password choosen by the user
   * @param {string} email - User email
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async createNewPassword(password: string, email: string, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const user = database.collection(COLLECTION_NAME);

    //Encrypts new password and saves it in database
    bcrypt.genSalt(10, function(error: Error, salt: string) {
      bcrypt.hash(password, salt, async function(error: any, hash: string): Promise<void> {
        const dbResult: any | null = await user.updateOne({email: email}, {$set: {password: hash}});
        return func(error, dbResult);
      });
    });
  },


/***Common models***/

  /**
   * Get user by email function.
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async getUserWithEmail(req: Request, func: any): Promise<void> {
    //Initializes connection
    const database = await connection();

    //Selects a collection
    const user = database.collection(COLLECTION_NAME);

    //Finds a document with the email of the user
    const dbResult: any | null = await user.findOne({email: req.body.email});

    return func(dbResult);
  },

}
