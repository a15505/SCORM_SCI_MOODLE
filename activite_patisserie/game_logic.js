document.addEventListener('DOMContentLoaded', () => {
    // --- Variables d'état ---
    let currentStep = 1;
    let score = 0;
    const maxSteps = 3;

    // --- Génération aléatoire des variables ---
    // Étape 1 : Fractions équivalentes
    const baseFractions = [
        { num: 1, den: 2, mult: 4 }, // 1/2 = 4/8
        { num: 1, den: 4, mult: 2 }, // 1/4 = 2/8
        { num: 3, den: 4, mult: 2 }, // 3/4 = 6/8
        { num: 2, den: 3, mult: 3 }, // 2/3 = 6/9
        { num: 1, den: 3, mult: 3 }  // 1/3 = 3/9
    ];
    const randIndex1 = Math.floor(Math.random() * baseFractions.length);
    const fraction1 = baseFractions[randIndex1];
    const targetDen1 = fraction1.den * fraction1.mult;
    const correctNum1 = fraction1.num * fraction1.mult;
    
    // Génération des choix pour l'étape 1
    const choices1 = [
        correctNum1,
        fraction1.num, // piège
        Math.abs(fraction1.num * 2 - 1), // piège aléatoire
        targetDen1 // piège pleine
    ].sort(() => Math.random() - 0.5);

    // Étape 2 : Décimaux
    const fractionsDec = [
        { num: 1, den: 2, dec: 0.5 },
        { num: 1, den: 4, dec: 0.25 },
        { num: 3, den: 4, dec: 0.75 },
        { num: 1, den: 10, dec: 0.1 }
    ];
    const fraction2 = fractionsDec[Math.floor(Math.random() * fractionsDec.length)];

    // Étape 3 : Addition
    const den3 = [5, 8, 10, 12][Math.floor(Math.random() * 4)];
    const num3_A = Math.floor(Math.random() * 3) + 1;
    const num3_B = Math.floor(Math.random() * 3) + 1;
    const correctNum3 = num3_A + num3_B;

    // --- Injection des variables dans le HTML ---
    function formatRand(val) {
        return `<i class="fa-solid fa-dice random-icon"></i><span class="random-value">${val}</span>`;
    }

    // Étape 1
    document.getElementById('frac1-base').innerHTML = formatRand(`${fraction1.num}/${fraction1.den}`);
    document.getElementById('frac1-den-text').innerHTML = formatRand(`${targetDen1}ièmes (1/${targetDen1})`);
    document.getElementById('frac1-target').innerHTML = formatRand(`${fraction1.num}/${fraction1.den}`);
    
    const container1 = document.getElementById('step1-choices');
    choices1.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'btn fraction-btn';
        btn.innerHTML = formatRand(`${c}/${targetDen1}`);
        btn.onclick = () => checkStep1(c, btn);
        container1.appendChild(btn);
    });

    // Étape 2
    document.getElementById('frac2-base').innerHTML = formatRand(`${fraction2.num}/${fraction2.den}`);
    document.getElementById('frac2-target').innerHTML = formatRand(`${fraction2.num}/${fraction2.den}`);

    // Étape 3
    document.getElementById('frac3-a').innerHTML = formatRand(`${num3_A}/${den3}`);
    document.getElementById('frac3-b').innerHTML = formatRand(`${num3_B}/${den3}`);

    // --- Logique de validation ---
    
    window.checkStep1 = function(selectedNum, btnElement) {
        disableButtons('step1-choices');
        const feedback = document.getElementById('feedback-1');
        feedback.style.display = 'block';
        
        if(selectedNum === correctNum1) {
            btnElement.classList.add('btn-success', 'text-white');
            feedback.className = 'feedback-box feedback-success';
            feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Excellent ! En multipliant par ${fraction1.mult}, on trouve que ${fraction1.num}/${fraction1.den} = ${correctNum1}/${targetDen1}.`;
            score += 33;
            showNextButton(1);
        } else {
            btnElement.classList.add('btn-danger', 'text-white');
            feedback.className = 'feedback-box feedback-error';
            feedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Attention ! Il faut multiplier le numérateur ET le dénominateur par le même nombre (ici ${fraction1.mult}). La bonne réponse était ${correctNum1}/${targetDen1}.`;
            showNextButton(1);
        }
        updateProgress();
    };

    window.checkStep2 = function() {
        const input = document.getElementById('input-step2').value.trim().replace(',', '.');
        const btn = document.getElementById('btn-step2');
        btn.disabled = true;
        
        const feedback = document.getElementById('feedback-2');
        feedback.style.display = 'block';

        if(parseFloat(input) === fraction2.dec) {
            feedback.className = 'feedback-box feedback-success';
            feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Parfait ! ${fraction2.num}/${fraction2.den} s'écrit bien ${fraction2.dec} en nombre décimal.`;
            score += 33;
            showNextButton(2);
        } else {
            feedback.className = 'feedback-box feedback-error';
            feedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Pas tout à fait. N'oublie pas qu'une fraction est une division : ${fraction2.num} ÷ ${fraction2.den} = ${fraction2.dec}.`;
            showNextButton(2);
        }
        updateProgress();
    };

    window.checkStep3 = function() {
        const inputNum = parseInt(document.getElementById('input-step3-num').value);
        const inputDen = parseInt(document.getElementById('input-step3-den').value);
        const btn = document.getElementById('btn-step3');
        btn.disabled = true;

        const feedback = document.getElementById('feedback-3');
        feedback.style.display = 'block';

        if(inputNum === correctNum3 && inputDen === den3) {
            feedback.className = 'feedback-box feedback-success';
            feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Félicitations ! Lorsque les dénominateurs sont identiques, on additionne seulement les numérateurs : ${num3_A} + ${num3_B} = ${correctNum3}.`;
            score += 34; // pour arriver à 100
        } else {
            feedback.className = 'feedback-box feedback-error';
            feedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Attention, le dénominateur reste ${den3} ! On n'additionne que les numérateurs : ${num3_A} + ${num3_B} = ${correctNum3}. Donc la réponse est ${correctNum3}/${den3}.`;
        }
        updateProgress();
        showEndScreen();
    };

    // --- Utilitaires ---
    function disableButtons(containerId) {
        const btns = document.querySelectorAll(`#${containerId} button`);
        btns.forEach(b => b.disabled = true);
    }

    function showNextButton(step) {
        const btn = document.getElementById(`next-btn-${step}`);
        if(btn) btn.style.display = 'inline-block';
    }

    window.nextStep = function(step) {
        document.getElementById(`step-${step}`).classList.remove('active');
        document.getElementById(`step-${step+1}`).classList.add('active');
        currentStep = step + 1;
        
        // Redimensionnement dynamique Iframe (simulé ici, réel dans SCORM)
        if(typeof window.requestResize === 'function') window.requestResize();
    };

    function updateProgress() {
        const pb = document.getElementById('main-progress');
        pb.style.width = `${(currentStep / maxSteps) * 100}%`;
    }

    function showEndScreen() {
        setTimeout(() => {
            document.getElementById('step-3').classList.remove('active');
            const end = document.getElementById('step-end');
            end.classList.add('active');
            document.getElementById('final-score').innerText = score + " %";
            
            if(score >= 60) {
                document.getElementById('end-msg').innerHTML = "Bravo ! Ta pâtisserie est un succès !";
            } else {
                document.getElementById('end-msg').innerHTML = "La pâtisserie a brûlé, mais tu feras mieux la prochaine fois !";
            }
            if(typeof window.requestResize === 'function') window.requestResize();
        }, 3000);
    }
});
