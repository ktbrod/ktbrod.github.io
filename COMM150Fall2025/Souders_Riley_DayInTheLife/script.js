//defining incremental score variables
let AcademicPerformance = 0;
let SocialLife = 0;
let CampusInvolvement = 0;
let PhysicalHealth = 0;
let MentalHealth = 0;
//importing all answer choices as variables
const Question1ChoiceA = document.getElementById('question-1-choice-a');
const Question1aChoiceA = document.getElementById('question-1a-choice-a');
const Question1ChoiceB = document.getElementById('question-1-choice-b');
const Question1aChoiceB = document.getElementById('question-1a-choice-b');
const Question2ChoiceA = document.getElementById('question-2-choice-a');
const Question2ChoiceB = document.getElementById('question-2-choice-b');
const Question3ChoiceA = document.getElementById('question-3-choice-a');
const Question3ChoiceB = document.getElementById('question-3-choice-b');
const Question3bChoiceA = document.getElementById('question-3b-choice-a');
const Question3bChoiceB = document.getElementById('question-3b-choice-b');
const Question4ChoiceA = document.getElementById('question-4-choice-a');
const Question4ChoiceB = document.getElementById('question-4-choice-b');
const Question5ChoiceA = document.getElementById('question-5-choice-a');
const Question5ChoiceB = document.getElementById('question-5-choice-b');
const Question5aChoiceA = document.getElementById('question-5a-choice-a');
const Question5aChoiceB = document.getElementById('question-5a-choice-b');
const Question6ChoiceA = document.getElementById('question-6-choice-a');
const Question6ChoiceB = document.getElementById('question-6-choice-b');
const Question7ChoiceA = document.getElementById('question-7-choice-a');
const Question7ChoiceB = document.getElementById('question-7-choice-b');
const Question7bChoiceA = document.getElementById('question-7b-choice-a');
const Question7bChoiceB = document.getElementById('question-7b-choice-b');
const Question8ChoiceA = document.getElementById('question-8-choice-a');
const Question8ChoiceB = document.getElementById('question-8-choice-b');
const Question9ChoiceA = document.getElementById('question-9-choice-a');
const Question9ChoiceB = document.getElementById('question-9-choice-b');
const Question10ChoiceA = document.getElementById('question-10-choice-a');
const Question10ChoiceB = document.getElementById('question-10-choice-b');
//incrementing the scores upon click of answer choice
Question1ChoiceA.addEventListener('click', function() {
    SocialLife += 2;
});
Question1ChoiceB.addEventListener('click', function() {
    SocialLife -= 1;
    CampusInvolvement += 2;
});
Question1aChoiceA.addEventListener('click', function() {
    CampusInvolvement += 2;
    PhysicalHealth -= 1;
});
Question1aChoiceB.addEventListener('click', function() {
    CampusInvolvement -= 1;
    PhysicalHealth += 2;
    MentalHealth -= 2;
});
Question2ChoiceA.addEventListener('click', function() {
    MentalHealth -= 2;
    AcademicPerformance += 2;
});
Question2ChoiceB.addEventListener('click', function() {
    MentalHealth += 2;
    AcademicPerformance -= 1;
});
Question3ChoiceA.addEventListener('click', function() {
    PhysicalHealth += 2;
});
Question3ChoiceB.addEventListener('click', function() {
    AcademicPerformance += 2;
});
Question3bChoiceA.addEventListener('click', function() {
    SocialLife -= 1;
    AcademicPerformance += 2;
});
Question3bChoiceB.addEventListener('click', function() {
    SocialLife += 2;
    AcademicPerformance -= 1;
});
Question4ChoiceA.addEventListener('click', function() {
    PhysicalHealth += 2;
    AcademicPerformance -= 1;
});
Question4ChoiceB.addEventListener('click', function() {
    PhysicalHealth -= 1;
    AcademicPerformance += 2;
    MentalHealth -= 2;
});
Question5ChoiceA.addEventListener('click', function() {
    PhysicalHealth -= 1;
});
Question5ChoiceB.addEventListener('click', function() {
    AcademicPerformance -= 1;
    PhysicalHealth += 2;
});
Question5aChoiceA.addEventListener('click', function() {
    AcademicPerformance += 1;
    PhysicalHealth -= 1;
});
Question5aChoiceB.addEventListener('click', function() {
    AcademicPerformance -= 1;
    PhysicalHealth += 2;
});
Question6ChoiceA.addEventListener('click', function() {
    CampusInvolvement += 2;
    SocialLife -= 1;
});
Question6ChoiceB.addEventListener('click', function() {
    SocialLife += 2;
    MentalHealth += 2;
});
Question7ChoiceA.addEventListener('click', function() {
    MentalHealth -= 2;
    AcademicPerformance += 2;
    SocialLife -= 1;
});
Question7bChoiceA.addEventListener('click', function() {
    PhysicalHealth += 2;
});
Question7bChoiceB.addEventListener('click', function() {
    CampusInvolvement += 2;
});
Question8ChoiceA.addEventListener('click', function() {
    SocialLife += 2;
    PhysicalHealth -= 1;
});
Question8ChoiceB.addEventListener('click', function() {
    SocialLife -= 1;
    PhysicalHealth += 2;
});
Question9ChoiceA.addEventListener('click', function() {
    MentalHealth += 3;
});
Question9ChoiceB.addEventListener('click', function() {
    CampusInvolvement += 2;
    MentalHealth += 2;
    PhysicalHealth += 2;
});
Question10ChoiceA.addEventListener('click', function() {
    SocialLife += 2;
});
Question10ChoiceB.addEventListener('click', function() {
    CampusInvolvement += 2;
});
//defining entire question as array variable so that its visibility can be disabled
const Question1 = document.getElementsByClassName('question-1');
const Question1a = document.getElementsByClassName('question-1a');
const Question2 = document.getElementsByClassName('question-2');
const Question3 = document.getElementsByClassName('question-3');
const Question3b = document.getElementsByClassName('question-3b');
const Question4 = document.getElementsByClassName('question-4');
const Question5 = document.getElementsByClassName('question-5');
const Question5a = document.getElementsByClassName('question-5a');
const Question6 = document.getElementsByClassName('question-6');
const Question7 = document.getElementsByClassName('question-7');
const Question7b= document.getElementsByClassName('question-7b');
const Question8 = document.getElementsByClassName('question-8');
const Question9 = document.getElementsByClassName('question-9');
const Question10 = document.getElementsByClassName('question-10');
//hiding each question after it is clicked and revealing the next
Question1ChoiceA.addEventListener('click', function() {
    //iterating through array variable to hide/reveal all components; extra skill
    for(i=0; i<Question1.length; i++) {
        Question1[i].style.display='none';
    };
    for(i=0; i<Question1a.length; i++) {
        Question1a[i].style.display='flex';
    };
});
Question1ChoiceB.addEventListener('click', function() {
    for(i=0; i<Question1.length; i++) {
        Question1[i].style.display='none';
    };
    for(i=0; i<Question2.length; i++) {
        Question2[i].style.display='flex';
    };
});
Question1aChoiceA.addEventListener('click', function() {
    for(i=0; i<Question1a.length; i++) {
        Question1a[i].style.display='none';
    };
    for(i=0; i<Question2.length; i++) {
        Question2[i].style.display='flex';
    };
});
Question1aChoiceB.addEventListener('click', function() {
    for(i=0; i<Question1a.length; i++) {
        Question1a[i].style.display='none';
    };
    for(i=0; i<Question2.length; i++) {
        Question2[i].style.display='flex';
    };
});
Question2ChoiceA.addEventListener('click', function() {
    for(i=0; i<Question2.length; i++) {
        Question2[i].style.display='none';
    };
    for(i=0; i<Question3.length; i++) {
        Question3[i].style.display='flex';
    };
});
Question2ChoiceB.addEventListener('click', function() {
    for(i=0; i<Question2.length; i++) {
        Question2[i].style.display='none';
    };
    for(i=0; i<Question3.length; i++) {
        Question3[i].style.display='flex';
    };
});
Question3ChoiceA.addEventListener('click', function() {
    for(i=0; i<Question3.length; i++) {
        Question3[i].style.display='none';
    };
    for(i=0; i<Question4.length; i++) {
        Question4[i].style.display='flex';
    };
});
Question3ChoiceB.addEventListener('click', function() {
    for(i=0; i<Question3.length; i++) {
        Question3[i].style.display='none';
    };
    for(i=0; i<Question3b.length; i++) {
        Question3b[i].style.display='flex';
    };
});
Question3bChoiceA.addEventListener('click', function() {
    for(i=0; i<Question3b.length; i++) {
        Question3b[i].style.display='none';
    };
    for(i=0; i<Question4.length; i++) {
        Question4[i].style.display='flex';
    };
});
Question3bChoiceB.addEventListener('click', function() {
    for(i=0; i<Question3b.length; i++) {
        Question3b[i].style.display='none';
    };
    for(i=0; i<Question4.length; i++) {
        Question4[i].style.display='flex';
    };
});
Question4ChoiceA.addEventListener('click', function() {
    for(i=0; i<Question4.length; i++) {
        Question4[i].style.display='none';
    };
    for(i=0; i<Question5.length; i++) {
        Question5[i].style.display='flex';
    };
});
Question4ChoiceB.addEventListener('click', function() {
    for(i=0; i<Question4.length; i++) {
        Question4[i].style.display='none';
    };
    for(i=0; i<Question5.length; i++) {
        Question5[i].style.display='flex';
    };
});
Question5ChoiceA.addEventListener('click', function() {
    for(i=0; i<Question5.length; i++) {
        Question5[i].style.display='none';
    };
    for(i=0; i<Question5a.length; i++) {
        Question5a[i].style.display='flex';
    };
});
Question5ChoiceB.addEventListener('click', function() {
    for(i=0; i<Question5.length; i++) {
        Question5[i].style.display='none';
    };
    for(i=0; i<Question6.length; i++) {
        Question6[i].style.display='flex';
    };
});
Question5aChoiceA.addEventListener('click', function() {
    for(i=0; i<Question5a.length; i++) {
        Question5a[i].style.display='none';
    };
    for(i=0; i<Question6.length; i++) {
        Question6[i].style.display='flex';
    };
});
Question5aChoiceB.addEventListener('click', function() {
    for(i=0; i<Question5a.length; i++) {
        Question5a[i].style.display='none';
    };
    for(i=0; i<Question6.length; i++) {
        Question6[i].style.display='flex';
    };
});
Question6ChoiceA.addEventListener('click', function() {
    for(i=0; i<Question6.length; i++) {
        Question6[i].style.display='none';
    };
    for(i=0; i<Question7.length; i++) {
        Question7[i].style.display='flex';
    };
});
Question6ChoiceB.addEventListener('click', function() {
    for(i=0; i<Question6.length; i++) {
        Question6[i].style.display='none';
    };
    for(i=0; i<Question7.length; i++) {
        Question7[i].style.display='flex';
    };
});
Question7ChoiceA.addEventListener('click', function() {
    for(i=0; i<Question7.length; i++) {
        Question7[i].style.display='none';
    };
    for(i=0; i<Question8.length; i++) {
        Question8[i].style.display='flex';
    };
});
Question7ChoiceB.addEventListener('click', function() {
    for(i=0; i<Question7.length; i++) {
        Question7[i].style.display='none';
    };
    for(i=0; i<Question7b.length; i++) {
        Question7b[i].style.display='flex';
    };
});
Question7bChoiceA.addEventListener('click', function() {
    for(i=0; i<Question7b.length; i++) {
        Question7b[i].style.display='none';
    };
    for(i=0; i<Question8.length; i++) {
        Question8[i].style.display='flex';
    };
});
Question7bChoiceB.addEventListener('click', function() {
    for(i=0; i<Question7b.length; i++) {
        Question7b[i].style.display='none';
    };
    for(i=0; i<Question8.length; i++) {
        Question8[i].style.display='flex';
    };
});
Question8ChoiceA.addEventListener('click', function() {
    for(i=0; i<Question8.length; i++) {
        Question8[i].style.display='none';
    };
    for(i=0; i<Question9.length; i++) {
        Question9[i].style.display='flex';
    };
});
Question8ChoiceB.addEventListener('click', function() {
    for(i=0; i<Question8.length; i++) {
        Question8[i].style.display='none';
    };
    for(i=0; i<Question9.length; i++) {
        Question9[i].style.display='flex';
    };
});
Question9ChoiceA.addEventListener('click', function() {
    for(i=0; i<Question9.length; i++) {
        Question9[i].style.display='none';
    };
    for(i=0; i<Question10.length; i++) {
        Question10[i].style.display='flex';
    };
});
Question9ChoiceB.addEventListener('click', function() {
    for(i=0; i<Question9.length; i++) {
        Question9[i].style.display='none';
    };
    for(i=0; i<Question10.length; i++) {
        Question10[i].style.display='flex';
    };
});
//Question 10 totals scores and sends to proper ending
Question10ChoiceA.addEventListener('click', function() {
    for(i=0; i<Question10.length; i++) {
        Question10[i].style.display='none';
    };
    console.log(`SL is ${SocialLife}`);
    console.log(`AP is ${AcademicPerformance}`);
    console.log(`MH is ${MentalHealth}`);
    console.log(`PH is ${PhysicalHealth}`);
    console.log(`CI is ${CampusInvolvement}`);
    //Determines which ending and sends to proper HTML page; extra skill (if/else if)
    if(SocialLife>(AcademicPerformance+2) && SocialLife>(MentalHealth+2) && SocialLife>(PhysicalHealth+2) && SocialLife>(CampusInvolvement+2)) {
        //Social Butterfly ending
        window.location = "end-page-SL.html";
    } else if(PhysicalHealth>(AcademicPerformance+2) && PhysicalHealth>(SocialLife+2) && PhysicalHealth>(MentalHealth+2) && PhysicalHealth>(CampusInvolvement+2)) {
        //Gymrat ending
        window.location = "end-page-PH.html"
    } else if(AcademicPerformance>(SocialLife+2) && AcademicPerformance>(PhysicalHealth+2) && AcademicPerformance>(MentalHealth+2) && AcademicPerformance>(CampusInvolvement+2)) {
        //Nerd ending
        window.location = "end-page-AP.html"
    } else if(MentalHealth>(SocialLife+2) && MentalHealth>(AcademicPerformance+2) && MentalHealth>(PhysicalHealth+2) && MentalHealth>(CampusInvolvement+2)) {
        //Empath ending
        window.location = "end-page-MH.html"
    } else if(CampusInvolvement>(SocialLife+2) && CampusInvolvement>(AcademicPerformance+2) && CampusInvolvement>(MentalHealth+2) && CampusInvolvement>(PhysicalHealth+2)) {
        //Busy Bee ending
        window.location = "end-page-CI.html"
    } else if(CampusInvolvement>0 && PhysicalHealth>0 && MentalHealth>0 && SocialLife>0 && AcademicPerformance>0) {
        //Well Rounded ending
        window.location = "end-page-WR.html"
    } else {
        //NPC ending
        window.location = "end-page-default.html"
    };
});
Question10ChoiceB.addEventListener('click', function() {
    for(i=0; i<Question10.length; i++) {
        Question10[i].style.display='none';
    };
    console.log(`SL is ${SocialLife}`);
    console.log(`AP is ${AcademicPerformance}`);
    console.log(`MH is ${MentalHealth}`);
    console.log(`PH is ${PhysicalHealth}`);
    console.log(`CI is ${CampusInvolvement}`);
    //Determines which ending and sends to proper HTML page; extra skill
    if(SocialLife>(AcademicPerformance+2) && SocialLife>(MentalHealth+2) && SocialLife>(PhysicalHealth+2) && SocialLife>(CampusInvolvement+2)) {
        //Social Butterfly ending
        location.href("end-page-SL.html");
    } else if(PhysicalHealth>(AcademicPerformance+2) && PhysicalHealth>(SocialLife+2) && PhysicalHealth>(MentalHealth+2) && PhysicalHealth>(CampusInvolvement+2)) {
        //Gymrat ending
        window.location = "end-page-PH.html"
    } else if(AcademicPerformance>(SocialLife+2) && AcademicPerformance>(PhysicalHealth+2) && AcademicPerformance>(MentalHealth+2) && AcademicPerformance>(CampusInvolvement+2)) {
        //Nerd ending
        window.location = "end-page-AP.html"
    } else if(MentalHealth>(SocialLife+2) && MentalHealth>(AcademicPerformance+2) && MentalHealth>(PhysicalHealth+2) && MentalHealth>(CampusInvolvement+2)) {
        //Empath ending
        window.location = "end-page-MH.html"
    } else if(CampusInvolvement>(SocialLife+2) && CampusInvolvement>(AcademicPerformance+2) && CampusInvolvement>(MentalHealth+2) && CampusInvolvement>(PhysicalHealth+2)) {
        //Busy Bee ending
        window.location = "end-page-CI.html"
    } else if(CampusInvolvement>0 && PhysicalHealth>0 && MentalHealth>0 && SocialLife>0 && AcademicPerformance>0) {
        //Well Rounded ending
        window.location = "end-page-WR.html"
    } else {
        //NPC ending
        window.location = "end-page-default.html"
    };
});