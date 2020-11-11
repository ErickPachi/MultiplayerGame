//---------------------Side Navbar
let closed = true;
function navBar() {
    
    if (window.innerWidth > 1200) {
        if (closed) {
            document.getElementById("mySidenav").style.width = "25%";
            document.getElementById("mySidenav").style.height = "100%";
            closed = false;
        }
        else {
            document.getElementById("mySidenav").style.width = "0px";
            document.getElementById("mySidenav").style.height = "98%;";
            closed = true;
        }
    }
    else{
        if (closed) {
                document.getElementById("mySidenav").style.height = "400px";
                document.getElementById("mySidenav").style.width = "100%";

            closed = false;
        }
        else {
            document.getElementById("mySidenav").style.width = "100%";
            document.getElementById("mySidenav").style.height = "0px";
            closed = true;
        }
    }
}


function closeNav() {
    document.getElementById("navInput").checked = false;
    if (window.innerWidth > 1200) {
        document.getElementById("mySidenav").style.width = "0px";
        closed = true;
    }
    else {
            document.getElementById("mySidenav").style.height = "0px";
            closed = true;
        }
    }
    



    let closed2 = true;
    function naveBar() {
        
        if (window.innerWidth > 1200) {
            if (closed2) {
                document.getElementById("mySidenav2").style.width = "25%";
                document.getElementById("mySidenav2").style.height = "88.9%";
                closed2 = false;
            }
            else {
                document.getElementById("mySidenav2").style.width = "0px";
                document.getElementById("mySidenav2").style.height = "88.9%;";
                closed2 = true;
            }
        }
        else{
            if (closed2) {
                    document.getElementById("mySidenav2").style.height = "400px";
                    document.getElementById("mySidenav2").style.width = "100%";
    
                    closed2 = false;
            }
            else {
                document.getElementById("mySidenav2").style.width = "100%";
                document.getElementById("mySidenav2").style.height = "0px";
                closed2 = true;
            }
        }
    }
    
    
    function closeNave() {
        document.getElementById("navInput").checked = false;
        if (window.innerWidth > 1200) {
            document.getElementById("mySidenav2").style.width = "0px";
            closed2 = true;
        }
        else {
                document.getElementById("mySidenav2").style.height = "0px";
                closed2 = true;
            }
        }
    


//-----------------------------Mobile Mode
let Previous_width = "";
let Previous_Height = "";
function openMobileMode() {
    //remove stuff
    var removeArray = ["header", "mySidenav2", "btnOpen", "footer", "Homebtns"];
    for (let index = 0; index < removeArray.length; index++) {
        document.getElementById(removeArray[index]).style.display = "none";
    }
    //add stuff
    var AddArray =  ["mobilebtns", "mobilebtns", "btnClose"];
    for (let index = 0; index < AddArray.length; index++) {
        document.getElementById(AddArray[index]).style.display = "block";
    }

    Previous_width = document.getElementById("canvas").style.width;
    Previous_Height = document.getElementById("canvas").style.height;

    document.getElementById("canvas").style.width = "99.3%";
    document.getElementById("canvas").style.height = "98.5%";
    document.getElementById("canvas").style.position = "absolute";
    document.getElementById("canvas").style.top = "0px";
    document.getElementById("canvas").style.left = "0px";
    document.getElementById("body").style.padding = "0px";
    document.getElementById("body").style.margin = "0px";

   }

   function closeMobileMode() { 
    //remove stuff
    var removeArray = ["mobilebtns", "mobilebtns", "btnClose"];
    for (let index = 0; index < removeArray.length; index++) {
        document.getElementById(removeArray[index]).style.display = "none";
    }
    //add stuff
    var AddArray = ["header", "mySidenav2", "btnOpen", "footer", "Homebtns"];
    for (let index = 0; index < AddArray.length; index++) {
        document.getElementById(AddArray[index]).style.display = "block";
    }

   
    document.getElementById("canvas").style.position = "static";
    document.getElementById("canvas").style.width = Previous_width;
    document.getElementById("canvas").style.height = Previous_Height;
    document.getElementById("body").style.paddingTop = "100px";

}

   //---------------------default data onload
   function setup() {
        const username = JSON.parse(localStorage.getItem('FavoriteUsername')) ? JSON.parse(localStorage.getItem('FavoriteUsername')) : JSON.parse(sessionStorage.getItem('username'));
        const color = JSON.parse(localStorage.getItem('FavoriteColor')) ? JSON.parse(localStorage.getItem('FavoriteColor')) : JSON.parse(sessionStorage.getItem('player_color'));
        if(username && color) {
            document.getElementById("Username").value = username;
            document.getElementById("color").value = color;
            document.getElementById("color").style.backgroundColor = color; 
            var option = document.getElementById("color").value;
            if (option === "") {
                document.getElementById("color").innerHTML += `
                <option value="${color}" style="background-color: ${color}">Personalied</option>
                `
            }
            document.getElementById("color").value = color;

        }
        else{
            document.getElementById("Username").value = "Player";
            const select = document.getElementById("color");
            select.options["#0000ff"];
        } 
   }
    //---------------------change select-option background
    function colorbg() {
        const select = document.getElementById("color");
        const color = select.options[select.selectedIndex].value;
        document.getElementById("color").style.backgroundColor = color; 
    }