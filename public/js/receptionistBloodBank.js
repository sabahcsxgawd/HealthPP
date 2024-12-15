async function logout() {
  localStorage.clear();
  let result = await fetch("http://localhost:4200/logout", {
    method: "DELETE",
  });
  window.location.replace("http://localhost:4200");
}

function settingName() {
  let setName = document.getElementById("setName");
  let name = localStorage.getItem("NAME");
  setName.innerText = `Welcome ${name}`;
  console.log(setName);
}

settingName();

function addBlood(ref){
  localStorage.setItem('Blood_Group', ref.parentNode.childNodes[1].innerText);
 window.location.replace("http://localhost:4200/receptionist/addBlood");
}

function giveaway(ref){

  localStorage.setItem('Blood_Group', ref.parentNode.childNodes[1].innerText);
 window.location.replace("http://localhost:4200/receptionist/giveaway");
}

async function start() {
  
  let result = await fetch("http://localhost:4200/receptionist/getBloodBagCount", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
  result = await result.json();
  let div1 = document.getElementById("insert");
  div1.innerHTML = "";
  for(let i=0; i<result.length; i++){
    div1.innerHTML += `
        <div class="card text-white bg-success mb-3" style="max-width: 60rem;">
        <div class="card-header">
          <div class="row">
              <div class="col-sm-4">
              <p style="color:white"><i>Blood Group:</i> ${result[i].BLOOD_GROUP}</p>
              </div>
              <div class="col-sm-4">
              <p style="color:white"><i>Currently Available:</i> ${result[i].COUNT} bags</p>
              </div>
              <div class="col-sm-1">
              </div>
              <div class="col-sm-3">
              <div class="btn-group" role="group" aria-label="Basic example">
                <p hidden>${result[i].BLOOD_GROUP}</p>
                <button type="button" onclick="addBlood(this)"class="btn btn-danger">Add Blood</button>
                <button type="button" onclick="giveaway(this)"class="btn btn-dark">Giveaway</button>
              </div>
              </div>
              
          </div>
        </div>
      </div>
    `;
  }
}

start();
