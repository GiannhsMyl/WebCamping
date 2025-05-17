const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const todayStr = `${year}-${month}-${day}`;

const myear = (today.getFullYear() +1);
const mmonth = String(today.getMonth()).padStart(2, '0');
const mday = String(today.getDate()).padStart(2, '0');
const maxdateStr = `${myear}-${mmonth}-${mday}`;

const mcyear = (today.getFullYear() +1);
const mcmonth = String(today.getMonth()+1).padStart(2, '0');
const mcday = String(today.getDate()).padStart(2, '0');
const max_check_out_dateStr = `${mcyear}-${mcmonth}-${mcday}`;

checkinInput.min = todayStr;
checkinInput.max = maxdateStr;

checkoutInput.max = max_check_out_dateStr;
checkoutInput.disabled = true;
checkoutInput.value = '';

checkinInput.addEventListener('change', function() {
  const checkinDate = new Date(this.value);
  
  if (!isNaN(checkinDate.getTime())) {
    // Προσθέτουμε μία ημέρα
    const nextDay = new Date(checkinDate);
    nextDay.setDate(checkinDate.getDate() + 1);

    // Διαμορφώνουμε την ημερομηνία στο format YYYY-MM-DD
    const year = nextDay.getFullYear();
    const month = String(nextDay.getMonth() + 1).padStart(2, '0');
    const day = String(nextDay.getDate()).padStart(2, '0');
    const minCheckoutDate = `${year}-${month}-${day}`;

    checkoutInput.min = minCheckoutDate;
    checkoutInput.value = '';
    checkoutInput.disabled = false;
  } else {
    checkoutInput.disabled = true;
    checkoutInput.value = '';
  }
});