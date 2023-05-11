import express from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
const app = express();

app.get('/', async (req,res) => {
    res.send('Hello Broject.');

    // Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_opu9Xs8YW",
  tokenUse: "id",
  clientId: "32ehv20b4ufclu8k2upu2eh7dh",
});

try {
  const payload = await verifier.verify(
    "eyJraWQiOiJpdmY5SGNuV1gwS3FFdFRWWHl2SW5CbVEzWkxYOTdGNE50MFwvT28rYXZaRT0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiWkJlQlc2bHBHWHM0TG1QV01TdkYtdyIsInN1YiI6IjZkMzljOGU3LTAyOWQtNDBiOS04NzA5LTUxMjU3M2E2MDk1NiIsImNvZ25pdG86Z3JvdXBzIjpbInVzLWVhc3QtMV9vcHU5WHM4WVdfR29vZ2xlIl0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9vcHU5WHM4WVciLCJjb2duaXRvOnVzZXJuYW1lIjoiZ29vZ2xlXzEwNjc3MDQxODQ1MTkzNjcwODQ3NyIsIm5vbmNlIjoiUUJienY2TTFRWW5jWGRfZlVNcTRURk4xNzlvc0VCQXVkNHJVS3NhNGZSMVpvNHpaRVR0amFlYnEwVFB6RUtjR1VILVlhUW9QdG9VMUdfRGVoRU9uWnhGVXdlS2QwTUZmejNiSDk4dWl2OHFwWExoSlJuSkNsWk5IUmZvYldPZTh6Uk1QN2tTOFlxWDlna1dHNVM4b0RWNjhreGZxcTNDMW8yNzdxSzBnWmJFIiwiYXVkIjoiMzJlaHYyMGI0dWZjbHU4azJ1cHUyZWg3ZGgiLCJpZGVudGl0aWVzIjpbeyJ1c2VySWQiOiIxMDY3NzA0MTg0NTE5MzY3MDg0NzciLCJwcm92aWRlck5hbWUiOiJHb29nbGUiLCJwcm92aWRlclR5cGUiOiJHb29nbGUiLCJpc3N1ZXIiOm51bGwsInByaW1hcnkiOiJ0cnVlIiwiZGF0ZUNyZWF0ZWQiOiIxNjgzODE4MTU1MjM1In1dLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY4MzgyMzExMiwiZXhwIjoxNjgzODI2NzEyLCJpYXQiOjE2ODM4MjMxMTIsImp0aSI6IjNjNTIzZTdkLTgyYjctNDExMC04OTVkLTc1NDExNWVmNDRkYyIsImVtYWlsIjoiZGF2aWQuY2FtcGJlbGxAd2lsbG93dHJlZWFwcHMuY29tIn0.Zhw6AABcUmeVQO5BGSF2ibBT1loeb6-E9ESW3weeWKvC8cf2kFy2i7TuRxv5sEyNPLSWQjkqSCUXcFPSllw2lcKZBHNBhrxJklQ_-TNdQa1hDfiNgFP5WDgMXrsQwZNoozpv4lgtl97WG2nhDDVvcSvZA2ZyYWHh8bTPfD6lUnWfpch0wWT7zzrXXBB_-531446YW6azgRwIwnhM65s1Wd0OMQms4VgA-UviLAvwBY7lVHg3AdPvpYsoGOtwacsFY5HZT8wWF7JlEtVgzHxyyiQCKitawMfQbGJpisQmvwlR9XeP21OTSzPrFb8IUmGd8g6ZlLeTqE29fkQQpnDUOw" // the JWT as string
  );
  console.log("Token is valid. Payload:", payload);
} catch(e) {
  console.log(JSON.stringify(e))
  console.log("Token not valid!");
}
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`))
