import {
  ApolloClient,
  InMemoryCache,
  // ApolloProvider,
  // useQuery,
  gql,
} from "@apollo/client";

const authClient = new ApolloClient({
  uri: "https://auth.onetab.ai/api/graphql",
  cache: new InMemoryCache(),
});

const signup = gql`
  mutation createMyUser($input: CreateUserInput!) {
    signup(createUserInput: $input) {
      _id
      email
    }
  }
`;

const login = gql`
  mutation login($email: String!, $isMobile: Boolean) {
    getLoginCode(email: $email, isMobile: $isMobile) {
      user {
        _id
        email
      }
    }
  }
`;

const verifyOtp = gql`
  mutation verifyOtp($createAuthInput: CreateAuthInput!) {
    getToken(createAuthInput: $createAuthInput) {
      user {
        _id
        firstName
        lastName
        email
        phoneNumber
        organizationDomain
        onboarding_flow
        is_invited
      }
      token
    }
  }
`;

const contactUs = gql`
  query contactUs(
    $firstName: String!
    $lastName: String!
    $email: String!
    $phoneNumber: String!
    $message: String!
  ) {
    contactUsEnquiry(
      email: $email
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      message: $message
    )
  }
`;

const socialLogin = gql`
  mutation socialLogin(
    $code: String!
    $loginFrom: String!
    $isMobile: Boolean
  ) {
    socialLogin(code: $code, loginFrom: $loginFrom, isMobile: $isMobile) {
      user {
        _id
        firstName
        lastName
        email
        phoneNumber
        organizationDomain
        onboarding_flow
        is_invited
      }
      token
    }
  }
`;

const updateOrganizationSkip = gql`
  mutation updateOrganizationSkip(
    $organizationDomainId: String!
    $email: String!
  ) {
    updateOrganizationSkip(
      organizationDomainId: $organizationDomainId
      email: $email
    )
  }
`;

// {
//   "createAuthInput": {
//     "email": "abhilashparmar@gmail.com",
//     "code": "6924"
//   }
// }

export const authService = {
  authClient,
  authQuery: {
    signup,
    login,
    verifyOtp,
    contactUs,
    socialLogin,
    updateOrganizationSkip,
  },
};
