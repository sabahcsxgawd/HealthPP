async function logout(){
    localStorage.clear();
    let result = await fetch("http://localhost:4200/logout", {
        method: "DELETE"
      });
    window.location.replace('http://localhost:4200');
}

function settingName() {
  let setName = document.getElementById("setName");
  let name = localStorage.getItem("NAME");
  setName.innerText = `Welcome ${name}`;
  //console.log(setName);
}

settingName();


async function search(){
  let info = {
      PID:localStorage.getItem('PID')
    };
    let result = await fetch("http://localhost:4200/admin/getUnDoctors", {
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
        div1.innerHTML += `<h1 style="color:red"> No Approval Requests Found </h1>`;
      }
      else{
        test(result);
      }
}

search();

let result1;

async function approve(){
  let flag = confirm("Are You Sure Approving This?")
  if(flag){
    let info = {
      DID:localStorage.getItem('DID'),
      AID:localStorage.getItem('AID')
    }
    result1 = await fetch("http://localhost:4200/admin/doDoctorApprove", {
      method: "POST",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result1 = await result1.json();
    window.location.replace('http://localhost:4200/admin/approveDoctor');
  }
}

async function clicked(ref) {
  localStorage.setItem('DID',ref.parentElement.childNodes[1].innerText);
  let info = {
    DID:localStorage.getItem('DID')
  }
  result1 = await fetch("http://localhost:4200/admin/getUnDoctorSingle", {
    method: "POST",
    body: JSON.stringify(info),
    headers: {
      "Content-Type": "application/json",
    },
  });
  result1 = await result1.json();
  let div1 = document.getElementById("insert");
  div1.innerHTML="";
  for(let i=0;i<result1.length;i++){
    div1.innerHTML = `
    <div class="card w-90">
    <div class="card-body">
          <div class="card text-white bg-success mb-3" style="max-width: 75rem;">
            <div class="card-header">Doctor's Info</div>
          </div>

          <div class="card border-success mb-3" style="max-width: 75rem; align-content: center;">
            <div class="card-body text-success">
              <h5 class="card-title">Prof Dr. ${result1[0].DOCTOR_NAME}</h5>
              <p class="card-text">${result1[0].SPECIALITY} SPECIALIST</br>
                Degrees: ${result1[0].DEGREES}<br>
                Gender: ${result1[0].GENDER}<br>
                Age: ${result1[0].AGE}<br>
                Address: ${result1[0].ADDRESS}<br>
                Email: ${result1[0].EMAIL}<br>
                Contact No: ${result1[0].PHONE}<br>		
                Preferred Visiting Times: ${result1[0].VIS_TIMES}
              </p>
              <button type="button" class="btn btn-dark" onclick="approve()">Approve</button>
            </div>
          </div>
    </div>
  </div>
    
    `;

  }

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
      <img src="images/doctor.png" class="img-fluid rounded-start" height="50px" width="200px" alt="...">
      </div>
      <div class="col-md-8">
      <div class="card-body">
        <p hidden>${result[i].EID}<p>
        <h4 class="card-title">NID: ${result[i].EID}</h4>
        <p style="color:white" class = "card-text">Doctor Name: ${result[i].FIRST_NAME} ${result[i].LAST_NAME}<br>
        ${result[i].WARD_NAME} Specialist </br>
        ${result[i].ADDRESS}</br>
        Blood Group: ${result[i].BLOOD_GROUP}</br>
        </p>
        <button type="button" class="btn btn-dark" onclick="clicked(this)">Review</button>
      </div>
      </div>
    </div>
    </div>`;
    div1.appendChild(divTemp);
  }

}