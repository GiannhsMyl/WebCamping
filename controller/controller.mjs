import nodemailer from 'nodemailer';
import fs from 'fs/promises';
const loadServices = async () => {
  try {
    const data = await fs.readFile('data/services.json', 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Σφάλμα ανάγνωσης JSON:', err);
    throw err; // Ανασήκωση σφάλματος για να το χειριστεί ο caller
  }
};
async function mainPage(req,res){
      try {
        const services = await loadServices(); // Φόρτωση δεδομένων υπηρεσιών
        res.render('index', {
            css : ["main_style.css","https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"],
            title: 'Home - Camping Apollon Delphi',
            services
        });
    } catch (err) {
        console.error('Σφάλμα φόρτωσης υπηρεσιών:', err);
        res.status(500).send('Σφάλμα διακομιστή');
    }
}
function contactPage(req,res){
  res.render('contact.hbs', {
    title : "contact",
    css: ["main_style.css"] 
  });
}
function reservationPage(req,res){
    res.render('reservation.hbs', {
    title: "reservation",
    css: ["main_style.css", "reservation-style.css"] 
  });
}
function login(req,res){
    res.render('connect.hbs', {
    title: "connect",
    css: ["main_style.css", "connection-menu-style.css"] 
  });
}
async function sendContactMessage(req,res){
  const { fname, lname, email, telephone, sub, minima } = req.body;

  // Έλεγχος αν λείπουν πεδία
  if (!fname || !lname || !email || !telephone || !sub || !minima) {
    return res.status(400).json({ message: 'Συμπλήρωσε όλα τα πεδία.' });
  }

  try {
    // Δημιουργία transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'camping.hmty@gmail.com',      
        pass: 'dsyd efsl kstn hqvn'             
      }
    });

    // Ρυθμίσεις email
    const mailOptions = {
      from: email,
      to: 'camping.hmty@gmail.com',           
      subject: 'Νέο μήνυμα από τη φόρμα επικοινωνίας',
      text: `Όνομα: ${fname}\nΕπίθετο: ${lname}\nEmail: ${email}\nΤηλέφωνο: ${telephone}\n\nΘέμα: ${sub}\n\nΜήνυμα:\n${minima}`
    };

    // Αποστολή email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ redirect: '/contact' });

  } catch (error) {
    console.error('Σφάλμα αποστολής email:', error);
    res.status(500).json({ message: 'Σφάλμα κατά την αποστολή του μηνύματος.' });
  }
}
function adminPage(req,res){
    try {
      res.render("admin.hbs", {title:"admin Page", css:["main_style.css","adminCustomerPage.css"],script:["adminPage.js"]});
    } catch (error) {
      console.error('Σφάλμα φόρτωσης σελίδας:', error);
      res.status(500).send('Σφάλμα διακομιστή');
    }
}
export {mainPage,contactPage,reservationPage,login,sendContactMessage,adminPage};