let result = null;

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
    setName.innerText = `Welcome  ${name}`;
    console.log(setName);
}

settingName();

async function search(){
    let info = {
        APPTID:localStorage.getItem('APPTID'),
        TEST_NAME:localStorage.getItem('TEST_NAME')
      };
      result = await fetch("http://localhost:4200/labAssistant/getSingleTest", {
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
          alert('No Records Found!');
        }
        else{
          test(result);
        }
}

search();


async function uploadTestResult(){
    let testResult = document.getElementById('testResult').value;
    
    if(testResult.trim() ===""){
        alert('Please Fill Up The Test Result Part Properly');
    }
    else{
        let flag = confirm('Are You sure about uploading this test result?');
        if(flag){
            const info = {
                TEST_NAME:localStorage.getItem('TEST_NAME'),
                APPTID:localStorage.getItem('APPTID'),
                TEST_RESULT:testResult,
                EID:localStorage.getItem('EID')
            }
            let temp = await fetch("http://localhost:4200/labAssistant/uploadTestResult", {
                method: "POST",
                body: JSON.stringify(info),
                headers: {
                    "Content-Type": "application/json",
                },
                });
                temp = await temp.json();
                if(temp==="success"){
                window.location.replace("http://localhost:4200/labAssistant/upcomingTests");
                }
        }
    }
}


async function test(result) {
    let div1 = document.getElementById("insert");
    div1.innerHTML="";
  
    for (i = 0; i < result.length; i++) {
      let divTemp = document.createElement("div");
      let src ;
      divTemp.innerHTML = `<div class="card mb-3 bg-success" style="max-width: 1000px;">
      <div class="row g-0">
        <div class="col-md-3">
        <img src="images/testResult.png" class="img-fluid rounded-start" height="50px" width="200px" alt="...">
        </div>
        <div class="col-md-9">
        <div class="card-body">
          <p hidden>${result[i].APPTID}<p>
          <h4 class="card-title">Appointment ID: ${result[i].APPTID}</h4>
          <p style="color:white" class = "card-text">
          <b><i>Test Name: </i></b>${result[i].TEST_NAME}</br>
          <b><i>Patient Name: </i></b>${result[i].PATIENT_NAME}<br>
          <b><i>NID: </i></b>${result[i].PID}</br>
          <b><i>Age: </i></b>${result[i].AGE} Years </br>
          <b><i>Blood Group: </i></b>${result[i].BLOOD_GROUP}</br>
          <b><i>APPT_TIME: </i></b>${result[i].APPT_TIME}</br>
          <b><i>APPT_DATE: </i></b>${result[i].APPT_DATE}</br>
          </p>
          
          <form action="#0">
            <label for="testResult"><b>Test Results(File links are attached below)</b></label>
            <div class="grow-wrap">
                <textarea name="text" placeholder="Example: Hemoglobin Rate: 1.92% \n Xray Report: https://xrayReport.png" id="testResult" onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
            </div>
            

            <p>       </p>
            <p>       </p>
            <p>       </p>
            <button type="button" id="button" onClick="uploadTestResult()" class="btn btn-dark">Upload Test Result</button>

            </form>
                </div>
        </div>
      </div>
      </div>`;
      div1.appendChild(divTemp);
    }

  }