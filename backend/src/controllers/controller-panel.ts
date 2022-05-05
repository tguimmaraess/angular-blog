import express, {Request, Response} from "express";
import model from "../models/model-panel";
import {validationResult} from "express-validator";

export default {

  /**
   * Get general data function  -  Gets general information for the panel
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  getGeneralInformation(req: Request, res: Response): void {
    //Gets general information from database
    model.getGeneralInformation(req, function(dbResult: any | null) {
      if(dbResult !== null){ //If information could be retrieved, sends "ok" message along with the information
        res.json({result: dbResult, message: "ok"});
      }else{
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

  /**
   * Gets article visits per month
   * @param {Request} req  -  NodeJS express request
   * @param {Response} res -  NodeJS express response
   */
  getArticleVisitsPerMonth(req: Request, res: Response): void {
    //If email and password macthes, returns "ok" message
    model.getArticleVisitsPerMonth(req, function(dbResult: any | null) {
      if(dbResult !== null){ //If articles visits per month could be retrieved, sends the database resutls with an "ok" message
        res.json({result: dbResult, message: "ok"});
      }else{
        res.status(500).json({message: "error"}); //An unknown error happened
      }
    });
  },

}
