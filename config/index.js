const IS_PRODUCTION = process.env.NX_IS_PRODUCTION ?? "false";
const IS_STAGING = process.env.IS_STAGING;

const env = {
  IS_PRODUCTION: IS_PRODUCTION === "true",
  IS_STAGING: IS_STAGING === "true",
  NX_ANALYTICS_API:
    IS_PRODUCTION === "true"
      ? process.env.NX_ANALYTICS_API
      : process.env.NX_ANALYTICS_API,
  NX_ANALYTICS_BASEURL:
    IS_PRODUCTION === "true"
      ? process.env.NX_ANALYTICS_BASEURL
      : process.env.NX_ANALYTICS_BASEURL,
  NX_AUTH_API:
    IS_PRODUCTION === "true"
      ? process.env.NX_AUTH_API
      : process.env.NX_LOCAL_AUTH_API,
  NX_HOST_NAME:
    IS_PRODUCTION === "true"
      ? process.env.NX_HOST_NAME
      : process.env.NX_LOCAL_HOST_NAME,
  NX_KANBAN_URL:
    IS_PRODUCTION === "true"
      ? process.env.NX_KANBAN_URL
      : process.env.NX_LOCAL_KANBAN_URL,

  NX_WEBSOKET_HOST_NAME:
    IS_PRODUCTION === "true"
      ? process.env.NX_WEBSOKET_HOST_NAME
      : process.env.NX_WEBSOKET_LOCAL_HOST_NAME,
  NX_DASHBOARD_URL:
    IS_PRODUCTION === "true"
      ? process.env.NX_DASHBOARD_URL
      : process.env.NX_LOCAL_DASHBOARD_URL,
  NX_API_API:
    IS_PRODUCTION === "true"
      ? process.env.NX_API_API
      : process.env.NX_LOCAL_API_API,
  NX_AUTH_URL:
    IS_PRODUCTION === "true"
      ? process.env.NX_AUTH_URL
      : process.env.NX_LOCAL_AUTH_URL,
  NX_MOCK_SERVER:
    IS_PRODUCTION === "true"
      ? process.env.NX_MOCK_SERVER
      : process.env.NX_LOCAL_MOCK_SERVER,
  NX_API_SERVER_HOSTNAME:
    IS_PRODUCTION === "true"
      ? process.env.NX_API_SERVER_HOSTNAME
      : process.env.NX_LOCAL_API_SERVER_HOSTNAME,
  NX_API_API_HOST:
    IS_PRODUCTION === "true"
      ? process.env.NX_API_API_HOST
      : process.env.NX_LOCAL_API_API_HOST,
  NX_STRIP_PUBLISH_KEY:
    IS_PRODUCTION === "true"
      ? process.env.NX_STRIP_PUBLISH_KEY
      : process.env.NX_LOCAL_STRIP_PUBLISH_KEY,
  NX_STRIP_PUBLISH_SECRET:
    IS_PRODUCTION === "true"
      ? process.env.NX_STRIP_PUBLISH_SECRET
      : process.env.NX_LOCAL_STRIP_PUBLISH_SECRET,
  NX_MATRIX_SERVER:
    IS_PRODUCTION === "true"
      ? process.env.NX_MATRIX_SERVER
      : process.env.NX_LOCAL_MATRIX_SERVER,
  NX_API_CHAT:
    IS_PRODUCTION === "true"
      ? process.env.NX_API_CHAT
      : process.env.NX_LOCAL_API_CHAT,
  NX_CHAT_HOSTNAME:
    IS_PRODUCTION === "true"
      ? process.env.NX_CHAT_HOSTNAME
      : process.env.NX_LOCAL_CHAT_HOSTNAME,
  NX_GOOGLE_CLIENT_ID:
    IS_PRODUCTION === "true"
      ? process.env.NX_GOOGLE_CLIENT_ID
      : process.env.NX_LOCAL_GOOGLE_CLIENT_ID,
  NX_GITHUB_CLIENT_ID:
    IS_PRODUCTION === "true"
      ? process.env.NX_GITHUB_CLIENT_ID
      : process.env.NX_LOCAL_GITHUB_CLIENT_ID,
  NX_GITHUB_APP_REDIRECT_URI:
    IS_STAGING === "true"
      ? process.env.NX_STAGING_GITHUB_APP_REDIRECT_URI
      : IS_PRODUCTION === "true"
      ? process.env.NX_GITHUB_APP_REDIRECT_URI
      : process.env.NX_LOCAL_GITHUB_APP_REDIRECT_URI,
  NX_GITHUB_PUBLIC_URL:
    IS_PRODUCTION === "true"
      ? process.env.NX_GITHUB_PUBLIC_URL
      : process.env.NX_LOCAL_GITHUB_PUBLIC_URL,
  NX_BITBUCKET_CLIENT_ID:
    IS_PRODUCTION === "true"
      ? process.env.NX_BITBUCKET_CLIENT_ID
      : process.env.NX_LOCAL_BITBUCKET_CLIENT_ID,
  NX_JIRA_CLIENT_ID:
    IS_PRODUCTION === "true"
      ? process.env.NX_JIRA_CLIENT_ID
      : process.env.NX_LOCAL_JIRA_CLIENT_ID,
  NX_JIRA_REDIRECT_URI:
    IS_PRODUCTION === "true"
      ? process.env.NX_JIRA_REDIRECT_URI
      : process.env.NX_LOCAL_JIRA_REDIRECT_URI,
  NX_ZOOM_CLIENT_ID:
    IS_PRODUCTION === "true"
      ? process.env.NX_ZOOM_CLIENT_ID
      : process.env.NX_LOCAL_ZOOM_CLIENT_ID,
  NX_ZOOM_REDIRECT_URI:
    IS_PRODUCTION === "true"
      ? process.env.NX_ZOOM_REDIRECT_URI
      : process.env.NX_LOCAL_ZOOM_REDIRECT_URI,
  NX_SERVICE_SERVER:
    IS_PRODUCTION === "true"
      ? process.env.NX_SERVICE_SERVER
      : process.env.NX_LOCAL_SERVICE_SERVER,
  NX_API_KANBAN:
    IS_PRODUCTION === "true"
      ? process.env.NX_API_KANBAN
      : process.env.NX_LOCAL_API_KANBAN,
  NX_KANBAN_HOST_NAME:
    IS_PRODUCTION === "true"
      ? process.env.NX_KANBAN_HOST_NAME
      : process.env.NX_KANBAN_LOCAL_HOST_NAME,

  NX_CICD_HOST_NAME:
    IS_PRODUCTION === "true"
      ? process.env.NX_CICD_HOST_NAME
      : process.env.NX_CICD_LOCAL_HOST_NAME,
  NX_API_CICD:
    IS_PRODUCTION === "true"
      ? process.env.NX_API_CICD
      : process.env.NX_LOCAL_API_CICD,
  NX_CICD_REDIRECT_GITHUB:
    IS_PRODUCTION === "true"
      ? process.env.NX_CICD_REDIRECT_GITHUB
      : process.env.NX_LOCAL_CICD_REDIRECT_GITHUB,
  NX_CICD_INSTALL_GITHUB_APP:
    IS_PRODUCTION === "true"
      ? process.env.NX_CICD_INSTALL_GITHUB_APP
      : process.env.NX_CICD_INSTALL_GITHUB_APP,

  NX_ANALYTICS_HOST_NAME:
    IS_PRODUCTION === "true"
      ? process.env.NX_ANALYTICS_HOST_NAME
      : process.env.NX_ANALYTICS_LOCAL_HOST_NAME,
  NX_LLM_HOST_NAME:
    IS_PRODUCTION === "true"
      ? process.env.NX_LLM_HOST_NAME
      : process.env.NX_LLM_LOCAL_HOST_NAME,
  NX_NOTES_HOST_NAME:
    IS_PRODUCTION === "true"
      ? process.env.NX_NOTES_HOST_NAME
      : process.env.NX_NOTES_LOCAL_HOST_NAME,
  NX_WEBSOKET_HOST_NAME:
    IS_PRODUCTION === "true"
      ? process.env.NX_WEBSOKET_HOST_NAME
      : process.env.NX_WEBSOKET_LOCAL_HOST_NAME,
  NX_OAUTH_REDIRECT_GOOGLE:
    IS_PRODUCTION === "true"
      ? process.env.NX_OAUTH_REDIRECT_GOOGLE_LIVE_URI
      : process.env.NX_OAUTH_REDIRECT_GOOGLE_LOCAL_URI,
  NX_OAUTH_REDIRECT_GITHUB:
    IS_PRODUCTION === "true"
      ? process.env.NX_OAUTH_REDIRECT_GITHUB_LIVE_URI
      : process.env.NX_OAUTH_REDIRECT_GITHUB_LOCAL_URI,
  NX_ONBOARDING_FLOW_REDIRECT_URI:
    IS_PRODUCTION === "true"
      ? process.env.NX_ONBOARDING_FLOW_LIVE_REDIRECT_URI
      : process.env.NX_ONBOARDING_FLOW_REDIRECT_URI,
  NX_DATA_DOC_APPLICATION_ID: process.env.NX_DATA_DOC_APPLICATION_ID,
  NX_DATA_DOC_CLIENT_TOKEN: process.env.NX_DATA_DOC_CLIENT_TOKEN,
  NX_DATA_DOC_SITE: process.env.NX_DATA_DOC_SITE,
  NX_FB_APIKEY: process.env.NX_FB_APIKEY,
  NX_FB_AUTHDOMAIN: process.env.NX_FB_AUTHDOMAIN,
  NX_FB_PROJECTID: process.env.NX_FB_PROJECTID,
  NX_FB_STORAGEBUCKET: process.env.NX_FB_STORAGEBUCKET,
  NX_FB_MESSAGINGSENDERID: process.env.NX_FB_MESSAGINGSENDERID,
  NX_FB_APPID: process.env.NX_FB_APPID,
  NX_FB_MEASUREMENTID: process.env.NX_FB_MEASUREMENTID,
  NX_ONBOARDING_FLOW_REDIRECT_URI: process.env.NX_ONBOARDING_FLOW_REDIRECT_URI,
  NX_AUTH_HOST_NAME: process.env.NX_AUTH_HOST_NAME,
  NX_MATRIX_ADMIN: process.env.NX_MATRIX_ADMIN,
  NX_MATRIX_DOMAIN: process.env.NX_MATRIX_DOMAIN,
  NX_API_DOMAIN: process.env.NX_API_DOMAIN,
  NX_COMPANY_NAME: process.env.NX_COMPANY_NAME,
  NX_SENDERS_MAIL: process.env.NX_SENDERS_MAIL,
  NX_ONETAB_DOMAIN: process.env.NX_ONETAB_DOMAIN,
  NX_IS_LOCAL: process.env.NX_IS_LOCAL,
};

export default env;
