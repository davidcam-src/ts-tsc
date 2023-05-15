import { CognitoJwtVerifier } from "aws-jwt-verify";

// 1. User logs in using google credentials and is added to the user pool
// 2. Gets a JWT token after successful login
// 3. JWT token is sent to the backend via the Authorization header
// 4. The backend verifies the token using the aws-jwt-verify library


const requireAuth = async (req: any, res:any, next:any) => { 

    if(!req.headers.authorization) { return res.status(401).send("Access Denied");}

    // Important to do testing on the next two lines: Bear vs Bearer
    const bearerToken = req.headers.authorization.substring(7);
    console.log("Bearer Token:", bearerToken);

    // If there is no token, return 401


    // Change to integrate with actual user pool
    // Create a verifier Instance, with information to specify the user pool we want to validate for (userPoolId, clientId, tokenUse)
    const verifier = CognitoJwtVerifier.create({
                    userPoolId: "us-east-1_lnjrIXlny",
                    tokenUse: "id",
                    clientId: "6aik3bqg1r5c6npmfgi38s5qqr",
                });

  try {
    // Verify the token using the instance we created
    const payload = await verifier.verify(
        bearerToken
    );
    // If the token is valid, the payload will be returned
    // Implementing a verifier service is recommended, would make the code more testable
    // Design Pattern: Service Repository/Clean Architecture
    console.log("Token is valid. Payload:", payload);
    next();
  } catch {
    // Invalid token, 401 returned
    console.log("Token not valid!");
    return res.status(401).send("Access Denied");
  }

}



export default requireAuth;