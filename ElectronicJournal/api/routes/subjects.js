import express from "express";
import {getSubjects} from "../controllers/subject.js";

const router = express.Router();

router.post("/", getSubjects);

export default router;