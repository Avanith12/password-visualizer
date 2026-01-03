
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
const requirementsSection = document.getElementById('requirements-section');
const requirementsList = document.getElementById('requirements-list');
const analysisSection = document.getElementById('analysis-section');
const characterBreakdown = document.getElementById('character-breakdown');
const passwordSuggestions = document.getElementById('password-suggestions');


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
        requirementsSection.classList.remove('opacity-0', 'translate-y-4');
        requirementsSection.classList.add('opacity-100', 'translate-y-0');
        analysisSection.classList.remove('opacity-0', 'translate-y-4');
        analysisSection.classList.add('opacity-100', 'translate-y-0');

        const result = zxcvbn(newVal);
        updateUI(result, newVal);
    } else {
        dashboard.classList.add('opacity-0', 'translate-y-4');
        dashboard.classList.remove('opacity-100', 'translate-y-0');
        requirementsSection.classList.add('opacity-0', 'translate-y-4');
        requirementsSection.classList.remove('opacity-100', 'translate-y-0');
        analysisSection.classList.add('opacity-0', 'translate-y-4');
        analysisSection.classList.remove('opacity-100', 'translate-y-0');
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
    updateRequirements(password);
    updateCharacterBreakdown(password);
    updatePasswordSuggestions(password);
    checkEasterEggs(password);
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

function updateRequirements(password) {
    requirementsList.innerHTML = '';

    const requirements = [
        { label: 'At least 8 characters', check: () => password.length >= 8, icon: 'fa-hashtag' },
        { label: 'Contains uppercase letter', check: () => /[A-Z]/.test(password), icon: 'fa-arrow-up' },
        { label: 'Contains lowercase letter', check: () => /[a-z]/.test(password), icon: 'fa-arrow-down' },
        { label: 'Contains number', check: () => /[0-9]/.test(password), icon: 'fa-0' },
        { label: 'Contains special character', check: () => /[^a-zA-Z0-9]/.test(password), icon: 'fa-exclamation' },
        { label: 'At least 12 characters (recommended)', check: () => password.length >= 12, icon: 'fa-star' }
    ];

    requirements.forEach(req => {
        const isMet = req.check();
        const item = document.createElement('div');
        item.className = `flex items-center space-x-3 ${isMet ? 'text-green-400' : 'text-gray-500'}`;
        item.innerHTML = `
            <i class="fas ${req.icon} w-5 text-center"></i>
            <span class="flex-1">${req.label}</span>
            <i class="fas ${isMet ? 'fa-check-circle text-green-400' : 'fa-times-circle text-red-400'}"></i>
        `;
        requirementsList.appendChild(item);
    });
}

function updateCharacterBreakdown(password) {
    characterBreakdown.innerHTML = '';

    const breakdown = {
        lowercase: (password.match(/[a-z]/g) || []).length,
        uppercase: (password.match(/[A-Z]/g) || []).length,
        numbers: (password.match(/[0-9]/g) || []).length,
        symbols: (password.match(/[^a-zA-Z0-9]/g) || []).length
    };

    const total = password.length || 1;
    const colors = {
        lowercase: '#3b82f6',
        uppercase: '#8b5cf6',
        numbers: '#10b981',
        symbols: '#f59e0b'
    };

    const items = [
        { label: 'Lowercase', count: breakdown.lowercase, color: colors.lowercase },
        { label: 'Uppercase', count: breakdown.uppercase, color: colors.uppercase },
        { label: 'Numbers', count: breakdown.numbers, color: colors.numbers },
        { label: 'Symbols', count: breakdown.symbols, color: colors.symbols }
    ];

    items.forEach(item => {
        const percentage = (item.count / total) * 100;
        const bar = document.createElement('div');
        bar.className = 'space-y-2';
        bar.innerHTML = `
            <div class="flex justify-between text-xs text-gray-400">
                <span>${item.label}</span>
                <span class="font-mono">${item.count} (${percentage.toFixed(0)}%)</span>
            </div>
            <div class="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" 
                     style="width: ${percentage}%; background-color: ${item.color};"></div>
            </div>
        `;
        characterBreakdown.appendChild(bar);
    });
}

function updatePasswordSuggestions(password) {
    passwordSuggestions.innerHTML = '';

    if (password.length === 0) {
        passwordSuggestions.innerHTML = '<p class="text-gray-500 text-sm italic">Start typing to get suggestions...</p>';
        return;
    }

    const suggestions = generateSuggestions(password);

    if (suggestions.length === 0) {
        passwordSuggestions.innerHTML = '<p class="text-green-400 text-sm font-bold">Your password looks good! 🎉</p>';
        return;
    }

    suggestions.forEach((suggestion, index) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors group';
        item.innerHTML = `
            <code class="text-sm font-mono text-gray-300 group-hover:text-white transition-colors flex-1">${suggestion}</code>
            <button class="ml-3 text-gray-500 hover:text-green-400 transition-colors copy-suggestion" data-password="${suggestion}">
                <i class="fas fa-copy"></i>
            </button>
        `;
        passwordSuggestions.appendChild(item);
    });

    document.querySelectorAll('.copy-suggestion').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const password = e.target.closest('button').getAttribute('data-password');
            navigator.clipboard.writeText(password).then(() => {
                const icon = e.target.closest('button').querySelector('i');
                icon.classList.remove('fa-copy');
                icon.classList.add('fa-check', 'text-green-400');
                setTimeout(() => {
                    icon.classList.remove('fa-check', 'text-green-400');
                    icon.classList.add('fa-copy');
                }, 2000);
            });
        });
    });
}

function generateSuggestions(password) {
    const suggestions = [];
    const base = password.toLowerCase().replace(/[^a-z]/g, '');

    if (base.length > 0) {
        const capitalized = base.charAt(0).toUpperCase() + base.slice(1);
        suggestions.push(capitalized + '2024!');

        const titleCase = [];
        for (let i = 0; i < base.length; i += 3) {
            const segment = base.slice(i, i + 3);
            titleCase.push(segment.charAt(0).toUpperCase() + segment.slice(1));
        }
        suggestions.push(titleCase.join('') + '99');

        const smartSub = base
            .replace(/a/g, '@')
            .replace(/e/g, '3')
            .replace(/i/g, '1')
            .replace(/o/g, '0')
            .replace(/s/g, '$');
        const smartSubCapitalized = smartSub.charAt(0).toUpperCase() + smartSub.slice(1);
        suggestions.push(smartSubCapitalized + '!2024');

        const mixed = base.split('').map((char, i) =>
            i % 2 === 0 ? char.toUpperCase() : char
        ).join('');
        suggestions.push(mixed + '2024#');
    } else {
        suggestions.push('SecurePass2024!');
        suggestions.push('MyStrongP@ssw0rd');
        suggestions.push('SafePassword2024#');
        suggestions.push('ProtectMe2024$');
    }

    const unique = [...new Set(suggestions)];
    return unique.slice(0, 4);
}

function checkEasterEggs(password) {
    const lowerPassword = password.toLowerCase();
    const easterEggs = {
        'password': '😱 Really? "password"? That\'s like leaving your door wide open!',
        'password123': '💀 "password123"? Even my grandma could hack this!',
        '12345678': '🚨 "12345678"? This is literally the first thing hackers try!',
        '123456': '🤦 "123456"? Come on, you can do better than that!',
        'qwerty': '⌨️ "qwerty"? Your keyboard pattern is showing!',
        'admin': '👨‍💼 "admin"? Are you trying to get hacked?',
        'letmein': '🚪 "letmein"? More like "let hackers in"!',
        'welcome': '👋 "welcome"? You\'re welcoming hackers!',
        'monkey': '🐵 "monkey"? At least pick a strong one!',
        'dragon': '🐉 "dragon"? Cool name, weak password!',
        'master': '🎓 "master"? More like "master of weak passwords"!',
        'iloveyou': '❤️ "iloveyou"? We love you too, but use a stronger password!',
        'princess': '👸 "princess"? Even princesses need strong passwords!',
        'football': '⚽ "football"? Score a goal with a better password!',
        'baseball': '⚾ "baseball"? Strike out with this weak password!',
        'trustno1': '🔒 "trustno1"? Good advice, but this password is still weak!',
        'superman': '🦸 "superman"? Even Superman needs a strong password!',
        'batman': '🦇 "batman"? The Dark Knight deserves better security!',
        'hunter2': '🎮 Classic! But still weak. Try something stronger!',
        'shadow': '👤 "shadow"? Your password is in the shadows, but not secure!'
    };

    for (const [key, message] of Object.entries(easterEggs)) {
        if (lowerPassword === key || lowerPassword.includes(key)) {
            const easterEggDiv = document.createElement('div');
            easterEggDiv.className = 'mt-4 p-4 bg-yellow-900/30 border-2 border-yellow-600/50 rounded-lg text-yellow-300 font-bold text-sm animate-pulse';
            easterEggDiv.innerHTML = `<i class="fas fa-egg mr-2"></i>${message}`;

            const existing = feedbackContainer.querySelector('.easter-egg');
            if (existing) existing.remove();

            easterEggDiv.classList.add('easter-egg');
            feedbackContainer.insertBefore(easterEggDiv, feedbackContainer.firstChild);
            return;
        }
    }

    const existing = feedbackContainer.querySelector('.easter-egg');
    if (existing) existing.remove();
}

function resetUI() {
    strengthBar.style.width = '0%';
    strengthBar.classList.remove('state-cracked', 'state-melting', 'state-exploding');
    strengthBar.parentElement.style.overflow = 'hidden';
    strengthText.textContent = 'Waiting...';
    entropyLabel.textContent = '0 bits';
    document.getElementById('meme-container').classList.add('hidden');
    requirementsList.innerHTML = '';
    characterBreakdown.innerHTML = '';
    passwordSuggestions.innerHTML = '';
}
