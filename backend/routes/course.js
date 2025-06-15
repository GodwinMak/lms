const router = require("express").Router();
const {createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse} = require("../controller/course");

router.post("/", createCourse);
router.get("/",getAllCourses);
router.get("/:id", getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
