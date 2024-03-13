import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
export const USER_FEATURE_KEY = "userStore";
export const userStoreAdapter = createEntityAdapter();
import { userService } from "../libs/userService";
import { authService } from "../libs/authService";
import { get } from "lodash";
import { getDeviceTokenToStorage } from "../utils/setUpContext";
import { getChatAccessToken } from "./chatStore";
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

export const getUser = createAsyncThunk("user/get", async (input, thunkAPI) => {
  const { userClient, userQuery } = userService;
  try {
    const data = await userClient.query({
      query: userQuery.getUser,
      fetchPolicy: "network-only",
    });
    console.log("userQuery.getUser", data);
    // thunkAPI.dispatch(
    //   getChatAccessToken({
    //     matrixUsername: data.data.userByToken.matrixUsername,
    //     matrixPassword: data.data.userByToken.matrixPassword,
    //   })
    // );
    return data;
  } catch (error) {
    console.log("userQuery.getUser", error);
    return undefined;
  }
});

export const getStorage = createAsyncThunk(
  "user/get/storage",
  async (input, thunkAPI) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.query({
        query: userQuery.getStorage,
      });
      console.log("userQuery.getStorage", data);
      return data;
    } catch (error) {
      console.log("userQuery.getStorage", error);
      return undefined;
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (input: any, thunkAPI: any) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.mutate({
        mutation: userQuery.updateUser,
        variables: { updateUserInput: input },
        fetchPolicy: "network-only",
      });

      thunkAPI.dispatch(getUser());
      console.log("userQuery.updateUser", data);
      return data;
    } catch (error) {
      console.log("userQuery.updateUser", error);
      return undefined;
    }
  }
);

export const updateTourFlow = createAsyncThunk(
  "user/update/tour",
  async (input: any, thunkAPI: any) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.mutate({
        mutation: userQuery.updateUser,
        variables: { updateUserInput: input },
      });
      console.log("userQuery.updateTourFlow", data);
      thunkAPI.dispatch(getUser());
      return data;
    } catch (error) {
      console.log("userQuery.updateTourFlow", error);
      return undefined;
    }
  }
);

export const uploadProfilePic = createAsyncThunk(
  "user/upload/pic",
  async (uploaddata: any, thunkAPI: any) => {
    const token = await getDeviceTokenToStorage();
    var formData = new FormData();
    formData.append("file", uploaddata);
    try {
      const data = await fetch(`https://services.wynn.io/file-upload`, {
        method: "POST",
        headers: {
          authorization: "Bearer " + token,
        },
        body: formData,
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          return data;
        });
      console.log("uploadProfilePic", data);
      return data;
    } catch (error) {
      console.log("uploadProfilePic", error);
      return undefined;
    }
  }
);

export const getModules = createAsyncThunk(
  "user/module/get",
  async (workspaceId: any, thunkAPI: any) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.query({
        query: userQuery.getModules,
        variables: { workspaceId },
      });
      console.log("userQuery.getModules", data);
      return data;
    } catch (error) {
      console.log("userQuery.getModules", error);
      return undefined;
    }
  }
);

export const getInvites = createAsyncThunk(
  "user/invites/get",
  async (_, thunkAPI: any) => {
    let workspaceId = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.mutate({
        mutation: userQuery.getInvites,
        variables: { workspaceId },
        fetchPolicy: "network-only",
      });
      console.log("userQuery.getInvites", data);
      return data;
    } catch (error) {
      console.log("userQuery.getInvites", error);
      return undefined;
    }
  }
);

export const createInvites = createAsyncThunk(
  "user/invites/create",
  async (createUserScopeInput: any, thunkAPI: any) => {
    let workspaceId = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const { userClient, userQuery } = userService;
    // try {
    console.log("data=====>>>>", { ...createUserScopeInput, workspaceId });
    const data = await userClient.mutate({
      mutation: userQuery.createInvites,
      variables: {
        createUserScopeInput: { ...createUserScopeInput, workspaceId },
      },
      fetchPolicy: "network-only",
    });
    console.log("userQuery.createInvites", data);
    thunkAPI.dispatch(getInvites());
    return data;
    // } catch (error) {
    //   console.log("userQuery.createInvites", error);
    //   return undefined;
    // }
  }
);

export const removeInvites = createAsyncThunk(
  "user/invites/remove",
  async (removeInv: any, thunkAPI: any) => {
    // let workspaceId = get(thunkAPI.getState(), 'workspaceStore.currentWorkspaceData._id', '')
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.mutate({
        mutation: userQuery.removeInvite,
        variables: { moduleId: removeInv.moduleId, _id: removeInv._id },
      });
      console.log("userQuery.removeInvite", data);
      thunkAPI.dispatch(getInvites());
      return data;
    } catch (error) {
      console.log("userQuery.removeInvite", error);
      return undefined;
    }
  }
);

export const getPlans = createAsyncThunk(
  "user/get/plans",
  async (createUserScopeInput, thunkAPI: any) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.query({
        query: userQuery.getPlans,
      });
      console.log("userQuery.getPlans", data);
      return data;
    } catch (error) {
      console.log("userQuery.getPlans", error);
      return undefined;
    }
  }
);

export const searchMail = createAsyncThunk(
  "user/search/mail",
  async (searchText: any, thunkAPI: any) => {
    const { userClient, userQuery } = userService;
    let userId = get(thunkAPI.getState(), "userStore.userData._id", "");
    try {
      const data = await userClient.query({
        query: userQuery.searchMail,
        variables: { userId, searchText },
        fetchPolicy: "network-only",
      });
      console.log("userQuery.searchMail", data);
      return data;
    } catch (error) {
      console.log("userQuery.searchMail", error);
      return undefined;
    }
  }
);

export const getSubscribePlan = createAsyncThunk(
  "user/get/subscribe",
  async (createUserScopeInput, thunkAPI) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.query({
        query: userQuery.getSubscribePlan,
      });
      console.log("userQuery.getSubscribePlan", data);
      return data;
    } catch (error) {
      console.log("userQuery.getSubscribePlan", error);
      return undefined;
    }
  }
);

export const upgradePlan = createAsyncThunk(
  "user/update/subscribe",
  async (input: any, thunkAPI) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.query({
        query: userQuery.upgradePlan,
        variables: input,
      });
      console.log("userQuery.upgradePlan", data);
      thunkAPI.dispatch(getSubscribePlan());
      return data;
    } catch (error) {
      console.log("userQuery.upgradePlan", error);
      return undefined;
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  "user/cancel/subscribe",
  async (subscription: any, thunkAPI) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.query({
        query: userQuery.cancelSubscription,
        variables: { subscription: subscription },
      });
      console.log("userQuery.cancelSubscription", data);
      thunkAPI.dispatch(getSubscribePlan());
      return data;
    } catch (error) {
      console.log("userQuery.cancelSubscription", error);
      return undefined;
    }
  }
);

export const updateCompanyInfo = createAsyncThunk(
  "user/update/company",
  async (companyInfo: any, thunkAPI) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.query({
        query: userQuery.updateCompanyInfo,
        variables: companyInfo,
      });
      console.log("userQuery.updateCompanyInfo", data);
      return data;
    } catch (error) {
      console.log("userQuery.updateCompanyInfo", error);
      return undefined;
    }
  }
);

export const subscribePlan = createAsyncThunk(
  "user/plans/subscribe",
  async (createUserScopeInput: any, thunkAPI) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.query({
        query: userQuery.subscribePlan,
        variables: createUserScopeInput,
      });
      if (get(data, "data.subscribeToPlan.success", false)) {
      }
      console.log("userQuery.subscribePlan", data);
      return data;
    } catch (error) {
      console.log("userQuery.subscribePlan", error);
      return undefined;
    }
  }
);

export const updatePayment = createAsyncThunk(
  "user/update/payment",
  async (paymentMethod: any, thunkAPI) => {
    const { userClient, userQuery } = userService;
    try {
      const data = await userClient.query({
        query: userQuery.updatePayment,
        variables: paymentMethod,
      });
      console.log("userQuery.updatePayment", data);
      thunkAPI.dispatch(getSubscribePlan());
      return data;
    } catch (error) {
      console.log("userQuery.updatePayment", error);
      return undefined;
    }
  }
);

export function getUserColor(matrixId: any, usersColor: any) {
  // console.log("matrixId", matrixId, " -------@@@@@@@@@_------- ", usersColor);
  const color = usersColor.find((e) => e.matrixID === matrixId);
  // console.log("color===========>", color ? color.color : "#3866E6");
  return color ? "#" + color.color : "#3866E6";
}

export const initialUserStoreState = userStoreAdapter.getInitialState({
  loadingStatus: "not loaded",
  error: null || "",
  getUserStatus: "not loaded",
  getUserData: {},
  getStorageStatus: "not loaded",
  getStorageData: {},
  getPlansStatus: "not loaded",
  getPlansData: {},
  getInvitesStatus: "not loaded",
  getInvitesData: {},
  updateUserStatus: "not loaded",
  updateUserData: {},
  getSubscribePlanStatus: "not loaded",
  getSubscribePlanData: {},
  searchMailStatus: "not loaded",
  searchMailData: {},
  updateTourFlowStatus: "not loaded",
  updateTourFlowData: {},
  upgradePlanStatus: "not loaded",
  upgradePlanData: {},
  cancelSubscriptionStatus: "not loaded",
  cancelSubscriptionData: {},
  getModulesStatus: "not loaded",
  getModulesData: {},
  createInvitesStatus: "not loaded",
  createInvitesData: {},
  removeInvitesStatus: "not loaded",
  removeInvitesData: {},
  updateCompanyInfoStatus: "not loaded",
  updateCompanyInfoData: {},
  subscribePlanStatus: "not loaded",
  subscribePlanData: {},
  updatePaymentStatus: "not loaded",
  updatePaymentData: {},
  userData: {},
  usersColor: [],
  matrixUserId: "",
  uploadProfilePicData: {},
  uploadProfilePicStatus: "not loaded",
  userListData: [],
});
export const userStoreSlice = createSlice({
  name: USER_FEATURE_KEY,
  initialState: initialUserStoreState,
  reducers: {
    add: userStoreAdapter.addOne,
    remove: userStoreAdapter.removeOne,
    setLoadingStatus: (state, action) => {
      state.loadingStatus = action.payload;
    },
    setUpdateUserData: (state, action) => {
      state.updateUserData = action.payload;
    },
    setUpdateUserStatus: (state, action) => {
      state.updateUserStatus = action.payload;
    },
    setmatrixUserId: (state, action) => {
      state.matrixUserId = action.payload;
    },
    setuploadProfilePicData: (state, action) => {
      state.uploadProfilePicData = action.payload;
    },
    setCreateInvitesStatus: (state, action) => {
      state.createInvitesStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.getUserStatus = "loading";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.getUserData = action.payload ?? {};
        state.userData = action.payload?.data.userByToken ?? {};
        const matrixusername =
          action.payload?.data?.userByToken?.matrixUsername ?? "";
        state.matrixUserId = "@" + matrixusername + ":matrix.onetab.ai";
        state.getUserStatus = "loaded";
      })
      .addCase(getUser.rejected, (state, action) => {
        state.getUserStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(getStorage.pending, (state) => {
        state.getUserStatus = "loading";
      })
      .addCase(getStorage.fulfilled, (state, action) => {
        state.getUserData = action.payload ?? {};
        state.userData = action.payload?.data.userByToken ?? {};
        state.getUserStatus = "loaded";
      })
      .addCase(getStorage.rejected, (state, action) => {
        state.getUserStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(getPlans.pending, (state) => {
        state.getPlansStatus = "loading";
      })
      .addCase(getPlans.fulfilled, (state, action) => {
        state.getPlansData = action.payload ?? {};
        state.getPlansStatus = "loaded";
      })
      .addCase(getPlans.rejected, (state, action) => {
        state.getPlansStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(getInvites.pending, (state) => {
        state.getInvitesStatus = "loading";
      })
      .addCase(getInvites.fulfilled, (state, action) => {
        state.getInvitesData = action.payload ?? {};
        // console.log("item", action?.payload?.data?.invites);
        state.userListData = action?.payload?.data?.invites;
        // action?.payload?.data?.invites?.filter(
        //   (item: any) => item?.modulesID[0]?.name === "Chat"
        // ) ?? [];
        state.getInvitesStatus = "loaded";
        state.usersColor = get(action.payload, "data.invites", []).map(
          (user: any, index: any) => {
            var color =
              Math.floor((((index + 1) * 2) / 0.5684464787) * 1000000) + 1;
            return {
              matrixID: "@" + user.matrixUsername + ":matrix.onetab.ai",
              color: ("000000" + color.toString(16)).slice(-6),
            };
          }
        );
      })
      .addCase(getInvites.rejected, (state, action) => {
        state.getInvitesStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserStatus = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateUserData = action.payload ?? {};
        state.updateUserStatus = "loaded";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(getSubscribePlan.pending, (state) => {
        state.getSubscribePlanStatus = "loading";
      })
      .addCase(getSubscribePlan.fulfilled, (state, action) => {
        state.getSubscribePlanData = action.payload ?? {};
        state.getSubscribePlanStatus = "loaded";
      })
      .addCase(getSubscribePlan.rejected, (state, action) => {
        state.getSubscribePlanStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(searchMail.pending, (state) => {
        state.searchMailStatus = "loading";
      })
      .addCase(searchMail.fulfilled, (state, action) => {
        state.searchMailData = action.payload ?? {};
        state.searchMailStatus = "loaded";
      })
      .addCase(searchMail.rejected, (state, action) => {
        state.searchMailStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(updateTourFlow.pending, (state) => {
        state.updateTourFlowStatus = "loading";
      })
      .addCase(updateTourFlow.fulfilled, (state, action) => {
        state.updateTourFlowData = action.payload ?? {};
        state.updateTourFlowStatus = "loaded";
      })
      .addCase(updateTourFlow.rejected, (state, action) => {
        state.updateTourFlowStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(upgradePlan.pending, (state) => {
        state.upgradePlanStatus = "loading";
      })
      .addCase(upgradePlan.fulfilled, (state, action) => {
        state.upgradePlanData = action.payload ?? {};
        state.upgradePlanStatus = "loaded";
      })
      .addCase(upgradePlan.rejected, (state, action) => {
        state.upgradePlanStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.cancelSubscriptionStatus = "loading";
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.cancelSubscriptionData = action.payload ?? {};
        state.cancelSubscriptionStatus = "loaded";
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.cancelSubscriptionStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(getModules.pending, (state) => {
        state.getModulesStatus = "loading";
      })
      .addCase(getModules.fulfilled, (state, action) => {
        state.getModulesData = action.payload ?? {};
        state.getModulesStatus = "loaded";
      })
      .addCase(getModules.rejected, (state, action) => {
        state.getModulesStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(createInvites.pending, (state) => {
        state.createInvitesStatus = "loading";
      })
      .addCase(createInvites.fulfilled, (state, action) => {
        state.createInvitesData = action.payload ?? {};
        state.createInvitesStatus = "loaded";
      })
      .addCase(createInvites.rejected, (state, action) => {
        state.createInvitesStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(removeInvites.pending, (state) => {
        state.removeInvitesStatus = "loading";
      })
      .addCase(removeInvites.fulfilled, (state, action) => {
        state.removeInvitesData = action.payload ?? {};
        state.removeInvitesStatus = "loaded";
      })
      .addCase(removeInvites.rejected, (state, action) => {
        state.removeInvitesStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(updateCompanyInfo.pending, (state) => {
        state.updateCompanyInfoStatus = "loading";
      })
      .addCase(updateCompanyInfo.fulfilled, (state, action) => {
        state.updateCompanyInfoData = action.payload ?? {};
        state.updateCompanyInfoStatus = "loaded";
      })
      .addCase(updateCompanyInfo.rejected, (state, action) => {
        state.updateCompanyInfoStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(subscribePlan.pending, (state) => {
        state.subscribePlanStatus = "loading";
      })
      .addCase(subscribePlan.fulfilled, (state, action) => {
        state.subscribePlanData = action.payload ?? {};
        state.subscribePlanStatus = "loaded";
      })
      .addCase(subscribePlan.rejected, (state, action) => {
        state.subscribePlanStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(updatePayment.pending, (state) => {
        state.updatePaymentStatus = "loading";
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.updatePaymentData = action.payload ?? {};
        state.updatePaymentStatus = "loaded";
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.updatePaymentStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(uploadProfilePic.pending, (state) => {
        state.uploadProfilePicStatus = "loading";
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.uploadProfilePicData = action.payload ?? {};
        state.uploadProfilePicStatus = "loaded";
      })
      .addCase(uploadProfilePic.rejected, (state, action) => {
        state.uploadProfilePicStatus = "error";
        state.error = action.error.message ?? "";
      });
  },
});
/*
 * Export reducer for store configuration.
 */
export const userStoreReducer = userStoreSlice.reducer;
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
export const userStoreActions = userStoreSlice.actions;
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
const { selectAll, selectEntities } = userStoreAdapter.getSelectors();
export const getUserStoreState = (rootState) => rootState[USER_FEATURE_KEY];
export const selectAllUserStore = createSelector(getUserStoreState, selectAll);
export const selectUserStoreEntities = createSelector(
  getUserStoreState,
  selectEntities
);
