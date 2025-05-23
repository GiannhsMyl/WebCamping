"use strict"

import db from 'better-sqlite3';


const sql = db('model/database.db', {fileMustExist: true});

export let zone_client_info = () => {
    const stmp = sql.prepare('SELECT name, numOfZones, maxPeople FROM ZONETYPE;');
    let zones;
    try {
        zones = stmp.all();
        //console.log(zones);
        return zones;
    } catch (err) {
        throw err;
    }
};

export let check_availability = (checkin, checkout, people, spacenum, spacetype) => {

    const f1 = sql.prepare('SELECT maxPeople, numOfZones FROM ZONETYPE WHERE name = ?;');
    const f2 = sql.prepare('SELECT SUM(zoneId) AS reservations FROM (SELECT DISTINCT zoneId FROM (RESERVATION JOIN RES_ZONE_NUM ON id=reservationId) WHERE ((checkIn <= ? AND checkOut > ?) OR (checkIn >= ? AND checkOut <= ?) OR (checkIn < ? AND checkOut >= ?)) AND zoneType = ? );');
    
    let maxnums;
    let reservations;
    try{
        maxnums = f1.all(spacetype);
        console.log(JSON.stringify(maxnums));
        reservations = parseInt(f2.get(checkin, checkin, checkin, checkout, checkout, checkout, spacetype));
        if ((people > parseInt(maxnums.maxPeople)*spacenum) || (spacenum > parseInt(maxnums.numOfZones) - reservations) ) {
            return 0;
        }
        else {
            return (parseInt(maxnums.numOfZones) - reservations);
        }
    } catch (err) {
        throw err;
    }
};

export function getAllZones(){
    const zones=sql.prepare("SELECT N.id,N.zoneType,T.defaultPeople,T.maxPeople,T.additionalChargePerPerson,T.highSeasonPrice,T.lowSeasonPrice,T.numOfZones FROM (ZONE AS N JOIN ZONETYPE AS T ON N.zoneType=T.name) ");
    return zones.all();
}
export function getAllReservations(){
    const reservations=sql.prepare("SELECT R.id,V.firstName,V.lastName,V.email,R.people,R.checkIn,R.checkOut,R.totalPrice,Z.num,Z.zoneType FROM ((RESERVATION AS R JOIN VISITOR AS V ON R.visitorId=V.email) JOIN RES_ZONE_NUM AS RZ ON R.id=RZ.reservationId)JOIN ZONE AS Z ON RZ.zoneId==Z.id");
    return reservations.all();
}
export function getAllVisitors(){
    const visitors=sql.prepare("SELECT * FROM VISITOR");
    return visitors.all();
}
export default (check_availability, zone_client_info);
