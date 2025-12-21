 let x = 0;
        function keepScore(){
        document.getElementById("displayclicks").innerText = x +=1;
        localStorage.setItem("score" , x);
        } 

