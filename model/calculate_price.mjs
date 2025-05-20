import check_availability from './model_better_sqlite.mjs';

import db from 'better-sqlite3';


const sql = db('model/database.db', {fileMustExist: true});


export let calculate_total_price = (checkin, checkout, people, spacenum, spacetype) => {
   
    const availability = check_availability(checkin, checkout, people, spacenum, spacetype);
    if (availability === 0) {
        throw new Error("Δεν υπάρχει διαθεσιμότητα για τις επιλεγμένες παραμέτρους");
    }

    
    const f1 = sql.prepare('SELECT * FROM ZONETYPE WHERE name = ?;');
    const zoneData = f1.get(spacetype);
    if (!zoneData) {
        throw new Error("Ο τύπος χώρου δεν βρέθηκε");
    }

    
    const isHighSeason = (month) => month >= 6 && month <= 8; 

    
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    let highSeasonDays = 0;
    let lowSeasonDays = 0;

    
    for (let date = new Date(checkinDate); date < checkoutDate; date.setDate(date.getDate() + 1)) {
        const month = date.getMonth() + 1; 
        isHighSeason(month) ? highSeasonDays++ : lowSeasonDays++;
    }

    
    const basePriceHigh = parseFloat(zoneData.highSeasonPrice) * highSeasonDays * spacenum;
    const basePriceLow = parseFloat(zoneData.lowSeasonPrice) * lowSeasonDays * spacenum;
    let totalPrice = basePriceHigh + basePriceLow;

    
    const defaultPeople = parseInt(zoneData.defaultPeople);
    const additionalChargePerPerson = parseFloat(zoneData.additionalChargePerPerson);
    
    const peoplePerSpace = Math.floor(people / spacenum);
    const remainingPeople = people % spacenum;
    
    let extraPeopleCharge = 0;
    for (let i = 0; i < spacenum; i++) {
        const peopleInSpace = peoplePerSpace + (i < remainingPeople ? 1 : 0);
        if (peopleInSpace > defaultPeople) {
            extraPeopleCharge += (peopleInSpace - defaultPeople) * additionalChargePerPerson;
        }
    }
    extraPeopleCharge *= (highSeasonDays + lowSeasonDays); 

  
    totalPrice += extraPeopleCharge;

    return totalPrice.toFixed(2);
};

export default calculate_total_price;