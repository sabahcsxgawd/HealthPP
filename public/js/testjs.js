        console.log("Aschi");
        const getinfo = async()=>{
            console.log("Aschi2");
            const options = {
                method:'GET'
            };
            console.log("Aschi3");
            const url = "http://localhost:4200/test";
            console.log("Aschi4");
            try{
            const response = await fetch(url,options);
            console.log("Aschi5");
            console.log(response);
            const myjson = await response.json();
            for(js of myjson){
                var temp = document.createElement('div');
                temp.className = "container-fluid col-md-6 col-xxl-9 bg-success";
                temp.innerText = `Patient Name: ${js.FIRST_NAME}   ${js.LAST_NAME}`;
                document.getElementById('divID').appendChild(temp);
            }
            }catch(err){
                console.log(err);
            }
            
        }
getinfo();