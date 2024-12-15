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
    let branch = document.getElementById("branch").value;
    let ambulanceType = document.getElementById("ambulanceType").value;
    if (branch.value === "" || ambulanceType.value === "") {
        let div1 = document.getElementById("insert");
        div1.innerHTML="";
        alert("Select The options correctly..");
    } else {
      let info = {
        BRANCH: branch,
        AMB_TYPE: ambulanceType
      };
      let result = await fetch("http://localhost:4200/patient/getAmbulances", {
          method: "POST",
          body: JSON.stringify(info),
          headers: {
            "Content-Type": "application/json",
          },
        });
        result = await result.json();
        //console.log(result);
        if(result.length==0){
          let div1 = document.getElementById("insert");
          div1.innerHTML="";
          div1.innerHTML += `<h1 style="color:red"> No Ambulance Found </h1>`;
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
      divTemp.innerHTML = `<div class="card mb-3 bg-success" style="max-width: 950px;">
      <div class="row g-0">
        <div class="col-md-4">
        <img src="images/ambulance.png" class="img-fluid rounded-start" height="30px" width="200px" alt="...">
        </div>
        <div class="col-md-8">
        <div class="card-body">
          <h4 class="card-title"><i class="fa fa-ambulance" aria-hidden="true"></i>  <b><i>Type: ${result[i].AMB_TYPE}</i></b></h4>
          <h5 class = "card-text"><b><i><i class="fa fa-phone" aria-hidden="true"></i>  Hotline: ${result[i].AMB_PHONE}</i></b></h5>
          <p style="color:white">Manager Name: ${result[i].AMB_MANAGER_NAME} </br>
          FROM ${result[i].HOSPITAL_NAME} , ${result[i].BRANCH} Branch</p>
        </div>
        </div>
      </div>
      </div>`;
      div1.appendChild(divTemp);
    }
  }




async function start(){
    let branch = await fetch("http://localhost:4200/patient/getBranch", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    });
    branch = await branch.json();
    let branchStr = "";
    for(let i=0;i<branch.length;i++){
        branchStr += `<option value="${branch[i].BRANCH}">${branch[i].BRANCH}</option>`;
    }

    let ambulanceType = await fetch("http://localhost:4200/patient/getAmbulanceType", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    });
    ambulanceType = await ambulanceType.json();
    let ambulanceTypeStr = "";
    for(let i=0;i<ambulanceType.length;i++){
        ambulanceTypeStr += `<option value="${ambulanceType[i].AMB_TYPE}">${ambulanceType[i].AMB_TYPE}</option>`;
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
                <label style="color: #098927" for="ambulanceType">Ambulance Type</label>
                <select id="ambulanceType" style="color: #098927" value="" class="form-control border-success" id="branch">
                    <option selected disabled>Select</option>
                        ${ambulanceTypeStr}
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
