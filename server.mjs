// server.js
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import bodyParser from 'body-parser';

import "dotenv/config";
import {router} from "./routes/router.mjs"
// import * as controller from "../project/controller/controller.mjs";
// Χρήσιμο για __dirname (δεν υπάρχει σε ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Φόρτωση services από JSON (με async/await)


const app = express();
const PORT = process.env.PORT || 3000;

// Ρύθμιση Handlebars
app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Στατικά αρχεία
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/",router);


// Εκκίνηση server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

