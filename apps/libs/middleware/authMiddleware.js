import { getDeviceTokenToStorage } from "../../utils/setUpContext";

import { ApolloLink } from "@apollo/client";

const authMiddleware = new ApolloLink(async (operation, forward) => {
  const token = await getDeviceTokenToStorage();
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: "Bearer " + token || null,
    },
  }));

  return forward(operation);
});

export default authMiddleware;
