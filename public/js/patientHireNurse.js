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