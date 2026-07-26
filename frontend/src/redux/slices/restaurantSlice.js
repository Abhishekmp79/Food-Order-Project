import { createSlice } from "@reduxjs/toolkit";
import {
  getRestaurants,
  createRestaurant,
  deleteRestaurant,
  analyzeReviews,
} from "../actions/restaurantActions";

const initialState = {
  restaurants: [],
  count: 0,
  loading: false,
  error: null,
  showVegOnly: false,
  pureVegRestaurantsCount: 0,
  creating: false,
  createError: null,
  deleting: false,
  deleteError: null,
  analyzingRestaurantId: null,
  analyzeError: null,
};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    sortByRatings: (state) => {
      state.restaurants.sort((a, b) => b.ratings - a.ratings);
    },
    sortByReviews: (state) => {
      state.restaurants.sort((a, b) => b.numOfReviews - a.numOfReviews);
    },
    toggleVegOnly: (state) => {
      state.showVegOnly = !state.showVegOnly;
      state.pureVegRestaurantsCount = calculatePureVegCount(
        state.restaurants,
        state.showVegOnly
      );
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRestaurants.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.restaurants = action.payload.restaurants;
        state.count = action.payload.count;
        state.pureVegRestaurantsCount = calculatePureVegCount(
          state.restaurants,
          true
        );
      })
      .addCase(getRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch restaurants";
      })
      .addCase(createRestaurant.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.creating = false;
        state.restaurants.push(action.payload.data);
        state.count += 1;
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      })
      .addCase(deleteRestaurant.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.deleting = false;
        state.restaurants = state.restaurants.filter(
          (restaurant) => restaurant._id !== action.payload.id
        );
        state.count = Math.max(0, state.count - 1);
        state.pureVegRestaurantsCount = calculatePureVegCount(
          state.restaurants,
          true
        );
      })
      .addCase(deleteRestaurant.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload;
      })
      .addCase(analyzeReviews.pending, (state, action) => {
        state.analyzingRestaurantId = action.meta.arg;
        state.analyzeError = null;
      })
      .addCase(analyzeReviews.fulfilled, (state, action) => {
        state.analyzingRestaurantId = null;
        state.analyzeError = null;

        const { restaurantId, aiData } = action.payload;
        const restaurant = state.restaurants.find(
          (item) => item._id === restaurantId
        );

        if (restaurant) {
          restaurant.reviewSentiment = aiData.sentiment;
          restaurant.reviewSummaryBullets = aiData.summaryBullets;
          restaurant.reviewTopMentions = aiData.topMentions;
        }
      })
      .addCase(analyzeReviews.rejected, (state, action) => {
        state.analyzingRestaurantId = null;
        state.analyzeError = action.payload;
      });
  },
});

export const {
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
  clearError,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;

const calculatePureVegCount = (restaurants, showVegOnly) => {
  if (!showVegOnly) return restaurants.length;

  return restaurants.filter((restaurant) => restaurant.isVeg).length;
};
