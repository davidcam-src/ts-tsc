import express from "express";
import requireAuth from "./middleware/authMiddleware";

const app = express();

// OAuth -> User Pool (Cognito) -> User gets JWT -> Validated by aws-jwt-verify
//Using the requireAuth middleware, we can protect our routes from unauthorized access.
app.get('/', requireAuth, async (req,res) => {
  res.send('API is working.')
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`))
