import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getMenus,
  addItemToMenu,
  createMenu,
} from "../redux/actions/menuActions";
import Fooditem from "./Fooditem.jsx";
import api from "../utils/api";

const Menu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { menus, menuId, loading, error, addError } = useSelector(
    (state) => state.menus
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [showMenuCreate, setShowMenuCreate] = useState(false);
  const [newMenuCategory, setNewMenuCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemToAdd, setItemToAdd] = useState({
    category: "",
    foodItemId: "",
  });
  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    imageUrl: "",
  });

  useEffect(() => {
    dispatch(getMenus(id));
  }, [dispatch, id]);

  const submitMenuCreation = async (e) => {
    e.preventDefault();

    if (!newMenuCategory.trim()) return;

    const result = await dispatch(
      createMenu({ restaurantId: id, category: newMenuCategory.trim() })
    );

    if (createMenu.fulfilled.match(result)) {
      dispatch(getMenus(id));
      setShowMenuCreate(false);
      setNewMenuCategory("");
    }
  };

  const submitNewFood = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...newFood,
        price: parseFloat(newFood.price) || 0,
        stock: parseInt(newFood.stock, 10) || 0,
        restaurant: id,
      };

      const { data } = await api.post("/v1/eats/item", payload, {
        headers: { "Content-Type": "application/json" },
      });

      const created = data.data;

      setItemToAdd((prev) => ({
        ...prev,
        foodItemId: created._id,
      }));
      setNewFood({
        name: "",
        price: "",
        description: "",
        stock: "",
        imageUrl: "",
      });

      return created;
    } catch (err) {
      console.error("unable to create food item", err);
      alert(err.response?.data?.message || err.message);
      return null;
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading menus...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : menus && menus.length > 0 ? (
        menus.map((menu, index) => (
            <div key={`${menu.category}-${index}`}>
              <div className="d-flex align-items-center">
                <h2 className="mr-2">{menu.category}</h2>

                {isAuthenticated && user?.role === "admin" && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      setItemToAdd({
                        category: menu.category,
                        foodItemId: "",
                      });
                      setShowAddModal(true);
                    }}
                  >
                    + Item
                  </button>
                )}
              </div>

              <hr />

              {menu.items && menu.items.length > 0 ? (
                <div className="row">
                  {menu.items.map((fooditem) => (
                    <Fooditem
                      key={fooditem._id}
                      fooditem={fooditem}
                      restaurant={id}
                    />
                  ))}
                </div>
              ) : (
                <p>No menu items available.</p>
              )}
            </div>
          ))
      ) : (
        <p>No menus available.</p>
      )}

      {isAuthenticated && user?.role === "admin" && (
        <div className="my-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowMenuCreate(true)}
          >
            + Add Menu
          </button>
        </div>
      )}

      {showMenuCreate && (
        <div className="create-modal">
          <div className="create-content">
            <h3>Create Menu Category</h3>

            <form onSubmit={submitMenuCreation}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={newMenuCategory}
                  onChange={(e) => setNewMenuCategory(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-primary" type="submit">
                Create
              </button>

              <button
                className="btn btn-secondary ml-2"
                type="button"
                onClick={() => setShowMenuCreate(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="create-modal">
          <div className="create-content">
            <h3>Add Food Item</h3>

            {addError && <p className="text-danger">{addError}</p>}

            <form
              onSubmit={async (e) => {
                const created = await submitNewFood(e);

                if (created?._id && menuId) {
                  const result = await dispatch(
                    addItemToMenu({
                      menuId,
                      category: itemToAdd.category,
                      foodItemId: created._id,
                      restaurantId: id,
                    })
                  );

                  if (addItemToMenu.fulfilled.match(result)) {
                    dispatch(getMenus(id));
                    setShowAddModal(false);
                  }
                }
              }}
            >
              <div className="form-group">
                <label>Menu Category</label>

                <select
                  value={itemToAdd.category}
                  onChange={(e) =>
                    setItemToAdd((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Select</option>
                  {menus.map((menu, index) => (
                    <option
                      key={`${menu.category}-${index}`}
                      value={menu.category}
                    >
                      {menu.category}
                    </option>
                  ))}
                </select>
              </div>

              <h5 className="mt-3">Create New Food Item</h5>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={newFood.name}
                  onChange={(e) =>
                    setNewFood((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group d-flex align-items-center">
                <input
                  type="number"
                  placeholder="Price"
                  value={newFood.price}
                  onChange={(e) =>
                    setNewFood((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group d-flex align-items-center">
                <input
                  type="text"
                  placeholder="Description"
                  value={newFood.description}
                  onChange={(e) =>
                    setNewFood((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />

                <button
                  type="button"
                  className="btn btn-sm btn-info ml-2"
                  onClick={async () => {
                    if (!newFood.name) {
                      alert("Enter name first");
                      return;
                    }

                    try {
                      const { data } = await api.post(
                        "/v1/eats/ai/generate",
                        {
                          name: newFood.name,
                          category: itemToAdd.category || "",
                          spiceLevel: "Medium",
                          price: newFood.price || 0,
                        },
                      );

                      setNewFood((prev) => ({
                        ...prev,
                        description: data.data.description,
                      }));
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  AI desc
                </button>
              </div>

              <div className="form-group">
                <input
                  type="number"
                  placeholder="Stock"
                  value={newFood.stock}
                  onChange={(e) =>
                    setNewFood((prev) => ({
                      ...prev,
                      stock: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newFood.imageUrl}
                  onChange={(e) =>
                    setNewFood((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                />
              </div>

              <button className="btn btn-primary" type="submit">
                Add
              </button>

              <button
                className="btn btn-secondary ml-2"
                type="button"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
