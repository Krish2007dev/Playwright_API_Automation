
import dotenv from 'dotenv';
import path from 'path';
// Read from ".env" file in the root directory
dotenv.config({ path: path.resolve(__dirname, '.env') });



const processEnv = process.env.TEST_ENV;
const env = processEnv || 'prod'
console.log('Test Environment is: ' + env)



const config = {


    apiUrl: 'https://conduit-api.bondaracademy.com/api',

    userEmail: 'ankitkarmilkar12@gmail.com',
    userPassword: 'Virat@1996'



}
if (env == 'qa') {
    config.apiUrl = 'https://conduit-api.bondaracademy.com/api',
        config.userEmail = 'ankitkarmilkar@gmail.com',
        config.userPassword = 'Virat@1996'
}

if (env == 'prod') {

    const username = process.env.PROD_USERNAME
    const password = process.env.PROD_PASSWORD;
    
    if(!username || !password){
        throw Error(`Missing required environment variables`)
    }
       config.apiUrl = 'https://conduit-api.bondaracademy.com/api',
        config.userEmail = username,
        config.userPassword = password
}


export { config }