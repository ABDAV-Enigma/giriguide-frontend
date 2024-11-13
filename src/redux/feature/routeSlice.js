import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchRoute = createAsyncThunk(
  "route/fetchRoute",
  async ({ page = 1, size = 5, title }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/location-routes?page=${page}&size=${size}` +
          (title ? `&title=${title}` : "")
      );
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const createRoute = createAsyncThunk(
  "route/createRoute",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/location-routes`, data);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);
export const fetchRouteDetailById = createAsyncThunk(
  "route/fetchRouteDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/location-routes/${id}`);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);
export const updateRoute = createAsyncThunk(
  "route/updateRoute",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/location-routes/${id}`,
        data
      );
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const deleteRoute = createAsyncThunk(
  "route/deleteRoute",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/location-routes/${id}`);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);
const routeSlice = createSlice({
  name: "route",
  initialState: {
    routes: [],
    routesDetail: {
      title: "",
      description: "",
      routes: [],
    },
    paging: null,
    fragmentRoute: [],
    idRouteForUpdate: null,
    isRouteUpdating: false,
    status: "",
    error: null,
  },
  reducers: {
    setIsRouteUpdating: (state, action) => {
      state.isRouteUpdating = action.payload;
    },
    addFragmentRoute: (state, action) => {
      state.fragmentRoute.push(action.payload);
    },
    removeFragmentRoute: (state, action) => {
      if (
        action.payload.index >= 0 &&
        action.payload.index < state.fragmentRoute.length
      ) {
        state.fragmentRoute.splice(action.payload.data, action.payload.index);
      }
    },
    updateFragmentRoute: (state, action) => {
      const { index, data } = action.payload;
      if (index >= 0 && index < state.fragmentRoute.length) {
        state.fragmentRoute[index] = { ...state.fragmentRoute[index], ...data };
        if (data.to && index + 1 < state.fragmentRoute.length) {
          state.fragmentRoute[index + 1].from = data.to;
        }
      }
    },

    clearFragmentRoute: (state) => {
      state.fragmentRoute = [];
    },
    setIdRouteForUpdate: (state, action) => {
      state.idRouteForUpdate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoute.pending, (state) => {
        console.log("Fetching route...");
        state.status = "loading";
      })
      .addCase(fetchRoute.fulfilled, (state, action) => {
        console.log("Route fetched", action.payload);
        state.status = "success";
        state.routes = action.payload.data;
        state.paging = action.payload.paging;
      })
      .addCase(fetchRoute.rejected, (state, action) => {
        console.log("Failed to fetch route", action.error.message);
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchRouteDetailById.pending, (state) => {
        console.log("Fetching route detail...");
        state.status = "loading";
      })
      .addCase(fetchRouteDetailById.fulfilled, (state, action) => {
        console.log("Route detail fetched", action.payload);
        state.status = "success";
        state.routesDetail = action.payload.data;
      })
      .addCase(fetchRouteDetailById.rejected, (state, action) => {
        console.log("Failed to fetch route detail", action.error.message);
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createRoute.pending, (state) => {
        console.log("Creating route...");
        state.status = "loading";
      })
      .addCase(createRoute.fulfilled, (state, action) => {
        console.log("Route created", action.payload);
        state.status = "success";
        state.routes.push(action.payload.data);
      })
      .addCase(createRoute.rejected, (state, action) => {
        console.log("Failed to create route", action.error.message);
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateRoute.pending, (state) => {
        console.log("Updating route...");
        state.status = "loading";
      })
      .addCase(updateRoute.fulfilled, (state, action) => {
        console.log("Route updated", action.payload);
        state.status = "success";
        state.routes = state.routes.map((route) => {
          if (route.id === action.payload.data.id) {
            return action.payload.data;
          }
          return route;
        });
      })
      .addCase(updateRoute.rejected, (state, action) => {
        console.log("Failed to update route", action.error.message);
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteRoute.pending, (state) => {
        console.log("Deleting route...");
        state.status = "loading";
      })
      .addCase(deleteRoute.fulfilled, (state, action) => {
        console.log("Route deleted", action.payload);
        state.status = "success";
        state.routes = state.routes.filter(
          (route) => route.id !== action.payload.data.id
        );
      })
      .addCase(deleteRoute.rejected, (state, action) => {
        console.log("Failed to delete route", action.error.message);
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const {
  setIsRouteUpdating,
  addFragmentRoute,
  removeFragmentRoute,
  clearFragmentRoute,
  updateFragmentRoute,
  setIdRouteForUpdate,
} = routeSlice.actions;
export default routeSlice.reducer;
