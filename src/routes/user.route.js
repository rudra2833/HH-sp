import { Router } from "express";

import { loginUser, registerUser } from "../controllers/user.controller.js";

import { registerService } from "../controllers/service.controller.js";

import {submitFeedback } from "../controllers/feedback.controller.js"

import { search } from "../controllers/search.controller.js";

const router = Router();



// router.route("/register").post(registerUser)

// router.route("/login").post(loginUser)

// router.route("/serviceprovider").post(registerService)

// router.route("/submit").post(submitFeedback)s

// router.route("/search").post(search)

export default router;