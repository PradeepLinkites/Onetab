import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { authService } from "../libs/authService";
import { saveDeviceTokenToStorage } from "../utils/setUpContext";
export const AUTH_FEATURE_KEY = "authStore";
export const authStoreAdapter = createEntityAdapter();
// import {get} from "lodash";
/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchStore())
 * }, [dispatch]);
 * ```
 */

export const signup = createAsyncThunk(
  "auth/signup",
  async (input: any, thunkAPI) => {
    console.log("input", input);
    input.countryCode = "+91";
    input.is_active = true;
    input.is_deleted = false;
    const { authQuery, authClient } = authService;
    try {
      const data = await authClient.mutate({
        mutation: authQuery.signup,
        variables: {
          input,
        },
      });
      console.log("authQuery.signup", JSON.stringify(data));
      return data;
    } catch (error) {
      // const message = get(error, 'response.errors[0].message', 'Something went wrong')
      console.log("authQuery.signup", error);
      alert(error);
      return undefined;
    }
  }
);
export const login = createAsyncThunk(
  "auth/login",
  async (input: { email: string; isMobile: boolean }, thunkAPI) => {
    const { authQuery, authClient } = authService;
   
    try {
      console.log("login.input", input);
      const data = await authClient.mutate({
        mutation: authQuery.login,
        variables: input,
      });
      console.log("authQuery.login", JSON.stringify(data));
      return data;
    } catch (error) {
      console.log("authQuery.login", error);
      alert(error);
      return undefined;
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verify/otp",
  async (createAuthInput: any, thunkAPI: any) => {
    const { authQuery, authClient } = authService;
    try {
      const data = await authClient.mutate({
        mutation: authQuery.verifyOtp,
        variables: { createAuthInput },
      });
      console.log("authQuery.verifyOtp", JSON.stringify(data));
      return data;
    } catch (error) {
      console.log("authQuery.verifyOtp", error);
      alert(error);
      return undefined;
    }
  }
);

export const contactUs = createAsyncThunk(
  "auth/contactus",
  async (input: any, thunkAPI) => {
    const { authQuery, authClient } = authService;
    try {
      const data = await authClient.query({
        query: authQuery.contactUs,
        variables: input,
      });
      console.log("authQuery.contactUs", data);
      return data;
    } catch (error) {
      console.log("authQuery.contactUs", error);
      return undefined;
    }
  }
);
interface authStoreState {
  loadingStatus: "not loaded" | "loading" | "loaded" | "error";
  error: any;
  loginData: any;
  loginStatus: "not loaded" | "loading" | "loaded" | "error";
  verifyOtpStatus: "not loaded" | "loading" | "loaded" | "error";
  verifyData: any;
  signUpStatus: "not loaded" | "loading" | "loaded" | "error";
  signUpData: any;
}

export const initialAuthStoreState = authStoreAdapter.getInitialState({
  loadingStatus: "not loaded",
  error: null || "",
  loginData: {},
  loginStatus: "not loaded",
  verifyOtpStatus: "not loaded",
  verifyData: {},
  signUpStatus: "not loaded",
  signUpData: {},
} as authStoreState);
export const authStoreSlice = createSlice({
  name: AUTH_FEATURE_KEY,
  initialState: initialAuthStoreState,
  reducers: {
    add: authStoreAdapter.addOne,
    remove: authStoreAdapter.removeOne,
    setLoadingStatus: (state, action) => {
      state.loadingStatus = action.payload;
    },
    setLoginStatus: (state, action) => {
      state.loginStatus = action.payload;
    },
    setLoginData: (state, action) => {
      state.loginData = action.payload;
    },
    setVerifyOtpStatus: (state, action) => {
      state.verifyOtpStatus = action.payload;
    },
    setVerifyData: (state, action) => {
      state.verifyData = action.payload;
    },
    setSignUpStatus: (state, action) => {
      state.signUpStatus = action.payload;
    },
    setSignUpData: (state, action) => {
      state.signUpData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginData = action.payload ?? {};
        state.loginStatus = "loaded";
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(verifyOtp.pending, (state) => {
        state.verifyOtpStatus = "loading";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.verifyData = action.payload ?? {};
        state.verifyOtpStatus = "loaded";
        console.log("token", action.payload?.data.getToken.token ?? "");
        saveDeviceTokenToStorage({
          deviceTokenId: action.payload?.data.getToken.token ?? "",
        });
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.verifyOtpStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(signup.pending, (state) => {
        state.signUpStatus = "loading";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.signUpData = action.payload ?? {};
        state.signUpStatus = "loaded";
      })
      .addCase(signup.rejected, (state, action) => {
        state.signUpStatus = "error";
        state.error = action.error.message ?? "";
      });
  },
});
/*
 * Export reducer for store configuration.
 */
export const authReducer = authStoreSlice.reducer;
/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(storeActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const authStoreActions = authStoreSlice.actions;
/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllStore);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = authStoreAdapter.getSelectors();
export const getAuthStoreState = (rootState) => rootState[AUTH_FEATURE_KEY];
export const selectAllAuthStore = createSelector(getAuthStoreState, selectAll);
export const selectAuthStoreEntities = createSelector(
  getAuthStoreState,
  selectEntities
);
