const router = require("express").Router();
const userController = require("../../../controllers/user");

// update user
router.put("/update", userController.update);

router.post("delete", userController.delete);

router.get("/getAll", userController.getAll);

module.exports = router;
