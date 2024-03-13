import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
export const API_FEATURE_KEY = "apiStore";
export const apiStoreAdapter = createEntityAdapter();
import { get } from "lodash";
import { apiService } from "../libs/apiService";
import { userService } from "../libs/userService";
import env from "../../config";
import { getDeviceTokenToStorage } from "../utils/setUpContext";

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
function getTabsWithoutRes(tabs, activeIndex) {
  const newState = tabs; //Object.assign({}, tabs)
  delete newState[activeIndex].apiStatus;
  delete newState[activeIndex].api.responseData;
  delete newState[activeIndex].api.responseHeaders;
  delete newState[activeIndex].api.responseStatus;
  delete newState[activeIndex].api.responseStatusText;
  return newState;
}

function allStorage() {
  var values = {},
    keys = Object.keys(localStorage),
    i = keys.length;
  while (i--) {
    values[keys[i]] = localStorage.getItem(keys[i]);
  }
  return values;
}

function saveTabs(workspaceid: any, tabs: any, activeKey = "") {
  localStorage.setItem(`api-tabs-${workspaceid}`, JSON.stringify(tabs));
  if (activeKey !== "") {
    localStorage.setItem(`api-active-tab-${workspaceid}`, activeKey);
  }
  saveStorage(allStorage());
}

async function saveStorage(storage: any) {
  const { userClient, userQuery } = userService;
  const data = await userClient.mutate({
    mutation: userQuery.saveStorage,
    variables: { extraFieldsInput: JSON.stringify(storage) },
  });
}

function getWordsBetweenCurlies(str: any, keys: any) {
  var url = str;
  var results: any = [],
    re = /{{([^}]+)}}/g,
    text: any;

  while ((text = re.exec(str))) {
    results.push(text[1]);
  }
  if (results.length) {
    results.map((data) => {
      const value = keys.filter((key) => key.varName === data);
      if (value.length) {
        var val = value[0].currentValue
          ? value[0].currentValue
          : value[0].initialValue;
        if (val) {
          url = url.replace(`{{${data}}}`, val);
        }
      }
    });
    // url
  }
  return url;
}
export const fetchApiEnv = createAsyncThunk("env/get", async (_, thunkAPI) => {
  let workspace = get(
    thunkAPI.getState(),
    "workspaceStore.currentWorkspaceData._id",
    ""
  );
  let user_id = get(thunkAPI.getState(), "userStore.userData._id", "");
  const { apiClient, apiQuery } = apiService;
  try {
    const data = await apiClient.query({
      query: apiQuery.getEnv,
      variables: {
        envlist: {
          workspace,
          user_id,
        },
      },
    });
    console.log("apiQuery.getEnv", data);
    return data;
  } catch (error) {
    console.log("apiQuery.getEnv", error);
    return undefined;
  }
});

export const updateEnv = createAsyncThunk(
  "env/update",
  async (updateEnvdata: any, thunkAPI) => {
    // let workspace = get(thunkAPI.getState(), 'workspace.currentWorkspaceData._id', '')
    // let user_id = get(thunkAPI.getState(), 'userStore.userData._id', '')

    let selectedEnv = {
      ...(updateEnvdata
        ? updateEnvdata
        : get(thunkAPI.getState(), "apiEnv.selectedEnv", "")),
    };
    const localData = [
      ...(updateEnvdata
        ? get(updateEnvdata, "local_variable", [])
        : get(selectedEnv, "local_variable", [])),
    ];
    if (!updateEnvdata) {
      localData.splice(-1);
    }
    selectedEnv.user_id = selectedEnv.user;
    delete selectedEnv.user;
    delete selectedEnv.__v;
    selectedEnv.local_variable = localData;
    selectedEnv.type = "envoirment";
    const { apiClient, apiQuery } = apiService;
    const data = await apiClient.mutate({
      mutation: apiQuery.updateEnv,
      variables: {
        updateEnv: selectedEnv,
      },
    });

    thunkAPI.dispatch(fetchApiEnv());
    thunkAPI.dispatch(getActiveEnv());
    return data;
  }
);

export const deleteEnv = createAsyncThunk(
  "env/delete",
  async (removeEnvdata: any, thunkAPI) => {
    const { apiClient, apiQuery } = apiService;
    const data = await apiClient.mutate({
      mutation: apiQuery.removeEnv,
      variables: {
        removeEnvById: {
          _id: removeEnvdata._id,
          user_id: removeEnvdata.user,
          workspace: removeEnvdata.workspace,
        },
      },
    });
    thunkAPI.dispatch(fetchApiEnv());
    thunkAPI.dispatch(getActiveEnv());
    return data;
  }
);

export const markActiveEnv = createAsyncThunk(
  "env/mark/active",
  async (markActivedata, thunkAPI) => {
    const { apiClient, apiQuery } = apiService;
    const data = await apiClient.query({
      query: apiQuery.markActive,
      variables: {
        activeEnvlist: {
          _id: markActiveEnv._id,
          user_id: markActiveEnv.user,
          workspace: markActiveEnv.workspace,
        },
      },
    });
    thunkAPI.dispatch(fetchApiEnv());
    thunkAPI.dispatch(getActiveEnv());
    return data;
  }
);

export const getActiveEnv = createAsyncThunk(
  "env/mark/active",
  async (_, thunkAPI) => {
    let workspace = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData",
      ""
    );
    let user_id = get(thunkAPI.getState(), "user.userData._id", "");
    const { apiClient, apiQuery } = apiService;
    const data = await apiClient.query({
      query: apiQuery.getActivEnv,
      variables: {
        activeEnvlist: {
          user_id,
          workspace,
        },
      },
    });
    return data;
  }
);

export const importEnv = createAsyncThunk(
  "mockServer/import/file",
  async (importEnvData: any, thunkAPI) => {
    const token = await getDeviceTokenToStorage();
    let workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    let organizationDomain = get(
      thunkAPI.getState(),
      "userStore.userData.organizationDomain",
      ""
    );
    var formData = new FormData();
    formData.append("file", importEnvData);
    console.log("token", token);
    if (token) {
      const data = await fetch(
        `${env.NX_SERVICE_SERVER}/file-upload/environment/${organizationDomain}/${workspace_id}`,
        {
          method: "POST",
          headers: {
            // 'Content-Type: 'application/json',
            // 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s',
            authorization: "Bearer " + token,
          },
          body: formData,
        }
      );
      const { apiClient } = apiService;
      thunkAPI.dispatch(fetchApiEnv());
      return data;
    }
  }
);

export const fetchCollections = createAsyncThunk(
  "api/collections/fetch",
  async (_, thunkAPI) => {
    let workspaceId = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const { apiClient, apiQuery } = apiService;
    const data = await apiClient.query({
      query: apiQuery.getCollections,
      variables: { workspaceId },
    });

    // thunkAPI.dispatch(fetchCollections())
    return data;
  }
);

export const createCollection = createAsyncThunk(
  "api/collection/create",
  async (name, thunkAPI) => {
    const { apiClient, apiQuery } = apiService;
    let workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const data = await apiClient.mutate({
      mutation: apiQuery.createCollection,
      variables: {
        createCollectionInput: {
          name,
          workspace_id,
        },
      },
    });

    thunkAPI.dispatch(fetchCollections());
    return data;
  }
);

export const updateCollection = createAsyncThunk(
  "api/collection/update",
  async (updateCollectionInput: any, thunkAPI) => {
    const { apiClient, apiQuery } = apiService;
    const workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    var collectionData = { ...updateCollectionInput };
    delete collectionData.api;
    const data = await apiClient.mutate({
      mutation: apiQuery.updateCollection,
      variables: { updateCollectionInput: { ...collectionData, workspace_id } },
    });

    thunkAPI.dispatch(fetchCollections());
    return { updateCollectionInput, ...data, workspace_id };
  }
);

export const deleteCollection = createAsyncThunk(
  "api/collection/remove",
  async (collection_id, thunkAPI) => {
    const { apiClient, apiQuery } = apiService;
    const workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const data = await apiClient.mutate({
      mutation: apiQuery.removeCollection,
      variables: { workspace_id, collection_id },
    });

    thunkAPI.dispatch(fetchCollections());
    return data;
  }
);

export const callApi = createAsyncThunk(
  "api/call",
  async (callApi: any, thunkAPI: any) => {
    const token = await getDeviceTokenToStorage();
    const { apiClient, apiQuery } = apiService;
    const state = thunkAPI.getState().api;

    const workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const activeIndex = state.tabs.findIndex(
      (tab) => tab.key === state.activeTab
    );
    const activeKeys = get(
      thunkAPI.getState(),
      "apiEnv.activeEnv.local_variable",
      []
    );
    const newState = Object.assign({}, state.tabs[activeIndex].api);
    var url = get(newState, "url", "").trim();
    if (activeKeys.length) {
      url = getWordsBetweenCurlies(url, activeKeys);
    }
    var prefix = "http://";
    var prefix1 = "https://";
    if (
      url.substr(0, prefix.length) !== prefix &&
      url.substr(0, prefix1.length) !== prefix1
    ) {
      url = prefix + url;
    }
    // remove last responce
    const newData: any = {
      body: null || "",
      body_type:
        get(newState, "body_type", "json") === "x-www-form-urlencoded"
          ? "xWwwFormUrlEncode"
          : get(newState, "body_type", "json") === "form-data"
          ? "formData"
          : get(newState, "body_type", "json"),
      // headers: null,
      method: get(newState, "method", "GET"),
      request_description: null,
      request_name: null,
      url: url,
      workspace_id: workspace_id,
    };
    if (get(callApi, "request_description", "")) {
      newData.request_description = callApi.request_description;
    }
    if (get(callApi, "request_name", "")) {
      newData.request_name = callApi.request_name;
    }
    if (newState.body_type === "json") {
      try {
        newData.body = JSON.parse(
          get(state.tabs[activeIndex], "rawBody", "")
            .replace(/\r\n/g, "")
            .trim()
        );
      } catch (e) {
        // newState.body = get(state.tabs[activeIndex], 'rawBody', "").replace(/\r\n/g, "").trim()
      }
    } else if (newState.body_type === "formData") {
      let body = {};
      state.tabs[activeIndex].formData.forEach((data) => {
        if (data.isChecked && data.name) {
          let name = data.name;
          let value = data.value;
          body[name] = value;
        }
      });
      newData.body = JSON.stringify(body);
    } else if (newState.body_type === "xWwwFormUrlEncode") {
      let body = {};
      state.tabs[activeIndex].xFormData.forEach((data) => {
        if (data.isChecked && data.name) {
          let name = data.name;
          let value = data.value;
          body[name] = value;
        }
      });
      newData.body = JSON.stringify(body);
    } else if (
      newState.body_type === "text" ||
      newState.body_type === "javaScript" ||
      newState.body_type === "html"
    ) {
      newData.body = get(state.tabs[activeIndex], "rawBody", "");
    } else if (newState.body_type === "graphQl") {
      newData.body = { ...state.tabs[activeIndex].graphQl };
      try {
        newData.body = JSON.parse(newData.body.replace(/\r\n/g, "").trim());
      } catch (e) {}
    }
    // set Header
    let headers: any = {};
    if (newState.body_type === "xml") {
      headers["Content-Type"] = "text/xml";
    } else if (newState.body_type === "text") {
      headers["Content-Type"] = "text/plain";
    } else if (newState.body_type === "javaScript") {
      headers["Content-Type"] = "application/javascript";
    } else if (newState.body_type === "html") {
      headers["Content-Type"] = "text/html";
    } else if (newState.body_type === "graphQl") {
      headers["Content-Type"] = "application/json";
    }
    try {
      if (get(state.tabs[activeIndex], "header", []).length) {
        state.tabs[activeIndex].header.forEach((data) => {
          if (data.isChecked && data.name) {
            let name = data.name;
            let value = data.value;
            headers[name] = value;
          }
        });
      }
      if (state.tabs[activeIndex].auth === "Bearer Token") {
        headers.token = get(state.tabs[activeIndex], "token", "");
      }
      if (state.tabs[activeIndex].auth === "API Key") {
        if (get(state.tabs[activeIndex], "APIKey.key", false)) {
          headers[get(state.tabs[activeIndex], "APIKey.key", "")] = get(
            state.tabs[activeIndex],
            "APIKey.value",
            ""
          );
        }
      }
      newData.headers = Object.keys(headers).length ? headers : null;
    } catch (e) {
      // newState.body = get(state.tabs[activeIndex], 'rawBody', "").replace(/\r\n/g, "").trim()
    }
    const createApiWebapiInput = { workspace_id, ...newData };
    // get(state.tabs[activeIndex], 'binaryFile', []).map((file)=>{
    //   formData.append('files', file);
    // })
    var formData = new FormData();
    var data = {};
    if (newState.body_type !== "binary") {
      data = await apiClient.mutate({
        mutation: apiQuery.callAPI,
        variables: { createApiWebapiInput, files: formData },
      });
    } else {
      formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: apiQuery.updateApi,
          variables: { createApiWebapiInput },
        })
      );
      formData.append("map", '{"0":["variables.files"]}');
      formData.append("0", get(state.tabs[activeIndex], "binaryFile", null));
      await fetch(env.NX_API_API ?? "", {
        method: "POST",
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
          authorization: "Bearer " + token,
          body: formData.toString(),
        },
      });
    }

    thunkAPI.dispatch(fetchHistory());
    return {
      ...data,
      workspace_id,
      request_name: get(createApiWebapiInput, "request_name", ""),
    };
  }
);

export const updateApi = createAsyncThunk(
  "api/update",
  async (updateApidata: any, thunkAPI: any) => {
    const token = await getDeviceTokenToStorage();
    const { apiClient, apiQuery } = apiService;
    const state = thunkAPI.getState().api;

    const workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const activeIndex = state.tabs.findIndex(
      (tab) => tab.key === state.activeTab
    );
    const newState = Object.assign({}, state.tabs[activeIndex].api);
    const activeKeys = get(
      thunkAPI.getState(),
      "apiEnv.activeEnv.local_variable",
      []
    );
    const newData: any = {};
    var url = get(newState, "url", "").trim();
    if (activeKeys.length) {
      url = getWordsBetweenCurlies(url, activeKeys);
    }
    var prefix = "http://";
    var prefix1 = "https://";
    if (
      url.substr(0, prefix.length) !== prefix &&
      url.substr(0, prefix1.length) !== prefix1
    ) {
      url = prefix + url;
    }

    if (get(updateApidata, "api", false)) {
      newData.id = get(updateApidata, "api", false);
      newData.workspace_id = workspace_id;
    } else {
      (newData.body_type =
        get(newState, "body_type", "json") === "x-www-form-urlencoded"
          ? "xWwwFormUrlEncode"
          : get(newState, "body_type", "json") === "form-data"
          ? "formData"
          : get(newState, "body_type", "json")),
        (newData.method = get(newState, "method", "GET"));
      newData.url = url;
      newData.body = null;
      newData.workspace_id = workspace_id;
      newData.id = get(newState, "_id", "");
    }

    if (get(updateApidata, "request_description", "")) {
      newData.request_description = updateApidata.request_description;
    }
    if (get(updateApidata, "request_name", "")) {
      newData.request_name = updateApidata.request_name;
    }
    if (!get(updateApidata, "api", false)) {
      // set body
      if (newState.body_type === "json") {
        try {
          newData.body = JSON.parse(
            get(state.tabs[activeIndex], "rawBody", "")
              .replace(/\r\n/g, "")
              .trim()
          );
        } catch (e) {
          // newState.body = get(state.tabs[activeIndex], 'rawBody', "").replace(/\r\n/g, "").trim()
        }
      } else if (newState.body_type === "formData") {
        let body = {};
        state.tabs[activeIndex].formData.forEach((data) => {
          if (data.isChecked && data.name) {
            let name = data.name;
            let value = data.value;
            body[name] = value;
          }
        });
        newData.body = body;
      } else if (newState.body_type === "xWwwFormUrlEncode") {
        let body = {};
        state.tabs[activeIndex].xFormData.forEach((data) => {
          if (data.isChecked && data.name) {
            let name = data.name;
            let value = data.value;
            body[name] = value;
          }
        });
        newData.body = body;
      } else if (
        newState.body_type === "text" ||
        newState.body_type === "javaScript" ||
        newState.body_type === "html" ||
        newState.body_type === "xml"
      ) {
        newData.body = get(state.tabs[activeIndex], "rawBody", "");
      } else if (newState.body_type === "graphQl") {
        newData.body = { ...state.tabs[activeIndex].graphQl };
        try {
          newData.body.variable = JSON.parse(
            newData.body.variable.replace(/\r\n/g, "").trim()
          );
        } catch (e) {
          // console.log("e=====>", e, newData.body)
        }
      }
      // set Header
      let headers: any = {};
      if (newState.body_type === "xml") {
        headers["Content-Type"] = "text/xml";
      } else if (newState.body_type === "text") {
        headers["Content-Type"] = "text/plain";
      } else if (newState.body_type === "javaScript") {
        headers["Content-Type"] = "application/javascript";
      } else if (newState.body_type === "html") {
        headers["Content-Type"] = "text/html";
      } else if (newState.body_type === "graphQl") {
        headers["Content-Type"] = "application/json";
      }
      try {
        if (get(state.tabs[activeIndex], "header", []).length) {
          state.tabs[activeIndex].header.forEach((data) => {
            if (data.isChecked && data.name) {
              let name = data.name;
              let value = data.value;
              headers[name] = value;
            }
          });
        }
        if (state.tabs[activeIndex].auth === "Bearer Token") {
          headers.token = get(state.tabs[activeIndex], "token", "");
        }
        if (state.tabs[activeIndex].auth === "API Key") {
          if (get(state.tabs[activeIndex], "APIKey.key", false)) {
            headers[get(state.tabs[activeIndex], "APIKey.key", "")] = get(
              state.tabs[activeIndex],
              "APIKey.value",
              ""
            );
          }
        }
        newData.headers = Object.keys(headers).length ? headers : null;
      } catch (e) {
        // newState.body = get(state.tabs[activeIndex], 'rawBody', "").replace(/\r\n/g, "").trim()
      }
    }
    const updateApiWebapiInput = { workspace_id, ...newData };
    // get(state.tabs[activeIndex], 'binaryFile', []).map((file)=>{
    //   formData.append('file[]', file);
    // })
    var data = {};
    if (newState.body_type !== "binary") {
      data = await apiClient.mutate({
        mutation: apiQuery.updateApi,
        variables: { updateApiWebapiInput, file: null },
      });
    } else {
      var formData = new FormData();
      formData.append(
        "operations",
        `{"query":"mutation callApi($input: CreateApiWebapiInput!, $files:[Upload!]) {apiCall(createApiWebapiInput: $input, files: $files) {_id workspace {_id name} created_at updated_at request_name request_description method url headers body body_type show_in_history responseStatus responseStatusText responseHeaders responseTimeInMilliseconds responseCookies responseData}}","variables":{"input":{"workspace_id":"624e7a02f5e877a6dbf7edca","method":"POST","url":"http://localhost:8000/upload_file","body_type":"binary","headers":{"content-type":"application/json"},"body":{},"show_in_history":true}}}`
      );
      formData.append("map", '{"0":["variables.files"]}');
      formData.append("0", get(state.tabs[activeIndex], "binaryFile", null));
      await fetch(env.NX_API_API ?? "", {
        method: "POST",
        headers: {
          // 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s',
          authorization: "Bearer " + token,
          body: formData.toString(),
        },
      });
    }
    thunkAPI.dispatch(fetchHistory());
    thunkAPI.dispatch(fetchCollections());
    return {
      isUpdating: get(updateApidata, "isUpdating", false),
      ...data,
      request_name: get(updateApidata, "request_name", ""),
    };
  }
);

export const fetchHistory = createAsyncThunk(
  "api/history/fetch",
  async (_, thunkAPI) => {
    let workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const { apiClient, apiQuery } = apiService;
    const data = await apiClient.query({
      query: apiQuery.getHistory,
      variables: { workspace_id },
    });
    return data;
  }
);

export const clearHistory = createAsyncThunk(
  "api/history/clear/all",
  async (_, thunkAPI) => {
    let workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const { apiClient, apiQuery } = apiService;
    const data = await apiClient.mutate({
      mutation: apiQuery.clearHistory,
      variables: { workspace_id },
    });

    thunkAPI.dispatch(fetchHistory());
    return data;
  }
);

export const removeApiFromHistory = createAsyncThunk(
  "api/history/api/remove",
  async (updateApidata: any, thunkAPI) => {
    let workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const { apiClient, apiQuery } = apiService;
    const data = await apiClient.mutate({
      mutation: apiQuery.updateApi,
      variables: { updateApiWebapiInput: { workspace_id, ...updateApidata } },
    });

    thunkAPI.dispatch(fetchHistory());
    return data;
  }
);

export const removeApiFromCollection = createAsyncThunk(
  "api/history/api/remove",
  async (deleteApidata: any, thunkAPI) => {
    let workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const { apiClient, apiQuery } = apiService;
    const data = await apiClient.mutate({
      mutation: apiQuery.deleteApi,
      variables: { workspace_id, ...deleteApidata },
    });

    thunkAPI.dispatch(fetchCollections());
    return data;
  }
);

export const saveResponce = createAsyncThunk(
  "api/api/saveRes",
  async (saveResponcedata: any, thunkAPI) => {
    let workspace_id = get(
      thunkAPI.getState(),
      "workspaceStore.currentWorkspaceData._id",
      ""
    );
    const { apiClient, apiQuery } = apiService;
    const data = await apiClient.mutate({
      mutation: apiQuery.saveResponce,
      variables: {
        updateApiWebapiInput: {
          workspace_id,
          ...saveResponcedata,
        },
      },
    });
    thunkAPI.dispatch(fetchCollections());
    return data;
  }
);

export const getCollectionDocs = createAsyncThunk(
  "api/collection/documents",
  async (getCollectionDocsdata: any, thunkAPI) => {
    const { workspaceId, organizationName, collectionId } =
      getCollectionDocsdata;
    const url = `${env.NX_SERVICE_SERVER}/api-doc/docs/${organizationName}/${workspaceId}/${collectionId}`;
    const data = await fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data;
      });
    return data;
  }
);

export const genrateCollectionDocs = createAsyncThunk(
  "api/genrate/collection/documents",
  async (genrateCollectionDocsdata: any, thunkAPI) => {
    const { workspaceId, organizationName, collectionId } =
      genrateCollectionDocsdata;
    const url = `${
      env.NX_SERVICE_SERVER
    }/api-doc/collections-docs/${organizationName}/${workspaceId}?collectionIds=${collectionId.join()}`;
    const data = await fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data;
      });
    return data;
  }
);

export const initialApiStoreState = apiStoreAdapter.getInitialState({
  loadingStatus: "not loaded",
  error: null || "",
  fetchApiEnvStatus: "not loaded",
  fetchApiEnvData: {},
  updateEnvStatus: "not loaded",
  updateEnvData: {},
  fetchHistoryStatus: "not loaded",
  fetchHistoryData: {},
  fetchCollectionsStatus: "not loaded",
  fetchCollectionsData: {},
  deleteEnvStatus: "not loaded",
  deleteEnvData: {},
  deleteCollectionStatus: "not loaded",
  deleteCollectionData: {},
  saveResponceStatus: "not loaded",
  saveResponceData: {},
  markActiveEnvStatus: "not loaded",
  markActiveEnvData: {},
  getActiveEnvStatus: "not loaded",
  getActiveEnvData: {},
  getCollectionDocsStatus: "not loaded",
  getCollectionDocsData: {},
  genrateCollectionDocsStatus: "not loaded",
  genrateCollectionDocsData: {},
  importEnvStatus: "not loaded",
  importEnvData: {},
  createCollectionStatus: "not loaded",
  createCollectionData: {},
  updateCollectionStatus: "not loaded",
  updateCollectionData: {},
  callApiStatus: "not loaded",
  callApiData: {},
  updateApiStatus: "not loaded",
  updateApiData: {},
  clearHistoryStatus: "not loaded",
  clearHistoryData: {},
  removeApiFromHistoryStatus: "not loaded",
  removeApiFromHistoryData: {},
  removeApiFromCollectionStatus: "not loaded",
  removeApiFromCollectionData: {},
});
export const apiStoreSlice = createSlice({
  name: API_FEATURE_KEY,
  initialState: initialApiStoreState,
  reducers: {
    add: apiStoreAdapter.addOne,
    remove: apiStoreAdapter.removeOne,
    setLoadingStatus: (state, action) => {
      state.loadingStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiEnv.pending, (state) => {
        state.fetchApiEnvStatus = "loading";
      })
      .addCase(fetchApiEnv.fulfilled, (state, action) => {
        state.fetchApiEnvData = action.payload ?? {};
        state.fetchApiEnvStatus = "loaded";
      })
      .addCase(fetchApiEnv.rejected, (state, action) => {
        state.fetchApiEnvStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(updateEnv.pending, (state) => {
        state.updateEnvStatus = "loading";
      })
      .addCase(updateEnv.fulfilled, (state, action) => {
        state.updateEnvData = action.payload ?? {};
        state.updateEnvStatus = "loaded";
      })
      .addCase(updateEnv.rejected, (state, action) => {
        state.updateEnvStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(fetchHistory.pending, (state) => {
        state.fetchHistoryStatus = "loading";
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.fetchHistoryData = action.payload ?? {};
        state.fetchHistoryStatus = "loaded";
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.fetchHistoryStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(fetchCollections.pending, (state) => {
        state.fetchCollectionsStatus = "loading";
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.fetchCollectionsData = action.payload ?? {};
        state.fetchCollectionsStatus = "loaded";
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.fetchCollectionsStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(deleteEnv.pending, (state) => {
        state.deleteEnvStatus = "loading";
      })
      .addCase(deleteEnv.fulfilled, (state, action) => {
        state.deleteEnvData = action.payload ?? {};
        state.deleteEnvStatus = "loaded";
      })
      .addCase(deleteEnv.rejected, (state, action) => {
        state.deleteEnvStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(deleteCollection.pending, (state) => {
        state.deleteCollectionStatus = "loading";
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.deleteCollectionData = action.payload ?? {};
        state.deleteCollectionStatus = "loaded";
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.deleteCollectionStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(saveResponce.pending, (state) => {
        state.saveResponceStatus = "loading";
      })
      .addCase(saveResponce.fulfilled, (state, action) => {
        state.saveResponceData = action.payload ?? {};
        state.saveResponceStatus = "loaded";
      })
      .addCase(saveResponce.rejected, (state, action) => {
        state.saveResponceStatus = "error";
        state.error = action.error.message ?? "";
      })
      // .addCase(markActiveEnv.pending, (state) => {
      //   state.markActiveEnvStatus = "loading";
      // })
      // .addCase(markActiveEnv.fulfilled, (state, action) => {
      //   state.markActiveEnvData = action.payload ?? {};
      //   state.markActiveEnvStatus = "loaded";
      // })
      // .addCase(markActiveEnv.rejected, (state, action) => {
      //   state.markActiveEnvStatus = "error";
      //   state.error = action.error.message ?? "";
      // })
      .addCase(getActiveEnv.pending, (state) => {
        state.getActiveEnvStatus = "loading";
      })
      .addCase(getActiveEnv.fulfilled, (state, action) => {
        state.getActiveEnvData = action.payload ?? {};
        state.getActiveEnvStatus = "loaded";
      })
      .addCase(getActiveEnv.rejected, (state, action) => {
        state.getActiveEnvStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(getCollectionDocs.pending, (state) => {
        state.getCollectionDocsStatus = "loading";
      })
      .addCase(getCollectionDocs.fulfilled, (state, action) => {
        state.getCollectionDocsData = action.payload ?? {};
        state.getCollectionDocsStatus = "loaded";
      })
      .addCase(getCollectionDocs.rejected, (state, action) => {
        state.getCollectionDocsStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(genrateCollectionDocs.pending, (state) => {
        state.genrateCollectionDocsStatus = "loading";
      })
      .addCase(genrateCollectionDocs.fulfilled, (state, action) => {
        state.genrateCollectionDocsData = action.payload ?? {};
        state.genrateCollectionDocsStatus = "loaded";
      })
      .addCase(genrateCollectionDocs.rejected, (state, action) => {
        state.genrateCollectionDocsStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(importEnv.pending, (state) => {
        state.importEnvStatus = "loading";
      })
      .addCase(importEnv.fulfilled, (state, action) => {
        state.importEnvData = action.payload ?? {};
        state.importEnvStatus = "loaded";
      })
      .addCase(importEnv.rejected, (state, action) => {
        state.importEnvStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(createCollection.pending, (state) => {
        state.createCollectionStatus = "loading";
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.createCollectionData = action.payload ?? {};
        state.createCollectionStatus = "loaded";
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.createCollectionStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(updateCollection.pending, (state) => {
        state.updateCollectionStatus = "loading";
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        state.updateCollectionData = action.payload ?? {};
        state.updateCollectionStatus = "loaded";
      })
      .addCase(updateCollection.rejected, (state, action) => {
        state.updateCollectionStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(callApi.pending, (state) => {
        state.callApiStatus = "loading";
      })
      .addCase(callApi.fulfilled, (state, action) => {
        state.callApiData = action.payload ?? {};
        state.callApiStatus = "loaded";
      })
      .addCase(callApi.rejected, (state, action) => {
        state.callApiStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(updateApi.pending, (state) => {
        state.updateApiStatus = "loading";
      })
      .addCase(updateApi.fulfilled, (state, action) => {
        state.updateApiData = action.payload ?? {};
        state.updateApiStatus = "loaded";
      })
      .addCase(updateApi.rejected, (state, action) => {
        state.updateApiStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(clearHistory.pending, (state) => {
        state.clearHistoryStatus = "loading";
      })
      .addCase(clearHistory.fulfilled, (state, action) => {
        state.clearHistoryData = action.payload ?? {};
        state.clearHistoryStatus = "loaded";
      })
      .addCase(clearHistory.rejected, (state, action) => {
        state.clearHistoryStatus = "error";
        state.error = action.error.message ?? "";
      })
      .addCase(removeApiFromHistory.pending, (state) => {
        state.removeApiFromHistoryStatus = "loading";
      })
      .addCase(removeApiFromHistory.fulfilled, (state, action) => {
        state.removeApiFromHistoryData = action.payload ?? {};
        state.removeApiFromHistoryStatus = "loaded";
      })
      .addCase(removeApiFromHistory.rejected, (state, action) => {
        state.removeApiFromHistoryStatus = "error";
        state.error = action.error.message ?? "";
      });
    // .addCase(removeApiFromCollection.pending, (state) => {
    //   state.removeApiFromCollectionStatus = "loading";
    // })
    // .addCase(removeApiFromCollection.fulfilled, (state, action) => {
    //   state.removeApiFromCollectionData = action.payload ?? {};
    //   state.removeApiFromCollectionStatus = "loaded";
    // })
    // .addCase(removeApiFromCollection.rejected, (state, action) => {
    //   state.removeApiFromCollectionStatus = "error";
    //   state.error = action.error.message ?? "";
    // });
  },
});
/*
 * Export reducer for store configuration.
 */
export const apiStoreReducer = apiStoreSlice.reducer;
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
export const apiStoreActions = apiStoreSlice.actions;
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
const { selectAll, selectEntities } = apiStoreAdapter.getSelectors();
export const getApiStoreState = (rootState) => rootState[API_FEATURE_KEY];
export const selectAllApiStore = createSelector(getApiStoreState, selectAll);
export const selectApiStoreEntities = createSelector(
  getApiStoreState,
  selectEntities
);
