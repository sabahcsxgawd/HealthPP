async function logout(){
  localStorage.clear();
  let result = await fetch("http://localhost:4200/logout", {
      method: "DELETE"
    });
  window.location.replace('http://localhost:4200');
}

function settingName(){
  let setName = document.getElementById('setName');
  let name = localStorage.getItem('NAME');
  setName.innerText = `Welcome ${name}`;
  console.log(setName);
}

settingName();

async function start(){
    const info = {
        HID:localStorage.getItem('HID')
      };
    let result = await fetch("http://localhost:4200/receptionist/getAppointments", {
    method: "POST",
    body: JSON.stringify(info),
    headers: {
      "Content-Type": "application/json",
    },
  });
  result = await result.json();
  if(result.length!=0){
    let div1 = document.getElementById("insert");
  div1.innerHTML="";
  for (i = 0; i < result.length; i++) {
    let divTemp = document.createElement("div");
    let src ;
    divTemp.innerHTML = `<div class="card mb-3 bg-success" style="max-width: 800px;">
    <div class="row g-0">
      <div class="col-md-4">
      <img src="https://cdn1.vectorstock.com/i/1000x1000/14/80/doctor-web-icon-therapist-avatar-vector-18531480.jpg" class="img-fluid rounded-start" height="50px" width="200px" alt="...">
      </div>
      <div class="col-md-8">
            <div class="card-body">
            <p hidden>${result[i].APPTID}<p>
            <h4 class="card-title">Appointment ID: ${result[i].APPTID}</h4>
            <h5 class = "card-text">Prof. Dr.${result[i].DOCTOR_NAME}</h5>
            <p >${result[i].SPECIALITY} Specialist.</p>
            <p style="color:white"> Patient Name: ${result[i].PATIENT_NAME}<br>
                Appointment Date: ${result[i].APPT_DATE}<br>
                Appointment Time: ${result[i].APPT_TIME}
            </p>
            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
            <button type="button" onclick="confirmm(this)" class="btn btn-dark">Confirm</button>
            <button type="button" onclick="cancel(this)" class="btn btn-danger">Cancel</button>
            </div>
            </div>
      </div>
    </div>
    </div>`;
    div1.appendChild(divTemp);
  }
  }
  else{
    let div1 = document.getElementById("insert");
    div1.innerHTML="";
    div1.innerHTML = `<h1 style="color:red">No Appointment Request Found.....</h1>`;
  }
}

start();

async function confirmm(ref){
    let APPTID = ref.parentElement.parentElement.childNodes[1].innerText;
    let flag = confirm('Are you sure about approving this appointment?');
    if(flag){
        const info = {
            APPTID,
            REID:localStorage.getItem('EID')
          };
          let result = await fetch("http://localhost:4200/receptionist/confirmAppointment", {
            method: "POST",
            body: JSON.stringify(info),
            headers: {
              "Content-Type": "application/json",
            },
          });
          result = await result.json();
         location.reload();
    }
    else{

    }
}

async function cancel(ref){
    let APPTID = ref.parentElement.parentElement.childNodes[1].innerText;
     let flag = confirm('Are you sure about cancelling this appointment?');
    if(flag){
        const info = {
            APPTID
          };
          let result = await fetch("http://localhost:4200/receptionist/cancelAppointment", {
            method: "POST",
            body: JSON.stringify(info),
            headers: {
              "Content-Type": "application/json",
            },
          });
          result = await result.json();
         location.reload();
    }
    else{
        
    }
}