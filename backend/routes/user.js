const router = require("express").Router();
const {createUser, getAllUsers, getUserById, updateUser, deleteUser, login} = require("../controller/user");

router.post("/", createUser);
router.post("/login", login);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
