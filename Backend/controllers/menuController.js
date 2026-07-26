//show all menus
//create menu
//deletemenu
//add items into menu

const Menu = require("../models/menu");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const restaurant = require("../models/restaurant");

// Get all menus
exports.getAllMenus = catchAsyncErrors(async (req, res, next) => {
    const filter = req.params.restaurantId
        ? { restaurant: req.params.restaurantId }
        : {};

    const menu = await Menu.find(filter).populate("menu.items");

    res.status(200).json({
        status: "success",
        count: menu.length,
        data: menu,
    });
});

// Create menu
exports.createMenu = catchAsyncErrors(async (req, res, next) => {
    const menu = await Menu.create(req.body);

    res.status(201).json({
        status: "success",
        data: menu,
    });
});

// Delete menu
exports.deleteMenu = catchAsyncErrors(async (req, res, next) => {
    const menu = await Menu.findByIdAndDelete(req.params.menuId);

    if (!menu) {
        return next(new ErrorHandler("No menu found with that ID", 404));
    }

    res.status(204).json({
        status: "success",
    });
});

// Add items into menu
exports.addItemsToMenu = catchAsyncErrors(async (req, res, next) => {
    const { category, foodItemId } = req.body;
    const menuId = req.params.menuId;

    if (!menuId) {
        return next(new ErrorHandler("Please provide menuID", 400));
    }

    const menu = await Menu.findById(menuId);

    if (!menu) {
        return next(new ErrorHandler("No menu found with that ID", 404));
    }

    let cat = menu.menu.find((c) => c.category === category);

    if (!cat) {
        cat = { category, items: [] };
        menu.menu.push(cat);
    }

    cat.items.push(foodItemId);

    await menu.save();
    await menu.populate("menu.items");

    res.status(200).json({
        status: "success",
        data: menu,
    });
});