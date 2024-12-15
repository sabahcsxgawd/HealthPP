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


async function search() {
    let id = localStorage.getItem('APPT_ID');
    let name = localStorage.getItem('TEST_NAME');
    console.log(id);
    let info = {
        APPT_ID:id,
        TEST_NAME:name
    };
    
    let result = await fetch("http://localhost:4200/patient/getTestResult", {
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
        alert('No Test Result Found!');
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
            <div class="card-header">Test Results</div>
            <div class="row">
                <div class="col-sm-9">
                    <div class="card-body">
                        <h5 class="card-title">Health++</h5>
                        <p class="card-text">
                        ${result[0].BRANCH} Branch </br>
                        Contact Us:  ${result[0].HOSPITAL_PHONE}
                        </p>
                    </div>
                </div>
                <div class="col-sm-2">
                </div>
            </div>
        </div>

        <div class="card text-white bg-success mb-3" style="max-width: 75rem;">
            <div class="card-header">Test Information</div>
        </div>

        <div class="card border-success mb-3" style="max-width: 75rem; align-content: center;">
            <div class="card-body text-success">
              <h5 class="card-title"> ${result[0].LABNAME} Laboratory</h5>
              <p class="card-text">Uploaded By: Lab Assistant  ${result[0].LAB_ASST_NAME}</br>
                Test Name:  ${result[0].TEST_NAME}<br>
                Test Date: 	${result[0].TEST_DATE}<br>
                Appointment Date:  ${result[0].APPT_DATE}
              </p>
            </div>
          </div>
        
          <div class="card text-white bg-success mb-3" style="max-width: 75rem;">
            <div class="card-header">Patient's Info</div>
          </div>

          <div class="card border-success mb-3" style="max-width: 75rem; align-content: center;">
            <div class="card-body text-success">
              <h5 class="card-title"> ${result[0].PATIENT_NAME}</h5>
              <p class="card-text">Age:  ${result[0].AGE} Years</br>
                Blood Group:  ${result[0].BLOOD_GROUP}ve<br>
                Contact No:  ${result[0].PHONE}<br>		
              </p>
            </div>
          </div>

          <div class="card text-white bg-success mb-3" style="max-width: 75rem;">
            <div class="card-header">Test Result</div>
          </div>

          <div class="card border-success mb-3" style="max-width: 75rem; align-content: center;">
            <div class="card-body text-success">
              <p class="card-text">
              ${result[0].RESULTS}
              </p>
            </div>
          </div>



</div>
    `;
}