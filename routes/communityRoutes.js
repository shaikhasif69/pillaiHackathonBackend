import express from "express";
import { auth } from "../middleware/auth.js";
import {
  approveCommunity,
  approveEvent,
  createCommunity,
  createEvent,
  deleteCommunity,
  deleteEvent,
  getPendingCommunities,
  getPostsByCommunity,
  getTrendingTags,
  getUserCommunities,
  getUserCreatedEvents,
  joinCommunity,
  listCommunities,
  updateCommunity,
  updateEvent,
} from "./../controllers/communityController.js";
import {
  deletePost,
  getApprovedEvents,
  getPostsByTag,
  getTrendingTags1,
  getUserFeed,
  updatePost,
  writePost,
} from "../controllers/postController.js";
import upload from "../helpers/multer.js";

const communityRouter = express.Router();
//  community Routes
communityRouter.post(
  "/create-community",
  auth,
  upload.single("image"),
  createCommunity
);
communityRouter.post("/approve-community", auth, approveCommunity);
communityRouter.get("/pending-community-approval", auth, getPendingCommunities);

communityRouter.get("/get-community", auth, getUserCommunities);

// EVENTS Routes
communityRouter.post("/events", auth, upload.single("image"), createEvent); // Create an event
communityRouter.put(
  "/update-event/:eventId",
  auth,
  upload.single("image"),
  updateEvent
); // update an event
communityRouter.delete("/delete-event/:eventId", auth, deleteEvent); // update an event
communityRouter.post("/events/approve", auth, approveEvent); // Approve an event
communityRouter.get("/getAdminEvents", auth, getUserCreatedEvents); // Approve an event

communityRouter.get(
  "/communities/:communityId/events",
  auth,
  getApprovedEvents
); // Get approved events for a community

communityRouter.patch(
  "/update-community/:communityId",
  auth,
  upload.single("image"),
  updateCommunity
);
communityRouter.delete("/delete-community/:communityId", auth, deleteCommunity);
communityRouter.post("/join-community", auth, joinCommunity);
communityRouter.get("/communityPost/:communityId", getPostsByCommunity);
communityRouter.delete("/deletePost", auth, deletePost); //ADMIN CAN DELETE USER POST tOOO
communityRouter.get("/getPosts", auth, getUserFeed);

// WRITE POST  CRUD  ROUTES
communityRouter.post("/createPost", auth, upload.single("image"), writePost);
communityRouter.patch("/updatePost", auth, upload.single("image"), updatePost);
communityRouter.delete("/deletePost", auth, deletePost);

// SPECIFIC ROUTES
communityRouter.get("/list-communities", listCommunities);
communityRouter.get("/trendingTags", getTrendingTags);
communityRouter.get("/trends/:communityId", getTrendingTags1);
communityRouter.get("/posts/:communityId/tags/:tagId/posts", getPostsByTag);

export default communityRouter;
