import {
  ApolloClient,
  HttpLink,
  gql,
  InMemoryCache,
  concat,
} from "@apollo/client";
import authMiddleware from "./middleware/authMiddleware";

const httpLink = new HttpLink({ uri: 'https://auth.onetab.ai/api/graphql' });

const workspaceClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

const createWorkspace = gql`
  mutation createWorkspace($createWorkspaceInput: CreateWorkspaceInput!) {
    createWorkspace(createWorkspaceInput: $createWorkspaceInput) {
      name
      _id
    }
  }
`;

const updateOrganisationLogo = gql`
  mutation updateOrganisationLogo($logo: String!, $_id: String!) {
    updateOrganisationLogo(logo: $logo, _id: $_id)
  }
`;

const fetchWorkspaces = gql`
  query fetchWorkspace {
    workspaces {
      name
      _id
      userId
      organizationId
      planDueDate
    }
  }
`;

const fetchCurrentWorkspaces = gql`
  query fetchCurrentWorkspace($workspaceId: String!) {
    workspace(workspaceId: $workspaceId) {
      _id
      userId
      name
      organizationId
      organizationName
      organizationLogo
      permission
    }
  }
`;
//Check Organization Name Already Exists Or Not
const checkOrgNameExists = gql`
mutation checkOrgNameExists($organizationDomain: String! ){
 checkOrgNameExists(organizationDomain:$organizationDomain){
  success
  message
  organizationDbName
 }
}
`;

//Create Organization
const createOrganization = gql`
 mutation createOrganization($organizationDomain: String! $UserId: String!){
  createOrganization(organizationDomain:$organizationDomain UserId:$UserId){
    user {
        _id
        firstName
        lastName
        email
        phoneNumber
        organizationDomain
        onboarding_flow
      }
    token
  }
}
`;

const userOrganizationAndWorkspace = gql`
  query userOrganizationAndWorkspace {
    userOrganizationAndWorkspace {
      hasOrganization
      hasWorkspace
    }
  }
`;

//Check Organization
const checkUserOrganization = gql`
  query checkUserOrg($userId: String!) {
    checkUserOrg(userId: $userId){
      hasOrganization
      user{
        _id
        firstName
        lastName
        # email
        organizationDomain
        activeOrganizationDomain
        onboarding_flow
        is_invited
      }
    }
  }
`;

export const workspaceService = {
  workspaceClient,
  workspaceQuery: {
    createWorkspace,
    updateOrganisationLogo,
    fetchWorkspaces,
    fetchCurrentWorkspaces,
    checkOrgNameExists,
    createOrganization,
    checkUserOrganization,
    userOrganizationAndWorkspace
  },
};
