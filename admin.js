const importBtn = document.getElementById("importBtn");

const jsonInput = document.getElementById("jsonInput");

const message = document.getElementById("message");



importBtn.addEventListener("click", function(){

    try{

        // Convert JSON text to JavaScript object

        const questions = JSON.parse(jsonInput.value);



        // Save in browser storage

        localStorage.setItem("sscQuestions", JSON.stringify(questions));

             successMessage.innerHTML =
        "✅ Questions uploaded successfully! Redirecting...";

             setTimeout(function()
              {
                 window.location.href = "index.html";
            }, 2000);

    }

    catch(error){

        message.innerHTML = "Invalid JSON ❌";

    }

});