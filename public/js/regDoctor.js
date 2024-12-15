// Example starter JavaScript for disabling form submissions if there are invalid fields

function getAge(dateString) {
  let ageInMilliseconds = new Date() - new Date(dateString);
  return Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365); // convert to years
}

var forms;

let doctorSignUpInfo = {

};


async function start(){
  
  let result = await fetch("http://localhost:4200/reg/getDocSpeciality", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
  let specialityStr = "";
  for(let i=0; i<result.length; i++){
    specialityStr += `  <option value="${result[i].SPECIALITY}">${result[i].SPECIALITY}</option>`
  }
  let div1 = document.getElementById('specialityDiv');
  div1.innerHTML = "";
  div1.innerHTML += `<label for="exampleFormControlInput4" class="form-label"
        style="color:#3ca507;">Speciality</label>
      <select id="speciality" class="form-select form-select-sm border-success"
        aria-label=".form-select-sm example" required>
        <option selected disabled>Select</option>
        ${specialityStr}
        </select>
        <div class="invalid-feedback">
            Please Provide a valid Speciality
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
          doctorSignUpInfo.firstName = firstName.value;
          chkArr[0] = true;
        }

        if (form.lastName.checkValidity()) {
          let lastName = document.getElementById("lastName");
          doctorSignUpInfo.lastName = lastName.value;
          chkArr[1] = true;
        }


        if (form.nid.checkValidity()) {
          let nid = document.getElementById("nid");
          doctorSignUpInfo.nid = nid.value;
          chkArr[2] = true;
        }


        if (form.email.checkValidity()) {
          let email = document.getElementById("email");
          doctorSignUpInfo.email = email.value;
          chkArr[3] = true;
        }


        if (form.phoneNumber.checkValidity()) {
          let phoneNumber = document.getElementById("phoneNumber");
          doctorSignUpInfo.phoneNumber = phoneNumber.value;
          chkArr[4] = true;
        }

        if (form.dob.checkValidity()) {
          let dob = document.getElementById("dob");
          doctorSignUpInfo.dob = dob.value;
          chkArr[5] = true;
        }


        if (form.bloodGroup.checkValidity() && form.bloodGroup.value != 'Select') {
          let bloodGroup = document.getElementById("bloodGroup");
          doctorSignUpInfo.bloodGroup = bloodGroup.value;
          chkArr[6] = true;
        }


        if (form.gender.checkValidity() && form.gender.value != 'Select') {
          let gender = document.getElementById("gender");
          doctorSignUpInfo.gender = gender.value;
          chkArr[7] = true;
        }


        if (form.address.checkValidity()) {
          let address = document.getElementById("address");
          doctorSignUpInfo.address = address.value;
          chkArr[8] = true;
        }


        if (form.password.checkValidity()) {
          let password = document.getElementById("password");
          doctorSignUpInfo.password = password.value;
          chkArr[9] = true;
        }


        if (form.retypePassword.checkValidity()) {
          let retypePassword = document.getElementById("retypePassword");
          doctorSignUpInfo.retypePassword = retypePassword.value;
          chkArr[10] = true;
        }


        if (form.flexCheckDefault.checkValidity()) {
          let flexCheckDefault = document.getElementById("flexCheckDefault");
          doctorSignUpInfo.flexCheckDefault = flexCheckDefault.value;
          chkArr[11] = true;
        }

        if (form.speciality.checkValidity() && form.speciality.value != 'Select') {
          let speciality = document.getElementById("speciality");
          doctorSignUpInfo.speciality = speciality.value;
          chkArr[12] = true;
        }

        let good = true;

        for (let i = 0; i < chkArr.length; i++) {
          good &= chkArr[i];
        }

        if (good) {

          let fromVisTime = [];
          let toVisTime = [];

          for (let i = 0; i < document.querySelectorAll('.visTime').length; i++) {
            if (document.querySelectorAll('.visTime')[i].checked) {
              fromVisTime.push(document.querySelectorAll('.visTime')[i].value.split(' - ')[0]);
              toVisTime.push(document.querySelectorAll('.visTime')[i].value.split(' - ')[1]);
            }
          }

          if (fromVisTime.length < 1) {
            good = false;
            alert('Please Choose Suitable Visiting Time/Times');
          }

          else {
            doctorSignUpInfo.fromVisTime = fromVisTime;
            doctorSignUpInfo.toVisTime = toVisTime;
          }

          let age = getAge(new Date(doctorSignUpInfo.dob));

          if (age < 18) {
            good = false;
            alert('Invalid Date of Birth');
          }

          else {
            doctorSignUpInfo.age = age;
          }

          let degrees = []
          let degreeElem = document.getElementById('degreeDiv');
          for (let i = 1; i < degreeElem.childElementCount; i++) {
            degrees.push(degreeElem.children[i].children[1].value);
          }

          if (degrees.length < 1) {
            good = false;
            alert('Not enough Degrees');
          }

          else {
            // degrees = Array.from(degrees);
            doctorSignUpInfo.degrees = degrees;
          }

          if (!(doctorSignUpInfo.password === doctorSignUpInfo.retypePassword)) {
            good = false;
            alert('Password does not match');
          }
          else {
            if (good) {
              login(doctorSignUpInfo);
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

let login = async function (doctorSignUpInfo) {

  console.log(doctorSignUpInfo);
  console.log('--------------------');

  let result = await fetch("http://localhost:4200/reg/doRegDoctor", {
    method: "POST",
    body: JSON.stringify(doctorSignUpInfo),
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
