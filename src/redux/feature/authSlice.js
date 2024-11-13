import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
export const login = createAsyncThunk(
  "userCredential/login",
  async (userCredential, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/auth/login`, userCredential);
      return response.data;
    } catch (error) {
      if (error) {
        return rejectWithValue(error.response);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

export const register = createAsyncThunk(
  "userCredential/register",
  async (userData, { rejectedWithValue }) => {
    try {
      const response = await axiosInstance.post(`/auth/register`, userData);
      if (response.statusCode === 201) {
        return response.data;
      }
      return "Gagal Register New User";
    } catch (e) {
      return rejectedWithValue(e.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "userCredential",
  initialState: {
    token: null,
    isLoggedIn: false,
    email: null,
    userId: null,
    role: null,
    error: null,
    status: null,
  },
  reducers: {
    logout: (state) => {
      return {
        ...state,
        token: null,
        isLoggedIn: false,
        email: null,
        role: null,
        userId: null,
        status: null,
      };
    },
    keepLogin: (state, action) => {
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload,
        status: "success",
        role: action.payload.role,
        email: action.payload.email,
        userId: action.payload.userId,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        return (state = { ...state, status: "loading" });
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload.data.role === "ROLE_ADMIN") {
          return {
            ...state,
            token: action.payload.data.token,
            role: action.payload.data.role,
            email: action.payload.data.email,
            userId: action.payload.data.userId,
            status: "success",
            isLoggedIn: true,
          };
        } else {
          return { ...state, status: "failed", error: "You are not admin" };
        }
      })
      .addCase(login.rejected, (state, action) => {
        console.log(action.payload.data.message.substring(0, 16));
        if (
          action.payload.status === 401 &&
          action.payload.data.message.substring(0, 16) === "401 UNAUTHORIZED"
        ) {
          return {
            ...state,
            status: "failed",
            error: "Invalid Email or Password",
          };
        }
        return {
          ...state,
          status: "failed",
          error: action.payload.data.message,
        };
      })
      .addCase(register.pending, (state) => {
        return (state = { ...state, status: "loading" });
      })
      .addCase(register.fulfilled, (state) => {
        return (state = { ...state, status: "success" });
      })
      .addCase(register.rejected, (state, action) => {
        return (state = { ...state, status: "failed", error: action.payload });
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state = { ...state, error: action.payload, status: "failed" };
        }
      );
  },
});
export const { logout, keepLogin } = authSlice.actions;
export default authSlice.reducer;
