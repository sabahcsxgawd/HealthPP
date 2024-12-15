// Example starter JavaScript for disabling form submissions if there are invalid fields

function getAge(dateString) {
  let ageInMilliseconds = new Date() - new Date(dateString);
  return Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365); // convert to years
}

var forms;

let patientSignUpInfo = {

};


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
          patientSignUpInfo.firstName = firstName.value;
          chkArr[0] = true;
        }

        if (form.lastName.checkValidity()) {
          let lastName = document.getElementById("lastName");
          patientSignUpInfo.lastName = lastName.value;
          chkArr[1] = true;
        }


        if (form.nid.checkValidity()) {
          let nid = document.getElementById("nid");
          patientSignUpInfo.nid = nid.value;
          chkArr[2] = true;
        }


        if (form.email.checkValidity()) {
          let email = document.getElementById("email");
          patientSignUpInfo.email = email.value;
          chkArr[3] = true;
        }


        if (form.phoneNumber.checkValidity()) {
          let phoneNumber = document.getElementById("phoneNumber");
          patientSignUpInfo.phoneNumber = phoneNumber.value;
          chkArr[4] = true;
        }

        if (form.dob.checkValidity()) {
          let dob = document.getElementById("dob");
          patientSignUpInfo.dob = dob.value;
          chkArr[5] = true;
        }


        if (form.bloodGroup.checkValidity() && form.bloodGroup.value != 'Select') {
          let bloodGroup = document.getElementById("bloodGroup");
          patientSignUpInfo.bloodGroup = bloodGroup.value;
          chkArr[6] = true;
        }


        if (form.gender.checkValidity() && form.gender.value != 'Select') {
          let gender = document.getElementById("gender");
          patientSignUpInfo.gender = gender.value;
          chkArr[7] = true;
        }


        if (form.address.checkValidity()) {
          let address = document.getElementById("address");
          patientSignUpInfo.address = address.value;
          chkArr[8] = true;
        }


        if (form.password.checkValidity()) {
          let password = document.getElementById("password");
          patientSignUpInfo.password = password.value;
          chkArr[9] = true;
        }


        if (form.retypePassword.checkValidity()) {
          let retypePassword = document.getElementById("retypePassword");
          patientSignUpInfo.retypePassword = retypePassword.value;
          chkArr[10] = true;
        }


        if (form.flexCheckDefault.checkValidity()) {
          let flexCheckDefault = document.getElementById("flexCheckDefault");
          patientSignUpInfo.flexCheckDefault = flexCheckDefault.value;
          chkArr[11] = true;
        }

        let good = true;

        for (let i = 0; i < 12; i++) {
          good &= chkArr[i];
        }

        if (good) {

          let age = getAge(new Date(patientSignUpInfo.dob));

          if (age < 18) {
            good = false;
            alert('Invalid Date of Birth');
          }

          else {
            patientSignUpInfo.age = age;
          }
          
          if (!(patientSignUpInfo.password === patientSignUpInfo.retypePassword)) {
            good = false;
            alert('Password does not match');
          }
          else {
            if (good) {
              login(patientSignUpInfo);
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

let login = async function (patientSignUpInfo) {

  console.log(patientSignUpInfo);
  console.log('--------------------');

  let result = await fetch("http://localhost:4200/reg/doRegPatient", {
    method: "POST",
    body: JSON.stringify(patientSignUpInfo),
    headers: {
      "Content-Type": "application/json",
    },
  });
  result = await result.json();
  // result = JSON.stringify(result);
  if(result.success) {
    let flag = confirm('Your Registration has been completed. Login with your credentials.');
    if(flag) {
      window.location.replace("http://localhost:4200/");
    }
  }
  else {
    console.log(result);
    alert(`${result.message}`);
  }
  // let msg = JSON.stringify(msgJson);
  // if (msg === '"Successful"') { window.location.replace("http://localhost:4200/test1"); }
};

let button = document.getElementById("submitButton");
