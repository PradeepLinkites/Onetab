import {
  ApolloClient,
  HttpLink,
  gql,
  InMemoryCache,
  concat,
} from "@apollo/client";
import authMiddleware from "./middleware/authMiddleware";

const httpLink = new HttpLink({ uri: 'https://stg-auth.onetab.ai/api/graphql' });

const userClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});
//old
const getUser = gql`
  query getUserByToken {
    userByToken {
      _id
      firstName
      lastName
      email
      phoneNumber
      profileImageUrl
      organizationDomain
      activeOrganizationDomain
      matrixUsername
      matrixPassword
      onboarding_flow
      is_invited
      timezone
      agoraUid
      plan {
        maxUsers
        _id
      }
    }
  }
`;

const updateUser = gql`
  mutation updateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      _id
    }
  }
`;

const getModules = gql`
  query getModules($workspaceId: String!) {
    userAccessibleModulesInWorkspace(workspaceId: $workspaceId) {
      _id
      name
      domainName
    }
  }
`;

const getInvites = gql`
  query getInvites($workspaceId: String!) {
    invites(workspaceId: $workspaceId) {
      _id
      userId
      email
      firstName
      lastName
      matrixUsername
      profileImageUrl
      isVerified
      timezone
      permission
    }
  }
`;

const updateInvitePermission = gql`
  mutation updateInvitePermission($assignedUserId: String!, $workspaceId: String!, $permission: [String!]!) {
    updateInvitePermission(assignedUserId: $assignedUserId, workspaceId: $workspaceId,  permission: $permission)
  }
`;

const createInvites = gql`
  mutation inviteUser($createUserScopeInput: InviteInput!) {
    createInvite(createUserScopeInput: $createUserScopeInput)
  }
`;

const removeInvite = gql`
  mutation removeInvites($_id: String!, $moduleId: String!) {
    updateInvite(_id: $_id, moduleId: $moduleId)
  }
`;

const cancelInvite = gql`
  mutation removeInvitemodules($Id: String!) {
    removeInvitemodules(Id: $Id)
  }
`;

const getPlans = gql`
  query getPlans {
    findPlans {
      _id
      id
      name
      description
      # amount
      price
      billingFrequency
      currency
      # interval
      # product {
      #   description
      #   name
      # }
    }
  }
`;

const postpaidPayment = gql`
  query subscribeToPlan(
    $paymentMethod: String!
    $plan: String!
    $workspaceId: String!
    $amount: Float
  ) {
    subscribeToPlan(
      paymentMethod: $paymentMethod
      plan: $plan
      workspaceId: $workspaceId
      amount: $amount
    ) {
      success
      message
      id
      status
      client_secret
      payment_method
      redirect_to_url {
        return_url
        url
        type
      }
    }
  }
`;

const subscribePlan = gql`
  query createCustomerOnStripe($paymentCreds: CompanyProfileDto! ) {
    createCustomerOnStripe(paymentCreds: $paymentCreds)
     {
      success
      message
    }
  }
`;

const getSubscribePlan = gql`
  query getSubscription($workspaceId: String!) {
    fetchCustomerPlan(workspaceId: $workspaceId) {
      _id
      customerId
      creditBalance
      subscriberId
      addOnUsers
      unPaidUsers
      removedUsers
      workspaceId
      removedUserDays
      startDate
      renewalDate
      status
      paymentAttemptStatus
      message
      receipts {
        createdAt
        amount_paid
        invoice_url
      }
      companyInfo
      companyName
      companyProfile{
        companyName
        address
        city
        postalCode
        country
        state
      }
      plan {
        _id
        name
        description
        maxWorkSpaces
        price
        currency
        billingFrequency
        cicd
        fileStorage
      }
      card {
        brand
        exp_month
        exp_year
        last4
        paymentMethodId
        isDefault
      }
    }
  }
`;

const cancelSubscription = gql`
  query cancelSubscription($subscription: String!, $workspaceId: String!) {
    cancelSubscription(subscription: $subscription, workspaceId: $workspaceId) {
      success
      message
    }
  }
`;

const upgradePlan = gql`
  query upgradePlan($plan: String!, $subscription: String!) {
    upgradePlan(plan: $plan, subscription: $subscription) {
      success
      message
    }
  }
`;

const updateCompanyInfo = gql`
  mutation updateInvoiceCompanyInfo($companyProfile: CompanyProfileDto!){
  updateInvoiceCompanyInfo(companyProfile:$companyProfile){
    success
    message
  }
}
`;

const updatePayment = gql`
  query updatePayment($paymentMethod: String!) {
    updateSubscriptionPaymentMethod(paymentMethod: $paymentMethod) {
      success
      message
    }
  }
`;

const searchMail = gql`
  query searchUser($searchText: String!, $userId: String!) {
    searchUser(searchText: $searchText, userId: $userId) {
      _id
      firstName
      lastName
      countryCode
      phoneNumber
      email
      organizationDomain
      address
      profileImageUrl
      agoraUid
      created_at
      updated_at
      matrixUsername
      matrixPassword
    }
  }
`;

const saveStorage = gql`
  mutation saveStorage($extraFieldsInput: String!) {
    saveUserExtraFields(extraFieldsInput: $extraFieldsInput)
  }
`;

const getStorage = gql`
  query getStorage {
    getUserExtraFields
  }
`;

const logout = gql`
  query removeToken {
    removeTokenForLogoutUser
  }
`;

const getUserAllRepository = gql`
  query getUserAllRepository($workspaceId: String!) {
    getUserAllRepository(workspaceId: $workspaceId)
  }
`;

const getUserAllComits = gql`
  query getUserAllComits(
    $workspaceId: String!
    $owner: String!
    $repository: String!
    $page: Float!
  ) {
    getUserAllComits(
      workspaceId: $workspaceId
      owner: $owner
      repository: $repository
      page: $page
    )
  }
  `;

const getUserAllPR = gql`
query getUserAllPR(
  $workspaceId: String!
  $owner: String!
  $repository: String!
  $query: String!
){
  getUserAllPR(
    workspaceId: $workspaceId
    owner: $owner
    repository: $repository
    query: $query
  )
}
`

const gmailConnect = gql`
  mutation connectGmail($gmailInput: GmailInput!) {
    connectGmail(gmailInput: $gmailInput)
  }
`;

const removeGmailConnection = gql`
  mutation deleteGmailConnection($workspaceId: String!, $channelId: String!) {
    deleteGmailConnection(workspaceId: $workspaceId, channelId: $channelId)
  }
`;

const getMailContacts = gql`
  query getGmailConnection($workspaceId: String!, $channelId: String!) {
    getGmailConnection(workspaceId: $workspaceId, channelId: $channelId)
  }
`;

const updateMailContacts = gql`
  mutation updateGmailConnection(
    $channelId: String!
    $gmailInput: GmailInput!
  ) {
    updateGmailConnection(channelId: $channelId, gmailInput: $gmailInput)
  }
`;

const connectGithub = gql`
  mutation connectGithub($githubInput: GithubInput!) {
    connectGithub(githubInput: $githubInput) {
      _id
      isInstalled
      isActive
    }
  }
`;

const getAdminGitConnect = gql`
query getAdminGitConnect(
  $user: String!
  $workspace: String!
){
  getAdminGitConnect(user: $user, workspace: $workspace){
    _id
    user{
      _id
    }
    organizationDomain
    workspace{
      _id
    }
    channel{
      _id
    }
    isInstalled
    isActive
    login
    repositories
    userRepos{
      id
      full_name
      owner{
        login
      }
    }
  }
}
`;

const getAdminRepository = gql`
query getAdminRepository(
  $user: String!
  $workspace: String!
){
  getAdminRepository(user: $user, workspace: $workspace){
    id
    full_name
    owner{
      login
      avatar_url
    }
  }
}
`
const getAdminGitCommits = gql`
  query getAdminGitCommits(
    $user: String!
    $workspaceId: String!
    $owner: String!
    $repository: String!
    $page: Float!
  ) {
    getAdminGitCommits(
      user: $user
      workspaceId: $workspaceId
      owner: $owner
      repository: $repository
      page: $page
    )
  }
`;

const removeGithubConnection = gql`
  mutation deleteGithubConnection($workspaceId: String!) {
    deleteGithubConnection(workspaceId: $workspaceId)
  }
`;

const getGithubConnection = gql`
  query getGithubConnection(
    $workspaceId: String!
    $includeRepos: Boolean!
    $repositoryType: String
  ) {
    getGithubConnection(
      workspaceId: $workspaceId
      includeRepos: $includeRepos
      repositoryType: $repositoryType
    ) {
      _id
      isInstalled
      isActive
      repositories
      id
      userRepos {
        id
        full_name
        owner {
          login
          avatar_url
        }
      }
      publicRepos {
        id
        full_name
        owner {
          login
          avatar_url
        }
      }
    }
  }
`;

const getGithubCommits = gql`
  query getGithubCommits(
    $workspaceId: String!
    $owner: String!
    $repository: String!
    $page: Float!
  ) {
    getGithubCommits(
      workspaceId: $workspaceId
      owner: $owner
      repository: $repository
      page: $page
    )
  }
`;

const getGithubBranches = gql`
  query getGithubBranches(
    $workspaceId: String!
    $owner: String!
    $repository: String!
  ) {
    getGithubBranches(
      workspaceId: $workspaceId
      owner: $owner
      repository: $repository
    )
  }
`;

const updateGithubConnection = gql`
  mutation updateGithubConnection(
    $channelId: String!
    $githubInput: GithubInput!
  ) {
    updateGithubConnection(channelId: $channelId, githubInput: $githubInput) {
      _id
    }
  }
`;

const connectJira = gql`
  mutation connectJira($jiraInput: JiraInput!) {
    connectJira(jiraInput: $jiraInput)
  }
`;

const getJiraConnection = gql`
  query getJiraConnection($channelId: String!) {
    getJiraConnection(channelId: $channelId)
  }
`;

const updateJiraSubscription = gql`
  mutation updateJiraSubscription(
    $channelId: String!
    $projectId: String!
    $projectKey: String!
    $action: String!
  ) {
    updateJiraSubscription(
      channelId: $channelId
      projectId: $projectId
      projectKey: $projectKey
      action: $action
    )
  }
`;

const removeJiraConnection = gql`
  mutation deleteJiraConnection($channelId: String!) {
    deleteJiraConnection(channelId: $channelId)
  }
`;

const connectBitBucket = gql`
  mutation connectBitbucket($bitbucketInput: BitbucketInput!) {
    connectBitbucket(bitbucketInput: $bitbucketInput) {
      _id
    }
  }
`;

const deleteBitbucketConnections = gql`
  mutation deleteBitbucketConnection($channelId: String!) {
    deleteBitbucketConnection(channelId: $channelId)
  }
`;

const deleteBitbucketRepoSubscription = gql`
  mutation deleteRepoSubscription($channelId: String!, $repoUid: String!) {
    deleteRepoSubscription(channelId: $channelId, repoUid: $repoUid)
  }
`;

const createSubcription = gql`
  mutation createRepoSubscription(
    $channelId: String!
    $workspaceSlug: String!
    $repoUid: String!
    $workspaceUid: String!
  ) {
    createRepoSubscription(
      channelId: $channelId
      workspaceSlug: $workspaceSlug
      repoUid: $repoUid
      workspaceUid: $workspaceUid
    )
  }
`;

const getbitbucketConnection = gql`
  query getBitbucketConnection($channelId: String!) {
    getBitbucketConnection(channelId: $channelId)
  }
`;

const connectZoom = gql`
  mutation connectZoom($zoomInput: ZoomInput!) {
    connectZoom(zoomInput: $zoomInput)
  }
`;

const deleteZoomConnection = gql`
  mutation deleteZoomConnection($channelId: String!) {
    deleteZoomConnection(channelId: $channelId)
  }
`;

const getUserByAgoraId = gql`
  query getUserByAgoraId($agoraUid: Float!) {
    getUserByAgoraId(agoraUid: $agoraUid) {
      _id
      firstName
      lastName
      profileImageUrl
      matrixUsername
    }
  }
`;

const getAllNotification = gql`
  query getAllNotification {
    getAllNotification {
      _id
      userId {
        _id
      }
      workspaces
      module
      notification {
        receiverId {
          firstName
          lastName
          profileImageUrl
          matrixUsername
        }
        senderId {
          firstName
          lastName
          profileImageUrl
          matrixUsername
        }
        title
        description
        date
        module
        eventId
        msgEventId
        selectedRoomId
        workspaceId
        organizationId
        eventKind
        isRead
        metaData {
          invitation {
            workspaceName
          }
          kanban {
            toColumn
            taskname
            taskId
          }
        }
      }
    }
  }
`;

const updateNotification = gql`
  mutation updateNotification {
    updateNotification {
      _id
    }
  }
`;
const removeNotificationByEventId = gql`
  mutation removeNotificationByEventId($eventId: String!) {
    removeNotificationByEventId(eventId: $eventId)
  }
`;

const saveSubscription = gql`
  mutation saveSubscription($planId: String!, $planWorkspaceId: String!) {
    saveSubscription(planId: $planId, planWorkspaceId: $planWorkspaceId) {
      success
      message
      id
    }
  }
`;

const users = gql`
  query users {
    users {
      _id
      firstName
      lastName
      email
      phoneNumber
      profileImageUrl
      organizationDomain
      activeOrganizationDomain
      matrixUsername
      matrixPassword
      onboarding_flow
      agoraUid
      is_active
      is_invited
      plan {
        name
        slug
        description
        maxWorkSpaces
        maxUsers
        price
        currency
        billingFrequency
      }
    }
  }
`;

const updateUserByAdmin = gql`
  mutation updateUserByAdmin(
    $updateUserInput: UpdateUserInput!
    $currentUserId: String!
  ) {
    updateUserByAdmin(
      updateUserInput: $updateUserInput
      currentUserId: $currentUserId
    ) {
      _id
    }
  }
`;

const adminGetOrganization = gql`
  query adminGetOrganization {
    adminGetOrganization {
      name
      displayName
      logo
    }
  }
`;

// const getInvoice = gql`
//   query getInvoice(
//     $subscriptionId: String!
//     $userCount: Float!
//     $isInvoice: Boolean!
//   ) {
//     getInvoice(
//       subscriptionId: $subscriptionId
//       userCount: $userCount
//       isInvoice: $isInvoice
//     )
//   }
// `;

const updateSubscription = gql`
  mutation updateSubscription($updateSubscriptionDto: updateSubscriptionDto!) {
    updateSubscription(updateSubscription: $updateSubscriptionDto) {
      success
      message
      id
      renewalDate
    }
  }
`;

const getBillingUsers = gql`
  query getBillingUsers($subscriptionId: String!) {
    getBillingUsers(subscriptionId: $subscriptionId) {
      addOnUsersDetails {
        _id
        firstName
        lastName
        email
      }
      removedUsersDetails {
        _id
        firstName
        lastName
        email
      }
    }
  }
`;

const activeUsersBillingDays = gql`
  query activeUsersBillingDays($subscriptionId: String!) {
    activeUsersBillingDays(subscriptionId: $subscriptionId)
  }
`;

const updateDefaultPaymentMethod = gql`
  mutation updateDefaultPaymentMethod($customer: String! $paymentMethod: String!) {
    updateDefaultPaymentMethod(customer:$customer  paymentMethod: $paymentMethod)
  }
`;

const adminUsersData = gql`
  query adminUsersData($page: Float!, $limit: Float!) {
    adminUsersData(page: $page, limit: $limit) {
      _id
      firstName
      lastName
      email
      profileImageUrl
      organizationDomain
      activeOrganizationDomain
      created_at
      plan {
        name
        # description
        # maxWorkSpaces
        # maxUsers
        price
        currency
        billingFrequency
      }
    }
  }
`;

const findPlansWithWorkspace = gql`
  query findPlansWithWorkspace($userId: String!) {
    findPlansWithWorkspace(userId: $userId) {
      _id
      userId
      name
      organizationId
      organizationName
      organizationLogo
    }
  }
`;

const AdminUserPlanDetail = gql`
  query UserPlanDetail($userId: String!, $workspaceId: String!) {
    UserPlanDetail(userId: $userId, workspaceId: $workspaceId) {
      planName
      renewalDate
    }
  }
`;

const AdminSearchUsersByName = gql`
  query searchUsersByName($firstName: String!) {
    searchUsersByName(firstName: $firstName) {
      _id
      firstName
      lastName
      email
      profileImageUrl
      organizationDomain
      activeOrganizationDomain
    }
  }
`;

const workspacesBillingByOrganization = gql`
  query workspacesBillingByOrganization($organizationName: String!) {
    workspacesByOrganization(organizationName: $organizationName) {
      renewalDate
     startDate
     planName
     planPrice
     membersCount
     workspaceName
     amount
     foreCastedAmount
     billingFrequency
    }
  }
`;

const notifyMentionUser = gql`
  mutation notifyMentionUser(
    $workspaceId: String!
    $organizationId: String!
    $matrixUsername: [String!]!
    $msgEventId: String!
    $selectedRoomId: String!
  ) {
    notifyMentionUser(
      matrixUsername: $matrixUsername
      workspaceId: $workspaceId
      organizationId: $organizationId
      msgEventId: $msgEventId
      selectedRoomId: $selectedRoomId
    ) {
      _id
      userId {
        _id
      }
      workspaces
      module
      notification {
        title
        description
        date
        module
        eventId
        msgEventId
        selectedRoomId
        workspaceId
        organizationId
        eventKind
        eventType
        isRead
      }
    }
  }
`;

const getChatWorkspaceStatusData = gql`
  query getChatWorkspaceStatusData($workspaceId: String!, $daysAgo: Float!) {
    getChatWorkspaceStatus(workspaceId: $workspaceId, daysAgo: $daysAgo) {
      totalApps
      totalUsers
      totalChannels
      totalItemsSave
      totalAppsApis
      activePlan
      chatTotalStorageUsed
      totalStorage
      totalTasks
      totalColumns
      totalFilesUpload
      totalApiCalls
      totalMokeServer
      totalCollection
      analyticsTotalFiles
      analyticsThirdPartyApp
      analyticsTotalDatabase
      analyticsTotalStorageUsed
      totalRepoRepositoryCount
      totalActiveUser
      totalInActiveUser
      totalMessageSent
      chatFileUploaded
      analyticsQueryCount
      analyticsQuerySuccessCount
      analyticsQueryFailedCount
      totalDirectChannels
      totalGroupChannels
    }
  }
`;

const getTaskPriorityStatistics = gql`
  query getTaskPriorityStatistics($workspaceId: String!, $filter: String!) {
    getTaskPriorityStatistics(workspaceId: $workspaceId, filter: $filter) {
      count
      priority
    }
  }
`;

const getUserActivityData = gql`
  query getUserActivityData(
    $workspaceId: String!
    $module: String!
    $type: String!
  ) {
    getUserActivityData(
      workspaceId: $workspaceId
      module: $module
      type: $type
    ) {
      dailyData {
        count
        inActiveCount
        label
      }
      weeklyData {
        count
        inActiveCount
        label
      }
    }
  }
`;

const getTaskActivityStatistics = gql`
  query getTaskActivityStatistics(
    $workspaceId: String!
    $columnId: String!
    $filter: String!
  ) {
    getTaskActivityStatistics(
      workspaceId: $workspaceId
      columnId: $columnId
      filter: $filter
    ) {
      count
      label
    }
  }
`;

const getAppsStatistics = gql`
  query getAppsStatistics($workspaceId: String!, $daysAgo: Float!) {
    getAppsStatistics(workspaceId: $workspaceId, daysAgo: $daysAgo) {
      installedApps {
        name
        description
      }
      coustomApps {
        appName
        description
        icon
      }
    }
  }
`;

const getMessageCountStatistics = gql`
  query getMessageCountStatistics(
    $workspaceId: String!
    $filter: String!
    $module: String!
  ) {
    getMessageCountStatistics(
      workspaceId: $workspaceId
      filter: $filter
      module: $module
    ) {
      dailyData {
        directMessage
        privateMessage
        publicMessage
        label
      }
      weeklyData {
        directMessage
        privateMessage
        publicMessage
        label
      }
    }
  }
`;

const getMessagesAndFilesStatistics = gql`
  query getMessagesAndFilesStatistics(
    $workspaceId: String!
    $module: String!
    $filter: String!
  ) {
    getMessagesAndFilesStatistics(
      workspaceId: $workspaceId
      module: $module
      filter: $filter
    ) {
      count
      label
    }
  }
`;

const getTimeZone = gql`
  mutation setTimeZone($userId: String!, $timezone: String!) {
    setTimeZone(userId: $userId, timezone: $timezone)
  }
`;
const GetUserTimeZoneByMatrixRoomId = gql`
query getUserByMatrixUsername($matrixRoomId: String!) {
  getUserByMatrixUsername(matrixRoomId: $matrixRoomId) {
    profileImageUrl
    firstName
    lastName
    is_active
    timezone
  }
}`;




const generateReport = gql`
  query generateReport($workspaceId: String!, $filter: String!) {
    generateReport(workspaceId: $workspaceId, filter: $filter)
    }`;

export const userService = {
  userClient,
  userQuery: {
    cancelInvite,
    connectZoom,
    deleteZoomConnection,
    connectJira,
    getJiraConnection,
    updateJiraSubscription,
    removeJiraConnection,
    connectGithub,
    getbitbucketConnection,
    removeGithubConnection,
    getGithubConnection,
    connectBitBucket,
    getAllNotification,
    updateNotification,

    removeNotificationByEventId,
    deleteBitbucketConnections,
    deleteBitbucketRepoSubscription,
    createSubcription,
    updateGithubConnection,
    gmailConnect,
    getMailContacts,
    removeGmailConnection,
    updateMailContacts,
    getUser,
    updateUser,
    getModules,
    getInvites,
    createInvites,
    removeInvite,
    getPlans,
    subscribePlan,
    getSubscribePlan,
    cancelSubscription,
    upgradePlan,
    updateCompanyInfo,
    updatePayment,
    searchMail,
    saveStorage,
    getStorage,
    logout,
    getUserByAgoraId,
    getGithubCommits,
    getGithubBranches,
    saveSubscription,
    // getInvoice,
    updateSubscription,
    users,
    updateUserByAdmin,
    adminGetOrganization,
    getBillingUsers,
    adminUsersData,
    findPlansWithWorkspace,
    AdminUserPlanDetail,
    AdminSearchUsersByName,
    notifyMentionUser,
    getUserAllRepository,
    getUserAllComits,
    getUserAllPR,
    activeUsersBillingDays,
    postpaidPayment,
    getChatWorkspaceStatusData,
    getUserActivityData,
    updateDefaultPaymentMethod,
    getTaskPriorityStatistics,
    getTaskActivityStatistics,
    getAppsStatistics,
    updateDefaultPaymentMethod,
    workspacesBillingByOrganization,
    getMessageCountStatistics,
    getMessagesAndFilesStatistics,
    generateReport,
    getAdminGitConnect,
    getAdminRepository,
    getAdminGitCommits,
    getTimeZone,
    GetUserTimeZoneByMatrixRoomId,
    updateInvitePermission,
  },
};
