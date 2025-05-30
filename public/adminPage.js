let reservations=[];
let zones=[];
let visitors=[];
const dpr=window.devicePixelRatio;
let lastDate;
document.addEventListener("DOMContentLoaded",async ()=>{
	console.log("main");
	curCalMonth=(new Date()).getMonth();
	makeCallendar(curCalMonth);
	zones=await refreshZones();
	reservations=await refreshReservations();
	lastDate=document.querySelector(".today").getAttribute("data-date");
	visitors=await refreshVisitors();	
	let yearSelect=document.querySelector("#yearSelect");
	document.querySelector(".callendarLtButton").addEventListener("click",async ()=>{
		if(curCalMonth>0)
			makeCallendar(--curCalMonth,yearSelect.value);
	});
	document.querySelector(".callendarGtButton").addEventListener("click",async ()=>{
		if(curCalMonth<11)
			makeCallendar(++curCalMonth),yearSelect.value;
	});
	// document.querySelector("#changeAvailabilityButton").addEventListener("click",()=>{
	// 	let form=document.querySelector("#changeAvailabilityForm");
	// 	if(form.getAttribute("data-display")==="false"){
	// 		form.setAttribute("data-display","true");
	// 		form.style.display="block";
	// 	}else{
	// 		form.setAttribute("data-display","false");
	// 		form.style.display="none";
	// 	}
	// });
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
			saveButton.addEventListener("click",async ()=>{
				let reservationTable=document.querySelectorAll("#reservationList tr");
				let editedReservations=[];
				for(let i=1;i<reservationTable.length;i++){
					editedReservations[i-1]={};
					let inp=reservationTable[i].querySelectorAll("input,select");
					for(let j=0;j<inp.length;j++){
						editedReservations[i-1][inp[j].getAttribute("name")]=inp[j].value;
					}
				}
				const response=await fetch("/admin/editReservations",{
					method:"POST",
					headers:{
						"Content-Type":"Application/json"
					},
					body:JSON.stringify(editedReservations)
				});
				let answer=await response.text();
				console.log(`response:${answer}`)
				console.log(editedReservations);
				alert("Οι αλλαγές αποθηκεύτηκαν!");
				document.querySelector("#reservation .saveButton").remove();
				reservations=await refreshReservations(lastDate);
				deleteTable("#reservationList>tr");
				fillReservations();
				editToggle=!editToggle;
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
	fillReservations();
	fillAvailability();
	// document.querySelector("#changeAvailabilityForm input[type=hidden]").value=new Date().toISOString().split("T")[0];
	fillZoneTable();
	fillVisitorsTable();
	document.querySelector("#visitors>button").addEventListener("click",showAddVisitorForm);
	document.querySelector("#reservation>button").addEventListener("click",showAddResForm);
	document.querySelector("#visitorSearch button").addEventListener("click",searchVisitor);

	let select=document.querySelector("#zoneType");
	for(let i=0;i<zones.length;i++){
		let temp=document.createElement("option");
		temp.setAttribute("value",zones[i].name);
		temp.innerHTML=zones[i].name;
		select.appendChild(temp);
	}
});

function addReservation(reserv,toggle=false){
	let row=document.createElement("tr");
	let nameColumn=document.createElement("td");

	let zoneColumn=document.createElement("td");
	
	let peopleColumn=document.createElement("td");
	
	let checkInColumn=document.createElement("td");
	
	let checkOutColumn=document.createElement("td");
	
	let costColumn=document.createElement("td");

	let deleteColumn=document.createElement("td");

	let id=reserv.id;
	let name=`${reserv.firstName} ${reserv.lastName}`;
	let zone=`${reserv.zoneType}-${reserv.num}`;
	let people=reserv.people;
	let checkIn=reserv.checkIn;
	let checkOut=reserv.checkOut;
	if(toggle){//this will appear when user has selected 'edit'
		// let nameInput=document.createElement("input");
		// nameInput.setAttribute("type","text");
		// nameInput.setAttribute("name","name");
		// nameInput.setAttribute("value",name);
		// nameColumn.appendChild(nameInput);

		let selectZone=document.createElement("select");
		selectZone.setAttribute("name","zone");
		let zoneList= [];
		for(let i=0;i<zones.length;i++)
			zoneList.push(zones[i].name);
		// console.log(zoneList);
		let maxNumZones=0;
		for(let i=0;i<zoneList.length;i++){
			let tempOption=document.createElement("option");
			tempOption.setAttribute("value",zoneList[i]);
			tempOption.innerHTML=zoneList[i];
			if(zoneList[i]==zone.split("-")[0]){
				tempOption.setAttribute("selected","");
				maxNumZones=zones[i].numOfZones;
			}
			selectZone.appendChild(tempOption);
		}
		selectZone.addEventListener("change",(event)=>{
			let idSelect=document.querySelector("#reservationList select[name=zoneNum]");
			deleteTable("#reservationList select[name=id] option");
			let max=0;
			
			for(let i=0;i<zones.length;i++){
				if(zones[i].name==event.target.value){
					max=zones[i].numOfZones;
				}
			}
			console.log(`${max}`)
			for(let i=1;i<max+1;i++){
				let tempOption=document.createElement("option");
				tempOption.setAttribute("value",i);
				tempOption.innerHTML=i;
				if(i===1)
					tempOption.setAttribute("selected","");
				idSelect.appendChild(tempOption);
			}
		});
		let op=document.createElement("select");
		op.setAttribute("name","zoneNum")
		console.log(maxNumZones);
		for(let i=1;i<maxNumZones+1;i++){
			let tempOption=document.createElement("option");
			tempOption.setAttribute("value",i);
			tempOption.innerHTML=i;
			if(zone.split("-")[1]==i)
				tempOption.setAttribute("selected","");
			op.appendChild(tempOption);
		}
		zoneColumn.appendChild(selectZone);
		zoneColumn.appendChild(op);


		let numberInput=document.createElement("input");
		numberInput.setAttribute("type","number");
		numberInput.setAttribute("name","people");
		numberInput.setAttribute("value",people);
		peopleColumn.appendChild(numberInput);

		let idInput=document.createElement("input");
		idInput.setAttribute("type","hidden");
		idInput.setAttribute("name","id");
		idInput.setAttribute("value",id);
		nameColumn.appendChild(idInput);


		let checkInInput=document.createElement("input");
		checkInInput.setAttribute("type","date");
		checkInInput.setAttribute("name","checkIn");
		checkInInput.setAttribute("value",checkIn);
		checkInColumn.appendChild(checkInInput);

		let checkOutInput=document.createElement("input");
		checkOutInput.setAttribute("type","date");
		checkOutInput.setAttribute("name","checkOut");
		checkOutInput.setAttribute("value",checkOut);
		checkOutColumn.appendChild(checkOutInput);

		let adel=document.createElement("a");
		adel.setAttribute("href",`admin/deleteReservation/${reserv.id}`);
		let deleteButton=document.createElement("button");
		deleteButton.innerHTML="Διαγραφή";
		adel.appendChild(deleteButton);
		deleteColumn.appendChild(adel);
	}else{//this will appear when edit is NOT selected

		zoneColumn.innerHTML=zone;
		peopleColumn.innerHTML=people;
		checkInColumn.innerHTML=checkIn;
		checkOutColumn.innerHTML=checkOut;
	}
	//this will appear regardless
	
	let linkVisitor=document.createElement("a");
	linkVisitor.setAttribute("href","#visitors");
	linkVisitor.setAttribute("data-email",reserv.email);
	linkVisitor.addEventListener("click",getSpecificVisitor)
	linkVisitor.innerHTML=name;
	nameColumn.appendChild(linkVisitor);
	
	costColumn.innerHTML=reserv.totalPrice;
	//
	row.appendChild(nameColumn);
	row.appendChild(zoneColumn);
	row.appendChild(peopleColumn);
	row.appendChild(checkInColumn);
	row.appendChild(checkOutColumn);
	row.appendChild(costColumn);
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
	monthText=["ΙΑΝΟΥΑΡΙΟΣ","ΦΕΒΡΟΥΑΡΙΟΣ","ΜΑΡΤΙΟΣ","ΑΠΡΙΛΙΟΣ","ΜΑΙΟΣ","ΙΟΥΝΙΟΣ","ΙΟΥΛΙΟΣ","ΑΥΓΟΥΣΤΟΣ","ΣΕΠΤΕΜΒΡΙΟΣ","ΟΚΤΟΒΡΙΟΣ","ΝΟΕΜΒΡΙΟΣ","ΔΕΚΕΜΒΡΙΟΣ"];
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
			temp.setAttribute("data-date",`${year}-${((month+1)/10<1)? ("0"+(month+1)):(month+1)}-${i-tempDate}`);
			temp.innerHTML=i-tempDate;
			if(isToday(new Date(`${year}-${month+1}-${i-tempDate}`))){
				temp.classList.add("today");
			}
			temp.addEventListener("click",async (event)=>{
				let dateAttr=event.currentTarget.getAttribute("data-Date");
				lastDate=dateAttr;
				let date=new Date(dateAttr);
				// document.querySelector("#changeAvailabilityForm input[type=hidden]").value=`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
				if(temp.classList.contains("today")){
					document.querySelector("#reservation>h3").innerHTML=`Κρατήσεις Σήμερα`;
					document.querySelector("#availability>h3").innerHTML=`Διαθεσιμότητα Σήμερα`;

				}
				else{
					document.querySelector("#reservation>h3").innerHTML=(date.getFullYear()===(new Date()).getFullYear())? `Κρατήσεις ${dayText[date.getDay()]} ${date.getDate()} ${monthText[date.getMonth()]}` : `Κρατήσεις ${dayText[date.getDay()]} ${date.getDate()} ${monthText[date.getMonth()]} ${date.getFullYear()}`;
					document.querySelector("#availability>h3").innerHTML=(date.getFullYear()===(new Date()).getFullYear())? `Διαθεσιμότητα ${dayText[date.getDay()]} ${date.getDate()} ${monthText[date.getMonth()]}` : `Διαθεσιμότητα ${dayText[date.getDay()]} ${date.getDate()} ${monthText[date.getMonth()]} ${date.getFullYear()}`;		
				}
				
				reservations=await refreshReservations(dateAttr);
				deleteTable("#reservationList>tr");
				fillReservations();
				deleteTable("#availabilityTable>tr");
				deleteTable("#canvasContainer>div");
				fillAvailability(dateAttr);
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
	ctx.scale(dpr,dpr);
	if(con!==0){
		ctx.fillStyle="#54C774";
		ctx.beginPath();
		ctx.moveTo(point.x,point.y)
		ctx.arc(point.x,point.y,point.y-10,0,-con/max*2*Math.PI,true);
		ctx.lineTo(point.x,point.y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	if(con!==max){
		ctx.fillStyle="#C75454";
		ctx.beginPath();
		ctx.moveTo(point.x,point.y)
		ctx.arc(point.x,point.y,point.y-10,0,(con===0)? 2*Math.PI:-(con/max)*2*Math.PI,false);
		ctx.lineTo(point.x,point.y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}
async function fillAvailability(date=document.querySelector(".today").getAttribute("data-date")){
	let pieContainer=document.querySelector("#canvasContainer");
	let availabilityTable=document.querySelector("#availability>.table-list");
	let availabilities=await fetch("/admin/getAvailabilities",{
		method:"POST",
		headers:{
			"Content-Type":"Application/json"
		},
		body:JSON.stringify({"date":date})
	});
	let availArr=await availabilities.json();

	for(let i=0;i<zones.length;i++){
		let div=document.createElement("div");
		div.setAttribute("align","center");
		let canvas=document.createElement("canvas");
		canvas.setAttribute("id",`pie-${zones[i].name}`);
		div.appendChild(canvas);
		let p=document.createElement("p");
		p.innerHTML=`Ζώνη ${zones[i].name}`;
		div.appendChild(p);
		pieContainer.appendChild(div);

		let rect =canvas.getBoundingClientRect();
		canvas.width=rect.width*dpr;
		canvas.height=rect.height*dpr;
		canvas.style.width=`${rect.width}px`
		canvas.style.height=`${rect.height}px`;

		let avail=availArr[i].availability;
		canvas.setAttribute("title",`Zώνη ${zones[i].name} - ${avail}/${zones[i].numOfZones}`)
		makePie(canvas,avail,zones[i].numOfZones);

		let tr=document.createElement("tr");
		for(let j=0;j<2;j++){
			let td=document.createElement("td");
			td.innerHTML=(j==0)? zones[i].name:avail;
			tr.appendChild(td);
		}
		availabilityTable.appendChild(tr);
	}
}
function fillZoneTable(){
	let zoneTable=document.querySelector("#zoneManagement .table-list");
	let trHead=document.createElement("tr");
	for(let j in zones[0]){
		if(j=="id") continue;
		let temp=document.createElement("th");
		temp.innerHTML=j;
		trHead.appendChild(temp);
	}
	let editButton=document.createElement("button");
	editButton.setAttribute("type","button");
	editButton.setAttribute("data-toggle","false");
	editButton.innerHTML="Επεξεργασία";
	editButton.addEventListener("click",async ()=>{
		let edit=(editButton.getAttribute("data-toggle")==="false")? false:true;
		editButton.setAttribute("data-toggle",!edit);
		if(!edit){
			let parentDiv=document.querySelector("#zoneManagement");
			let saveButton=document.createElement("button");
			saveButton.setAttribute("class","saveButton");
			saveButton.innerHTML="Αποθήκευση αλλαγών";
			saveButton.addEventListener("click",async ()=>{
				let zoneList=document.querySelectorAll("#zoneList tr");
				let head=zoneList[0].querySelectorAll("th");
				let temp=[];
				//  for(let i=0;i<head.length-1;i++){
				// 	// console.log(head[i].innerHTML);
				// 	temp[head[i].innerHTML]="";
				//  }
				for(let i=1;i<zoneList.length;i++){
					temp[i-1]={};
					let inp=zoneList[i].querySelectorAll("input");
					for(let j=0;j<inp.length;j++){
						temp[i-1][inp[j].getAttribute("name")]=inp[j].value;
					}
					console.log(temp[i-1]);
				}
				const response=await fetch("/admin/editZone",{
					method:"POST",
					headers:{
						"Content-Type":"Application/json"
					},
					body:JSON.stringify(temp)
				});
				let answer=await response.text();
				console.log(`response:${answer}`)
				alert("Οι αλλαγές αποθηκεύτηκαν!");
				deleteTable("#zoneList tr");
				deleteTable("#canvasContainer>div");
				deleteTable("#availabilityTable>tr");
				zones=await refreshZones();
				fillZoneTable();
				fillAvailability();
				document.querySelector("#zoneManagement .saveButton").remove();
			});
			parentDiv.appendChild(saveButton);
			let zoneList=document.querySelectorAll("#zoneList tr");
			let head=zoneList[0].querySelectorAll("th");
			for(let i=1;i<zoneList.length;i++){
				let temp=zoneList[i].querySelectorAll("td");
				let tr=document.createElement("tr");
				for(let j=0;j<head.length-1;j++){
					let td=document.createElement("td");
					let input=document.createElement("input");
					input.setAttribute("name",head[j].innerHTML);
					input.setAttribute("type","text");
					input.setAttribute("value",temp[j].innerHTML);
					td.appendChild(input);
					if(head[j].innerHTML=="name"){
						let hidden=document.createElement("input");
						hidden.setAttribute("type","hidden");
						hidden.setAttribute("name","ogname");
						hidden.value=temp[j].innerHTML;
						td.appendChild(hidden);
					}
					tr.appendChild(td);
					// console.log(`${head[j].innerHTML} : ${temp[j].innerHTML}`)
				}
				let delButton=document.createElement("button");
				// delButton.setAttribute(,);
				let adel=document.createElement("a");//not-the-singer
				adel.setAttribute("href",`/admin/deleteZoneType/${temp[0].innerHTML.replace(" ","_")}`);
				delButton.innerHTML="Διαγραφή";
				let delTd=document.createElement("td");
				adel.appendChild(delButton)
				delTd.appendChild(adel);
				tr.appendChild(delTd);
				zoneTable.appendChild(tr);
			}
			for(let i=1;i<zoneList.length;i++){
				zoneList[i].remove();
			}
		}else{
			document.querySelector("#zoneManagement .saveButton").remove();
			let zoneList=document.querySelectorAll("#zoneList tr");
			let head=zoneList[0].querySelectorAll("th");
			for(let i=1;i<zoneList.length;i++){
				let temp=zoneList[i].querySelectorAll("td input");
				let tr=document.createElement("tr");
				for(let j=0;j<head.length-1;j++){
					let td=document.createElement("td");
					td.innerHTML=temp[j].getAttribute("value");
					tr.appendChild(td);
				}
				tr.appendChild(document.createElement("td"));
				zoneTable.appendChild(tr);
			}
			for(let i=1;i<zoneList.length;i++){
				zoneList[i].remove();
			}

		}
	});
	let editTh=document.createElement("th");
	editTh.appendChild(editButton);
	trHead.appendChild(editTh);
	zoneTable.appendChild(trHead);
	for(let i=0;i<zones.length;i++){
		let tr=document.createElement("tr");
		for(let j in zones[i]){
			if (j=="id") continue;
			let td=document.createElement("td");
			td.innerHTML=`${zones[i][j]}`
			tr.appendChild(td);
		}
		tr.appendChild(document.createElement("td"));
		zoneTable.appendChild(tr);
	}
}
function fillVisitorsTable(){
	let table=document.querySelector("#visitorList");
	let visitorInfo=Object.keys(visitors[0]);
	let trHead=document.createElement("tr");
	for(let i=0;i<visitorInfo.length;i++){
		let th=document.createElement("th");
		th.innerHTML=visitorInfo[i];
		trHead.appendChild(th);
	}
	let th=document.createElement("th");
	let editButton=document.createElement("button");
	editButton.innerHTML="Επεξεργασία";
	editButton.setAttribute("data-edit",false);
	editButton.addEventListener("click",(event)=>{
		let toggle=event.target.getAttribute("data-edit")=="false"? false :true;
		event.target.setAttribute("data-edit",!toggle);
		let table=document.querySelectorAll("#visitorList tr");
		let thead=table[0].querySelectorAll("th");
		deleteTable("#visitorList tr:not(:first-child)")
		let id;
		for(let i=1;i<table.length;i++){
			let temptr=document.createElement("tr");
			let localtr=table[i].querySelectorAll("td");
			let j;
			for(j=0;j<localtr.length-2;j++){
				let temptd=document.createElement("td");
				if(!toggle){
					let tempInp=document.createElement("input");
					tempInp.setAttribute("name",thead[j].innerHTML);
					tempInp.setAttribute("type","text");
					tempInp.setAttribute("value",localtr[j].innerHTML);
					temptd.appendChild(tempInp);
					if(thead[j].innerHTML=="email"){
						let hidden=document.createElement("input");
						hidden.setAttribute("type","hidden");
						hidden.setAttribute("name","ogEmail");
						id=localtr[j].innerHTML;
						hidden.value=localtr[j].innerHTML;
						temptd.appendChild(hidden);
					}
				}else{
					temptd.innerHTML=localtr[j].querySelector("input").value;
				}
				temptr.appendChild(temptd);
			}
			let temptd=document.createElement("td");
			temptd.innerHTML=localtr[j].innerHTML;
			temptr.appendChild(temptd);
			let temptd2=document.createElement("td");
			if(!toggle){
				let deleteButton=document.createElement("button");
				deleteButton.innerHTML="Διαγραφή";
				let adel=document.createElement("a");
				adel.setAttribute("href",`/admin/deleteVisitor/${id}`);
				adel.appendChild(deleteButton);
				temptd2.appendChild(adel);
			}
			temptr.appendChild(temptd2);
			document.querySelector("#visitorList").appendChild(temptr);
		}
		if(!toggle){
			let saveButton=document.createElement("button");
			saveButton.innerHTML="Αποθήκευση αλλαγών";
			saveButton.classList.add("save-button");
			saveButton.addEventListener("click",async ()=>{
				let table=document.querySelectorAll("#visitorList tr");
				let vis=[];
				for(let i=1;i<table.length;i++){
					let inp=table[i].querySelectorAll("input");
					let tempVisitor={};
					for(let j=0;j<inp.length;j++){
						tempVisitor[inp[j].getAttribute("name")]=inp[j].value;
					}
					vis.push(tempVisitor);
				}
				let invalidEmail=false;
				for(let i=0;i<vis.length;i++){
					// console.log(vis[i])
					if(vis[i].email.match("[A-Za-z0-9]+@[A-Za-z0-9]+\\.[A-Za-z0-9]+")===null){
						invalidEmail=true;
						break;
					}
				}
				if(invalidEmail){
					alert("Δώστε μια έγκυρη τιμή email");
				}else{
					const response=await fetch("/admin/editVisitors",{
						method:"POST",
						headers:{
						"Content-type":"application/json"
						},
						body:JSON.stringify(vis)
					});
					// let vitor=await response.json();
					deleteTable("#visitorList tr");
					visitors=await refreshVisitors();
					document.querySelector("#visitors .save-button").remove();
					fillVisitorsTable();
				}
			});
			document.querySelector("#visitors").appendChild(saveButton);
		}else{
			document.querySelector("#visitors .save-button").remove();
		}
		// deleteTable("#visitorList tr:not(:first-child)");
	});
	th.appendChild(editButton);
	trHead.appendChild(th);
	table.appendChild(trHead);
	for(let i=0;i<visitors.length;i++){
		let tr=document.createElement("tr");
		for(let j=0;j<visitorInfo.length;j++){
			let td=document.createElement("td");
			td.innerHTML=visitors[i][visitorInfo[j]];
			tr.appendChild(td);
		}
		let td=document.createElement("td");
		tr.appendChild(td);
		table.appendChild(tr);
	}
}
function deleteVisitorTable(){
	let children2delete=document.querySelector("#visitorList").children;
	while(children2delete.length!==0){
		children2delete[0].remove();
	}
}
function deleteTable(tableSelector){
	let tr2delete=document.querySelectorAll(tableSelector);
	for(let i=0;i<tr2delete.length;i++){
		tr2delete[i].remove();
	}
}
function fillReservations(){
	for(let i=0;i<reservations.length;i++){
		addReservation(reservations[i]);
	}
}
async function searchVisitor(){
	let query=document.querySelector("#visitorSearchIn").value
	if(query===""/* || query.split(" ").length!=2*/){
		visitors=await refreshVisitors();
		deleteVisitorTable();
		fillVisitorsTable();
	}else{
		const resp=await fetch(`/admin/searchVisitors/${query.replace(" ","_")}`,{
			method:"POST",
			headers:{
				"Content-type":"application/json"
			}
		});
		visitors=await resp.json();
		if(visitors.length==0)
			deleteTable("#visitorList tr:not(:first-child)");
		else
			deleteTable("#visitorList tr");

		fillVisitorsTable();
	}
}
async function refreshZones() {
	const response=await fetch("admin/getZones",{
	method:"POST",
	headers:{
		"Content-type":"application/json"
	}
	});
	let zones=await response.json(); 
	return zones;
}

async function refreshReservations(date=document.querySelector(".today").getAttribute("data-date")) {
	const response=await fetch("admin/getReservations",{
		method:"POST",
		headers:{
			"Content-type":"application/json"
		},
		body:JSON.stringify({"date":date}),
	});
	let reservations=await response.json();
	return reservations;
}

async function refreshVisitors() {
	const response=await fetch("admin/getVisitors",{
		method:"POST",
		headers:{
			"Content-type":"application/json"
		}
	});
	let visitors=await response.json();
	return visitors;
}
async function getSpecificVisitor(event) {
	let email=event.currentTarget.getAttribute("data-email");
	const response=await fetch(`/admin/visitors/${email}`,{
		method:"POST",
		headers:{
			"Content-type":"application/json"
		}
	});
	let f=await response.json();
	visitors=[];
	visitors.push(f);//await response.json()
	deleteVisitorTable();
	fillVisitorsTable();
}

function showAddVisitorForm(event){
	let toggle=event.target.getAttribute("data-show")=="false"? false :true;
	if(!toggle){
		document.querySelector("#addVisitor").style.display="block";
	}else{
		document.querySelector("#addVisitor").style.display="none";
	}
	toggle=!toggle;
	event.target.setAttribute("data-show",toggle);
}
function showAddResForm(event){
	let toggle=event.target.getAttribute("data-show")=="false"? false :true;
	let tempDate=new Date();
	document.querySelector("#checkIn").setAttribute("value",`${tempDate.getFullYear()}-${(tempDate.getMonth()>10)?tempDate.getMonth()+1:"0".concat("",tempDate.getMonth()+1)}-${tempDate.getDate()}`);
	if(!toggle){
		document.querySelector("#addReservation").style.display="block";
	}else{
		document.querySelector("#addReservation").style.display="none";
	}
	toggle=!toggle;
	event.target.setAttribute("data-show",toggle);
}