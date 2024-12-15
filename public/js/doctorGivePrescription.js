async function logout(){
  localStorage.clear();
  let result = await fetch("http://localhost:4200/logout", {
      method: "DELETE"
    });
  window.location.replace('http://localhost:4200');
}

let testStr = "";
let result = null;
let testArr = [];
let medArr = [];

function settingName(){
    let setName = document.getElementById('setName');
    let name = localStorage.getItem('NAME');
    setName.innerText = `Welcome Dr. ${name}`;
    console.log(setName);
}

settingName();

async function search(){
    let info = {
        APPTID:localStorage.getItem('APPTID')
      };
      result = await fetch("http://localhost:4200/doctor/getSingleAppointment", {
          method: "POST",
          body: JSON.stringify(info),
          headers: {
            "Content-Type": "application/json",
          },
        });
        result = await result.json();
        // console.log(result);
        if(result.length==0){
          let div1 = document.getElementById("insert");
          div1.innerHTML="";
          alert('No Appointments Found!');
        }
        else{
          test(result);
        }
}

search();

async function uploadPrescription(){
  let meds = "";
  for(let i=0;i<medArr.length;i++){
    meds += `${medArr[i]}</br>`;
  }

  let advice = document.getElementById('advice').value;
  let remarks = document.getElementById('remarks').value;
  let bed = document.getElementById('bedRequired').value;

  // console.log(medicines);
  // console.log(advice);
  // console.log(remarks);
  // console.log(bed);

  if(meds.trim() === "" || advice.trim() === "" || remarks.trim() === "" || bed.trim() === ""){
    alert('Please Fill up the medicines,advice,remarks,bed assigned fields properly');
  }
  else{
    let flag = confirm('Are You sure about uploading this prescription?');
    if(flag){
      const info = {
        TESTARR:testArr,
        APPTID:result[0].APPTID,
        REMARKS:remarks,
        ADVICE:advice,
        MEDICINES:meds,
        BED:bed
      }
      let temp = await fetch("http://localhost:4200/doctor/uploadPrescription", {
          method: "POST",
          body: JSON.stringify(info),
          headers: {
            "Content-Type": "application/json",
          },
        });
        temp = await temp.json();
        if(temp==="success"){
          window.location.replace("http://localhost:4200/doctor/upcomingAppointments");
        }
    }
  }
}


async function getTestNames(){
  const info = {
    msg:'test de'
  }
  let temp = await fetch("http://localhost:4200/doctor/testNames", {
      method: "POST",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json",
      },
    });
    temp = await temp.json();
    testStr = "";
    for(let i=0; i<temp.length;i++){
      testStr += `<li id = "${temp[i].TEST_NAME}" style = "display : none" onclick="addTest(this)"><a href="#">${temp[i].TEST_NAME}</a></li>`;
    }

    let ul = document.getElementById('myUL');
    ul.innerHTML = "";
    ul.innerHTML = testStr;
    // let li = document.createElement('li');
    // li.innerHTML = testStr;
    // ul.appendChild(li);
}



function removeMed(el) {
  var element = el;
  let index = medArr.indexOf(element.innerText);
  medArr.splice(index,1);
  console.log(medArr);
  element.remove();
}



function addMedicines(){
  let selectedMedicines = document.getElementById('selectedMedicines');
  selectedMedicines.style.display = "block";
  let medicine = document.getElementById('medicine').value;
  let time = "(";
  if(document.getElementById('Breakfast').checked){
    time += ` "${document.getElementById('Breakfast').value}" `;
  }
  if(document.getElementById('Lunch').checked){
    time += ` "${document.getElementById('Lunch').value}" `;
  }
  if(document.getElementById('Dinner').checked){
    time += `"${document.getElementById('Dinner').value}"`;
  }
  time +=")"

  let days = document.getElementById('days').value;
  medicine += time;
  medicine += ` (For ${days} days) `;
  medArr.push(medicine);
  console.log(medArr);
  selectedMedicines.innerHTML += `<p class="mouse" onclick="removeMed(this)">${medicine}</p>`;

  document.getElementById('Breakfast').checked = false;
  document.getElementById('Lunch').checked = false;
  document.getElementById('Dinner').checked = false;
  document.getElementById('medicine').value = "";
  document.getElementById('days').value = "";

}


function removeTest(el) {
  var element = el;
  let index = medArr.indexOf(element.innerText);
  testArr.splice(index,1);
  console.log(testArr);
  element.remove();
}

function addTest(ref) {
  testArr.push(ref.innerText);
  //console.log(testArr);
  let parent = document.getElementById(ref.innerText).parentElement;
  let child = document.getElementById(ref.innerText);
  //parent.removeChild(child);
  let selectedTests = document.getElementById('selectedTests');
  selectedTests.style.display = "block"
  selectedTests.innerHTML += `<p class="mouse" onclick="removeTest(this)">${ref.innerText}</p>`;
}



async function test(result) {

    let temp = await fetch("http://localhost:4200/doctor/getMedNames", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    temp = await temp.json();
    let medStr = "";
    for(let i=0; i<temp.length; i++){
      medStr+=`<option value="${temp[i].MEDNAME}">`;
    }

    let div1 = document.getElementById("insert");
    div1.innerHTML="";
  
    for (i = 0; i < result.length; i++) {
      let divTemp = document.createElement("div");
      let src ;
      divTemp.innerHTML = `<div class="card mb-3 bg-success" style="max-width: 1000px;">
      <div class="row g-0">
        <div class="col-md-3">
        <img src="images/editPrescription.png" class="img-fluid rounded-start" height="50px" width="200px" alt="...">
        </div>
        <div class="col-md-9">
        <div class="card-body">
          <p hidden>${result[i].APPTID}<p>
          <h4 class="card-title">Appointment ID: ${result[i].APPTID}</h4>
          <p style="color:white" class = "card-text">Patient Name: ${result[i].PATIENT_NAME}<br>
          NID: ${result[i].PID}</br>
          Age: ${result[i].AGE} Years </br>
          Blood Group: ${result[i].BLOOD_GROUP}</br>
          Phone: ${result[i].PHONE}</br>
          APPT_TIME: ${result[i].APPT_TIME}</br>
          APPT_DATE: ${result[i].APPT_DATE}</br>
          </p>

          <div style="color:white;display:none" id = "selectedTests">
            <b style="color:black"><i>Selected Tests(Click On The Test Name To Remove)</b></i>
          </div>
          <label for="#"><b>Required Tests</b></label>
          <form action="#0">
            
          
          <input type="text" style="border-radius: 5px;" id="myInput" onkeyup="myFunction()" placeholder="Search And Click on required tests">

          
          <ul id="myUL">
            
          </ul>


            <div style="color:white;display:none" id = "selectedMedicines">
             <b style="color:black"><i>Selected Medicines(Click On The Medicine Name To Remove)</b></i>
            </div>

            <label for="brow"><b>Required Medicines</b></label></br>
            <input list="brow" style="border-radius: 5px;"  id = "medicine">
            <datalist id="brow">
                ${medStr}
            </datalist> 
            <p style="color:white">Take After</p>
            <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" value="Breakfast" id="Breakfast">
            <label class="form-check-label" for="Breakfast">Breakfast</label></br>
            <input class="form-check-input" type="checkbox" value="Lunch" id="Lunch">
            <label class="form-check-label" for="Lunch">Lunch</label></br>
            <input class="form-check-input" type="checkbox" value="Dinner" id="Dinner">
            <label class="form-check-label" for="Dinner">Dinner</label>
            </div>

            <div class="row">
              <div class = "col-sm-4">
                <label class="form-check-label" for="days" style="color:white">For(Days)</label>
                <input type="number" class="form-control" id="days" aria-describedby="days">
              </div>
              <div class = "col-sm-5">
              </br>
                <button type="button" onclick="addMedicines()" class="btn btn-danger">Add Medicine</button>
              </div>
            </div>
            

            
                      
            </br>
            </br>

            <label for="remarks"><b>Remarks</b></label>
            <div class="grow-wrap">
                <textarea name="text" style="border-radius: 5px;"  placeholder="Remarks" id="remarks" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
            </div>

            <label for="advice"><b>Advice</b></label>
            <div class="grow-wrap">
                <textarea name="text" style="border-radius: 5px;"  placeholder="Advice" id="advice" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
            </div>

            <label for="bedRequired"><b>Assigned to bed?</b></label>
            <select id = "bedRequired" class="form-select" value="" aria-label="Default select example">
            <option selected disabled>Select</option>
            <option value="Y">Yes</option>
            <option value="N">No</option>
            </select>
            

            <p>       </p>
            <p>       </p>
            <p>       </p>
            <button type="button" id="button" onClick="uploadPrescription()" class="btn btn-dark">Upload Prescription</button>

            </form>
                </div>
        </div>
      </div>
      </div>`;
      div1.appendChild(divTemp);
      getTestNames();
    }

  }



  async function myFunction() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1 && filter.trim().length != 0) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }


  // <li id = "Ade le" style = "display : none" onclick="addTest(this)"><a href="#">Ade le</a></li>
  //           <li id = "Ag ne s" style = "display : none" onclick="addTest(this)"><a href="#">Ag ne s</a></li>
          
  //           <li id = "Billy" style = "display : none" onclick="addTest(this)"><a href="#">Billy</a></li>
  //           <li id = "Bob" style = "display : none" onclick="addTest(this)"><a href="#">Bob</a></li>
          
  //           <li id = "Calvin" style = "display : none" onclick="addTest(this)"><a href="#">Calvin</a></li>
  //           <li id = "Christina" style = "display : none" onclick="addTest(this)"><a href="#">Christina</a></li>
  //           <li id = "Cindy" style = "display : none" onclick="addTest(this)"><a href="#">Cindy</a></li>