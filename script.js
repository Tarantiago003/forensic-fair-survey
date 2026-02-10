// ============================================
// STATE MANAGEMENT
// ============================================
let currentQuestion = 0;
let quizAnswers = {};
let formData = {};
let finalResult = null;

// ============================================
// FORENSIC PATHS DATA
// ============================================
const forensicPaths = {
    investigator: { title: '🏆 Case Master Investigator', flavor: 'May mata ka sa detalye at utak na pang-solve ng kaso.' },
    patrolman: { title: '🏆 Frontline Law Enforcer', flavor: 'Ikaw ang unang rumesponde para sa kaayusan at seguridad.' },
    emergency: { title: '🏆 Critical Response Specialist', flavor: 'Kalma ka kahit chaos na — lives come first for you.' },
    fire: { title: '🏆 Fire & Disaster Commander', flavor: 'Hindi ka umaatras kahit delikado ang sitwasyon.' },
    jail: { title: '🏆 Detention Security Officer', flavor: 'Order, control, at seguridad ang natural mong strength.' },
    correction: { title: '🏆 Rehabilitation & Discipline Officer', flavor: 'Naniniwala ka sa pagbabago at tamang disiplina.' },
    fingerprint: { title: '🏆 Latent Print Specialist', flavor: 'Isang marka lang, kaya mong ikonek ang buong kaso.' },
    photographer: { title: '🏆 Forensic Visual Analyst', flavor: 'Ang lens mo ang nagsasalita para sa ebidensya.' },
    polygraph: { title: '🏆 Truth Verification Analyst', flavor: 'Alam mo kung kailan may itinatago ang isang tao.' },
    chemist: { title: '🏆 Forensic Laboratory Analyst', flavor: 'Science ang sandata mo sa paghahanap ng katotohanan.' },
    firearm: { title: '🏆 Ballistics & Firearms Specialist', flavor: 'Bawat bala may kwento — at kaya mo itong basahin.' },
    document: { title: '🏆 Document Authenticity Expert', flavor: 'Sulat at pirma? Hindi ka madaling malinlang.' },
    pdea: { title: '🏆 Anti-Narcotics Intelligence Operative', flavor: 'Tahimik kang gumagalaw pero malaki ang impact.' }
};

// ============================================
// QUIZ QUESTIONS (12 Scenario-based, Taglish)
// ============================================
const questions = [
    {
        id: 1,
        case: 'CASE NO: R3/06',
        scenario: 'May nakita kang suspicious package sa isang public place. Ano ang unang gagawin mo?',
        options: [
            { text: 'Secure the area at tawagan ang bomb squad', path: 'emergency' },
            { text: 'I-inspect ang package ng maingat', path: 'investigator' },
            { text: 'Mag-coordinate sa local police', path: 'patrolman' },
            { text: 'I-document lahat ng detalye gamit camera', path: 'photographer' }
        ]
    },
    {
        id: 2,
        case: 'CASE NO: F7/12',
        scenario: 'May sunog na naganap sa isang building. Ikaw ang first responder. Priority mo ay?',
        options: [
            { text: 'Rescue ng mga trapped victims', path: 'fire' },
            { text: 'Secure ang crime scene para sa investigation', path: 'investigator' },
            { text: 'Provide emergency medical assistance', path: 'emergency' },
            { text: 'Control the crowd at maintain order', path: 'patrolman' }
        ]
    },
    {
        id: 3,
        case: 'CASE NO: L4/23',
        scenario: 'Nakita mo ang isang suspect na nag-lie during interrogation. Ano ang approach mo?',
        options: [
            { text: 'Use polygraph test para ma-verify ang statement', path: 'polygraph' },
            { text: 'Cross-check ang statement sa evidence', path: 'investigator' },
            { text: 'Intimidate para mag-confess', path: 'jail' },
            { text: 'Build rapport at hanapin ang inconsistencies', path: 'pdea' }
        ]
    },
    {
        id: 4,
        case: 'CASE NO: C9/41',
        scenario: 'May nakuha kang mysterious white powder sa crime scene. Next step mo?',
        options: [
            { text: 'I-test sa laboratory para malaman ang composition', path: 'chemist' },
            { text: 'I-document at i-photograph ang evidence', path: 'photographer' },
            { text: 'I-report sa PDEA kung drug-related', path: 'pdea' },
            { text: 'Secure at i-seal ang evidence properly', path: 'investigator' }
        ]
    },
    {
        id: 5,
        case: 'CASE NO: P2/58',
        scenario: 'Patrolling ka sa community when you witness a minor crime. Ano ang gagawin mo?',
        options: [
            { text: 'Immediate arrest at bring to station', path: 'patrolman' },
            { text: 'Issue warning at i-document ang incident', path: 'patrolman' },
            { text: 'Investigate muna kung may mas malaking involvement', path: 'investigator' },
            { text: 'Counsel at educate ang suspect', path: 'correction' }
        ]
    },
    {
        id: 6,
        case: 'CASE NO: D8/67',
        scenario: 'May nag-submit ng forged document sa government office. Paano mo i-verify?',
        options: [
            { text: 'Examine signatures, paper quality, at printing marks', path: 'document' },
            { text: 'Compare sa original documents sa database', path: 'investigator' },
            { text: 'Interview ang nag-submit ng document', path: 'polygraph' },
            { text: 'Use chemical tests sa paper', path: 'chemist' }
        ]
    },
    {
        id: 7,
        case: 'CASE NO: B5/89',
        scenario: 'May shooting incident. May recovered bullet. Ano ang focus mo?',
        options: [
            { text: 'Analyze bullet trajectory at firearm type', path: 'firearm' },
            { text: 'Photograph ang bullet position at scene', path: 'photographer' },
            { text: 'Secure witnesses at gather statements', path: 'investigator' },
            { text: 'Provide medical aid sa victims', path: 'emergency' }
        ]
    },
    {
        id: 8,
        case: 'CASE NO: J3/94',
        scenario: 'Ikaw ang in-charge sa detention facility. May riot na naganap. Priority mo?',
        options: [
            { text: 'Restore order using force if necessary', path: 'jail' },
            { text: 'Negotiate with inmates para matapos ang riot', path: 'correction' },
            { text: 'Call for backup at secure the perimeter', path: 'patrolman' },
            { text: 'Evacuate vulnerable inmates', path: 'emergency' }
        ]
    },
    {
        id: 9,
        case: 'CASE NO: M1/15',
        scenario: 'May latent fingerprints sa crime scene. Paano mo i-process?',
        options: [
            { text: 'Lift prints using proper techniques at analyze', path: 'fingerprint' },
            { text: 'Photograph first bago i-lift', path: 'photographer' },
            { text: 'Compare directly sa suspect database', path: 'investigator' },
            { text: 'Use chemical reagents para enhance', path: 'chemist' }
        ]
    },
    {
        id: 10,
        case: 'CASE NO: N7/28',
        scenario: 'Intelligence report about drug syndicate operations. Ano ang approach mo?',
        options: [
            { text: 'Conduct surveillance at gather more intel', path: 'pdea' },
            { text: 'Immediate raid based sa report', path: 'patrolman' },
            { text: 'Build case file muna bago mag-operate', path: 'investigator' },
            { text: 'Infiltrate the group undercover', path: 'pdea' }
        ]
    },
    {
        id: 11,
        case: 'CASE NO: R6/33',
        scenario: 'May parolee na lumalabag sa conditions. Paano mo i-handle?',
        options: [
            { text: 'Immediate revoke parole at ibalik sa facility', path: 'jail' },
            { text: 'Counsel at give second chance with monitoring', path: 'correction' },
            { text: 'Report sa court at follow protocol', path: 'investigator' },
            { text: 'Coordinate with social workers', path: 'correction' }
        ]
    },
    {
        id: 12,
        case: 'CASE NO: E4/77',
        scenario: 'Major emergency - multiple casualties. You\'re the incident commander. First priority?',
        options: [
            { text: 'Triage at prioritize critical patients', path: 'emergency' },
            { text: 'Secure the scene para safe ang responders', path: 'fire' },
            { text: 'Coordinate all responding units', path: 'emergency' },
            { text: 'Document everything para sa investigation', path: 'investigator' }
        ]
    }
];

// ============================================
// VALIDATION FUNCTIONS
// ============================================

// Validate Philippine Mobile Number
// Accepts: 09XXXXXXXXX, 639XXXXXXXXX, +639XXXXXXXXX, or with dashes/spaces
function isValidPhoneNumber(phone) {
    // Remove all spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');
    
    // Check for various valid formats
    const patterns = [
        /^09\d{9}$/,           // 09XXXXXXXXX
        /^639\d{9}$/,          // 639XXXXXXXXX
        /^\+639\d{9}$/         // +639XXXXXXXXX
    ];
    
    return patterns.some(pattern => pattern.test(cleaned));
}

// Validate Email
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Show error message
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    input.classList.add('invalid');
    
    // Remove existing error message if any
    const existingError = input.parentElement.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorSpan = document.createElement('small');
    errorSpan.className = 'error-text';
    errorSpan.textContent = message;
    input.parentElement.appendChild(errorSpan);
}

// Clear error message
function clearError(inputId) {
    const input = document.getElementById(inputId);
    input.classList.remove('invalid');
    
    const existingError = input.parentElement.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
}

// ============================================
// PAGE NAVIGATION
// ============================================
function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'quizPage') {
        loadQuestion();
    }
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================
document.getElementById('intakeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    // Collect form data
    formData = {
        fullName: document.getElementById('fullName').value.trim(),
        contactNumber: document.getElementById('contactNumber').value.trim(),
        email: document.getElementById('email').value.trim(),
        gradeLevel: document.getElementById('gradeLevel').value.trim(),
        school: document.getElementById('school').value.trim(),
        guardianName: document.getElementById('guardianName').value.trim(),
        guardianContactNumber: document.getElementById('guardianContactNumber').value.trim()
    };
    
    // Validate Contact Number
    if (!isValidPhoneNumber(formData.contactNumber)) {
        showError('contactNumber', '⚠️ Invalid phone number. Use: 09XX-XXX-XXXX');
        isValid = false;
    } else {
        clearError('contactNumber');
    }
    
    // Validate Guardian Contact Number
    if (!isValidPhoneNumber(formData.guardianContactNumber)) {
        showError('guardianContactNumber', '⚠️ Invalid phone number. Use: 09XX-XXX-XXXX');
        isValid = false;
    } else {
        clearError('guardianContactNumber');
    }
    
    // Validate Email
    if (!isValidEmail(formData.email)) {
        showError('email', '⚠️ Please enter a valid email address');
        isValid = false;
    } else {
        clearError('email');
    }
    
    // Check if all fields are filled
    const allFilled = Object.values(formData).every(val => val !== '');
    
    if (!allFilled) {
        alert('❌ Please complete all fields');
        isValid = false;
    }
    
    // If all valid, proceed to quiz
    if (isValid) {
        goToPage('quizPage');
    }
});

// Real-time validation on input
document.getElementById('contactNumber').addEventListener('blur', function() {
    const value = this.value.trim();
    if (value && !isValidPhoneNumber(value)) {
        showError('contactNumber', '⚠️ Invalid phone number. Use: 09XX-XXX-XXXX');
    } else if (value) {
        clearError('contactNumber');
    }
});

document.getElementById('guardianContactNumber').addEventListener('blur', function() {
    const value = this.value.trim();
    if (value && !isValidPhoneNumber(value)) {
        showError('guardianContactNumber', '⚠️ Invalid phone number. Use: 09XX-XXX-XXXX');
    } else if (value) {
        clearError('guardianContactNumber');
    }
});

document.getElementById('email').addEventListener('blur', function() {
    const value = this.value.trim();
    if (value && !isValidEmail(value)) {
        showError('email', '⚠️ Please enter a valid email address');
    } else if (value) {
        clearError('email');
    }
});

// ============================================
// QUIZ LOGIC
// ============================================
function loadQuestion() {
    const q = questions[currentQuestion];
    
    document.getElementById('caseNumber').textContent = q.case;
    document.getElementById('questionText').textContent = q.scenario;
    document.getElementById('progressText').textContent = `CASE PROGRESS: ${currentQuestion + 1} / 12`;
    document.getElementById('progressFill').style.width = `${((currentQuestion + 1) / 12) * 100}%`;
    
    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = '';
    
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            EXHIBIT ${String.fromCharCode(65 + idx)}
            <div class="option-text">${opt.text}</div>
        `;
        btn.onclick = () => selectAnswer(opt.path);
        optionsGrid.appendChild(btn);
    });
}

function selectAnswer(path) {
    quizAnswers[questions[currentQuestion].id] = path;
    
    if (currentQuestion < 11) {
        currentQuestion++;
        setTimeout(() => loadQuestion(), 300);
    } else {
        setTimeout(() => calculateResult(), 300);
    }
}

// ============================================
// CALCULATE RESULT
// ============================================
function calculateResult() {
    const scores = {};
    Object.values(quizAnswers).forEach(path => {
        scores[path] = (scores[path] || 0) + 1;
    });
    
    const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    finalResult = winner;
    
    const resultPath = forensicPaths[winner];
    document.getElementById('resultTitle').textContent = resultPath.title;
    document.getElementById('resultFlavor').textContent = resultPath.flavor;
    
    submitToGoogleSheets(winner);
    goToPage('resultPage');
}

// ============================================
// GOOGLE SHEETS SUBMISSION
// ============================================
async function submitToGoogleSheets(finalPath) {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRNSAO7jLfUN1uJosh_oLQYj_FGU8ACRcn2oU7KiVevqUsJPNSqa3ZcnP2Ewtto2f8ew/exec';
    
    const data = {
        timestamp: new Date().toISOString().split('T')[0],  // ✅ DATE ONLY
        fullName: formData.fullName,
        contactNumber: formData.contactNumber,
        email: formData.email,
        gradeLevel: formData.gradeLevel,
        school: formData.school,
        guardianName: formData.guardianName,
        guardianContactNumber: formData.guardianContactNumber,
        forensicPath: forensicPaths[finalPath].title
    };
    
    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log('✅ Data submitted successfully:', data);
    } catch (error) {
        console.error('❌ Submission error:', error);
    }
}

// ============================================
// TRENDS PAGE
// ============================================
function loadTrends() {
    const mockTrends = {
        'Crime Scene Investigation': 38,
        'Law Enforcement': 28,
        'Emergency Response': 15,
        'Digital Forensics': 19
    };
    
    const trendsContent = document.getElementById('trendsContent');
    trendsContent.innerHTML = '';
    
    Object.entries(mockTrends).forEach(([path, percent]) => {
        const trendBar = document.createElement('div');
        trendBar.className = 'trend-bar';
        trendBar.innerHTML = `
            <div class="trend-label">
                <span class="icon">📊</span> ${path.toUpperCase()}
            </div>
            <div class="bar-container">
                <div class="bar-fill" style="width: ${percent}%"></div>
                <span class="percent">${percent}%</span>
            </div>
        `;
        trendsContent.appendChild(trendBar);
    });
}

document.querySelector('[onclick="goToPage(\'trendsPage\')"]').addEventListener('click', loadTrends);

// ============================================
// RESTART GAME
// ============================================
function restartGame() {
    currentQuestion = 0;
    quizAnswers = {};
    formData = {};
    finalResult = null;
    
    document.getElementById('intakeForm').reset();
    
    // Clear all error messages
    ['contactNumber', 'guardianContactNumber', 'email'].forEach(clearError);
    
    goToPage('landingPage');
}

// ============================================
// INITIALIZE
// ============================================
window.onload = function() {
    console.log('🕵️ Forensic Path Discovery Game Loaded');
    console.log('✅ Ready to investigate!');
};