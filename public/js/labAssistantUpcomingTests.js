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


async function search(){
    let info = {
        LABNAME:localStorage.getItem('LABNAME'),
        HID:localStorage.getItem('HID')
      };
      let result = await fetch("http://localhost:4200/labAssistant/getTests", {
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
          alert('No Upcoming Tests Found!');
        }
        else{
          test(result);
        }
}

search();


function clicked(ref) {
    localStorage.setItem('APPTID',ref.parentElement.childNodes[1].innerText.trim());
    localStorage.setItem('TEST_NAME',ref.parentElement.childNodes[3].innerText.trim());
    window.location.replace("http://localhost:4200/labAssistant/giveTestResult");
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
        <img src="images/testResult.png" class="img-fluid rounded-start" height="50px" width="200px" alt="...">
        </div>
        <div class="col-md-8">
        <div class="card-body">
          <p hidden>${result[i].APPTID}<p>
          <p hidden>${result[i].TEST_NAME}</p>
          <h4 class="card-title">Appointment ID: ${result[i].APPTID}</h4>
          <p style="color:white" class = "card-text"><i><b>Test Name: </b></i> ${result[i].TEST_NAME}<br>
          <i><b>Lab Name: </b></i> ${result[i].LABNAME} </br>
          <i><b>Patient NID: </b></i> ${result[i].PID}</br>
          <i><b>Appointment Time: </b></i>${result[i].APPT_TIME}</br>
          <i><b>Appointment Date: </b></i>${result[i].APPT_DATE}</br>
          </p>
          <button type="button" class="btn btn-dark" onclick="clicked(this)">Edit Test Results</button>
        </div>
        </div>
      </div>
      </div>`;
      div1.appendChild(divTemp);
    }

  }