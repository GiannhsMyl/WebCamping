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
    const f2 = sql.prepare(`
        SELECT COUNT(DISTINCT zoneId) AS reserved_zones 
        FROM RESERVATION 
        JOIN RES_ZONE_NUM ON RESERVATION.id = RES_ZONE_NUM.reservationId
        JOIN ZONE ON ZONE.id = RES_ZONE_NUM.zoneId
        WHERE (
            (checkIn <= ? AND checkOut > ?) OR 
            (checkIn >= ? AND checkOut <= ?) OR 
            (checkIn < ? AND checkOut >= ?)
        ) 
        AND zoneType = ?;
    `);
    
    try {
        
        const zoneTypeInfo = f1.get(spacetype);
        if (!zoneTypeInfo) {
            throw new Error(`Zone type ${spacetype} not found`);
        }

        const maxPeople = parseInt(zoneTypeInfo.maxPeople);
        const totalZones = parseInt(zoneTypeInfo.numOfZones);

       
        const result = f2.get(
            checkin, checkin,    
            checkin, checkout,    
            checkout, checkout,   
            spacetype           
        );

        const reservedZones = result ? parseInt(result.reserved_zones) : 0;
        if (isNaN(reservedZones)) {
            throw new Error("Invalid reserved zones count received");
        }

        const availableZones = totalZones - reservedZones;
        const maxPeopleAllowed = maxPeople * spacenum;

        
        if (people > maxPeopleAllowed || spacenum > availableZones) {
            return 0;
        }

        return availableZones;
    } catch (err) {
        console.error("Error in check_availability:", err);
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

export function getSpecificVisitor(id){
    const visitor=sql.prepare("SELECT * FROM VISITOR WHERE email=?")
    return visitor.get(id)
}
export function searchVisitor(name){
    let searchName=name.split("_");
    let searchEmail=name.split("@");
    let result=[];
    if(searchEmail.length===1){//search by name
        if(searchName.length==2){//name is -> firstName LastName
            let firstName=searchName[0];
            let lastName=searchName[1];
            const visitor=sql.prepare("SELECT * FROM VISITOR WHERE UPPER(firstName) LIKE UPPER(?) AND UPPER(lastName) LIKE UPPER(?)");
            result=visitor.all(firstName,lastName);
        }
        if(searchName.length==1){//name is -> firstName or lastName
            const visitor=sql.prepare("SELECT * FROM VISITOR WHERE UPPER(firstName) LIKE UPPER(?) OR  UPPER(lastName) LIKE UPPER(?)");
            result=visitor.all(name,name);
        }
    }else{//search by email
        let ans=getSpecificVisitor(name);
        if(ans!=undefined)
            result.push(ans);
    }
    if(result.length==0)
        return [{}];
    return result;
}
export default (check_availability, zone_client_info);

