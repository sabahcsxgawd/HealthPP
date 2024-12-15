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

  async function giveaway(ref){
    let flag = confirm("Are You Sure About donating this bag?");
    if(flag){
      let info = {
        BAGID:ref.parentNode.childNodes[1].innerText
      }
      let result = await fetch("http://localhost:4200/receptionist/bloodGiveaway", {
        method: "POST",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if(result.success){
        window.location.replace("http://localhost:4200/receptionist/giveaway")
      }
    }
  }

  async function start(){
    let info = {
      BLOOD_GROUP:localStorage.getItem('Blood_Group')
    }
    let result = await fetch("http://localhost:4200/receptionist/getBloodBags", {
      method: "POST",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    let div1 = document.getElementById("insert");
    div1.innerHTML = "";
    div1.innerHTML = `<p style="color:red">***<b><i>Showing ${Math.min(result.length,20)} Out of ${result.length} Entries </i></b></p>`;
    for(let i=0;i<Math.min(result.length,20);i++){
        div1.innerHTML += `
        <div class="card text-white bg-success mb-3" style="max-width: 60rem;">
        <div class="card-header">
          <div class="row">

                <div class="col-sm-3">
                    Bag ID: ${result[i].BAGID}
                </div>
                <div class="col-sm-3">
                    Blood Group: ${result[i].BLOOD_GROUP}
                </div>
                <div class="col-sm-3">
                    Added At: ${result[i].LAST_ADDED}
                </div>
                <div class="col-sm-1">
                </div>
                <div class="col-sm-1">
                <p hidden>${result[i].BAGID}</p>
                <button type="button" onclick="giveaway(this)"class="btn btn-dark">Giveaway</button>
                </div>


          </div>
        </div>
      </div>
        `;
    }
  }
  start();