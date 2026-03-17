// 题目练习页逻辑
let currentIndex = 0;
let userAnswers = [];
let score = 0;
let answered = false;

document.addEventListener('DOMContentLoaded', function() {
  initQuiz();
});

// 初始化练习
function initQuiz() {
  currentIndex = 0;
  userAnswers = [];
  score = 0;
  answered = false;
  renderQuestion();
  updateProgress();
}

// 渲染当前题目
function renderQuestion() {
  const quiz = quizData[currentIndex];
  answered = false;

  const content = document.getElementById('quiz-content');
  const letters = ['A', 'B', 'C', 'D'];

  content.innerHTML = `
    <div class="question-card">
      <div class="question-number">第 ${currentIndex + 1} 题</div>
      <div class="question-text">${escapeHtml(quiz.question)}</div>
      <div class="options-list">
        ${(quiz.options || []).map((opt, idx) => `
          <div class="option-item" data-index="${idx}" onclick="selectOption(${idx})">
            <span class="option-letter">${letters[idx]}</span>
            <span class="option-text">${escapeHtml(opt)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // 更新下一题按钮
  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = true;
  nextBtn.textContent = currentIndex < quizData.length - 1 ? '查看结果' : '下一题 →';

  // 更新底部栏
  const bottomBar = document.getElementById('quiz-bottom-bar');
  bottomBar.style.display = 'block';
}

// 选择选项
function selectOption(index) {
  if (answered) return;

  answered = true;
  userAnswers[currentIndex] = index;

  const quiz = quizData[currentIndex];
  const options = document.querySelectorAll('.option-item');
  const isCorrect = index === quiz.answer;

  if (isCorrect) {
    score++;
  }

  // 标记选项状态
  options.forEach((opt, idx) => {
    opt.classList.add('disabled');
    if (idx === quiz.answer) {
      opt.classList.add('correct');
    } else if (idx === index && !isCorrect) {
      opt.classList.add('wrong');
    }
  });

  // 显示解析
  const explanationDiv = document.createElement('div');
  explanationDiv.className = 'explanation';
  explanationDiv.innerHTML = `
    <div class="explanation-title">📝 解析</div>
    <div class="explanation-text">${escapeHtml(quiz.explanation || '暂无解析')}</div>
  `;
  document.querySelector('.question-card').appendChild(explanationDiv);

  // 启用下一题按钮
  document.getElementById('next-btn').disabled = false;
}

// 下一题
function nextQuestion() {
  if (currentIndex < quizData.length - 1) {
    currentIndex++;
    renderQuestion();
    updateProgress();
  } else {
    showResult();
  }
}

// 更新进度
function updateProgress() {
  const progress = ((currentIndex + 1) / quizData.length) * 100;
  document.getElementById('progress-bar').style.setProperty('--progress', progress + '%');
  document.getElementById('progress-text').textContent = `第 ${currentIndex + 1} 题 / 共 ${quizData.length} 题`;
}

// 显示结果
function showResult() {
  const modal = document.getElementById('result-modal');
  const percentage = Math.round((score / quizData.length) * 100);

  // 设置结果内容
  document.getElementById('result-score').textContent = `${score} / ${quizData.length}`;

  let icon, title, desc;
  if (percentage >= 80) {
    icon = '🎉';
    title = '太棒了！';
    desc = '你已经掌握得很好了！';
  } else if (percentage >= 60) {
    icon = '👍';
    title = '不错哦！';
    desc = '继续加油，再接再厉！';
  } else {
    icon = '💪';
    title = '继续努力！';
    desc = '多复习一下课程内容吧！';
  }

  document.getElementById('result-icon').textContent = icon;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-desc').textContent = desc;

  // 隐藏底部栏，显示弹窗
  document.getElementById('quiz-bottom-bar').style.display = 'none';
  modal.classList.add('show');
}

// 重新练习
function restartQuiz() {
  document.getElementById('result-modal').classList.remove('show');
  initQuiz();
}

// 返回首页
function goHome() {
  window.location.href = 'index.html';
}

// 返回
function goBack() {
  window.location.href = 'index.html';
}

// HTML转义
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
