import express from "express";
import { getSubjects, getDates, getGrades} from "../controllers/studentTable.js";

const router = express.Router();

router.post("/subjects", getSubjects);
router.post("/dates", getDates);
router.post("/grades", getGrades);

export default router;