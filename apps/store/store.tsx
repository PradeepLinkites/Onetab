import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
export const STORE_FEATURE_KEY = "store";
export const storeAdapter = createEntityAdapter();
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
export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
export const getUserNameForDirectMessage = (item: any) => {
  if (item !== null && item.matrixRoomEvent != null) {
    const myUserId = item.matrixRoomEvent.myUserId;
    var otherUserId = "";
    item.matrixRoomInfo.members.map((items: any) => {
      if (items !== myUserId) {
        otherUserId = items;
      }
    });
    try {
      const otherUserName = item.matrixRoomInfo.membersInfo[otherUserId];
      return otherUserName;
    } catch (error) {
      return "Direct Message";
    }
  }
  return "Direct Message";
};
export const fetchStore = createAsyncThunk(
  "store/fetchStatus",
  async (_, thunkAPI) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getStores()`;
     * Right now we just return an empty array.
     */
    return Promise.resolve([]);
  }
);
interface storeState {
  loadingStatus: "not loaded" | "loading" | "loaded" | "error";
  error: any;
}
export const initialStoreState = storeAdapter.getInitialState({
  loadingStatus: "not loaded",
  error: null,
} as storeState);
export const storeSlice = createSlice({
  name: STORE_FEATURE_KEY,
  initialState: initialStoreState,
  reducers: {
    add: storeAdapter.addOne,
    remove: storeAdapter.removeOne,
    setLoadingStatus: (state, action) => {
      state.loadingStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStore.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(fetchStore.fulfilled, (state, action) => {
        storeAdapter.setAll(state, action.payload);
        state.loadingStatus = "loaded";
      })
      .addCase(fetchStore.rejected, (state, action) => {
        state.loadingStatus = "error";
        state.error = action.error.message ?? "";
      });
  },
});
/*
 * Export reducer for store configuration.
 */
export const storeReducer = storeSlice.reducer;
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
export const storeActions = storeSlice.actions;
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
const { selectAll, selectEntities } = storeAdapter.getSelectors();
export const getStoreState = (rootState) => rootState[STORE_FEATURE_KEY];
export const selectAllStore = createSelector(getStoreState, selectAll);
export const selectStoreEntities = createSelector(
  getStoreState,
  selectEntities
);
