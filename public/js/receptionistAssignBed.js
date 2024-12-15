async function logout() {
    localStorage.clear();
    let result = await fetch("http://localhost:4200/logout", {
      method: "DELETE",
    });
    window.location.replace("http://localhost:4200");
  }
  
  function settingName() {
    let setName = document.getElementById("setName");
    let name = localStorage.getItem("NAME");
    setName.innerText = `Welcome ${name}`;
    console.log(setName);
  }
  
  settingName();
  let appointment;


  async function search(){
    let nid = document.getElementById('nid').value;
    if(nid === ""){
        document.getElementById('error').style.display = "block";
        let div1 = document.getElementById("insert");
        div1.innerHTML="";
    }
    else{
        document.getElementById('error').style.display = "none";
        let info = {
            PID:nid
          };
          appointment = await fetch("http://localhost:4200/receptionist/getBedStatusFromAppointment", {
              method: "POST",
              body: JSON.stringify(info),
              headers: {
                "Content-Type": "application/json",
              },
            });
            appointment = await appointment.json();
            //console.log(result);
            if(appointment.length==0){
              let div1 = document.getElementById("insert");
              div1.innerHTML="";
              div1.innerHTML += `<h1 style="color:red"> No Bed Assign Request Found For this patient.. </h1>`
            }
            else{
              test(appointment);
            }
    }
}


async function assignBed(ref){
  let flag = confirm('Are You Sure About Assigning this bed?')
  if(flag){
    let info = {
      BED_NO:ref.parentNode.childNodes[1].innerText,
      PID:appointment[0].PID,
      HID:localStorage.getItem('HID'),
      SPECIALITY:appointment[0].SPECIALITY
    };
    let result = await fetch("http://localhost:4200/receptionist/admitToBed", {
      method: "POST",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    if(result.success){
      let div1 = document.getElementById("insert");
      div1.innerHTML="";
      div1.innerHTML += `<h1 style="color:Green"> ${appointment[0].PATIENT_NAME} has been successfully admitted to ${info.BED_NO} </h1>`
    }
  }
 
}

async function searchBeds(){
  let info = {
    SPECIALITY:appointment[0].SPECIALITY,
    HID:localStorage.getItem('HID')
  };
  let result = await fetch("http://localhost:4200/receptionist/getEmptyBeds", {
      method: "POST",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    if(result.length==0){
      let div1 = document.getElementById("insert");
              div1.innerHTML="";
              div1.innerHTML += `<h1 style="color:red"> No Empty Beds Found In This Ward </h1>`
    }
    else{
      let div1 = document.getElementById("insert");
      div1.innerHTML = "";
      for(let i=0; i<result.length; i++){
        div1.innerHTML += `
            <div class="card text-white bg-success mb-3" style="max-width: 60rem;">
            <div class="card-header">
              <div class="row">
                  <div class="col-sm-4">
                  <p style="color:white"><i>Bed No:</i> ${result[i].BED_NO}</p>
                  </div>
                  <div class="col-sm-4">
                  <p style="color:white"><i>Ward Name:</i> ${result[i].WARD_NAME} bags</p>
                  </div>
                  <div class="col-sm-1">
                  </div>
                  <div class="col-sm-3">
                  <div class="btn-group" role="group" aria-label="Basic example">
                    <p hidden>${result[i].BED_NO}</p>
                    <button type="button" onclick="assignBed(this)"class="btn btn-dark">Assign Bed</button>
                  </div>
                  </div>
                  
              </div>
            </div>
          </div>
        `;
      }
    }
}


function test(result) {
  let div1 = document.getElementById("insert");
  div1.innerHTML="";

  for (i = 0; i < result.length; i++) {
    let divTemp = document.createElement("div");
    let src ;
    divTemp.innerHTML = `<div class="card mb-3 bg-success" style="max-width: 900px;">
    <div class="row g-0">
      <div class="col-md-4">
      <img src="images/appointment.png" class="img-fluid rounded-start" height="50px" width="200px" alt="...">
      </div>
      <div class="col-md-8">
      <div class="card-body">
        <p hidden>${result[i].APPTID}<p>
        <p hidden>${result[i].TEST_NAME}<p>
        <h4 class="card-title">Appointment ID: ${result[i].APPTID}</h4>
        <p style="color:white" class = "card-text">Doctor Name: ${result[i].DOCTOR_NAME}<br>
        Speciality: ${result[i].SPECIALITY}</br>
        Patient Name: ${result[i].PATIENT_NAME}</br>
        <i><b>Patient Should Be Assigned to a bed immediately</b></i></br>
        Appointment Date: ${result[i].APPT_DATE}</br>
        </p>
        <button type="button" class="btn btn-dark" onclick="searchBeds()">Search For Beds</button>
      </div>
      </div>
    </div>
    </div>`;
    div1.appendChild(divTemp);
  }

}
