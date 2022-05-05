import article from "../controllers/controller-articles";
import {body, param} from "express-validator";
import express from "express";
import verify from '../middleware/check-user';

const router = express.Router();

const validateArticle = [
  body("title").not().isEmpty(),
  body("post").isLength({min: 100}),
];

const validateComment = [
  body("title").not().isEmpty(),
  body("comment").not().isEmpty().isLength({min: 3}),
];

/***Admin Routes***/

/**
 * @post
 * create-article
 * Create article route
 */
router.post("/create-article", validateArticle, verify.authenticateUser, article.createArticle.bind(article));

/**
 * @post
 * edit-article/
 * Updates article by article id route
 */
router.post("/edit-article", validateArticle, verify.authenticateUser, article.editArticle);

/**
* @get
* /get-articles/:id
* Get all user articles route by the author id
*/
router.get("/get-articles/:id", verify.authenticateUser, article.getArticles);

/**
* @get
* delete-article/:articleId/
* Delete article by article id route
*/
router.get("/delete-article/:articleId", verify.authenticateUser, article.deleteArticle);

/**
 * @get
 * get-article-for-edit/:articleId/:id/
 * Get an article by user id and article id route
 */
router.get("/get-article-for-edit/:articleId/:id", article.getArticleForEdit);


/***Site Routes***/

/**
 * @get
 * get-all-articles/
 * Get all articles route
 */
router.get("/get-all-articles", article.getAllArticles);

/**
 * @get
 * get-article/:articleId/
 * Get one article by id route
 */
router.get("/get-article/:articleId", article.getArticle);

/**
 * @post
 * like-article/
 * Updates article by article id route
 */
router.post("/like-article", article.likeArticle);

/**
 * @post
 * add-comment/
 * Post a comment route
 */
router.post("/add-comment", validateComment, article.addComment);

/**
 * @get
 * get-comment/:articleId
 * Get all comments of certain article route
 */
router.get("/get-comments/:articleId", article.getComments);

/**
 * @get
 * add-view/:articleId/
 * Add a view (visit) to an article route
 */
router.get("/add-article-view/:articleId", article.addArticleView);

export default router;
