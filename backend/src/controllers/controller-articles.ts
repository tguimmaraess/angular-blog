import {Request, Response} from "express";
import model from "../models/model-articles";
import {validationResult} from "express-validator";

const path = require("path");

export default {

/***Admin controllers***/

  /**
   * Create article function
   * @param {Request} req - NodeJS express request
   * @param {Response} res - NodeJS express response
   */
  createArticle(req: Request, res: Response): void {
    //Form validation result
    const errors = validationResult(req);

    //If there are errors, sends a response
    if (!validationResult(req).isEmpty()) {
      res.status(422).json(errors.array());
      return;
    }

    //Creates article if everything is OK
    model.createArticle(req, function(dbResult: any | null) {
      if (dbResult !== null && dbResult.acknowledged == true) { //If result isn't empty and acknowledged is true, sends "ok" message
        res.json({message: "ok"});
      } else {
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

  /**
   * Update article function
   * @param {Request} req - NodeJS express request
   * @param {Response} res - NodeJS express response
   */
  editArticle(req: Request, res: Response): void {
    //Form validation result
    const errors = validationResult(req);

    //If there are errors, sends a response
    if (!validationResult(req).isEmpty()) {
      res.status(422).json(errors.array());
      return;
    }

    //Calls model to edit article
    model.editArticle(req, function(dbResult: any | null) {
      //If modifedCount is equal or higher than 1 (usually 1), it means the edit was successfull
      if (dbResult !== null && dbResult.modifiedCount >= 1) {
        res.json({message: "ok"}); //Sends "ok" message
      } else {
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

  /**
   * Get article for edit function
   * @param {Request} req  - NodeJS express request
   * @param {Response} res - NodeJS express response
   */
  getArticleForEdit(req: Request, res: Response): void {
    //Form validation result
    const errors = validationResult(req);

    //If there are errors, sends a response
    if(!validationResult(req).isEmpty()){
      res.status(401).json(errors.array());
      return;
    }

    //Gets one article by user id
    model.getArticleForEdit(req, function(dbResult: any | null) {
      if (dbResult !== null) { //If article could be sucessfully retrieved to be edited, sends "ok" message
        res.json({result: dbResult, message: "ok"});
      } else {
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

  /**
   * Delete article function
   * @param {Request} req - NodeJS express request
   * @param {Response} res - NodeJS express response
   */
  deleteArticle(req: Request, res: Response): void {
    //Deletes an article from mongodb based on its id
    model.deleteArticle(req, function(dbResult: any | null) {
      //If MongoDB response wasn't null and deletedCount is 1 (or higher but should be 1), it means the article was deleted
      if (dbResult !== null && dbResult.deletedCount >= 1) {
        res.json({message: "ok"});
      } else {
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

  /**
   * Get all articles for a certain user function
   * @param {Request} req - NodeJS express request
   * @param {Response} res - NodeJS express response
   */
  getArticles(req: Request, res: Response): void {
    //Gets all articles
    model.getArticles(req, function(dbResult: Array<any> | null) {
      if (dbResult !== null) { //If all articles could be retrieved for a certain user, sends "ok" message
        res.json({result: dbResult, message: "ok"});
      } else {
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },


/***Site controllers***/

  /**
   * Get all articles function
   * @param {Request} req - NodeJS express request
   * @param {Response} res - NodeJS express response
   */
  getAllArticles(req: Request, res: Response): void {
    //Gets all articles
    model.getAllArticles(function(dbResult: Array<any> | null) {
      if (dbResult !== null) { //If MongoDB result isn't null, it means the articles could be retrieved, then sends "ok" message
        res.json({result: dbResult, message: "ok"});
      } else {
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

  /**
   * Add view function - Adds a view (visit) to an article
   * @param {Request} req - NodeJS express request
   * @param {Response} res - NodeJS express response
   */
  addArticleView(req: Request, res: Response): void {
    //Adds a view to an article (for statistics) without having to confirm if the record was inserted
    model.addArticleView(req);
    res.json(); //Just sends empty response
  },

  /**
   * Get one article by id function
   * @param {Request} req - NodeJS express request
   * @param {Response} res - NodeJS express response
   */
  getArticle(req: Request, res: Response): void {
    //Gets one article
    model.getArticle(req, function(dbResult: any | null) {
      if (dbResult !== null) { //If an article was sucesssfully retrieved, sends "ok" message and the result of the query with the article information
        res.json({result: dbResult, message: "ok"});
      } else {
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

  /**
   * Like article function
   * @param {Request} req - NodeJS express request
   * @param {Response} res - NodeJS express response
   */
  likeArticle(req: Request, res: Response): void {
    //Likes an article
    model.likeArticle(req, function(dbResult: any | null) {
      if (dbResult !== null && dbResult.modifiedCount >= 1) { //If article was liked, sends "ok" message
        res.json({message: "ok"});
      } else {
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

  /**
   * Add comment function
   * @param {Request} req - NodeJS express request
   * @param {Response} res - NodeJS express response
   */
  addComment(req: Request, res: Response): void {
    //Form validation result
    const errors = validationResult(req);

    //If there are validation errors, sends a response
    if (!errors.isEmpty()) {
      res.status(422).json({errors: errors.array()});
      return;
    }

    //Calls model to add a comment
    model.addComment(req, function(dbResult: any | null) {
      if (dbResult !== null && dbResult.modifiedCount >= 1) { //If comment was sucessfully added, sends "ok" message
        res.json({message: "ok"});
      } else {
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

  /**
   * Get comments of a certain article function
   * @param {Request} req - NodeJS express request
   * @param {Response} res - NodeJS express response
   */
  getComments(req: Request, res: Response): void {
    //Model gets comments of a certain article passing the article id
    model.getComments(req, function(dbResult: Array<any> | null) {
      if (dbResult !== null) { //If comments were retrieved, returns all comments of that article and "ok" message
        res.json({result: dbResult, message: "ok"});
      } else {
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

}
