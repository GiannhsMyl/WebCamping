document.addEventListener("DOMContentLoaded",()=>{
	console.log("main");
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