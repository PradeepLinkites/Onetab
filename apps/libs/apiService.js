import env from "../../config";
import {
  ApolloClient,
  HttpLink,
  gql,
  InMemoryCache,
  concat,
} from "@apollo/client";
import authMiddleware from "./middleware/authMiddleware";

const httpLink = new HttpLink({ uri: env.NX_API_API });

const apiClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

const getCollections = gql`
  query getCollection($workspaceId: String!) {
    collections(workspace_id: $workspaceId) {
      _id
      name
      apis
      created_by {
        _id
        organizationDomain
      }
    }
  }
`;

const createCollection = gql`
  mutation createCollection($createCollectionInput: CreateCollectionInput!) {
    createCollection(createCollectionInput: $createCollectionInput) {
      _id
      name
      apis
    }
  }
`;

const updateCollection = gql`
  mutation updateCollection($updateCollectionInput: UpdateCollectionInput!) {
    updateCollection(updateCollectionInput: $updateCollectionInput) {
      _id
      name
      apis
    }
  }
`;

const callAPI = gql`
  mutation apiCall(
    $createApiWebapiInput: CreateApiWebapiInput!
    $files: [Upload!]
  ) {
    apiCall(createApiWebapiInput: $createApiWebapiInput, files: $files) {
      responseStatus
      responseStatusText
      responseHeaders
      responseCode
      responseData
      responseCookies
      responseTimeInMilliseconds
      _id
    }
  }
`;

const updateApi = gql`
  mutation updateApi(
    $updateApiWebapiInput: UpdateApiWebapiInput!
    $file: [Upload!]
  ) {
    apiUpdate(updateApiWebapiInput: $updateApiWebapiInput, file: $file) {
      _id
      request_name
      request_description
      responseStatus
      responseCookies
      responseStatusText
      responseHeaders
      responseData
      responseTimeInMilliseconds
    }
  }
`;

const deleteApi = gql`
  mutation deleteAPI($workspace_id: String!, $api_id: String!) {
    apiDelete(workspace_id: $workspace_id, api_id: $api_id)
  }
`;

const getHistory = gql`
  query getHistory($workspace_id: String!) {
    apisHistoryByDate(workspace_id: $workspace_id) {
      apis
    }
  }
`;

const clearHistory = gql`
  mutation clearHistory($workspace_id: String!) {
    clearHistory(workspace_id: $workspace_id)
  }
`;

const removeCollection = gql`
  mutation deleteCollection($workspace_id: String!, $collection_id: String!) {
    removeCollection(workspace_id: $workspace_id, collection_id: $collection_id)
  }
`;
const saveResponce = gql`
  mutation updateApi(
    $updateApiWebapiInput: UpdateApiWebapiInput!
    $file: [Upload!]
  ) {
    apiUpdate(updateApiWebapiInput: $updateApiWebapiInput, file: $file) {
      saved_response
    }
  }
`;

const createEnv = gql`
  mutation createEnv($create: EnvInput!) {
    createEnvvar(create: $create) {
      local_variable {
        varName
        initialValue
        currentValue
      }
      envoirmentName
    }
  }
`;

const getEnv = gql`
  query getAllEnv($envlist: EnvList!) {
    getAllEnv(envlist: $envlist)
  }
`;

const updateEnv = gql`
  mutation updateEnv($updateEnv: UpadteEnvInput!) {
    updateEnv(updateEnv: $updateEnv) {
      local_variable {
        varName
      }
    }
  }
`;

const removeEnv = gql`
  mutation removeEnv($removeEnvById: UpadteEnvInput!) {
    removeEnvByID(removeEnvById: $removeEnvById)
  }
`;

const markActive = gql`
  query markActive($activeEnvlist: EnvList!) {
    activeEnv(activeEnvlist: $activeEnvlist)
  }
`;

const getActivEnv = gql`
  query getActiveEnv($activeEnvlist: EnvList!) {
    getallactiveList(activeEnvlist: $activeEnvlist)
  }
`;

export const apiService = {
  apiClient,
  apiQuery: {
    createCollection,
    getCollections,
    updateCollection,
    removeCollection,
    callAPI,
    updateApi,
    deleteApi,
    getHistory,
    clearHistory,
    saveResponce,
    getEnv,
    updateEnv,
    createEnv,
    removeEnv,
    markActive,
    getActivEnv,
  },
};
