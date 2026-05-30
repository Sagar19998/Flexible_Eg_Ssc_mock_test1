const importBtn = document.getElementById("importBtn");

const jsonInput = document.getElementById("jsonInput");

const message = document.getElementById("message");

const successMessage = document.getElementById("successMessage");



importBtn.addEventListener("click", function(){

     try {
        const jsonText = jsonInput.value.trim();

        // Validate empty input first
        if (!jsonText) {
            message.innerHTML = "Please enter JSON ❌";
            return;
        }

        // Parse JSON
        const questions = JSON.parse(jsonText);

        // Save to localStorage
        localStorage.setItem("sscQuestions", JSON.stringify(questions));

        // SUCCESS MESSAGE
        successMessage.innerHTML =
            "✅ Questions uploaded successfully! Redirecting...";

        message.innerHTML = ""; // clear error

        // Redirect after 2 sec
        setTimeout(function () {
            window.location.href = "index.html";
        }, 2000);

    } catch (error) {
        console.log("JSON Error:", error);

        message.innerHTML = "Invalid JSON ❌";
        successMessage.innerHTML = "";
    }

});