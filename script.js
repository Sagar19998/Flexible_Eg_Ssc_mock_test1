const startBtn = document.getElementById("startBtn");

const questionBox = document.getElementById("questionBox");

const timer = document.getElementById("timer");

const submitBtn = document.getElementById("submitBtn");

const result = document.getElementById("result");

const palette = document.getElementById("palette");

const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");



// LOAD QUESTIONS FROM LOCAL STORAGE

let questions = [];

const storedQuestions = localStorage.getItem("sscQuestions");

if(storedQuestions){

    questions = JSON.parse(storedQuestions);

}



// CURRENT QUESTION

let currentQuestion = 0;



// STORE USER ANSWERS

let userAnswers = {};

let countdown;


// CREATE PALETTE BUTTONS

questions.forEach(function(q, index){

    palette.innerHTML += `

        <button class="palette-btn" id="pal${index}">

            ${index + 1}

        </button>

    `;

});



// SHOW QUESTION FUNCTION

function showQuestion(index){

    const q = questions[index];



    let questionHTML = `

        <div class="question">

            <h3>

                Q${index + 1}. ${q.question}

            </h3>

            ${q.options.map(function(option){

                return `

                    <label>

                        <input 
                            type="radio" 
                            name="q${index}" 
                            value="${option}"

                            ${userAnswers[index] === option ? "checked" : ""}
                        >

                        ${option}

                    </label>

                    <br><br>

                `;

            }).join("")}

        </div>

    `;



    questionBox.innerHTML = questionHTML;



    // PALETTE BUTTON CLICK

    document
        .querySelectorAll(".palette-btn")
        .forEach(function(btn, btnIndex){

            btn.onclick = function(){

                saveCurrentAnswer();

                currentQuestion = btnIndex;

                showQuestion(currentQuestion);

            };

        });

}



// SHOW FIRST QUESTION

showQuestion(currentQuestion);



// SAVE CURRENT ANSWER

function saveCurrentAnswer(){

    const selected = document.querySelector(

        `input[name="q${currentQuestion}"]:checked`
    );



    if(selected){

        userAnswers[currentQuestion] = selected.value;



        // MARK PALETTE GREEN

        document
            .getElementById(`pal${currentQuestion}`)
            .classList.add("attempted");
    }

}



// NEXT BUTTON

nextBtn.addEventListener("click", function(){

    saveCurrentAnswer();



    if(currentQuestion < questions.length - 1){

        currentQuestion++;

        showQuestion(currentQuestion);

    }

});



// PREVIOUS BUTTON

prevBtn.addEventListener("click", function(){

    saveCurrentAnswer();



    if(currentQuestion > 0){

        currentQuestion--;

        showQuestion(currentQuestion);

    }

});



// START TEST

startBtn.addEventListener("click", function(){

    questionBox.style.display = "block";

    timer.style.display = "block";

    startBtn.style.display = "none";

    nextBtn.style.display = "inline-block";
    prevBtn.style.display = "inline-block";
    submitBtn.style.display = "inline-block";

    let totalTime = 15 * 60;



     countdown = setInterval(function(){

        let minutes = Math.floor(totalTime / 60);

        let seconds = totalTime % 60;



        if(seconds < 10){

            seconds = "0" + seconds;
        }



        timer.innerHTML = "Time Left: " + minutes + ":" + seconds;



        totalTime--;



        // AUTO SUBMIT

        if(totalTime < 0){

            clearInterval(countdown);

            saveCurrentAnswer();

            checkResult();

        }

    }, 1000);

});



// SUBMIT BUTTON

submitBtn.addEventListener("click", function(){

    let confirmSubmit = confirm(
        "Are you sure you want to submit the test?\n\nOnce submitted, you cannot continue the test."
    );

    if(!confirmSubmit){

        return; // User clicked Cancel

    }

    saveCurrentAnswer();

    clearInterval(countdown);

    timer.innerHTML = "Test Submitted";

    checkResult();

});


// CHECK RESULT FUNCTION

function checkResult(){

questionBox.style.display = "none";
submitBtn.style.display = "none";
nextBtn.style.display = "none";
prevBtn.style.display = "none";
palette.style.display = "none";


    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    let reviewHTML = "";

    questions.forEach(function(q, index){

        let userAnswer = userAnswers[index];

        // Count Correct / Wrong / Unattempted

        if(userAnswer === undefined){

            unattempted++;

            userAnswer = "Not Attempted";

        }
        else if(userAnswer === q.answer){

            correct++;

        }
        else{

            wrong++;

        }

        // Review Section

        reviewHTML += `

            <div class="review-box">

                <h3>
                    Q${index + 1}. ${q.question}
                </h3>

                <p>
                    <strong>Your Answer:</strong>
                    ${userAnswer}
                    ${userAnswer === q.answer ? "✅" : "❌"}
                </p>

                <p>
                    <strong>Correct Answer:</strong>
                    ${q.answer} ✅
                </p>

                <p>
                    <strong>Explanation:</strong>
                    ${q.explanation}
                </p>

            </div>

        `;

    });


// SSC CGL Marking

    let marksEarned = correct * 2;

    let negativeMarks = wrong * 0.5;

    let finalScore = marksEarned - negativeMarks;

    let maxMarks = questions.length * 2;

    let accuracy = 0;

    if(correct + wrong > 0){

        accuracy = (
            (correct / (correct + wrong)) * 100
        ).toFixed(2);

    }

    result.innerHTML = `

<div class="review-box">

    <h2>📊 SSC CGL Result</h2>

    <table style="width:100%; text-align:center; border-collapse:collapse;">

        <tr>
            <th>Total</th>
            <th>Correct</th>
            <th>Wrong</th>
            <th>Unattempted</th>
            <th>Score</th>
            <th>Negative</th>
            <th>Accuracy</th>
        </tr>

        <tr>
            <td>${questions.length}</td>
            <td>✅ ${correct}</td>
            <td>❌ ${wrong}</td>
            <td>⚪ ${unattempted}</td>
            <td>${finalScore}/${maxMarks}</td>
            <td>${negativeMarks}</td>
            <td>${accuracy}%</td>
        </tr>

    </table>

</div>

${reviewHTML}
`;

}