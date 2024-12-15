// Example starter JavaScript for disabling form submissions if there are invalid fields

function getAge(dateString) {
  let ageInMilliseconds = new Date() - new Date(dateString);
  return Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365); // convert to years
}

var forms;

let labAssistantSignUpInfo = {

};


async function start(){
  
  let result = await fetch("http://localhost:4200/reg/getLabName", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
  let labnameStr = "";
  for(let i=0; i<result.length; i++){
    labnameStr += `  <option value="${result[i].LABNAME}">${result[i].LABNAME}</option>`
  }
  let div1 = document.getElementById('labDiv');
  div1.innerHTML = "";
  div1.innerHTML += `
      <label for="exampleFormControlInput4" class="form-label" style="color:#3ca507;">Laboratory</label>
      <select id="lab" class="form-select form-select-sm border-success"
          aria-label=".form-select-sm example" required>
          <option selected disabled>Select</option>
          ${labnameStr}           
      </select>
      <div class="invalid-feedback">
          Please Provide a valid Laboratory Name
      </div>
  `;

}

start();


(async function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  forms = document.querySelectorAll(".needs-validation");

  let chkArr = new Array(13).fill(false);

  // Loop over them and prevent submission

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
        event.preventDefault();

        if (form.firstName.checkValidity()) {
          let firstName = document.getElementById("firstName");
          labAssistantSignUpInfo.firstName = firstName.value;
          chkArr[0] = true;
        }

        if (form.lastName.checkValidity()) {
          let lastName = document.getElementById("lastName");
          labAssistantSignUpInfo.lastName = lastName.value;
          chkArr[1] = true;
        }


        if (form.nid.checkValidity()) {
          let nid = document.getElementById("nid");
          labAssistantSignUpInfo.nid = nid.value;
          chkArr[2] = true;
        }


        if (form.email.checkValidity()) {
          let email = document.getElementById("email");
          labAssistantSignUpInfo.email = email.value;
          chkArr[3] = true;
        }


        if (form.phoneNumber.checkValidity()) {
          let phoneNumber = document.getElementById("phoneNumber");
          labAssistantSignUpInfo.phoneNumber = phoneNumber.value;
          chkArr[4] = true;
        }

        if (form.dob.checkValidity()) {
          let dob = document.getElementById("dob");
          labAssistantSignUpInfo.dob = dob.value;
          chkArr[5] = true;
        }


        if (form.bloodGroup.checkValidity() && form.bloodGroup.value != 'Select') {
          let bloodGroup = document.getElementById("bloodGroup");
          labAssistantSignUpInfo.bloodGroup = bloodGroup.value;
          chkArr[6] = true;
        }


        if (form.gender.checkValidity() && form.gender.value != 'Select') {
          let gender = document.getElementById("gender");
          labAssistantSignUpInfo.gender = gender.value;
          chkArr[7] = true;
        }


        if (form.address.checkValidity()) {
          let address = document.getElementById("address");
          labAssistantSignUpInfo.address = address.value;
          chkArr[8] = true;
        }


        if (form.password.checkValidity()) {
          let password = document.getElementById("password");
          labAssistantSignUpInfo.password = password.value;
          chkArr[9] = true;
        }


        if (form.retypePassword.checkValidity()) {
          let retypePassword = document.getElementById("retypePassword");
          labAssistantSignUpInfo.retypePassword = retypePassword.value;
          chkArr[10] = true;
        }


        if (form.flexCheckDefault.checkValidity()) {
          let flexCheckDefault = document.getElementById("flexCheckDefault");
          labAssistantSignUpInfo.flexCheckDefault = flexCheckDefault.value;
          chkArr[11] = true;
        }

        if (form.lab.checkValidity() && form.lab.value != 'Select') {
          let lab = document.getElementById("lab");
          labAssistantSignUpInfo.lab = lab.value;
          chkArr[12] = true;
        }

        let good = true;

        for (let i = 0; i < chkArr.length; i++) {
          good &= chkArr[i];
        }

        if (good) {

          let age = getAge(new Date(labAssistantSignUpInfo.dob));

          if (age < 18) {
            good = false;
            alert('Invalid Date of Birth');
          }

          else {
            labAssistantSignUpInfo.age = age;
          }
          
          if (!(labAssistantSignUpInfo.password === labAssistantSignUpInfo.retypePassword)) {
            good = false;
            alert('Password does not match');
          }
          else {
            if (good) {
              login(labAssistantSignUpInfo);
            }
            
          }

        }

        else {
          alert('Fill the registration form correctly, give proper inputs and select the necessary options');
        }

      },
      false
    );
  });
})();

let login = async function (labAssistantSignUpInfo) {

  console.log(labAssistantSignUpInfo);
  console.log('--------------------');

  let result = await fetch("http://localhost:4200/reg/doRegLabAssistant", {
    method: "POST",
    body: JSON.stringify(labAssistantSignUpInfo),
    headers: {
      "Content-Type": "application/json",
    },
  });
  result = await result.json();
  if(result.success) {
    let flag = confirm('Your Registration is pending. Please wait for admin approval by checking your email.');
    if(flag) {
      window.location.replace("http://localhost:4200/");
    }
  }
  else {
    console.log(result);
    alert(`${result.message}`);
  }
};

let button = document.getElementById("submitButton");
