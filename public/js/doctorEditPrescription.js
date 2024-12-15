async function logout(){
    localStorage.clear();
    let result = await fetch("http://localhost:4200/logout", {
        method: "DELETE"
      });
    window.location.replace('http://localhost:4200');
}

function settingName(){
    let setName = document.getElementById('setName');
    let name = localStorage.getItem('NAME');
    setName.innerText = `Welcome Dr. ${name}`;
    console.log(setName);
}

settingName();