import express from "express";
import { auth } from "../middleware/auth.js";
// import {
//   createGroup,
//   getGroups,
//   joinGroup,
//   messageGroup,
// } from "../controllers/council/groupController.js";
// import { auth } from "../middleware/auth.js";
import {
  getTopUpvotedMessages,
  getUserGroups,
} from "./../controllers/council/groupController.js";

const councilRoutes = express.Router();

councilRoutes.get("/getTopVotedComments", getTopUpvotedMessages);
councilRoutes.get("/getUserJoined", auth, getUserGroups);

// councilRoutes.post("/joinGroup/:groupId", auth, joinGroup);
// councilRoutes.post("/:groupId", auth, messageGroup);
// councilRoutes.get("/getGroups", auth, getGroups);
export default councilRoutes;
