
const passwordInput = document.getElementById('password-input');
const toggleBtn = document.getElementById('toggle-visibility');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const entropyLabel = document.getElementById('entropy-label');
const dashboard = document.getElementById('dashboard');


const timeThrottled = document.getElementById('time-throttled');
const timeGpu = document.getElementById('time-gpu');
const timeBotnet = document.getElementById('time-botnet');


const feedbackContainer = document.getElementById('feedback-container');


toggleBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);


    const icon = toggleBtn.querySelector('i');
    if (type === 'text') {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});


passwordInput.addEventListener('input', (e) => {
    const newVal = e.target.value;

    if (newVal.length > 0) {
        dashboard.classList.remove('opacity-0', 'translate-y-4');
        dashboard.classList.add('opacity-100', 'translate-y-0');

        const result = zxcvbn(newVal);
        updateUI(result, newVal);
    } else {
        dashboard.classList.add('opacity-0', 'translate-y-4');
        dashboard.classList.remove('opacity-100', 'translate-y-0');
        resetUI();
    }
});

function updateUI(result, password) {
    const score = result.score;
    const colors = ['#ef4444', '#ef4444', '#eab308', '#22c55e', '#3b82f6'];
    const widths = ['5%', '25%', '50%', '75%', '100%'];
    const labels = ['Weak', 'Weak', 'Fair', 'Strong', 'Excellent'];

    strengthBar.style.width = widths[score];
    strengthBar.style.backgroundColor = colors[score];
    strengthText.textContent = labels[score];
    strengthText.style.color = colors[score];

    // Reset Effects
    strengthBar.classList.remove('state-cracked', 'state-melting', 'state-exploding');
    strengthBar.parentElement.style.overflow = 'hidden'; // Default (clip bar)

    // Apply New Effects
    if (score <= 1) {
        strengthBar.classList.add('state-cracked');
    } else if (score <= 3) {
        strengthBar.classList.add('state-melting');
        strengthBar.parentElement.style.overflow = 'visible'; // Allow drips
    } else {
        strengthBar.classList.add('state-exploding');
    }

    updateCrackTime(timeThrottled, result.crack_times_display.online_no_throttling_10_per_second);
    updateCrackTime(timeGpu, result.crack_times_display.offline_slow_hashing_1e4_per_second);
    updateCrackTime(timeBotnet, result.crack_times_display.offline_fast_hashing_1e10_per_second);

    renderFeedback(result);
    updateEntropy(password);
    updateMeme(score);
}

function updateMeme(score) {
    const memeImg = document.getElementById('meme-image');
    const memeContainer = document.getElementById('meme-container');


    const memes = [
        "https://api.memegen.link/images/mw/your_password_is_weak/hackers_are_watching.png",
        "https://api.memegen.link/images/ds/so_you_re_telling_me/this_is_secure_lol.png",
        "https://api.memegen.link/images/fry/not_sure_if_secure/or_just_lazy.png",
        "https://api.memegen.link/images/success/secure_password/hackers_crying_now.png",
        "https://api.memegen.link/images/hackerman/access_denied/bro.png"
    ];

    memeImg.src = memes[score];
    memeContainer.classList.remove('hidden');
}

function updateCrackTime(element, text) {
    element.textContent = text;

    if (text.includes('century') || text.includes('year')) {
        element.style.color = '#4ade80';
    } else if (text.includes('second') || text.includes('minute') || text.includes('hour') || text.includes('instant')) {
        element.style.color = '#f87171';
    } else {
        element.style.color = 'white';
    }
}

function renderFeedback(result) {
    feedbackContainer.innerHTML = '';

    // Check for keyboard patterns (spatial)
    const hasKeyboardPattern = result.sequence.some(seq => seq.pattern === 'spatial');

    if (hasKeyboardPattern) {
        const warn = document.createElement('div');
        warn.className = 'text-purple-400 mb-2 font-bold text-sm';
        warn.innerHTML = `<i class="fas fa-keyboard mr-2"></i> ur keyboard failed u haha`;
        feedbackContainer.appendChild(warn);
        return; // Skip other feedback
    }

    if (result.feedback.warning) {
        const warn = document.createElement('div');
        warn.className = 'text-red-400 mb-2 font-bold text-sm';
        warn.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i> ${result.feedback.warning}`;
        feedbackContainer.appendChild(warn);
    }

    if (result.feedback.suggestions.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'text-sm text-gray-500 space-y-1';
        result.feedback.suggestions.forEach(s => {
            const li = document.createElement('li');
            li.textContent = s;
            feedbackContainer.appendChild(li);
        });
        feedbackContainer.appendChild(ul);
    }

    if (!result.feedback.warning && result.feedback.suggestions.length === 0) {
        feedbackContainer.innerHTML = `<div class="text-green-500 font-bold"><i class="fas fa-shield-alt text-4xl mb-2"></i><br>Secure Password</div>`;
    }
}

function updateEntropy(password) {
    let charset = 0;
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charset += 32;

    if (charset === 0) {
        entropyLabel.textContent = "0 bits";
        return;
    }

    const entropy = Math.floor(Math.log2(Math.pow(charset, password.length)));
    entropyLabel.textContent = `${entropy} bits`;
}

function resetUI() {
    strengthBar.style.width = '0%';
    strengthBar.classList.remove('state-cracked', 'state-melting', 'state-exploding');
    strengthBar.parentElement.style.overflow = 'hidden';
    strengthText.textContent = 'Waiting...';
    entropyLabel.textContent = '0 bits';
    document.getElementById('meme-container').classList.add('hidden');
}
