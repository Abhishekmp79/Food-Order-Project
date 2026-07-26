const express = require('express');

const router = express.Router({mergeParams: true});

const {
    getAllMenus, 
    createMenu, 
    deleteMenu,
    addItemsToMenu} = require("../controllers/menuController");

const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");

router.route("/").get(getAllMenus).post(protect, authorizeRoles("admin"), createMenu);
router.route("/:menuId").delete(protect, authorizeRoles("admin"), deleteMenu);
router.route("/:menuId/items").post(protect, authorizeRoles("admin"), addItemsToMenu);
module.exports = router;