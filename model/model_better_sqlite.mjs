"use strict"

import db from 'better-sqlite3';


const sql = db('model/database.db', {fileMustExist: true});

export let zone_client_info = () => {
    const stmp = sql.prepare('SELECT name, numOfZones, maxPeople FROM ZONETYPE;');
    let zones;
    try {
        zones = stmp.all();
        console.log(zones);
        return zones;
    } catch (err) {
        throw err;
    }
};

export let check_availability = (checkin, checkout, people, spacenum, spacetype) => {

    const f1 = sql.prepare('SELECT * FROM ZONETYPE WHERE name = ?;');
    const f2 = sql.prepare('SELECT SUM(zoneId) AS reservations FROM (SELECT DISTINCT zoneId FROM RESERVATION WHERE ((checkIn <= ? AND checkOut > ?) OR (checkIn >= ? AND checkOut <= ?) OR (checkIn < ? AND checkOut >= ?)) AND zoneType = ? );');
    
    let maxnums;
    let reservations;
    try{
        maxnums = f1.get(spacetype);
        reservations = parseInt(f2.get(checkin, checkin, checkin, checkout, checkout, checkout, spacetype));
        if (people > parseInt(maxnums.maxPeople)*spacenum || spacenum > parseInt(maxnums.numOfZones) - reservations ) {
            return 0;
        }
        else {
            return 1;
        }
    } catch (err) {
        throw err;
    }
};


export default (check_availability, zone_client_info);
