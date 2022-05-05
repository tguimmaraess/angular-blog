import {Request} from "express";
import {connection, ObjectId} from "../config/mongo-connection";

const COLLECTION_NAME = "posts";

export default {

  /**
   * Get general data function. Gets general information for the panel by user id
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
   async getGeneralInformation(req: Request, func: any): Promise<void> {

     //Initializes connection
     const database = await connection();

     //Selects a collection
     const post = database.collection(COLLECTION_NAME);

     //Id of the signed in user
     const id = req.params.id;

     //Finds a general data by user id
     const dbResult: Array<any> | null = await post.aggregate(
      [
        {
          //Returns more than one result in the same query using $facet
          $facet: {
             //Counts total number of comments of all posts where the author is the signed in user
            "countComments": [
              {
                $project:
                {
                  countComments: { //Counts the number of items in comments array if it exists, if it doesn't, returns 0
                    "$cond": { //Condition for the aggregation
                      "if": { //Checks if comments is an array and if it exists and also checks if the author id is the id of the signed in user
                        "$and": [
                          {"$isArray": "$comments"}, //Does comment exist and it's an array?
                          {"$eq": ["$author._id", new ObjectId(id)]} //Grabs all documents where the signed in user id matches the author id
                        ]
                      },
                      "then": {$size: "$comments"}, //If conditions matchy, returns the size of the array (number of items in the array)
                      "else": 0 //Else returns 0
                    }
                  }
                }
              },
              {
                $group:
                {
                  _id: 0,
                  totalComments: {$sum: "$countComments"} //Groups by totalComments, summing up the total number of comments found in all posts where the user is the author
                }
              }
            ],
            //Counts total number of likes of all posts
            "countLikes": [
            {
              $group:
              {
                _id: 0,
                totalLikes:
                {
                  $sum: //Sums the total number of likes on all posts that belongs to the user and if it's null, then returns 0
                  {
                    "$cond": //Condition for the aggregation
                    {
                      "if": //If likes field exists and where the author id is the user
                      {
                        "$and": [
                          {"$ifNull":["$likes", false]}, //Does likes exist and its not null?
                          {"$eq": ["$author._id", new ObjectId(id)]} //Signed in user is the author
                        ]
                      },
                      "then": "$likes", //If condition is satisfied, grabs a sum of all likes. No aditional operation is needed since "likes" is an integer field
                      "else": 0 //Else returns 0
                    }
                  }
                }
              }
            }
            ],
            //Counts total number of posts
            "countPosts": [
            {
              $group:
              {
                _id: 0,
                //Counts the number of all user's posts
                totalPosts:
                {
                  $sum:
                  {
                    "$cond": //Condition for the aggregation
                    {
                      "if": //Checks if author id exists and if it matches the signed in user
                      {
                        "$and": [
                          {"$ifNull":["$_id", false]}, //Let's check if _id exists, if _id exists, means the document exists so we have at least one article
                          {"$eq": ["$author._id", new ObjectId(id)]} //Now let's check the articles where the author is the signed in user
                        ]
                      },
                      "then": {$sum: 1}, //sum: 1 Counts how many posts exist for the signed in user
                      "else": 0 //If conditions fail, it means we have no articles for the user, then we return 0
                    }
                  }
                }
              }
            }
            ],
            //Article that recieved more visits
            "getArticleWithMostVisits": [
              {
                $match: {
                  "author._id": new ObjectId(id), //Selects where the author id is the id of the signed in user
                  visits: {$exists: true} //Selects the posts where visits array field exists
                }
              },
              {
                $project: //Projects the fields we want
                {
                  _id: 1,
                  title: 1,
                  countMaxVisits: {$size: "$visits"} //Counts all items in the visits array from all posts where the author is the user
                }
              },

              {$group: {_id: "$_id", title:{"$first": "$title"}, visitsMax: {$max: "$countMaxVisits"}}}, //Groups by the id, title and visitsMax (counts the total number of items of visits array from all posts and returns the post that has more visits )
              {$sort: {visitsMax: -1}}, //Sorts before limitting and after group. Let's sort from the higher value to the smaller
              {$limit: 1}, //Limits to one result
            ],
            //Article that recieved less visits
            "getArticleWithLeastVisits": [
              {
                $match: {"author._id": new ObjectId(id), //Selects where the author id is the id of the signed in user
                visits: {$exists: true}}, //Selects the posts where visits array field exists
              },
              {
                $project:
                {
                  title: 1,
                  _id: 1,
                  countMinVisits: {$size: "$visits"} //Counts all items in the visits array from all posts where the author is the user
                }
              },
              {$group: {_id: "$_id", title: {"$first": "$title"}, visitsMin: {$min: "$countMinVisits"}}}, //Gets the id and the title of the post that has the least number of visits as well as the visits count
              {$sort: {visitsMin: 1}}, //Sorts results (from min to max)
              {$limit: 1}, //Limits to one result
            ]
          }
        }
      ]
    ).toArray();

    return func(dbResult);
  },

  /**
   * Get article visits per month function. Gets article visits for every month current year where the author is the signed in user
   * @param {Request} req - NodeJS express request
   * @param {function} func - Callback
   * @returns {function} - Callback with result
   */
  async getArticleVisitsPerMonth(req: Request, func: any): Promise<void> {

    //Initializes connection
    const database = await connection();

    //Selects a collection
    const post = database.collection(COLLECTION_NAME);

    //Id of the signed in user
    const id = req.params.id;

    //Finds all article visits per month (current year) using the user id
    const dbResult: Array<any> | null = await post.aggregate(
    [
      {
        $facet: { //Let's use facet to get more than one result in a single query as array
          "januaryArticlesVisits": [ //januaryArticlesVisits array generated by $facet operator that will contain the result of this query
            {
              $unwind:{ //Unwinds the array field "visits" in posts documents (Transforms the array into separated documents like a loop)
                path: "$visits", //Name of the field that we want to unwind
                preserveNullAndEmptyArrays: true //Preserve null and empty arrays, means they will be displayed
              }
            },
            {
             $group: //Groups by id and totalVisitsJanuary which is the value for the key januaryArticlesVisits
             {
               _id: 0,
               totalArticlesVisitsJanuary: {
                 $sum: { //Sums all items in the visits array that matches the condition
                   "$cond": { //Applies condition
                     "if": { //If the the below criterias match, sums up all documents (items in the array) from all the "posts" documents that match the criteria
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 1]}, //Gets all items in the array where month is 1 (January)
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]}, //Gets all items in the array in all documents where year is the current year
                        {"$eq": ["$author._id", new ObjectId(id)]} //And where the author is the signed in user
                      ]
                     },
                     "then": {$sum: 1}, //If the criteria is met, sums up the documents (items in the array that have been converted into separated documents by $unwind operator) from all posts documents
                     "else": 0 //Else returns 0
                    }
                  }
                }
              }
            }
          ],
          //Now we repeat the same query for the other months. They are basically the same thing as the above.
          //Let's just change the number of the month: 2 for February, 3 for March, 4 for April and so on until December.
          //Looks like a long query but it's the same thing, just changing the number of the month we want to get the data from
          "februaryArticlesVisits": [ //februaryArticlesVisits array
            {
              $unwind:{
                path: "$visits",
                preserveNullAndEmptyArrays: true
              }
            },
            {
             $group:
             {
               _id: 0,
               totalArticlesVisitsFebruary: { //totalArticlesVisitsFebruary value for februaryArticlesVisits array
                 $sum: {
                   "$cond": {
                     "if": {
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 2]},
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]},
                        {"$eq": ["$author._id", new ObjectId(id)]}
                      ]
                     },
                     "then": {$sum: 1},
                     "else": 0
                    }
                  }
                }
              }
            }
          ],
          "marchArticlesVisits": [ //marchArticlesVisits array
            {
              $unwind:{
                path: "$visits",
                preserveNullAndEmptyArrays: true
              }
            },
            {
             $group:
             {
               _id: 0,
               totalArticlesVisitsMarch: { //totalArticlesVisitsMarch value for marchArticlesVisits array
                 $sum: {
                   "$cond": {
                     "if": {
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 3]},
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]},
                        {"$eq": ["$author._id", new ObjectId(id)]}
                      ]
                     },
                     "then": {$sum: 1},
                     "else": 0
                    }
                  }
                }
              }
            }
          ],
          "aprilArticlesVisits": [ //aprilArticlesVisits array
            {
              $unwind:{
                path: "$visits",
                preserveNullAndEmptyArrays: true
              }
            },
            {
             $group:
             {
               _id: 0,
               totalArticlesVisitsApril: { //totalArticlesVisitsApril value for aprilArticlesVisits array
                 $sum: {
                   "$cond": {
                     "if": {
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 4]},
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]},
                        {"$eq": ["$author._id", new ObjectId(id)]}
                      ]
                     },
                     "then": {$sum: 1},
                     "else": 0
                    }
                  }
                }
              }
            }
          ],
          "mayArticlesVisits": [ //mayArticlesVisits array
            {
              $unwind:{
                path: "$visits",
                preserveNullAndEmptyArrays: true
              }
            },
            {
             $group:
             {
               _id: 0,
               totalArticlesVisitsMay: { //totalArticlesVisitsMay value for mayArticlesVisits array
                 $sum: {
                   "$cond": {
                     "if": {
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 5]},
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]},
                        {"$eq": ["$author._id", new ObjectId(id)]}
                      ]
                     },
                     "then": {$sum: 1},
                     "else": 0
                    }
                  }
                }
              }
            }
          ],
          "juneArticlesVisits": [ //juneArticlesVisits array
            {
              $unwind:{
                path: "$visits",
                preserveNullAndEmptyArrays: true
              }
            },
            {
             $group:
             {
               _id: 0,
               totalArticlesVisitsJune: { //totalArticlesVisitsJune value for juneArticlesVisits array
                 $sum: {
                   "$cond": {
                     "if": {
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 6]},
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]},
                        {"$eq": ["$author._id", new ObjectId(id)]}
                      ]
                     },
                     "then": {$sum: 1},
                     "else": 0
                    }
                  }
                }
              }
            }
          ],
          "julyArticlesVisits": [ //julyArticlesVisits array
            {
              $unwind:{
                path: "$visits",
                preserveNullAndEmptyArrays: true
              }
            },
            {
             $group:
             {
               _id: 0,
               totalArticlesVisitsJuly: { //totalArticlesVisitsJuly value for julyArticlesVisits array
                 $sum: {
                   "$cond": {
                     "if": {
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 7]},
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]},
                        {"$eq": ["$author._id", new ObjectId(id)]}
                      ]
                     },
                     "then": {$sum: 1},
                     "else": 0
                    }
                  }
                }
              }
            }
          ],
          "augustArticlesVisits": [ //augustArticlesVisits array
            {
              $unwind:{
                path: "$visits",
                preserveNullAndEmptyArrays: true
              }
            },
            {
             $group:
             {
               _id: 0,
               totalArticlesVisitsAugust: { //totalArticlesVisitsAugust value for augustArticlesVisits array
                 $sum: {
                   "$cond": {
                     "if": {
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 8]},
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]},
                        {"$eq": ["$author._id", new ObjectId(id)]}
                      ]
                     },
                     "then": {$sum: 1},
                     "else": 0
                    }
                  }
                }
              }
            }
          ],
          "septemberArticlesVisits": [ //septemberArticlesVisits array
            {
              $unwind:{
                path: "$visits",
                preserveNullAndEmptyArrays: true
              }
            },
            {
             $group:
             {
               _id: 0,
               totalArticlesVisitsSeptember: { //totalArticlesVisitsSeptember value for semptemberArticlesVisits array
                 $sum: {
                   "$cond": {
                     "if": {
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 9]},
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]},
                        {"$eq": ["$author._id", new ObjectId(id)]}
                      ]
                     },
                     "then": {$sum: 1},
                     "else": 0
                    }
                  }
                }
              }
            }
          ],
          "octoberArticlesVisits": [ //octoberArticlesVisits array
            {
              $unwind:{
                path: "$visits",
                preserveNullAndEmptyArrays: true
              }
            },
            {
             $group:
             {
               _id: 0,
               totalArticlesVisitsOctober: { //totalArticlesVisitsOctober value for octoberArticlesVisits array
                 $sum: {
                   "$cond": {
                     "if": {
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 10]},
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]},
                        {"$eq": ["$author._id", new ObjectId(id)]}
                      ]
                     },
                     "then": {$sum: 1},
                     "else": 0
                    }
                  }
                }
              }
            }
          ],
          "novemberArticlesVisits": [ //novemberArticlesVisits array
            {
              $unwind:{
                path: "$visits",
                preserveNullAndEmptyArrays: true
              }
            },
            {
             $group:
             {
               _id: 0,
               totalArticlesVisitsNovember: { //totalArticlesVisitsNovember value for novemberArticlesVisits array
                 $sum: {
                   "$cond": {
                     "if": {
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 11]},
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]},
                        {"$eq": ["$author._id", new ObjectId(id)]}
                      ]
                     },
                     "then": {$sum: 1},
                     "else": 0
                    }
                  }
                }
              }
            }
          ],
          "decemberArticlesVisits": [ //decemberArticlesVisits array
            {
              $unwind:{
                path: "$visits",
                preserveNullAndEmptyArrays: true
              }
            },
            {
             $group:
             {
               _id: 0,
               totalArticlesVisitsDecember: { //totalArticlesVisitsDecember value for decemberArticlesVisits array
                 $sum: {
                   "$cond": {
                     "if": {
                       "$and": [
                        {"$eq":[{$month: "$visits.date"}, 12]},
                        {"$eq":[{$year: "$visits.date"}, new Date().getFullYear()]},
                        {"$eq": ["$author._id", new ObjectId(id)]}
                      ]
                     },
                     "then": {$sum: 1},
                     "else": 0
                    }
                  }
                }
              }
            }
          ],
        }
      }
    ]
   ).toArray();

   return func(dbResult);
  }

}
