import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import "dotenv/config";
import * as model from '../model/model_better_sqlite.mjs';
import calculate_total_price  from '../model/calculate_price.mjs';


let reservations=[
	{id:1,name:"John Doe",zone:"A",people:"5",checkIn:"2025-10-12",checkOut:"2025-10-12"},
	{id:2,name:"John Hoe",zone:"C",people:"2",checkIn:"2025-05-05",checkOut:"2025-05-05"}
];
let zones=[
	{zone:"A",totalAvailability:"1",cost:"1"},
	{zone:"B",totalAvailability:"1",cost:"1"},
	{zone:"C",totalAvailability:"1",cost:"1"},
	{zone:"D",totalAvailability:"1",cost:"1"},
];
zones=model.getAllZones();
reservations=model.getAllReservations();
const loadServices = async () => {
  try {
    const data = await fs.readFile('data/services.json', 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Σφάλμα ανάγνωσης JSON:', err);
    throw err;
  }
};


async function mainPage(req,res){
      try {
        const services = await loadServices();
        res.render('index', {
            css : ["main_style.css","https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"], 
            script : ["collapsed_menu.js"],
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
    css: ["main_style.css"], 
    script : ["collapsed_menu.js", "new_contact_message.js"]
  });
}


async function reservationPage(req,res){
  try{
    let zones = await model.zone_client_info();
    res.render('reservation.hbs', {
      title: "reservation",
      css: ["main_style.css", "reservation-style.css"], 
      script : ["collapsed_menu.js", "reservation.js"],
      zone: zones
    });
  } catch (err) {
    throw err;
  }
}

async function reservation_search(req, res) {
  try {
    const {checkIn:checkin, checkOut:checkout, spacesType:spacetype, spaceNo:spacenum, peopNo:people} = req.body;
  
    console.log('Received data:', req.body);
    //console.log(people);
    let results = await calculate_total_price(checkin, checkout, people, spacenum, spacetype);
    let zones = await model.zone_client_info();
    res.render('reservation.hbs', {
      title: "reservation",
      css: ["main_style.css", "reservation-style.css"], 
      script : ["collapsed_menu.js", "reservation.js"],
      zone: zones,
      result: [{"checkin": checkin, "checkout": checkout, "spacetype": spacetype, "spacenum": spacenum, "peoplenum": people, "price": results}]
    });
  } catch (err) {
    throw err;
  }
  
}


function login(req,res){
    res.render('connect.hbs', {
    title: "connect",
    css: ["main_style.css", "connection-menu-style.css"], 
    script : ["collapsed_menu.js"]
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
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDR,      
        pass: process.env.EMAIL_PASS             
      }
    });

    // Ρυθμίσεις email
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_ADDR,           
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

function addZone(req,res){
    zones.push(req.body);
    res.redirect("/admin");
}
function editZone(req,res){
    zones=req.body;
    res.send("all fine");
}
function getAllZones(req,res){
    res.send(JSON.stringify(zones));
}
function deleteZone(req,res){
    let zone2Delete=req.params.zone;
    let temp=undefined;
    for(let i=0;i<zones.length;i++){
      if(zones[i].zone==zone2Delete){
        temp=zones[i];
        zones.splice(i,1);
        break;
      }
    }
    if(temp!==undefined)
        res.redirect("/admin");
    else
        res.send(`${zone2Delete} doesnt exist`);

}
function getAllReservations(req,res){
    res.send(JSON.stringify(reservations));
}
function editReservations(req,res){
    reservations=req.body;
    res.send("reservations edited");
}
function deleteReservation(req,res){
  let reservation2Delete=req.params.reservation;
  let temp=undefined;
  for(let i=0;i<reservations.length;i++){
      if(reservations[i].id==reservation2Delete){
        temp=reservations[i];
        reservations.splice(i,1);
        break;
      }
    }
    if(temp!==undefined)
        res.redirect("/admin");
    else
        res.send(`${reservation2Delete} doesnt exist`);
}
function getSpecificVisitor(req,res){
    let id=req.params.id;
    res.send(model.getSpecificVisitor(id));

}

function getVisitors(req,res){
      res.send(model.getAllVisitors());
}

function searchVisitor(req,res){
    let name=req.params.visitorName;
    res.send(model.searchVisitor(name));
}
export {mainPage,contactPage,reservationPage,login,sendContactMessage,adminPage,addZone,editZone,getAllZones,getAllReservations,deleteZone,editReservations,deleteReservation,reservation_search,getVisitors,getSpecificVisitor,searchVisitor};