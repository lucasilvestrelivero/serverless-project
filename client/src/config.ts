// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '5lvkn2tmxl'
export const apiEndpoint = `https://${apiId}.execute-api.sa-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-79qte56h.us.auth0.com',            // Auth0 domain
  clientId: 's2UT7ko4JH30LYOpoWT6blEkzLhBmRRd',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
