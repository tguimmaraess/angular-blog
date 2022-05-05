import express, {Request, Response} from "express";
import model from "../models/model-users";
import {validationResult} from "express-validator";
import jwt, {Secret} from "jsonwebtoken";
import sendMessage from "../lib/send-mail";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export default {

/***Admin controllers***/


  /**
   * Update user function
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  updateUser(req: Request, res: Response): void {
    //Form validation results
    const errors = validationResult(req);

    //If there are validation errors, sends a response
    if (!errors.isEmpty()) {
      res.status(422).json({errors: errors.array()});
      return;
    }

    model.updateUser(req, function(error: boolean, dbResult: any | null) {
      //Lets check if error is true, if so, it means the email already exists in the system and we return an error
      if (error == true) {
        res.status(409).json({message: "Email already exists. Please choose a different one."});
      } else { //If email user is trying to change isn't already registered, proceeds with update
        if (dbResult !== null && dbResult.lastErrorObject.n >= 1) { //Checks if update was succesful
          dbResult.value["jsonwebtoken"] = req.query.jsonwebtoken; //Adds the token to database results
          res.json({result: dbResult.value, message: "ok"}); //Sends to the client new updated document with the token
        } else {
          res.status(500).json({message: "error"}); //An unknown error happened
        }
      }
    });
  },

  /**
   * Get user function
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  getUser(req: Request, res: Response): void {
   model.getUser(req.params.id, function(dbResult: any | null){
     if (dbResult !== null) { //If user could ne retrieved, sends "ok" message and user information
       res.json({result: dbResult, message: "ok"});
     } else {
       res.status(500).json({message: "error"}); //An unknown error happened
     }
   });
 },


 /***Site controllers***/

  /**
   * User signin function
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  userSignin(req: Request, res: Response): void {
    //Validation results
    const errors = validationResult(req);

    //If there are errors, sends a response
    if (!errors.isEmpty()) {
      res.status(422).json(errors.array());
      return;
    }

    //Calls a function in user model to find a password and email that was submited in the form
    model.userSignin(req, function(error: any | undefined, compared: boolean, dbResult: any | null) {
      if (dbResult !== null) {
        if (error == undefined) { //If password was undefined, means the function to compare passwords was sucessfully executed
          //If email exists and password matches, creates token and send back the results to the client, else sends "wrong login" error message
          if (compared !== false) {
              //Signs the token, containing user email, user id and the the hashed secret key
              const token = jwt.sign({
                    userEmail: req.body.email,
                    userId: dbResult._id as string
                  }, process.env.TOKEN as Secret);

              dbResult["jsonwebtoken"] = token; //Adds the token to the database results
              res.json({result: dbResult, message: "ok"}); //Sends to client response with database result and token
            } else {
              res.status(401).json({message: "Error. Check your email and password"}); //If email and password don't match, sends "Check Email and password" error message
            }
        } else {
          res.status(500).json({message: "error"}); //An unknown error happened when comparing passwords
        }
      } else {
        res.status(401).json({message: "Error. Check your email and password"}); //If email and password don't match, sends "Check Email and password" error message
      }
    });
  },

  /**
   * Create user function
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  createAccount(req: Request, res: Response): void {
    //Validation
    const errors = validationResult(req);

    //If there are validation errors, sends a response
    if (!errors.isEmpty()) {
      res.status(422).json({errors: errors.array()});
      return;
    }

    model.createAccount(req, function(error: boolean, dbResult: any | null) {
      if (error == true) {
        res.status(409).json({ message: "Email address already exists. Please, choose a different one."});
      } else {
        if (dbResult !== null) {
          res.json({result: dbResult, message: "ok"}); //Account was created
        } else {
          res.status(500).json({message: "error"}); //An unknown error happened
        }
      }
    });
  },

  /**
   * Recover password link function
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  forgotPasswordLink(req: Request, res: Response): void {
    //Validation results
    const errors = validationResult(req);

    //If there are validation errors, sends a response
    if (!errors.isEmpty()) {
      res.status(422).json({errors: errors.array()});
      return;
    }

    //If email exists, send email
    model.getUserWithEmail(req, function(dbResult: any | null) {
      //If forgot password link was found, proceeds
      if (dbResult !== null) {
        //Creates hash link
        const hash = crypto.createHash("md5").update(req.body.email + req.body.id + new Date() as string).digest("hex");

        //Email message
        const message = "Use this <a href='https://blog-ang.herokuapp.com/create-new-password/" + req.body.email + '/' + hash + "'>link</a> to reset your password." +
        "<br /> The link is valid for one hour. <br \><br \>  If you didn't request this password change, please disregard this email."

        //Email title
        const title = "Recover your password";

        //Sends mail
        sendMessage(message, title, req.body.email, function(mailResult: any | null) {
          if (mailResult !== null && mailResult.messageId !== null) { //If mail was sucesfully sent, saves hash in database
            //Saves link in database
            model.saveForgotPasswordLink(hash, req.body.email, function(error: any, dbResult: any | null) {
              if (dbResult !== null) {
                res.json({result: dbResult, message: "ok"});
              } else {
                res.status(500).json({message: "error"});
              }
            });
          } else {
            res.status(500).json({message: "error"}); //An unknown error happened
          }
        });
      } else {
        res.json({message: "ok"}); //Let's return ok, even if the email wasn't found
      }
    });
  },

  /**
   * Create new password function
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  createNewPassword(req: Request, res: Response): void {
    //Validation results
    const errors = validationResult(req);

    //If there are validation errors, sends a response
    if (!errors.isEmpty()) {
      res.status(422).json({errors: errors.array()});
      return;
    }

    model.getForgotPasswordLink(req.body.hash, function(error: any | undefined, dbResult: Array<any> | null) {
      if (dbResult !== null) { //If forgot password link was found, proceeds
        if (dbResult[0].dateDifference <= 60) { //If the link was created max 60 minutes before this password change, proceeds with the password change
          //Deletes forgot password link
          model.removeForgotPasswordLink(dbResult[0].hash);
          //Creates new password
          model.createNewPassword(req.body.password, req.body.email, function(error: any | undefined, dbResult: any | null) {
            if (error == undefined) { //If password was generated proceeds, else sends error message
              if (dbResult !== null && dbResult.modifiedCount >= 1) { //If password was updated, sends "ok" message
                res.json({result: dbResult, message: "ok"});
              } else {
                res.status(500).json({message: "error"}); //Database could not be updated, sends error message
              }
            } else {
              res.status(500).json({message: "error"}); //Error ocuccured when creating a new password we don't know why tho
            }
          });
        } else {
          model.removeForgotPasswordLink(dbResult[0].hash); //Deletes the hash if more than 60 minutes have passed
          res.json({message: "Error creating a new password. Invalid link"}); //If link has expired, sends "Invalid link" error message
        }
      } else {
        res.json({message: "Error creating a new password. Invalid link"}); //If link wasn't found (dbResult is null), sends "Invalid link" error message
      }
    });
  },

  /**
   * Delete user account function
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  deleteAccount(req: Request, res: Response): void {
    model.deleteAccount(req, function(error: any | undefined, compared: boolean, dbResult: any | null) {
      if (error == undefined) { //Error is undefined, meaning function to compare password was sucessfully called
        if (compared !== false) { //Password matches
          if (dbResult !== null && dbResult.deletedCount >= 1) { //Checks if the account was deleted
            res.json({message: "ok"}); //Account was deleted, sends "ok" message
          } else {
            res.status(500).json({message: "error"}); //An unknown error happened
          }
        } else {
          res.status(401).json({message: "Incorrect password. Please check your password and try again"}); //Incorrect password
        }
      } else {
        res.status(500).json({message: "error"}); //An error happened when trying to compare the password
      }
    });
  },

}
