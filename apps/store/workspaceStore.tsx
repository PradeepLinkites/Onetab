import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { userService } from "../libs/userService";
import { workspaceService } from "../libs/workspaceService";

export const WORKSPACE_FEATURE_KEY = "workspaceStore";
export const workspaceStoreAdapter = createEntityAdapter();
import { get } from "lodash";
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
function allStorage() {
  var values = {},
    keys = Object.keys(localStorage),
    i = keys.length;
  while (i--) {
    values[keys[i]] = localStorage.getItem(keys[i]);
  }
  return values;
}

async function saveStorage(storage) {
  const { userClient, userQuery } = userService;
  const data = await userClient.mutate({
    mutation: userQuery.saveStorage,
    variables: { extraFieldsInput: JSON.stringify(storage) },
  });
}
export const updateOrganigation = createAsyncThunk(
  "user/update/organigation",
  async (input: any, thunkAPI: any) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.mutate({
        mutation: userQuery.updateUser,
        variables: {
          updateUserInput: { activeOrganizationId: input.activeOrganizationId },
        },
      });
      if (input.workspaceId) {
        localStorage.setItem("active_workspace", input.workspaceId);
        saveStorage(allStorage());
      }
      console.log("userQuery.updateUser", data);
      return data;
    } catch (error) {
      console.log("userQuery.updateUser", error);
      return undefined;
    }
  }
);
export const updateLogo = createAsyncThunk(
  "workspace/update/logo",
  async (logoInput: any, thunkAPI: any) => {
    let _id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData.organizationId",
      ""
    );
    let workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const { workspaceClient, workspaceQuery } = workspaceService;
    try {
      const data = await workspaceClient.mutate({
        mutation: workspaceQuery.updateOrganisationLogo,
        variables: { _id, logo: logoInput },
      });
      thunkAPI.dispatch(fetchCurrentWorkspace(workspace_id));
      console.log("workspaceQuery.updateOrganisationLogo", data);
      return data;
    } catch (error) {
      console.log("workspaceQuery.updateOrganisationLogo", error);
      return undefined;
    }
  }
);
export const createWorkspace = createAsyncThunk(
  "workspace/create",
  async (createWorkspaceInput: any, thunkAPI: any) => {
    const { workspaceClient, workspaceQuery } = workspaceService;
    try {
      const data = await workspaceClient.mutate({
        mutation: workspaceQuery.createWorkspace,
        variables: { createWorkspaceInput },
      });
      console.log("workspaceQuery.createWorkspace", data);
      thunkAPI.dispatch(fetchWorkspaces());
      return data;
    } catch (error) {
      console.log("workspaceQuery.createWorkspace", error);
      return undefined;
    }
  }
);

export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetch",
  async (_, thunkAPI) => {
    const { workspaceClient, workspaceQuery } = workspaceService;
    try {
      const data = await workspaceClient.query({
        query: workspaceQuery.fetchWorkspaces,
        fetchPolicy: "network-only",
      });
      console.log("workspaceQuery.fetchWorkspaces", data);
      return data;
    } catch (error) {
      console.log("workspaceQuery.fetchWorkspaces", error);
      return undefined;
    }
  }
);
export const fetchCurrentWorkspace = createAsyncThunk(
  "workspace/fetch/currentworkspace",
  async (workspaceId: any) => {
    const { workspaceClient, workspaceQuery } = workspaceService;
    try {
      const data = await workspaceClient.query({
        query: workspaceQuery.fetchCurrentWorkspaces,
        variables: { workspaceId },
        fetchPolicy: "network-only",
      });
      console.log("workspaceQuery.fetchCurrentWorkspaces", data);
      return data;
    } catch (error) {
      console.log("workspaceQuery.fetchCurrentWorkspaces", error);
      return undefined;
    }
  }
);
interface workspaceStoreState {
  currentWorkspaceStatus: "not loaded" | "loading" | "loaded" | "error";
  currentWorkspaceData: any;
  error: any;
  fetchWorkspaceStatus: "not loaded" | "loading" | "loaded" | "error";
  fetchWorkspaceData: any;
  updateOrgStatus: "not loaded" | "loading" | "loaded" | "error";
  updateOrgData: any;
  updateLogoStatus: "not loaded" | "loading" | "loaded" | "error";
  updateLogoData: any;
  createWorkspaceStatus: "not loaded" | "loading" | "loaded" | "error";
  createWorkspaceData: any;
}
export const initialWorkspaceStoreState = workspaceStoreAdapter.getInitialState(
  {
    currentWorkspaceStatus: "not loaded",
    currentWorkspaceData: {},
    error: null || "",
    fetchWorkspaceStatus: "not loaded",
    fetchWorkspaceData: {},
    updateOrgStatus: "not loaded",
    updateOrgData: {},
    updateLogoStatus: "not loaded",
    updateLogoData: {},
    createWorkspaceStatus: "not loaded",
    createWorkspaceData: {},
  } as workspaceStoreState
);
export const workspaceStoreSlice = createSlice({
  name: WORKSPACE_FEATURE_KEY,
  initialState: initialWorkspaceStoreState,
  reducers: {
    add: workspaceStoreAdapter.addOne,
    remove: workspaceStoreAdapter.removeOne,
    setCurrentWorkspaceStatus: (state, action) => {
      state.currentWorkspaceStatus = action.payload;
    },
    setCurrentWorkspaceData: (state, action) => {
      state.currentWorkspaceData = action.payload;
    },
    setFetchWorkspaceStatus: (state, action) => {
      state.fetchWorkspaceStatus = action.payload;
    },
    setFetchWorkspaceData: (state, action) => {
      state.fetchWorkspaceData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.fetchWorkspaceStatus = "loading";
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.fetchWorkspaceData = action.payload ?? {};
        state.fetchWorkspaceStatus = "loaded";
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.fetchWorkspaceStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(fetchCurrentWorkspace.pending, (state) => {
        state.currentWorkspaceStatus = "loading";
      })
      .addCase(fetchCurrentWorkspace.fulfilled, (state, action) => {
        state.currentWorkspaceData = action.payload?.data.workspace ?? {};
        state.currentWorkspaceStatus = "loaded";
      })
      .addCase(fetchCurrentWorkspace.rejected, (state, action) => {
        state.currentWorkspaceStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(updateOrganigation.pending, (state) => {
        state.updateOrgStatus = "loading";
      })
      .addCase(updateOrganigation.fulfilled, (state, action) => {
        state.updateOrgData = action.payload ?? {};
        state.updateOrgStatus = "loaded";
      })
      .addCase(updateOrganigation.rejected, (state, action) => {
        state.updateOrgStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(updateLogo.pending, (state) => {
        state.updateLogoStatus = "loading";
      })
      .addCase(updateLogo.fulfilled, (state, action) => {
        state.updateLogoData = action.payload ?? {};
        state.updateLogoStatus = "loaded";
      })
      .addCase(updateLogo.rejected, (state, action) => {
        state.updateLogoStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(createWorkspace.pending, (state) => {
        state.createWorkspaceStatus = "loading";
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.createWorkspaceData = action.payload ?? {};
        state.createWorkspaceStatus = "loaded";
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.createWorkspaceStatus = "error";
        state.error = action.error.message ?? "";
      });
  },
});
/*
 * Export reducer for store configuration.
 */
export const workspaceReducer = workspaceStoreSlice.reducer;
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
export const workspaceStoreActions = workspaceStoreSlice.actions;
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
const { selectAll, selectEntities } = workspaceStoreAdapter.getSelectors();
export const getworkspaceStoreState = (rootState) =>
  rootState[WORKSPACE_FEATURE_KEY];
export const selectAllworkspaceStore = createSelector(
  getworkspaceStoreState,
  selectAll
);
export const selectworkspaceStoreEntities = createSelector(
  getworkspaceStoreState,
  selectEntities
);
