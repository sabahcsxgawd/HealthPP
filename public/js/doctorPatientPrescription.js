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


async function search() {
    let id = localStorage.getItem('APPT_ID');
    console.log(id);
    let info = {
        APPT_ID:id
    };
    
    let result = await fetch("http://localhost:4200/doctor/getSinglePrescription", {
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
        div1.innerHTML += `<h1 style="color:red"> No Appointment History Found </h1>`;
    }
    else{
        //console.log(result);
        test(result);
    }
}

search();



async function test(result){
    
    let div1 = document.getElementById("insert");
    div1.innerHTML="";
    div1.innerHTML=`
    <div class="card w-90">
    <div class="card-body">
        <div class="card text-white bg-success mb-3" style="max-width: 75rem;">
            <div class="card-header">Prescription</div>
            <div class="row">
                <div class="col-sm-9">
                    <div class="card-body">
                        <h5 class="card-title">Health++</h5>
                        <p class="card-text">
                          ${result[0].BRANCH} Branch </br>
                          Contact Us: ${result[0].HOSPITAL_PHONE}
                        </p>
                    </div>
                </div>
                <div class="col-sm-2">
                </div>
            </div>
          </div>

          <div class="card text-white bg-success mb-3" style="max-width: 75rem;">
            <div class="card-header">Doctor's Info</div>
          </div>

          <div class="card border-success mb-3" style="max-width: 75rem; align-content: center;">
            <div class="card-body text-success">
              <h5 class="card-title">Prof Dr. ${result[0].DOCTOR_NAME}</h5>
              <p class="card-text">${result[0].SPECIALITY} SPECIALIST</br>
                ${result[0].DEGREES}<br>
                Contact No: ${result[0].DOCTOR_PHONE}<br>		
              </p>
            </div>
          </div>

          <div class="card text-white bg-success mb-3" style="max-width: 75rem;">
            <div class="card-header">Patient's Info</div>
          </div>

          <div class="card border-success mb-3" style="max-width: 75rem; align-content: center;">
            <div class="card-body text-success">
              <h5 class="card-title">${result[0].PATIENT_NAME}</h5>
              <p class="card-text">Age: ${result[0].PATIENT_AGE} Years</br>
                Blood Group: ${result[0].BLOOD_GROUP}ve<br>
                Contact No: ${result[0].PATIENT_PHONE}<br>		
              </p>
            </div>
          </div>

          <div class="card text-white bg-success mb-3" style="max-width: 75rem;">
            <div class="card-header">Required Tests</div>
          </div>

          <div class="card border-success mb-3" style="max-width: 75rem; align-content: center;">
            <div class="card-body text-success">
              <p class="card-text">
              ${result[0].TEST_NAMES}
              </p>
            </div>
          </div>

          <div class="card text-white bg-success mb-3" style="max-width: 75rem;">
            <div class="card-header">Suggested Medicines</div>
          </div>

          <div class="card border-success mb-3" style="max-width: 75rem; align-content: center;">
            <div class="card-body text-success">
              <p class="card-text">
              ${result[0].MEDNAME}	
              </p>
            </div>
          </div>

          <div class="card text-white bg-success mb-3" style="max-width: 75rem;">
            <div class="card-header">Remarks</div>
          </div>

          <div class="card border-success mb-3" style="max-width: 75rem; align-content: center;">
            <div class="card-body text-success">
              <p class="card-text">
              ${result[0].REMARKS}
              </p>
            </div>
          </div>

          <div class="card text-white bg-success mb-3" style="max-width: 75rem;">
            <div class="card-header">Advice</div>
          </div>

          <div class="card border-success mb-3" style="max-width: 75rem; align-content: center;">
            <div class="card-body text-success">
              <p class="card-text">
              ${result[0].ADVICE}
              </p>
            </div>
          </div>
    </div>
  </div>
    `;


}