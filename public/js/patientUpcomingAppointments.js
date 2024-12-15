async function logout(){
  localStorage.clear();
  let result = await fetch("http://localhost:4200/logout", {
      method: "DELETE"
    });
  window.location.replace('http://localhost:4200');
}

function settingName(){
    let setName = document.getElementById('setName');
    let firstName = localStorage.getItem('FIRST_NAME');
    let lastName = localStorage.getItem('LAST_NAME')
    setName.innerText = `Welcome ${firstName} ${lastName}`;
    console.log(setName);
}

settingName();


async function search(){
    let info = {
        PID:localStorage.getItem('PID')
      };
      let result = await fetch("http://localhost:4200/patient/getUpcomingAppointments", {
          method: "POST",
          body: JSON.stringify(info),
          headers: {
            "Content-Type": "application/json",
          },
        });
        result = await result.json();
        console.log(result);
        if(result.length==0){
          let div1 = document.getElementById("insert");
          div1.innerHTML="";
          div1.innerHTML += `<h1 style="color:red"> No Upcoming Appointment Found </h1>`;
        }
        else{
          test(result);
        }
}

search();


function test(result) {
    let div1 = document.getElementById("insert");
    div1.innerHTML="";
  
    for (i = 0; i < result.length; i++) {
      let divTemp = document.createElement("div");
      let src ;
      divTemp.innerHTML = `<div class="card mb-3 bg-success" style="max-width: 800px;">
      <div class="row g-0">
        <div class="col-md-4">
        <img src="images/editPrescription.png" class="img-fluid rounded-start" height="50px" width="200px" alt="...">
        </div>
        <div class="col-md-8">
        <div class="card-body">
          <p hidden>${result[i].APPTID}<p>
          <h4 class="card-title">Appointment ID: ${result[i].APPTID}</h4>
          <p style="color:white" class = "card-text">Doctor Name: ${result[i].DOCTOR_NAME}<br>
          ${result[i].SPECIALITY} Specialist </br>
          ${result[i].DEGREES}</br>
          ${result[i].HOSPITAL_NAME}, ${result[i].BRANCH}</br>
          APPT_TIME: ${result[i].APPT_TIME}</br>
          APPT_DATE: ${result[i].APPT_DATE}</br>
          </p>
        </div>
        </div>
      </div>
      </div>`;
      div1.appendChild(divTemp);
    }

  }