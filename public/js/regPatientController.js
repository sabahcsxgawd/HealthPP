// Example starter JavaScript for disabling form submissions if there are invalid fields

function getMonthFromString(mon) {
  return new Date(Date.parse(mon + " 1, 2012")).getMonth();
}

function getAge(date) {
  let today = new Date();
  let birthDate = date;
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

var forms;

let patientLoginInfo = {

};

(async function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  forms = document.querySelectorAll(".needs-validation");

  let chkArr = new Array(14).fill(false);

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
          patientLoginInfo.firstName = firstName.value;
          chkArr[0] = true;
          console.log(firstName.value);
        }
        if (form.lastName.checkValidity()) {
          let lastName = document.getElementById("lastName");
          patientLoginInfo.lastName = lastName.value;
          chkArr[1] = true;
          console.log(lastName.value);
        }
        if (form.email.checkValidity()) {
          let email = document.getElementById("email");
          patientLoginInfo.email = email.value;
          chkArr[2] = true;
          console.log(email.value);
        }
        if (form.phoneNumber.checkValidity()) {
          let phoneNumber = document.getElementById("phoneNumber");
          patientLoginInfo.phoneNumber = phoneNumber.value;
          chkArr[3] = true;
          console.log(phoneNumber.value);
        }
        if (form.date.checkValidity()) {
          let date = document.getElementById("date");
          patientLoginInfo.date = date.value;
          chkArr[4] = true;
          console.log(date.value);
        }
        if (form.month.checkValidity()) {
          let month = document.getElementById("month");
          patientLoginInfo.month = month.value;
          chkArr[5] = true;
          console.log(month.value);
        }
        if (form.year.checkValidity()) {
          let year = document.getElementById("year");
          patientLoginInfo.year = year.value;
          chkArr[6] = true;
          console.log(year.value);
        }
        if (form.bloodGroup.checkValidity()) {
          let bloodGroup = document.getElementById("bloodGroup");
          patientLoginInfo.bloodGroup = bloodGroup.value;
          chkArr[7] = true;
          console.log(bloodGroup.value);
        }
        if (form.gender.checkValidity()) {
          let gender = document.getElementById("gender");
          patientLoginInfo.gender = gender.value;
          chkArr[8] = true;
          console.log(gender.value);
        }
        if (form.address.checkValidity()) {
          let address = document.getElementById("address");
          patientLoginInfo.address = address.value;
          chkArr[9] = true;
          console.log(address.value);
        }
        if (form.password.checkValidity()) {
          let password = document.getElementById("password");
          patientLoginInfo.password = password.value;
          chkArr[10] = true;
          console.log(password.value);
        }
        if (form.retypePassword.checkValidity()) {
          let  retypePassword = document.getElementById("retypePassword");
          patientLoginInfo.retypePassword = retypePassword.value;
          chkArr[11] = true;
          console.log(retypePassword.value);
        }
        if (form.flexCheckDefault.checkValidity()) {
          // checkBox = document.getElementById("checkBox");
          // patientLoginInfo.checkBox = checkBox.value;
          chkArr[12] = true;
          // console.log(checkBox.value);
        }
        if (form.nid.checkValidity()) {
          let  nid = document.getElementById("nid");
          patientLoginInfo.nid = nid.value;
          chkArr[13] = true;
          console.log(nid.value);
        }
        // if (form.email.checkValidity() && form.password.checkValidity()) {
        //   login(email.value, password.value);
        // }

        let good = true;

        for(let i=0;i<12;i++) {
          good &= chkArr[i];
        }

        if(good) {
          if(patientLoginInfo.password === patientLoginInfo.retypePassword) {
            let d = new Date(patientLoginInfo.year, getMonthFromString(patientLoginInfo.month), patientLoginInfo.date, 0, 0, 0, 0);
            patientLoginInfo.dob = d;
            d = getAge(d);
            patientLoginInfo.age = d;
            console.log(patientLoginInfo.age);
            login(patientLoginInfo);
          }
          else {
             alert('Password does not match');
          }
          
        }

      },
      false
    );
  });
})();

let login = async function (patientLoginInfo) {
  // const loginInfo = {
  //   email,
  //   password,
  // };
  let result = await fetch("http://localhost:4200/reg/regPatient", {
    method: "POST",
    body: JSON.stringify(patientLoginInfo),
    headers: {
      "Content-Type": "application/json",
    },
  });
  //   let gg = await result.json();
  result = await result.json();
  if(result.success){
    localStorage.clear();
    confirm('Patient Has Been Successfully Added!');
    window.location.replace("http://localhost:4200/loginPatient");
  }
};

let button = document.getElementById("submitButton");
