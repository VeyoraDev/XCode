// ===== DATA SOAL =====
const questions = [
    {
        code: `function add(a, b) {\n  return a - b;\n}`,
        options: ['Fungsi pengurangan', 'Fungsi penjumlahan', 'Fungsi perkalian', 'Fungsi pembagian'],
        answer: 1
    },
    {
        code: `let x = 5;\nlet y = '5';\nconsole.log(x == y);`,
        options: ['true', 'false', 'undefined', 'error'],
        answer: 0
    },
    {
        code: `for(let i=0; i<3; i++) {\n  console.log(i);\n}`,
        options: ['0 1 2', '1 2 3', '0 1 2 3', 'error'],
        answer: 0
    },
    {
        code: `const arr = [1,2,3];\narr.push(4);\nconsole.log(arr.length);`,
        options: ['3', '4', '5', 'error'],
        answer: 1
    },
    {
        code: `function test() {\n  return arguments.length;\n}\ntest(1,2,3);`,
        options: ['0', '1', '2', '3'],
        answer: 3
    },
    {
        code: `let a = [1,2,3];\nlet b = a;\nb.push(4);\nconsole.log(a.length);`,
        options: ['3', '4', '5', 'error'],
        answer: 1
    },
    {
        code: `console.log(typeof null);`,
        options: ['null', 'undefined', 'object', 'number'],
        answer: 2
    },
    {
        code: `let x = 10;\nif(x = 5) {\n  console.log('yes');\n}`,
        options: ['yes', 'no', 'error', 'undefined'],
        answer: 0
    },
    {
        code: `setTimeout(() => {\n  console.log('done');\n}, 0);\nconsole.log('start');`,
        options: ['start done', 'done start', 'start', 'done'],
        answer: 0
    },
    {
        code: `class Car {\n  constructor() {\n    this.wheels = 4;\n  }\n}\nconst c = new Car();\nconsole.log(c.wheels);`,
        options: ['4', 'undefined', 'error', 'null'],
        answer: 0
    }
];

// ===== STATE =====
let currentIndex = 0;
let score = 0;
let streak = 0;
let unlocked = 0;
let timer = 30;
let timerInterval = null;
let isAnswered = false;

// DOM refs
const codeEl = document.getElementById('code-content');
const optBtns = document.querySelectorAll('.opt');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const unlockedEl = document.getElementById('unlocked');
const timerEl = document.getElementById('timer');

// ===== FUNGSI =====
function loadQuestion(index) {
    const q = questions[index];
    if (!q) {
        // Game selesai
        codeEl.textContent = '🏆 GAME OVER! Lo berhasil!\n🎉 Tekan F5 buat main lagi.';
        optBtns.forEach(btn => btn.style.display = 'none');
        feedbackEl.textContent = `🔥 Skor akhir: ${score} | Unlocked: ${unlocked} tools`;
        clearInterval(timerInterval);
        timerEl.textContent = '⏱️ 0s';
        return;
    }

    codeEl.textContent = q.code;
    optBtns.forEach((btn, i) => {
        btn.textContent = String.fromCharCode(65 + i) + '. ' + q.options[i];
        btn.className = 'opt';
        btn.disabled = false;
    });
    feedbackEl.textContent = '';
    isAnswered = false;
    timer = 30;
    timerEl.textContent = `⏱️ ${timer}s`;

    // Reset timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer--;
        timerEl.textContent = `⏱️ ${timer}s`;
        if (timer <= 0) {
            clearInterval(timerInterval);
            // Timeout = otomatis salah
            if (!isAnswered) {
                feedbackEl.textContent = '⏰ Habis waktu! Jawaban salah.';
                optBtns.forEach(btn => btn.disabled = true);
                setTimeout(() => {
                    currentIndex++;
                    loadQuestion(currentIndex);
                }, 1200);
            }
        }
    }, 1000);
}

function handleAnswer(selectedIndex) {
    if (isAnswered) return;
    isAnswered = true;
    clearInterval(timerInterval);

    const q = questions[currentIndex];
    const isCorrect = (selectedIndex === q.answer);

    // Highlight
    optBtns.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('correct');
        if (i === selectedIndex && !isCorrect) btn.classList.add('wrong');
    });

    if (isCorrect) {
        score += 10 + streak * 2;
        streak++;
        if (streak >= 3) {
            unlocked++;
            unlockedEl.textContent = unlocked;
            feedbackEl.innerHTML = '🔥 <span style="color:#ff00ff;">TOOL UNLOCKED! +1</span>';
        } else {
            feedbackEl.textContent = '✅ Mantap! Jawaban bener!';
        }
    } else {
        streak = 0;
        feedbackEl.textContent = '❌ Salah! Jawaban: ' + String.fromCharCode(65 + q.answer);
    }

    scoreEl.textContent = score;
    streakEl.textContent = streak;

    setTimeout(() => {
        currentIndex++;
        loadQuestion(currentIndex);
    }, 1500);
}

// ===== EVENT LISTENER =====
optBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => handleAnswer(idx));
});

// ===== START =====
loadQuestion(0);
