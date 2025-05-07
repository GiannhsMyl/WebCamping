// server.js
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Χρήσιμο για __dirname (δεν υπάρχει σε ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Φόρτωση services από JSON (με async/await)
const loadServices = async () => {
  try {
    const data = await fs.readFile('data/services.json', 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Σφάλμα ανάγνωσης JSON:', err);
    throw err; // Ανασήκωση σφάλματος για να το χειριστεί ο caller
  }
};

const app = express();
const PORT = process.env.PORT || 3000;

// Ρύθμιση Handlebars
app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Στατικά αρχεία
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Αρχική σελίδα
app.get('/', async (req, res) => {
    try {
        const services = await loadServices(); // Φόρτωση δεδομένων υπηρεσιών
        res.render('index', {
            title: 'Home - Camping Apollon Delphi',
            description: 'Το Camping Apollon βρίσκεται στην είσοδο του μαγευτικού χωριού των Δελφών, σε απόσταση μόλις ενός χιλιομέτρου από τον αρχαιολογικό χώρο! Περιλαμβάνει σύγχρονες εγκαταστάσεις πισίνας και γηπέδων, καθώς και εστιατόριο με θέα τον ελαιώνα της Άμφισσας και τον Κορινθιακό κόλπο! Τέλος, διαθέτει χώρους για σκηνές, τροχόσπιτα, καθώς και Bungalow παραδοσιακής αρχιτεκτονικής, θέλοντας να καλύψει τις ανάγκες κάθε επισκέπτη και κατασκηνωτή!',
            services
        });
    } catch (err) {
        console.error('Σφάλμα φόρτωσης υπηρεσιών:', err);
        res.status(500).send('Σφάλμα διακομιστή');
    }
});

// Εκκίνηση server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

