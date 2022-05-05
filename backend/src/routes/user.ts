import user from "../controllers/controller-users";
import express from "express";
import {body} from "express-validator";
import verify from '../middleware/check-user';

const router  = express.Router();

//Validation rules for user sign in form
const validateSignin =  [
  body("email").isEmail(),
  body("password").isLength({min: 6}),
];

//Validation rules for email
const validateEmail = body("email").isEmail();

//Validation rules for create new password
const validateForgotPasswordLink =  [
  body("email").isEmail(),
  body("hash").not().isEmpty(),
  body("password").not().isEmpty().isLength({min: 6})
];

//Validation rules for user sign up form
const validateSignup =  [
  body("email").isEmail(),
  body("password").isLength({min: 6}),
  body("name").not().not().isEmpty()
];

/***Admin Routes***/

/**
 * @get
 * get-user/:id/
 * Gets user information
 */
router.get("/get-user/:id", verify.authenticateUser, user.getUser);

/**
 * @post
 * update-user/
 * Update user information route
 */
router.post("/update-user/", verify.authenticateUser, user.updateUser);


/***Site Routes***/

/**
 * @post
 * send-recover-password-link/
 * Send recover password link route
 */
router.post("/send-forgot-password-link/", validateEmail, user.forgotPasswordLink);

/**
 * @post
 * create-new-password/
 * Create new password route
 */
router.post("/create-new-password/", validateForgotPasswordLink, user.createNewPassword);


/**
 * @post
 * user-signin/
 * User signin route
 */
router.post("/user-signin", validateSignin, user.userSignin);

/**
 * @post
 * create-account/
 * Creates a new user account
 */
router.post("/create-account",  user.createAccount);

/**
 * @post
 * delete-account/
 * Deletes a user account
 */
router.post("/delete-account",  user.deleteAccount);

export default router;
