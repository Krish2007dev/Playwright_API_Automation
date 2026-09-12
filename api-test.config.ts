


const processEnv = process.env.TEST_ENV;
const env = processEnv || 'prod'
console.log('Test Environment is: ' +env)



const config = {


    apiUrl: 'https://conduit-api.bondaracademy.com/api',

    userEmail: 'ankitkarmilkar@gmail.com',
    userPassword: 'Virat@1996'



}
if (env == 'qa') {
    config.apiUrl = 'https://conduit-api.bondaracademy.com/api',
        config.userEmail = 'ankitkarmilkar@gmail.com',
            config.userPassword = 'Virat@1996'
}

if (env == 'prod') {
    config.apiUrl = 'https://conduit-api.bondaracademy.com/api',
        config.userEmail = 'ankitkarmilkar12@gmail.com',
            config.userPassword = 'Virat@1996'
}


export { config }