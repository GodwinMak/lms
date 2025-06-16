const router = require("express").Router();
const {createUser, getAllUsers, getUserById, updateUser, deleteUser, login, updatePassword} = require("../controller/user");

router.post("/", createUser);
router.post("/login", login);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/password/:id", updatePassword);

module.exports = router;
