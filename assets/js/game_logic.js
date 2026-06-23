let currentNodeId = scenarioData.startNodeId;
let currentScore = 0;

const ui = {
    card: document.getElementById('game-card'),
    title: document.getElementById('node-title'),
    image: document.getElementById('node-image'),
    text: document.getElementById('node-text'),
    choicesContainer: document.getElementById('choices-container'),
    feedbackAlert: document.getElementById('feedback-alert'),
    feedbackText: document.getElementById('feedback-text'),
    continueContainer: document.getElementById('continue-container'),
    btnContinue: document.getElementById('btn-continue'),
    scoreDisplay: document.getElementById('score-display')
};

let nextNodeAfterFeedback = null;

function renderNode(nodeId) {
    const node = scenarioData.story[nodeId];
    if (!node) return;

    currentNodeId = nodeId;
    
    ui.title.innerHTML = node.title;
    ui.text.innerHTML = node.text;
    ui.image.className = node.image + " fa-4x text-primary";
    
    // Reset feedback
    ui.feedbackAlert.className = "alert d-none mt-4";
    ui.continueContainer.classList.add('d-none');
    
    // Render choices
    ui.choicesContainer.innerHTML = '';
    
    if (node.isEnd) {
        const btn = document.createElement('button');
        btn.className = "btn btn-success choice-btn btn-lg";
        btn.innerHTML = "<i class='fas fa-flag-checkered'></i> Terminer l'activité";
        btn.onclick = () => finishActivity(node.status);
        ui.choicesContainer.appendChild(btn);
    } else {
        node.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = "btn btn-outline-primary choice-btn text-start";
            btn.innerHTML = `<i class="fas fa-chevron-right me-2"></i> ${choice.text}`;
            btn.onclick = () => handleChoice(choice, btn);
            ui.choicesContainer.appendChild(btn);
        });
    }

    ui.card.style.display = 'block';
}

function handleChoice(choice, btnElement) {
    // Disable all choice buttons
    const buttons = ui.choicesContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = choice.scoreImpact > 0;
    
    if (isCorrect) {
        currentScore += choice.scoreImpact;
        ui.scoreDisplay.textContent = currentScore;
        btnElement.classList.replace('btn-outline-primary', 'btn-success');
        ui.feedbackAlert.className = "alert alert-success mt-4";
        ui.feedbackText.innerHTML = `<i class="fas fa-check-circle feedback-icon"></i> ${choice.feedback}`;
    } else {
        btnElement.classList.replace('btn-outline-primary', 'btn-danger');
        ui.feedbackAlert.className = "alert alert-danger mt-4";
        ui.feedbackText.innerHTML = `<i class="fas fa-times-circle feedback-icon"></i> ${choice.feedback}`;
    }

    nextNodeAfterFeedback = choice.nextNodeId;
    ui.continueContainer.classList.remove('d-none');
}

ui.btnContinue.onclick = () => {
    if (nextNodeAfterFeedback) {
        renderNode(nextNodeAfterFeedback);
    }
};

function finishActivity(status) {
    if (typeof API !== 'undefined') {
        API.LMSSetValue('cmi.core.score.raw', currentScore.toString());
        API.LMSSetValue('cmi.core.lesson_status', status || 'passed');
        API.LMSCommit();
        alert("Félicitations ! Ton score de " + currentScore + "% a été envoyé à la plateforme d'apprentissage.");
    } else {
        alert("Activité terminée avec succès ! Score final : " + currentScore + "% (Test local : SCORM API non détectée).");
    }
}

// Initialisation
window.onload = () => {
    if (typeof API !== 'undefined') {
        API.LMSInitialize("");
    }
    renderNode(currentNodeId);
};
