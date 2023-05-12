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

        console.log(b.data.id_token);
        console.log(b.data.access_token);
        console.log(b.data.refresh_token);
  } catch (error) {
    console.log(error);
  }


  const verifier = CognitoJwtVerifier.create({
    userPoolId: "us-east-1_opu9Xs8YW",
    tokenUse: "id",
    clientId: "1pj6o4rvfsbm21ddg8cjbmn73c",
  });
  try {
    //based on what is returned for payload, we move on with the functionality
    //library communicates with cognito to verify the token
    //read more about the library to explain the line below

    const payload = await verifier.verify(
      "eyJraWQiOiJpdmY5SGNuV1gwS3FFdFRWWHl2SW5CbVEzWkxYOTdGNE50MFwvT28rYXZaRT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiWkJlQlc2bHBHWHM0TG1QV01TdkYtdyIsInN1YiI6IjZkMzljOGU3LTAyOWQtNDBiOS04NzA5LTUxMjU3M2E2MDk1NiIsImNvZ25pdG86Z3JvdXBzIjpbInVzLWVhc3QtMV9vcHU5WHM4WVdfR29vZ2xlIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9vcHU5WHM4WVciLCJjb2duaXRvOnVzZXJuYW1lIjoiZ29vZ2xlXzEwNjc3MDQxODQ1MTkzNjcwODQ3NyIsIm5vbmNlIjoiUUJienY2TTFRWW5jWGRfZlVNcTRURk4xNzlvc0VCQXVkNHJVS3NhNGZSMVpvNHpaRVR0amFlYnEwVFB6RUtjR1VILVlhUW9QdG9VMUdfRGVoRU9uWnhGVXdlS2QwTUZmejNiSDk4dWl2OHFwWExoSlJuSkNsWk5IUmZvYldPZTh6Uk1QN2tTOFlxWDlna1dHNVM4b0RWNjhreGZxcTNDMW8yNzdxSzBnWmJFIiwiYXVkIjoiMzJlaHYyMGI0dWZjbHU4azJ1cHUyZWg3ZGgiLCJpZGVudGl0aWVzIjpbeyJ1c2VySWQiOiIxMDY3NzA0MTg0NTE5MzY3MDg0NzciLCJwcm92aWRlck5hbWUiOiJHb29nbGUiLCJwcm92aWRlclR5cGUiOiJHb29nbGUiLCJpc3N1ZXIiOm51bGwsInByaW1hcnkiOiJ0cnVlIiwiZGF0ZUNyZWF0ZWQiOiIxNjgzODE4MTU1MjM1In1dLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY4MzgyMzExMiwiZXhwIjoxNjgzODI2NzEyLCJpYXQiOjE2ODM4MjMxMTIsImp0aSI6IjNjNTIzZTdkLTgyYjctNDExMC04OTVkLTc1NDExNWVmNDRkYyIsImVtYWlsIjoiZGF2aWQuY2FtcGJlbGxAd2lsbG93dHJlZWFwcHMuY29tIn0.Zhw6AABcUmeVQO5BGSF2ibBT1loeb6-E9ESW3weeWKvC8cf2kFy2i7TuRxv5sEyNPLSWQjkqSCUXcFPSllw2lcKZBHNBhrxJklQ_-TNdQa1hDfiNgFP5WDgMXrsQwZNoozpv4lgtl97WG2nhDDVvcSvZA2ZyYWHh8bTPfD6lUnWfpch0wWT7zzrXXBB_-531446YW6azgRwIwnhM65s1Wd0OMQms4VgA-UviLAvwBY7lVHg3AdPvpYsoGOtwacsFY5HZT8wWF7JlEtVgzHxyyiQCKitawMfQbGJpisQmvwlR9XeP21OTSzPrFb8IUmGd8g6ZlLeTqE29fkQQpnDUOw" // the JWT as string
    );
    console.log("Token is valid. Payload:", payload);
  } catch {
    console.log("Token not valid!");
  }

    res.send('Hello World!')
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`))
