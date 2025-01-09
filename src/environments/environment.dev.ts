export const environment = {
    production: true,
    user_pool_domain_uri: process.env['USER_POOL_DOMAIN_URI'],
    token_endpoint: process.env['TOKEN_ENDPOINT'],
    login_endpoint: process.env['LOGIN_ENDPOINT'],
    grant_type: 'authorization_code',
    client_id: process.env['CLIENT_ID'],
    client_secret: process.env['CLIENT_SECRET'],
    redirect_uri: process.env['REDIRECT_URI'],
    response_type: 'code',
    adminGroup: process.env['ADMIN_GROUP'],
    api_gateway: process.env['API_GATEWAY']
}