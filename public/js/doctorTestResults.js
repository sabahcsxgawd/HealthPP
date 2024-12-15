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
          let result = await fetch("http://localhost:4200/doctor/getTestResults", {
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
              div1.innerHTML += `<h1 style="color:red"> No Test Result Found </h1>`
            }
            else{
              test(result);
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
        <img src="images/testResult.png" class="img-fluid rounded-start" height="50px" width="200px" alt="...">
        </div>
        <div class="col-md-8">
        <div class="card-body">
          <p hidden>${result[i].APPTID}<p>
          <p hidden>${result[i].TEST_NAME}<p>
          <h4 class="card-title">Test Name: ${result[i].TEST_NAME}</h4>
          <p style="color:white" class = "card-text">${result[i].LABNAME} Laboratory<br>
          ${result[i].HOSPITAL_NAME}, ${result[i].BRANCH}</br>
          Result Published: ${result[i].TEST_DATE}</br>
          Appointment Date: ${result[i].APPT_DATE}</br>
          </p>
          <button type="button" class="btn btn-dark" onclick="clicked(this)">View Test Result</button>
        </div>
        </div>
      </div>
      </div>`;
      div1.appendChild(divTemp);
    }

  }


  function clicked(ref) {
    localStorage.setItem('APPT_ID',ref.parentElement.childNodes[1].innerText);
    localStorage.setItem('TEST_NAME',ref.parentElement.childNodes[3].innerText);
    window.location.replace("http://localhost:4200/doctor/singleTestResult");
  }