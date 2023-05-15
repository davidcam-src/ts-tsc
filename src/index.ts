import express from "express";
import requireAuth from "./middleware/authMiddleware";
import { people } from "./tests/data/Tree";
import cors from 'cors';
const app = express();

const corsOptions = {
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization','X-Amz-Date','X-Amz-Security-Token','X-Api-Key'],
};

app.use(cors(corsOptions));
// app.use(requireAuth);


// OAuth -> User Pool (Cognito) -> User gets JWT -> Validated by aws-jwt-verify
//Using the requireAuth middleware, we can protect our routes from unauthorized access.
app.get('/trees', async (req,res) => {
  people.forEach((person) => {
    console.log(person.name);
});
    res.send({"employees": people});
})

app.get('/version', async (req, res) => {
  res.send('1.0.0');
});


app.use('/:invalidPath', (req, res) => {
  res.status(404).send('404 Not Found');
});


const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`App listening on PORT ${port}`))
