document.addEventListener("DOMContentLoaded",()=>{
	console.log("main");
	curCalMonth=(new Date()).getMonth();
	makeCallendar(curCalMonth);
	document.querySelector(".callendarLtButton").addEventListener("click",()=>{
		if(curCalMonth>0)
			makeCallendar(--curCalMonth);
	});
	document.querySelector(".callendarGtButton").addEventListener("click",()=>{
		if(curCalMonth<11)
			makeCallendar(++curCalMonth);
	});


	let radio=document.querySelectorAll(".admin-form input[type='radio']");
	for(let i=0;i<radio.length;i++)
		radio[i].addEventListener("click",()=>{
			if(!document.querySelector("#changeAvailability").checked){
				document.querySelector("#numberAvailability").style.display="none";
				document.querySelector("#numberAvailabilityText").style.display="none";
			}else{
				document.querySelector("#numberAvailability").style.display="Block";
				document.querySelector("#numberAvailabilityText").style.display="Block";
			}
		});
	let editToggle=false;
	document.querySelector("#editReservation button").addEventListener("click",()=>{
		console.log("edit");
		let form=document.querySelectorAll("#reservationList tr");
		if(editToggle){
			editToggle=false;
		}else{
			editToggle=true;
		}
		let childrenForm=!editToggle? document.querySelectorAll("#reservationList input,#reservationList select"):document.querySelectorAll("#reservationList td");
		let rowNumber=document.querySelectorAll("#reservationList th").length-2;
		let args=[];
		console.log(rowNumber)
		for(let i=0;i<childrenForm.length;i++){//stuff to do here
			tempValue=editToggle? childrenForm[i].innerHTML:childrenForm[i].value;
			if(i%(rowNumber)==0 &&i!=0){
				//addReservation("john Doe","A","5","2025-10-12","2025-10-12",editToggle);
				args[(i+1)%(rowNumber)]=tempValue;
				addReservation(args[1],args[2],args[3],args[4],args[5],editToggle);
				console.log(args)
				continue;
			}
			console.log(tempValue);
			args[(i+1)%(rowNumber)]=tempValue;
			console.log((i+1)%rowNumber)

		}
		for(let i=1;i<form.length;i++){
			form[i].remove();
		}
	});
	let addZoneToggle=true;
	document.querySelector("#addZoneToggle").addEventListener("click",()=>{
		if(!addZoneToggle){
			addZoneToggle=true;
			document.querySelector("#addZone").style.display="none";
		}else{
			addZoneToggle=false;
			document.querySelector("#addZone").style.display="block";
		}
	});
	addReservation("john Doe","A","5","2025-10-12","2025-10-12");
	// addReservation("john Hoe","C","2","2025-8-12","2025-8-14");

});

function addReservation(name,zone,people,checkIn,checkOut,toggle=false){
	let row=document.createElement("tr");
	let nameColumn=document.createElement("td");

	let zoneColumn=document.createElement("td");
	
	let peopleColumn=document.createElement("td");
	
	let checkInColumn=document.createElement("td");
	
	let checkOutColumn=document.createElement("td");
	
	let deleteColumn=document.createElement("td");
	if(toggle){
		let nameInput=document.createElement("input");
		nameInput.setAttribute("type","text");
		nameInput.setAttribute("value",name);
		nameColumn.appendChild(nameInput);

		let selectZone=document.createElement("select");
		let zoneList= ["A","B","C","D"];
		for(let i=0;i<zoneList.length;i++){
			let tempOption=document.createElement("option");
			tempOption.setAttribute("value",zoneList[i]);
			tempOption.innerHTML=zoneList[i];
			if(zoneList[i]==zone)
				tempOption.setAttribute("selected","");
			selectZone.appendChild(tempOption);
		}
		zoneColumn.appendChild(selectZone);

		let numberInput=document.createElement("input");
		numberInput.setAttribute("type","number");
		numberInput.setAttribute("value",people);
		peopleColumn.appendChild(numberInput);

		let checkInInput=document.createElement("input");
		checkInInput.setAttribute("type","date");
		checkInInput.setAttribute("value",checkIn);
		checkInColumn.appendChild(checkInInput);

		let checkOutInput=document.createElement("input");
		checkOutInput.setAttribute("type","date");
		checkOutInput.setAttribute("value",checkOut);
		checkOutColumn.appendChild(checkOutInput);
	}else{
		nameColumn.innerHTML=name;
		zoneColumn.innerHTML=zone;
		peopleColumn.innerHTML=people;
		checkInColumn.innerHTML=checkIn;
		checkOutColumn.innerHTML=checkOut;
	}
	//let deleteButton=document.createElement("button")
	//deleteButton.innerHTML="Διαγραφή";
	//deleteColumn.appendChild(deleteButton);
	row.appendChild(nameColumn);
	row.appendChild(zoneColumn);
	row.appendChild(peopleColumn);
	row.appendChild(checkInColumn);
	row.appendChild(checkOutColumn);
	row.appendChild(deleteColumn);

	document.querySelector("#reservationList").appendChild(row);
}

function makeCallendar(month,leapYear=false,year=(new Date()).getFullYear()){//0 JAN 1 FEB 2 MARCH etc
	let daysInMonth=10;
	if(month%2===0)//if month even
		if(month<7)
			daysInMonth=31;
		else
			daysInMonth=30;
	else//month odd
		if(month==1)
			daysInMonth=leapYear? 29:28;
		else
			if(month<6)
				daysInMonth=30;
			else
				daysInMonth=31;
	calBox=document.querySelector(".callendarBox");
	calHeaderTitle=document.querySelector(".callendarHeader h4");
	calHeader=document.querySelector(".callendarHeader");
	calBox.innerHTML="";//resets Callendar
	// monthText=document.createElement("span");
	monthText=["ΙΑΝΟΥΑΡΙΟΣ","ΦΕΒΡΟΥΑΡΙΟΣ","ΜΑΡΤΙΟΣ","ΑΠΡΙΛΙΟΣ","ΜΑΙΟΣ","ΙΟΥΝΙΟΣ","ΙΟΥΛΙΟΣ","ΑΥΓΟΥΣΤΟΣ","ΣΕΠΤΕΜΒΡΙΟΣ","ΟΚΤΟΒΡΙΟΣ","ΜΟΕΜΒΡΙΟΣ","¨ΔΕΚΕΜΒΡΙΟΣ"];
	dayText=["ΚΥΡ","ΔΕΥ","ΤΡΙ","ΤΕΤ","ΠΕΜ","ΠΑΡ","ΣΑΒ"];
	calHeaderTitle.innerHTML=monthText[month] +" "+ year;
	for(let i=0;i<7;i++){
		let temp=document.createElement("span");
		temp.innerHTML=dayText[i];
		calBox.appendChild(temp);
	}
	let tempDate=(new Date(year,month,1)).getDay();
	for(let i=1;i<daysInMonth+1+tempDate;i++){
		let temp=document.createElement("div");
		if(i>tempDate){
			temp.setAttribute("data-date",`${year}-${month+1}-${i-tempDate}`);
			temp.innerHTML=i-tempDate;
			if(isToday(new Date(`${year}-${month+1}-${i-tempDate}`)))
				temp.classList.add("today");
			temp.addEventListener("click",(event)=>{
				let date=new Date(event.currentTarget.getAttribute("data-Date"));
				if(temp.classList.contains("today"))
					document.querySelector("#reservation>h3").innerHTML=`Κρατήσεις Σήμερα`;
				else
					document.querySelector("#reservation>h3").innerHTML=`Κρατήσεις ${dayText[date.getDay()]} ${date.getDate()} ${monthText[date.getMonth()]}`;
				window.location.href = "#reservation";
			});
		}
		calBox.appendChild(temp);
	}
}
function isToday(date){
	let todayDate=new Date();
	return date.getDate()===todayDate.getDate() && date.getMonth()===todayDate.getMonth() && date.getFullYear()===todayDate.getFullYear();
}