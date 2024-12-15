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
    setName.innerText = `Welcome Dr. ${name}`;
    console.log(setName);
}

settingName();

async function search(){
    let info = {
        EID:localStorage.getItem('EID')
      };
      let result = await fetch("http://localhost:4200/doctor/getAppointments", {
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
          alert('No Appointments Found!');
        }
        else{
          test(result);
        }
}

search();


function clicked(ref) {
    localStorage.setItem('APPTID',ref.parentElement.childNodes[1].innerText);
    window.location.replace("http://localhost:4200/doctor/givePrescription");
}

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
          <p style="color:white" class = "card-text">Patient Name: ${result[i].PATIENT_NAME}<br>
          Age: ${result[i].AGE} Years </br>
          Blood Group: ${result[i].BLOOD_GROUP}</br>
          Phone: ${result[i].PHONE}</br>
          APPT_TIME: ${result[i].APPT_TIME}</br>
          APPT_DATE: ${result[i].APPT_DATE}</br>
          </p>
          <button type="button" class="btn btn-dark" onclick="clicked(this)">Edit Prescription</button>
        </div>
        </div>
      </div>
      </div>`;
      div1.appendChild(divTemp);
    }

  }