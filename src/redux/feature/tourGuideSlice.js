import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const fetchTourGuide = createAsyncThunk(
  "tourGuide/fetchTourGuide",
  async ({ page, size, name }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/tour-guide?page=${page}` +
          `&size=${size}` +
          (name ? `&name=${name}` : "")
      );
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const fetchTourGuideById = createAsyncThunk(
  "tourGuide/fetchTourGuideById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tour-guide/data/${id}`);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const fetchMasteredHikingPoint = createAsyncThunk(
  "tourGuide/fetchMasteredHikingPoint",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tour-guide/${id}`);
      return response.data.data.mountains;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const fetchHikingPointByMountainId = createAsyncThunk(
  "tourGuide/fetchHikingPointByMountainId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/mountains/${id}`);
      return response.data.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const createTourGuide = createAsyncThunk(
  "tourGuide/createTourGuide",
  async (data, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/tour-guide`, data);
      const response = await axiosInstance.get(
        `/tour-guide?page=${1}&size=${5}`
      );
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const createMasteredHikingPoint = createAsyncThunk(
  "tourGuide/createMasteredHikingPoint",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/tour-guide/${id}/hiking-points`,
        data
      );
      return response.data.data.mountains;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const updateTourGuide = createAsyncThunk(
  "tourGuide/updateTourGuide",
  async ({ id, data, image }, { rejectWithValue }) => {
    try {
      if (image) {
        const responeseUpdate = await axiosInstance.patch(
          `/tour-guide/data/${id}/update-image`,
          image
        );
        console.log(responeseUpdate);
        await axiosInstance.patch(`/tour-guide/data/${id}`, data);
        return { id, data };
      }
      const res = await axiosInstance.patch(`/tour-guide/data/${id}`, data);
      console.log(res.data);
      return { id, data };
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const updateTourGuideImage = createAsyncThunk(
  "tourGuide/updateTourGuideImage",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/tour-guide/data/${id}/update-image`, data);
      const response = await axiosInstance.get(
        `/tour-guide?page=${1}&size=${20}`
      );
      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const deleteTourGuide = createAsyncThunk(
  "tourGuide/deleteTourGuide",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tour-guide/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const deleteMasteredHikingPoint = createAsyncThunk(
  "tourGuide/deleteMasteredHikingPoint",
  async ({ idHikingPoint, idTourGuide }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `/tour-guide/${idTourGuide}/hiking-points/${idHikingPoint}`
      );
      return { idHikingPoint };
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const tourGuideSlice = createSlice({
  name: "tourGuide",
  initialState: {
    tourGuides: [],
    selectedTourGuide: null,
    tourGuideId: null,
    mountainIdForSelectingHikingPoint: null,
    mountainNameSelected: null,
    hikingPointIdSelected: [],
    hikingPointFromMountainId: null,
    isTourGuideUpdating: false,
    mountains: [],
    status: null,
    error: null,
  },
  reducers: {
    setSelectedTourGuide: (state, action) => {
      state.selectedTourGuide = action.payload;
    },
    addTourGuideId: (state, action) => {
      state.tourGuideId = action.payload;
    },
    setIsTourGuideUpdating: (state, action) => {
      state.isTourGuideUpdating = action.payload;
    },
    setMountainIdForSelectingHikingPoint: (state, action) => {
      return { ...state, mountainIdForSelectingHikingPoint: action.payload };
    },
    addHikingPointIdSelected: (state, action) => {
      if (!state.hikingPointIdSelected.includes(action.payload)) {
        state.hikingPointIdSelected.push(action.payload);
      }
    },
    removeHikingPointIdSelected: (state, action) => {
      state.hikingPointIdSelected = state.hikingPointIdSelected.filter(
        (id) => id !== action.payload
      );
    },
    clearHikingPointIdSelected: (state) => {
      state.hikingPointIdSelected = [];
    },
    removeHikingPointFromMountainId: (state) => {
      state.hikingPointFromMountainId = state.hikingPointFromMountainId.filter(
        (hikingPoint) => !state.hikingPointIdSelected.includes(hikingPoint.id)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTourGuide.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTourGuide.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tourGuides = action.payload.data;
        state.paging = action.payload.paging;
      })
      .addCase(fetchTourGuide.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(fetchTourGuideById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTourGuideById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedTourGuide = action.payload;
      })
      .addCase(fetchTourGuideById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(fetchMasteredHikingPoint.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMasteredHikingPoint.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mountains = action.payload;
      })
      .addCase(fetchMasteredHikingPoint.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(fetchHikingPointByMountainId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHikingPointByMountainId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mountainNameSelected = action.payload.name;
        state.hikingPointFromMountainId = action.payload.hikingPoints.filter(
          (hikingPoint) =>
            !state.hikingPointIdSelected.includes(hikingPoint.id) &&
            !state.mountains.some(
              (masteredHikingPoint) => masteredHikingPoint.id === hikingPoint.id
            )
        );
      })
      .addCase(fetchHikingPointByMountainId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(createTourGuide.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTourGuide.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tourGuides.push(action.payload);
      })
      .addCase(createTourGuide.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(createMasteredHikingPoint.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createMasteredHikingPoint.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mountains = action.payload;
      })
      .addCase(createMasteredHikingPoint.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(updateTourGuide.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTourGuide.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tourGuides = state.tourGuides.map((tourGuide) => {
          if (tourGuide.id === action.payload.id) {
            return { ...tourGuide, ...action.payload.data };
          }
          return tourGuide;
        });
      })
      .addCase(updateTourGuide.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(updateTourGuideImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTourGuideImage.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateTourGuideImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(deleteTourGuide.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTourGuide.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tourGuides = state.tourGuides.filter(
          (tourGuide) => tourGuide.id !== action.payload.id
        );
      })
      .addCase(deleteTourGuide.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(deleteMasteredHikingPoint.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMasteredHikingPoint.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mountains = state.mountains.map((mountain) => {
          return {
            ...mountain,
            hikingPoints: mountain.hikingPoints.filter(
              (hikingPoint) => hikingPoint.id !== action.payload.idHikingPoint
            ),
          };
        });
      })
      .addCase(deleteMasteredHikingPoint.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export {
  fetchTourGuide,
  createTourGuide,
  updateTourGuide,
  deleteTourGuide,
  fetchTourGuideById,
  updateTourGuideImage,
  fetchMasteredHikingPoint,
  fetchHikingPointByMountainId,
  createMasteredHikingPoint,
  deleteMasteredHikingPoint,
};
export const {
  setSelectedTourGuide,
  addTourGuideId,
  setIsTourGuideUpdating,
  setMountainIdForSelectingHikingPoint,
  setHikingPointSelected,
  addHikingPointIdSelected,
  removeHikingPointIdSelected,
  clearHikingPointIdSelected,
  removeHikingPointFromMountainId,
} = tourGuideSlice.actions;
export default tourGuideSlice.reducer;
