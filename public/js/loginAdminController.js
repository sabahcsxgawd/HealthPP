// Example starter JavaScript for disabling form submissions if there are invalid fields

var forms;
let email, password;

(async function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  forms = document.querySelectorAll(".needs-validation");

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
        if (form.email.checkValidity()) {
          email = document.getElementById("email");
          console.log(email.value);
        }
        if (form.password.checkValidity()) {
          password = document.getElementById("password");
          console.log(password.value);
        }
        if (form.email.checkValidity() && form.password.checkValidity()) {
          login(email.value, password.value);
        }
      },
      false
    );
  });
})();

let login = async function (email, password) {
  const loginInfo = {
    email,
    password,
  };
  let result = await fetch("http://localhost:4200/doLoginAdmin", {
    method: "POST",
    body: JSON.stringify(loginInfo),
    headers: {
      "Content-Type": "application/json",
    },
  });
  //   let gg = await result.json();
  result = await result.json();
  if(result.success){
    localStorage.clear();
    localStorage.setItem('EMAIL',result.EMAIL);
    localStorage.setItem('AID',result.AID);
    localStorage.setItem('NAME',result.NAME);
    window.location.replace("http://localhost:4200/admin/home");
  }
  else{
      let alert = document.getElementById('alert');
      let div = document.createElement('div');
      div.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Authentication Error!</strong> You should check in on some of those fields below.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
      alert.appendChild(div);
  }
};

let button = document.getElementById("submitButton");
