import express from "express";
import { auth } from "../middleware/auth.js";
import {
  approveCommunity,
  approveEvent,
  createCommunity,
  createEvent,
  deleteCommunity,
  deleteEvent,
  getAllEvents,
  getEnrolledEvents,
  getEventsByCommunity,
  getOngoingEvents,
  getPendingCommunities,
  getPostsByCommunity,
  getTrendingTags,
  getUpcomingEvents,
  getUserCommunities,
  getUserCreatedEvents,
  joinCommunity,
  joinEvent,
  leaveCommunity,
  listCommunities,
  listCommunitiesMembers,
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
communityRouter.post("/approve-community", auth, approveCommunity);
communityRouter.get(
  "/getCommunityMembers/:commmunityId",
  listCommunitiesMembers
);

communityRouter.get("/get-community", auth, getUserCommunities);
communityRouter.get("/getupcoming", getUpcomingEvents);
communityRouter.get("/getongoing", getOngoingEvents);
communityRouter.post("/joinEvent/:eventId", auth, joinEvent);
communityRouter.get("/enrolled-event", auth, getEnrolledEvents);
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
communityRouter.get("/getUserEvents", auth, getUserCreatedEvents); // Approve an event
communityRouter.get("/getCommunityEvents/:communityId", getEventsByCommunity); // Approve an event
communityRouter.get("/getAllEvents", getAllEvents); // Approve an event

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
communityRouter.post("/join-community:communityId", auth, joinCommunity);
communityRouter.delete("/leave-community", auth, leaveCommunity);
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
