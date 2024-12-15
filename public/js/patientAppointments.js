async function logout() {
  localStorage.clear();
  let result = await fetch("http://localhost:4200/logout", {
    method: "DELETE",
  });
  window.location.replace("http://localhost:4200");
}

function settingName() {
  let setName = document.getElementById("setName");
  let firstName = localStorage.getItem("FIRST_NAME");
  let lastName = localStorage.getItem("LAST_NAME");
  setName.innerText = `Welcome ${firstName} ${lastName}`;
  console.log(setName);
}

settingName();

async function search() {
  let branch = document.getElementById("branch").value;
  let speciality = document.getElementById("speciality").value;
  if (branch.value === "" || speciality.value === "") {
    alert("Select The options correctly..");
  } else {
    let docInfo = {
      BRANCH: branch,
      SPECIALITY: speciality,
    };
    let result = await fetch("http://localhost:4200/patient/getDoctor", {
      method: "POST",
      body: JSON.stringify(docInfo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    //console.log(result);
    if (result.length == 0) {
      let div1 = document.getElementById("insert");
      div1.innerHTML = "";
      alert("No Doctors Found!");
    } else {
      test(result);
    }
  }
}

function test(result) {
  let div1 = document.getElementById("insert");
  div1.innerHTML = "";

  for (i = 0; i < result.length; i++) {
    let divTemp = document.createElement("div");
    let src;
    divTemp.innerHTML = `<div class="card mb-3 bg-success" style="max-width: 800px;">
    <div class="row g-0">
      <div class="col-md-4">
      <img src="https://cdn1.vectorstock.com/i/1000x1000/14/80/doctor-web-icon-therapist-avatar-vector-18531480.jpg" class="img-fluid rounded-start" height="50px" width="200px" alt="...">
      </div>
      <div class="col-md-8">
      <div class="card-body">
        <h4 class="card-title">Prof. Dr. ${result[i].NAME}</h4>
        <h5 class = "card-text">${result[i].DEGREE}</h5>
        <p hidden>${result[i].EID}<p>
        <p >${result[i].SPECIALITY} Specialist.</br>
        Working at ${result[i].HOSPITAL_NAME}</p>
        <button type="button" class="btn btn-dark" onclick="clicked(this)">Book Appointment</button>
      </div>
      </div>
    </div>
    </div>`;
    div1.appendChild(divTemp);
  }
}

function clicked(ref) {
  localStorage.setItem("EID", ref.parentElement.childNodes[5].innerText);
  window.location.replace("http://localhost:4200/patient/confirmAppointment");
}


async function start() {
  let branch = await fetch("http://localhost:4200/patient/getBranch", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  branch = await branch.json();
  let branchStr = "";
  for (let i = 0; i < branch.length; i++) {
    branchStr += `<option value="${branch[i].BRANCH}">${branch[i].BRANCH}</option>`;
  }

  let speciality = await fetch(
    "http://localhost:4200/patient/getSpeciality",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  speciality = await speciality.json();
  let specialityStr = "";
  for (let i = 0; i < speciality.length; i++) {
    specialityStr += `<option value="${speciality[i].SPECIALITY}">${speciality[i].SPECIALITY}</option>`;
  }

  let divSearch = document.getElementById('search');
    divSearch.innerHTML = "";
    divSearch.innerHTML += `
        <form>
        <div class="row">
            <div class="col-sm-5" style="border-color:#098927;">
                <label style="color: #098927" for="branch">Select Branch Name</label>
                <select id = "branch" style="color: #098927;border-color: #098927;" value="" class="border-success form-control " id="branch">
                    <option selected disabled>Select</option>
                        ${branchStr}
                </select>
            </div>
            <div class="col-sm-5">
                <label style="color: #098927" for="speciality">Speciality</label>
                <select id="speciality" style="color: #098927" value="" class="form-control border-success" id="branch">
                    <option selected disabled>Select</option>
                        ${specialityStr}
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-3">
                <label style="color: #098927" for="branch"></label>
                <button id="searchButton" onclick="search()" type="button" class ="btn btn-success form-control">Search</button>
                
            </div>
        </div>
        </form>
    `;
}


start();
