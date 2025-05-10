let reservations=[
	{name:"John Doe",zone:"A",people:"5",checkIn:"2025-10-12",checkOut:"2025-10-12"},
	{name:"John Hoe",zone:"C",people:"2",checkIn:"2025-05-05",checkOut:"2025-05-05"}
];
let zones=[
	{zone:"A",totalAvailability:"1",cost:"1"},
	{zone:"B",totalAvailability:"1",cost:"1"},
	{zone:"C",totalAvailability:"1",cost:"1"},
	{zone:"D",totalAvailability:"1",cost:"1"},
];
const dpr=window.devicePixelRatio;
document.addEventListener("DOMContentLoaded",()=>{
	console.log("main");
	curCalMonth=(new Date()).getMonth();
	makeCallendar(curCalMonth);
	let yearSelect=document.querySelector("#yearSelect");
	document.querySelector(".callendarLtButton").addEventListener("click",()=>{
		if(curCalMonth>0)
			makeCallendar(--curCalMonth,yearSelect.value);
	});
	document.querySelector(".callendarGtButton").addEventListener("click",()=>{
		if(curCalMonth<11)
			makeCallendar(++curCalMonth),yearSelect.value;
	});
	document.querySelector("#changeAvailabilityButton").addEventListener("click",()=>{
		let form=document.querySelector("#changeAvailabilityForm");
		if(form.getAttribute("data-display")==="false"){
			form.setAttribute("data-display","true");
			form.style.display="block";
		}else{
			form.setAttribute("data-display","false");
			form.style.display="none";
		}
	});
	let editToggle=false;
	document.querySelector("#editReservation button").addEventListener("click",()=>{
		console.log("edit");
		let form=document.querySelectorAll("#reservationList tr");
		editToggle=!editToggle;
		for(let i=1;i<form.length;i++){
			form[i].remove();
		}
		for(let i=0;i<reservations.length;i++){
			addReservation(reservations[i],editToggle);
		}
		if(editToggle){
			let parentDiv=document.querySelector("#reservation");
			let saveButton=document.createElement("button");
			saveButton.setAttribute("class","saveButton");
			saveButton.innerHTML="Αποθήκευση αλλαγών";
			saveButton.addEventListener("click",()=>{
				alert("Οι αλλαγές αποθηκεύτηκαν!");
			});
			parentDiv.appendChild(saveButton);
		}else{
			document.querySelector("#reservation .saveButton").remove();
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
	for(let i=0;i<reservations.length;i++){
		addReservation(reservations[i]);
	}
	fillAvailability();
	fillZoneTable();
});

function addReservation(reserv,toggle=false){
	let row=document.createElement("tr");
	let nameColumn=document.createElement("td");

	let zoneColumn=document.createElement("td");
	
	let peopleColumn=document.createElement("td");
	
	let checkInColumn=document.createElement("td");
	
	let checkOutColumn=document.createElement("td");
	
	let deleteColumn=document.createElement("td");

	let name=reserv.name;
	let zone=reserv.zone;
	let people=reserv.people;
	let checkIn=reserv.checkIn;
	let checkOut=reserv.checkOut;
	if(toggle){
		let nameInput=document.createElement("input");
		nameInput.setAttribute("type","text");
		nameInput.setAttribute("value",name);
		nameColumn.appendChild(nameInput);

		let selectZone=document.createElement("select");
		let zoneList= [];
		for(let i=0;i<zones.length;i++)
			zoneList.push(zones[i].zone);
		console.log(zoneList);
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
	if(toggle){
		let deleteButton=document.createElement("button")
		deleteButton.innerHTML="Διαγραφή";
		deleteColumn.appendChild(deleteButton);
	}
	row.appendChild(nameColumn);
	row.appendChild(zoneColumn);
	row.appendChild(peopleColumn);
	row.appendChild(checkInColumn);
	row.appendChild(checkOutColumn);
	row.appendChild(deleteColumn);

	document.querySelector("#reservationList").appendChild(row);
}

function makeCallendar(month,year=(new Date()).getFullYear()){//0 JAN 1 FEB 2 MARCH etc
	let daysInMonth=10;
	if(month%2===0)//if month even
		if(month<7)
			daysInMonth=31;
		else
			daysInMonth=30;
	else//month odd
		if(month==1)
			daysInMonth=isLeapYear(year)? 29:28;
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
			if(isToday(new Date(`${year}-${month+1}-${i-tempDate}`))){
				temp.classList.add("today");
			}
			temp.addEventListener("click",(event)=>{
				let date=new Date(event.currentTarget.getAttribute("data-Date"));
				if(temp.classList.contains("today")){
					document.querySelector("#reservation>h3").innerHTML=`Κρατήσεις Σήμερα`;
					document.querySelector("#availability>h3").innerHTML=`Διαθεσιμότητα Σήμερα`;

				}
				else{
					document.querySelector("#reservation>h3").innerHTML=(date.getFullYear()===(new Date()).getFullYear())? `Κρατήσεις ${dayText[date.getDay()]} ${date.getDate()} ${monthText[date.getMonth()]}` : `Κρατήσεις ${dayText[date.getDay()]} ${date.getDate()} ${monthText[date.getMonth()]} ${date.getFullYear()}`;
					document.querySelector("#availability>h3").innerHTML=(date.getFullYear()===(new Date()).getFullYear())? `Διαθεσιμότητα ${dayText[date.getDay()]} ${date.getDate()} ${monthText[date.getMonth()]}` : `Διαθεσιμότητα ${dayText[date.getDay()]} ${date.getDate()} ${monthText[date.getMonth()]} ${date.getFullYear()}`;		
				}
				window.location.href ="#reservation";
			});
		}
		calBox.appendChild(temp);
	}
	let selectYear=document.querySelector("#yearSelect");
	selectYear.innerHTML="";
	for(let i=0;i<5;i++){
		let temp=document.createElement("option");
		temp.innerHTML=(i===0)? String(Number(year)+1) :String(Number(year)-i+1);
		if(temp.innerHTML==year)
			temp.setAttribute("selected","")
		temp.setAttribute("value",temp.innerHTML);
		temp.addEventListener("click",(event)=>{
			
		});
		selectYear.appendChild(temp);
	}
	selectYear.addEventListener("change",()=>{
		makeCallendar(month,selectYear.value);
	});
}
function isToday(date){
	let todayDate=new Date();
	return date.getDate()===todayDate.getDate() && date.getMonth()===todayDate.getMonth() && date.getFullYear()===todayDate.getFullYear();
}
function isLeapYear(year){
	return year%4===0 && year%100!=0 ? true : (year%400===0? true: false);
}
function makePie(canvas,con,max){
	let ctx=canvas.getContext("2d");
	let point={x:canvas.width/(2*dpr),y:canvas.height/(2*dpr)};
	ctx.fillStyle="#54C774";
	ctx.scale(dpr,dpr);
	ctx.beginPath();
	ctx.moveTo(point.x,point.y)
	ctx.arc(point.x,point.y,point.y-10,0,-con/max*2*Math.PI,true);
	ctx.lineTo(point.x,point.y);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();


	ctx.fillStyle="#C75454";
	ctx.beginPath();
	ctx.moveTo(point.x,point.y)
	ctx.arc(point.x,point.y,point.y-10,0,-(con/max)*2*Math.PI,false);
	ctx.lineTo(point.x,point.y);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}
function fillAvailability(){
	let pieContainer=document.querySelector("#canvasContainer");
	let availabilityTable=document.querySelector("#availability>.table-list");
	for(let i=0;i<zones.length;i++){
		let div=document.createElement("div");
		div.setAttribute("align","center");
		let canvas=document.createElement("canvas");
		canvas.setAttribute("id",`pie-${zones[i].zone}`);
		div.appendChild(canvas);
		let p=document.createElement("p");
		p.innerHTML=`Ζώνη ${zones[i].zone}`;
		div.appendChild(p);
		pieContainer.appendChild(div);

		let rect =canvas.getBoundingClientRect();
		canvas.width=rect.width*dpr;
		canvas.height=rect.height*dpr;
		canvas.style.width=`${rect.width}px`
		canvas.style.height=`${rect.height}px`;

		let avail=Math.random();
		canvas.setAttribute("title",`Zώνη ${zones[i].zone} - ${avail}/${zones[i].totalAvailability}`)
		makePie(canvas,avail,1);

		let tr=document.createElement("tr");
		for(let j=0;j<2;j++){
			let td=document.createElement("td");
			td.innerHTML=(j==0)? zones[i].zone:avail;
			tr.appendChild(td);
		}
		availabilityTable.appendChild(tr);
	}
}
function fillZoneTable(){
	let zoneTable=document.querySelector("#zoneManagement .table-list");
	let trHead=document.createElement("tr");
	for(let j in zones[0]){
		let temp=document.createElement("th");
		temp.innerHTML=j;
		trHead.appendChild(temp);
	}
	let editButton=document.createElement("button");
	editButton.setAttribute("type","button");
	editButton.setAttribute("data-toggle","false");
	editButton.innerHTML="Επεξεργασία";
	editButton.addEventListener("click",()=>{
		let edit=(editButton.getAttribute("data-toggle")==="false")? false:true;
		editButton.setAttribute("data-toggle",!edit);
		if(!edit){
			let parentDiv=document.querySelector("#zoneManagement");
			let saveButton=document.createElement("button");
			saveButton.setAttribute("class","saveButton");
			saveButton.innerHTML="Αποθήκευση αλλαγών";
			saveButton.addEventListener("click",()=>{
				alert("Οι αλλαγές αποθηκεύτηκαν!");
			});
			parentDiv.appendChild(saveButton);
		}else{
			document.querySelector("#zoneManagement .saveButton").remove();
		}
	});
	let editTh=document.createElement("th");
	editTh.appendChild(editButton);
	trHead.appendChild(editTh);
	zoneTable.appendChild(trHead);
	for(let i=0;i<zones.length;i++){
		let tr=document.createElement("tr");
		for(let j in zones[i]){
			let td=document.createElement("td");
			td.innerHTML=`${zones[i][j]}`
			tr.appendChild(td);
		}
		tr.appendChild(document.createElement("td"));
		zoneTable.appendChild(tr);
	}
}