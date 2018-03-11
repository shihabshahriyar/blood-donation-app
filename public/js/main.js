var searchForm = document.querySelector("#search-form");
var dobMonth = document.querySelector("#DOBMonth");
var dobDay = document.querySelector("#DOBDay");
var dobYear = document.querySelector("#DOBYear");
var toggleButtons = document.getElementsByClassName("toggle-close");
isOpen = false;

selectedMonthIndex = dobMonth.selectedIndex;

function leapYear(year) {
   return (((year%4 == 0) && (year%100 !=0)) || (year%400==0));
}

dobYear.onchange = function() { 
    if([1,3,5,7,8,10,12].includes(selectedMonthIndex)) {
        //Do nothing
        if(dobDay.options[dobDay.selectedIndex].value > 31) {
            dobDay.selectedIndex = 0;
        }
        dobDay.options[27].classList.remove("hide");
        dobDay.options[28].classList.remove("hide");
        dobDay.options[29].classList.remove("hide");
        dobDay.options[30].classList.remove("hide");
        dobDay.options[31].classList.remove("hide");
    }
    if ([4,6,9,11].includes(selectedMonthIndex)) {
        //Remove 30
        if(dobDay.options[dobDay.selectedIndex].value > 30) {
            dobDay.selectedIndex = 0;
        }
        dobDay.options[27].classList.remove("hide");
        dobDay.options[28].classList.remove("hide");
        dobDay.options[29].classList.remove("hide");
        dobDay.options[30].classList.remove("hide");
        dobDay.options[31].classList.add("hide");
    }
    if (selectedMonthIndex == 2){
        //Calculate if leap year
        if(leapYear(dobYear.options[dobYear.selectedIndex].value)){
            if(dobDay.options[dobDay.selectedIndex].value > 28) {
                dobDay.selectedIndex = 0;
            }
            dobDay.options[31].classList.add("hide");
            dobDay.options[30].classList.add("hide");
            dobDay.options[29].classList.add("hide");
            dobDay.options[28].classList.remove("hide");
            dobDay.options[27].classList.remove("hide");
        } 
        if(!leapYear(dobYear.options[dobYear.selectedIndex].value)) {
            if(dobDay.options[dobDay.selectedIndex].value > 27) {
                dobDay.selectedIndex = 0;
            }
            dobDay.options[31].classList.add("hide");
            dobDay.options[30].classList.add("hide");
            dobDay.options[29].classList.add("hide");
            dobDay.options[28].classList.add("hide");
            dobDay.options[27].classList.remove("hide");
        }
    }
}

dobMonth.onchange = function() {
    selectedMonthIndex = dobMonth.selectedIndex;
    //Calculate number of days a month should have
    if([1,3,5,7,8,10,12].includes(selectedMonthIndex)) {
        //Do nothing
        if(dobDay.options[dobDay.selectedIndex].value > 31) {
            dobDay.selectedIndex = 0;
        }
        dobDay.options[27].classList.remove("hide");
        dobDay.options[28].classList.remove("hide");
        dobDay.options[29].classList.remove("hide");
        dobDay.options[30].classList.remove("hide");
        dobDay.options[31].classList.remove("hide");
    }
    if ([4,6,9,11].includes(selectedMonthIndex)) {
        //Remove 30
        if(dobDay.options[dobDay.selectedIndex].value > 30) {
            dobDay.selectedIndex = 0;
        }
        dobDay.options[27].classList.remove("hide");
        dobDay.options[28].classList.remove("hide");
        dobDay.options[29].classList.remove("hide");
        dobDay.options[30].classList.remove("hide");
        dobDay.options[31].classList.add("hide");
    }
    if (selectedMonthIndex == 2){
        //Calculate if leap year
        if(leapYear(dobYear.options[dobYear.selectedIndex].value)){
            if(dobDay.options[dobDay.selectedIndex].value > 28) {
                dobDay.selectedIndex = 0;
            }
            dobDay.options[31].classList.add("hide");
            dobDay.options[30].classList.add("hide");
            dobDay.options[29].classList.add("hide");
            dobDay.options[28].classList.remove("hide");
            dobDay.options[27].classList.remove("hide");
        } 
        if(!leapYear(dobYear.options[dobYear.selectedIndex].value)) {
            if(dobDay.options[dobDay.selectedIndex].value > 27) {
                dobDay.selectedIndex = 0;
            }
            dobDay.options[31].classList.add("hide");
            dobDay.options[30].classList.add("hide");
            dobDay.options[29].classList.add("hide");
            dobDay.options[28].classList.add("hide");
            dobDay.options[27].classList.remove("hide");
        }
    }
}

function toggleHeader() {
    if(!isOpen){
        searchForm.style.height = "5000px";
        for(var i = 0; i < toggleButtons.length; i++){
            toggleButtons[i].classList.add("fa-arrow-up");
            toggleButtons[i].classList.remove("fa-arrow-down");
        }
        isOpen = true;
    } else {
        searchForm.style.height = "0px";
        for(var i = 0; i < toggleButtons.length; i++){
            toggleButtons[i].classList.add("fa-arrow-down");
            toggleButtons[i].classList.remove("fa-arrow-up");
        }
        isOpen = false;
    }
}

function setfilename(val)
{
  var fileName = val.split('\\').pop();
  document.querySelector(".file-label").textContent = fileName;
}
  