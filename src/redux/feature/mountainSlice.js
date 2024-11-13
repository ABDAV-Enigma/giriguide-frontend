import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const size = 12;

const fetchMountain = createAsyncThunk(
  "mountain/fetchMountain",
  async ({ page, size, search, city = "" }) => {
    try {
      const response = await axiosInstance.get(
        `/mountains?page=${page}&size=${size}` +
          (search ? `&name=${search}` : "") +
          (city ? `&city=${city}` : "")
      );
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
);

const fetchMountainById = createAsyncThunk(
  "mountain/fetchMountainById",
  async (id) => {
    try {
      const response = await axiosInstance.get(`/mountains/${id}`);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
);
const updateMountain = createAsyncThunk(
  "mountain/updateMountain",
  async ({ id, data, image }) => {
    try {
      if (image) {
        await axiosInstance.patch(`/mountains/${id}`, image);
        await axiosInstance.put(`/mountains/${id}`, data);
        const res = await axiosInstance.get(`/mountains?page=1&size=${size}`);
        return res.data;
      }
      await axiosInstance.put(`/mountains/${id}`, data);
      const res = await axiosInstance.get(`/mountains?page=1&size=${size}`);
      return res.data;
    } catch (e) {
      return e.response.data;
    }
  }
);
const updateImageMountain = createAsyncThunk(
  "mountain/updateImageMountain",
  async ({ id, data }) => {
    try {
      await axiosInstance.patch(`/mountains/${id}`, data);
      const res = await axiosInstance.get(`/mountains?page=1&size=${size}`);
      return res.data;
    } catch (e) {
      return e.response.data;
    }
  }
);

const createMountain = createAsyncThunk(
  "mountain/createMountain",
  async (data) => {
    try {
      await axiosInstance.post(`/mountains`, data);
      const response = await axiosInstance.get(
        `/mountains?page=1&size=${size}`
      );
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
);
const deleteMountain = createAsyncThunk(
  "mountain/deleteMountain",
  async (id) => {
    try {
      const response = await axiosInstance.delete(`/mountains/${id}`);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
);
const mountainSlice = createSlice({
  name: "mountain",
  initialState: {
    mountains: [],
    selectedMountain: null,
    isMountainUpdating: false,
    paging: null,
    status: null,
    error: null,
  },
  reducers: {
    setIsMountainUpdating: (state, action) => {
      return (state = { ...state, isMountainUpdating: action.payload });
    },
    setSelectedMountain: (state, action) => {
      return (state = { ...state, selectedMountain: action.payload });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMountain.pending, (state) => {
        console.log("Loading...");
        return (state = { ...state, status: "loading" });
      })
      .addCase(fetchMountain.fulfilled, (state, action) => {
        console.log("fetched mountains", action.payload);
        return (state = {
          ...state,
          mountains: action.payload.data,
          paging: action.payload.paging,
          status: "success",
        });
      })
      .addCase(fetchMountain.rejected, (state, action) => {
        console.log("failed", action.payload);
        return (state = {
          ...state,
          status: "failed",
          error: action.error.message,
        });
      })
      .addCase(fetchMountainById.pending, (state) => {
        return (state = { ...state, status: "loading" });
      })
      .addCase(fetchMountainById.fulfilled, (state, action) => {
        return (state = {
          ...state,
          selectedMountain: action.payload.data,
          status: "success",
        });
      })
      .addCase(fetchMountainById.rejected, (state, action) => {
        console.log(action.payload);
        return {
          ...state,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(updateMountain.pending, (state) => {
        return (state = { ...state, status: "loading" });
      })
      .addCase(updateMountain.fulfilled, (state, action) => {
        return {
          ...state,
          mountains: action.payload.data,
          status: "success",
          paging: action.payload.paging,
        };
      })
      .addCase(updateMountain.rejected, (state, action) => {
        return (state = {
          ...state,
          status: "failed",
          error: action.error.message,
        });
      })
      .addCase(updateImageMountain.pending, (state) => {
        return (state = { ...state, status: "loading" });
      })
      .addCase(updateImageMountain.fulfilled, (state, action) => {
        return {
          ...state,
          mountains: action.payload.data,
          status: "success",
        };
      })
      .addCase(updateImageMountain.rejected, (state, action) => {
        return {
          ...state,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(createMountain.pending, (state) => {
        return (state = { ...state, status: "loading" });
      })
      .addCase(createMountain.fulfilled, (state, action) => {
        return {
          ...state,
          mountains: action.payload.data,
          status: "success",
        };
      })
      .addCase(createMountain.rejected, (state, action) => {
        return {
          ...state,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(deleteMountain.pending, (state) => {
        return (state = { ...state, status: "loading" });
      })
      .addCase(deleteMountain.fulfilled, (state, action) => {
        return (state = {
          ...state,
          mountains: action.payload.data,
          status: "success",
        });
      })
      .addCase(deleteMountain.rejected, (state, action) => {
        return (state = {
          ...state,
          status: "failed",
          error: action.error.message,
        });
      });
  },
});
export {
  fetchMountain,
  updateMountain,
  createMountain,
  deleteMountain,
  fetchMountainById,
  updateImageMountain,
};
export const { setIsMountainUpdating, setSelectedMountain } =
  mountainSlice.actions;
export default mountainSlice.reducer;
