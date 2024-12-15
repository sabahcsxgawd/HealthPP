function swapElem(a, b) {
    let dummy = document.createElement("div")
    a.before(dummy)
    b.before(a)
    dummy.replaceWith(b)
}

function addDegreeField() {
    let elem = document.getElementById('degreeDiv');
    let ok = true;
    let elemChildCount = document.getElementById('degreeDiv').childElementCount;
    for (let i = 0; i < elemChildCount; i++) {
        let val = document.getElementById(`degree${i}`).value;
        if (val.trim() === '' || !document.getElementById(`degree${i}`).checkValidity()) {
            ok = false;
            alert('Tumi amar baaler doctor');
            break;
        }
    }
    if (ok) {
        for (let i = 0; i < elemChildCount; i++) {
            document.getElementById(`degree${i}`).readOnly = true;
        }
        let newDivElem = document.createElement('div');
        newDivElem.className = 'mb-3 border-success';
        let newDivElem2 = document.createElement('div');
        newDivElem2.className = 'invalid-feedback';
        newDivElem2.innerText = 'Please Provide a valid degree';
        newDivElem.innerHTML =
        `
        <label for="exampleFormControlInput4" class="form-label" style="color:#3ca507;">Degrees</label>
        <input type="text" class="form-control border-success" id="degree0" placeholder="Example : FCPS (Medicine)" pattern="[A-Za-z ()]{1,50}" value="" autocomplete="off">
        `;
        // newDivElem.appendChild(newDivElem2);

        let newDivElem3 = document.createElement('div');
        newDivElem3.className = 'mb-3 border-success';
        newDivElem3.innerHTML = 
        `
        <label for="exampleFormControlInput4" class="form-label" style="color:#3ca507;"></label>
        <button type='button' class='removeDegree' id='removeDegree${elemChildCount}' onclick="removeDegreeField(this)"> - </button>
        `;
        document.getElementById('degreeButtons').appendChild(newDivElem3);

        elem.children[0].children[1].id = `degree${elemChildCount}`;
        elem.children[0].children[0].innerText = '';
        elem.appendChild(newDivElem);
        swapElem(elem.children[0], newDivElem);
    }
}

function removeDegreeField(ref) {
    let ref2 = ref.id.replace('removeDegree', 'degree');
    ref2 = document.getElementById(ref2);
    ref2.parentNode.parentNode.removeChild(ref2.parentNode);
    ref.parentNode.parentNode.removeChild(ref.parentNode);
    // ref.parentNode.removeChild(ref.previousElementSibling);
    // ref.parentNode.removeChild(ref);
}