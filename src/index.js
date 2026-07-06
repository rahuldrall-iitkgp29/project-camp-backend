import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/database.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000; // if our port not work then run it on 3000

connectDB() //now our apllication run only whens our db connect,run properly
  .then(() => {
    app.listen(port, () => {
      console.log(`example app listening on port http://localhost${port}`);
    });
  })
  .catch((err) => {
    console.error("mongo db connection error", err);
    process.exit(1);
  });
// if our db is run properly -> then , othere if there was any error -> catch
