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
  let appointment;


  async function release(ref){
    let flag = confirm('Are You Sure About Releasing This Patient?')
    if(flag){
      let info = {
        PID:appointment[0].PID,
      };
      let result = await fetch("http://localhost:4200/receptionist/doReleasePatient", {
        method: "POST",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if(result.success){
        let div1 = document.getElementById("insert");
        div1.innerHTML="";
        div1.innerHTML += `<h1 style="color:Green"> Patient has been successfully released from ${appointment[0].BED_NO} </h1>`
      }
    }
   
  }
  

  
function test(result) {
  let div1 = document.getElementById("insert");
  div1.innerHTML="";
  for(let i=0; i<result.length; i++){
    div1.innerHTML += `
        <div class="card text-white bg-success mb-3" style="max-width: 60rem;">
        <div class="card-header">
          <div class="row">
              <div class="col-sm-3">
              <p style="color:white"><i>Bed No:</i> ${result[i].BED_NO}</p>
              </div>
              <div class="col-sm-3">
              <p style="color:white"><i>Ward Name:</i> ${result[i].WARD_NAME}</p>
              </div>
              <div class="col-sm-3">
              <p style="color:white"><i>Patient NID:</i> ${result[i].PID}<br>
              <i>Admitted Date: ${result[i].ADMITTED_DATE}</i>                   
              </p>
              </div>
              <div class="col-sm-3">
              <div class="btn-group" role="group" aria-label="Basic example">
                <p hidden>${result[i].BED_NO}</p>
                <button type="button" onclick="release(this)"class="btn btn-dark">Release Patient</button>
              </div>
              </div>
              
          </div>
        </div>
      </div>
    `;
  }
}

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
          appointment = await fetch("http://localhost:4200/receptionist/getBedByPID", {
              method: "POST",
              body: JSON.stringify(info),
              headers: {
                "Content-Type": "application/json",
              },
            });
            appointment = await appointment.json();
            //console.log(result);
            if(appointment.length==0){
              let div1 = document.getElementById("insert");
              div1.innerHTML="";
              div1.innerHTML += `<h1 style="color:red"> This Patient isn't assigned to any bed.. </h1>`
            }
            else{
              test(appointment);
            }
    }
}



