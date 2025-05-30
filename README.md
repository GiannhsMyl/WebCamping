# Camping Web App-Project στο μάθημα Προγραμματισμός Διαδικτύου

## Οδηγίες Εγκατάστασης Εφαρμογής

Μπορείτε να ελέγξετε την λειτουργία της εφαρμογής μέσω του συνδέσμου:
https://web-camping-app-upatraswebproject.onrender.com

Note: Στην αναφορά που παραδόθηκε υπάρχει ορθογραφικό λάθος στον παραπάνω σύνδεσμο, οποτε μπορείτε να χρησιμοποιήσετε τον παραπάνω.

1. Λήψη Κώδικα

    χρησιμοποιώντας την εντολή

    `git clone https://github.com/GiannhsMyl/WebCamping.git`
    
    ή εναλλακτικά επιλέγοντας **code** και **Download ZIP**

2. Λήψη όλων των απαραίτητων node modules
    
    `npm install`

3. Δημιουργία κατάλληλου αρχείου **.env**

    Το αρχείο .env που θα δημιουργηθεί θα πρέπει να έχει την ακόλουθη μορφή:

    ````
    PORT=XXXX
    EMAIL_ADDR=XXXX
    EMAIL_PASS=XXXX
    SESSION_SEC=XXXX
    ````
    
    όπου:

    >PORT:Η πόρτα στην οποία θα ακούει η εφαρμογή
    >
    >EMAIL_ADDR και EMAIL_PASS:Τα στοιχεία του λογαριασμού email από τον οποίο θα αποστέλλονται οι φόρμες
    >
    >SESSION_SEC: Η "υπογραφή" της εφαρμογής για τα sessions

4. Παροχή SSL Certificate

    προτείνεται ή η δημιουργία με χρήση του openSSL είτε μέσω της [letsEncrypt](https://letsencrypt.org)

5. Δημιουργία χρήστη

    Η δημιουργία χρήστη γίνεται μέσω του αρχείου **/data/users.json** όπου αρκεί να προστεθεί ένα αντικείμενο με την μορφή
    
    `{username:XXXX,password:XXXX}`
    
    όπου:
    >username:το όνομα χρήστη
    >  
    >password:ο κωδικός αφού έχει κατακερματιστεί (Hash) με τον αλγόρυθμο bcrypt

    εναλλακτικά μπορεί να χρησιμοποιηθεί ο ήδη υπάρχων λογαριασμός:

   >username:admin
   >
   >password:camping2025

7. Εκκίνηση του server
   
    `node server.mjs`
