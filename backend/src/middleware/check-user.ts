import jwt, {Secret, JwtPayload} from "jsonwebtoken";
import {Request, Response} from "express";
import dotenv from 'dotenv';
dotenv.config();

export default {

  /**
   * authenticateUser function checks if json web token is valid or not
   * @params {req} Request - NodeJS express request
   * @params {res} Response - NodeJS express response
   */
  authenticateUser(req: Request, res: Response, next: any) {
   try {
     //Verifies token sent in url
     const decoded = jwt.verify(req.query.jsonwebtoken as string, process.env.TOKEN as Secret);
     //Defines parameters (params and body) id with result from token, so that any eventual tampering will be overwritten
     //id means the user id, any other id will be specified, such as articleId (id of the article)
     req.params.id = (decoded as JwtPayload).userId;
     req.body.id = (decoded as JwtPayload).userId;
   } catch(e: any) {
     //If token isn't correct, sends Error message
     res.status(403).json({message: 'Error'});
     return;
   }
   next(); //If everything is OK, goes to the next request
  }

}
