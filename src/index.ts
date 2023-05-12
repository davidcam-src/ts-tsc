import express from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import axios from 'axios';

const app = express();

// make sure verification is actually working - dd
// middleware pipeline prior to access to protected endpoints
// jwt in authorization header "Bearer <token>"
// read up on jwt, and signature verification
// verify: cog jwt verifier is auth with aws already then reaches out to cog to verify the token
// check the authorization header for the token in the request

// OAuth -> OpenID Connect -> Cognito
// OAuth -> User Pool (Cognito) -> User gets JWT -> Validated by aws-jwt-verify

// The details of the header and payload of the JWT are encoded in base64.
// Encoded details are plugged into a specified algorithm within the header with a specified secret key for signature verification.
// If the result of what was mentioned in the previous line does not match the last section of the JWT (signature) then it's invalid.
// Users would need to have a our secret key in order to generate a valid signature.
// Benefit of using a JWT is that the same user details can be accessed from different servers. AWS Cognito can be used to verify the same user details across seperate APIs

// Verify who library was made by
// When someone is within a user pool (You can only get a valid token once you're in a user pool)
// Explain the technical details and then put it in "english"
// Come up with an idea of what google is doing


//Express auth guard/middleware
app.get('/', async (req,res) => {
    //What we're using to forward token information to cognito where the token is validated is the verifier
    // Verifier that expects valid access tokens:
    //creates an instance of the verifier with specific information

  console.log(req.originalUrl.substring(7));
  const code = req.originalUrl.substring(7)
  // axios.post('https://ts-tsc-1.auth.us-east-1.amazoncognito.com/oauth2/token',
  // { 
  //  params: { grant_type: 'authorization_code',
  //   client_id: '1pj6o4rvfsbm21ddg8cjbmn73c',
  //   code: code,
  //   redirect_uri: 'http://localhost:3000/'}},
  // { headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   }}
  // )

//   axios.post({
//   url: "/oauth/token",
//   method: "POST",
//   baseURL: "https://ts-tsc-1.auth.us-east-1.amazoncognito.com/",
//   headers:{
//     'content-type': 'application/x-www-formurlencoded',
//   },
//   data: {
//     "grant_type": "authorization_code",
//     "client_id": "1pj6o4rvfsbm21ddg8cjbmn73c",
//     "code": code,
//     "redirect_uri": "http://localhost:3000/"    
//   }
// }).then(function(res) {
//   console.log(res);  
// });

let access_token = "";

try {
    const b = await axios.post("https://ts-tsc-1.auth.us-east-1.amazoncognito.com/oauth2/token",
        {
          grant_type: "authorization_code",
          client_id: "1pj6o4rvfsbm21ddg8cjbmn73c",
          code: code,
          redirect_uri: "http://localhost:3000" 
        },
        {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

        // console.log(b.data.id_token);
        // console.log(b.data.access_token);
        // console.log(b.data.refresh_token);
        access_token = b.data.access_token;
  } catch (error) {
    console.log(error);
  }


  const verifier = CognitoJwtVerifier.create({
    userPoolId: "us-east-1_opu9Xs8YW",
    tokenUse: "access",
    clientId: "1pj6o4rvfsbm21ddg8cjbmn73c",
  });
  try {
    //based on what is returned for payload, we move on with the functionality
    //library communicates with cognito to verify the token
    //read more about the library to explain the line below

    console.log(access_token);
    const payload = await verifier.verify(
      access_token
    );
    console.log("Token is valid. Payload:", payload);
  } catch {
    console.log("Token not valid!");
  }

    res.send('Hello World!')
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`))
