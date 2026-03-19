const STORAGE_KEY = 'bazi_wrong_questions'
const optionLetters = ['A', 'B', 'C', 'D']

let wrongQuestions = []
let practiceData = []
let practiceCurrent = 0
let practiceScore = 0
let showPracticeAnswer = false
let practiceStarted = false
let practiceFinished = false

document.addEventListener('DOMContentLoaded', function() {
  loadWrongQuestions()
  renderWrongQuestions()
})

// 获取错题
function getWrongQuestions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('读取错题失败:', e)
    return []
  }
}

// 保存错题
function saveWrongQuestions(questions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions))
  } catch (e) {
    console.error('保存错题失败:', e)
  }
}

// 添加错题
function addWrongQuestion(question) {
  const wrongQuestions = getWrongQuestions()
  const exists = wrongQuestions.some(item => item.questionId === question.questionId)
  
  if (!exists) {
    wrongQuestions.push({
      ...question,
      id: Date.now(),
      wrongTime: Date.now(),
      wrongCount: 1
    })
  } else {
    const index = wrongQuestions.findIndex(item => item.questionId === question.questionId)
    wrongQuestions[index].wrongCount++
    wrongQuestions[index].wrongTime = Date.now()
  }
  
  saveWrongQuestions(wrongQuestions)
}

// 删除错题
function removeWrongQuestion(questionId) {
  const wrongQuestions = getWrongQuestions()
  const filtered = wrongQuestions.filter(item => item.questionId !== questionId)
  saveWrongQuestions(filtered)
  loadWrongQuestions()
  renderWrongQuestions()
}

// 清空错题
function clearWrongQuestions() {
  saveWrongQuestions([])
  loadWrongQuestions()
  renderWrongQuestions()
}

// 加载错题
function loadWrongQuestions() {
  wrongQuestions = getWrongQuestions()
  
  // 补充完整题目信息
  wrongQuestions = wrongQuestions.map(wq => {
    const fullQuestion = quizData.find(q => q.id === wq.questionId)
    return {
      ...wq,
      ...fullQuestion,
      userAnswerText: optionLetters[wq.userAnswer] || wq.userAnswer,
      correctAnswerText: optionLetters[wq.correctAnswer] || wq.correctAnswer,
      wrongTimeText: formatTime(wq.wrongTime)
    }
  })
}

// 格式化时间
function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 渲染错题列表
function renderWrongQuestions() {
  const statsDiv = document.getElementById('wrong-stats')
  const emptyDiv = document.getElementById('empty-state')
  const listDiv = document.getElementById('wrong-list')

  if (wrongQuestions.length === 0) {
    statsDiv.style.display = 'none'
    emptyDiv.style.display = 'block'
    listDiv.innerHTML = ''
    return
  }

  statsDiv.style.display = 'block'
  emptyDiv.style.display = 'none'

  // 更新统计
  document.getElementById('wrong-count-num').textContent = wrongQuestions.length
  const totalWrongCount = wrongQuestions.reduce((sum, q) => sum + q.wrongCount, 0)
  document.getElementById('wrong-total-count').textContent = totalWrongCount

  // 渲染列表
  listDiv.innerHTML = wrongQuestions.map((question, index) => `
    <div class="wrong-item">
      <div class="wrong-header">
        <div class="wrong-badge">
          <span class="badge-text">第${index + 1}题</span>
        </div>
        <div class="wrong-meta">
          <span class="wrong-count">错 ${question.wrongCount} 次</span>
          <span class="wrong-time">${question.wrongTimeText}</span>
        </div>
      </div>
      <div class="wrong-question">${escapeHtml(question.question)}</div>
      <div class="wrong-answer">
        <span class="answer-label">你的答案：</span>
        <span class="answer-wrong">${question.userAnswerText}</span>
      </div>
      <div class="wrong-answer">
        <span class="answer-label">正确答案：</span>
        <span class="answer-correct">${question.correctAnswerText}</span>
      </div>
      <div class="wrong-footer">
        <button class="btn-sm btn-remove" onclick="removeWrongQuestion(${question.questionId})">删除</button>
      </div>
    </div>
  `).join('')
}

// 开始练习
function startPractice() {
  practiceData = [...wrongQuestions]
  practiceStarted = false
  practiceFinished = false
  
  document.getElementById('practice-modal').style.display = 'block'
  document.getElementById('start-practice-btn').style.display = 'inline-block'
  document.getElementById('next-practice-btn').style.display = 'none'
  document.getElementById('restart-practice-btn').style.display = 'none'
  document.getElementById('practice-progress').style.display = 'none'
  document.getElementById('practice-question').style.display = 'none'
  document.getElementById('practice-result').style.display = 'none'
}

// 关闭练习
function closePractice() {
  document.getElementById('practice-modal').style.display = 'none'
}

// 开始练习
function startPracticeQuiz() {
  practiceStarted = true
  practiceFinished = false
  practiceCurrent = 0
  practiceScore = 0
  showPracticeAnswer = false

  document.getElementById('start-practice-btn').style.display = 'none'
  document.getElementById('practice-progress').style.display = 'block'
  document.getElementById('practice-question').style.display = 'block'
  
  loadPracticeQuestion()
}

// 加载练习题目
function loadPracticeQuestion() {
  const question = practiceData[practiceCurrent]
  const progress = ((practiceCurrent) / practiceData.length) * 100
  
  document.getElementById('progress-fill').style.width = progress + '%'
  document.getElementById('progress-text').textContent = `${practiceCurrent + 1} / ${practiceData.length}`
  
  document.getElementById('practice-question-text').textContent = question.question
  
  const optionsList = document.getElementById('practice-options-list')
  optionsList.innerHTML = (question.options || []).map((opt, idx) => `
    <div class="option-item" data-index="${idx}" onclick="selectPracticeOption(${idx})">
      <span class="option-letter">${optionLetters[idx]}</span>
      <span class="option-text">${escapeHtml(opt)}</span>
    </div>
  `).join('')
  
  document.getElementById('practice-explanation').style.display = 'none'
  document.getElementById('next-practice-btn').style.display = 'none'
  showPracticeAnswer = false
}

// 选择练习选项
function selectPracticeOption(index) {
  if (showPracticeAnswer) return

  const options = document.querySelectorAll('#practice-options-list .option-item')
  options.forEach(opt => opt.classList.add('disabled'))
  options[index].classList.add('selected')

  setTimeout(() => {
    checkPracticeAnswer(index)
  }, 300)
}

// 检查练习答案
function checkPracticeAnswer(selectedIndex) {
  const question = practiceData[practiceCurrent]
  const isCorrect = selectedIndex === question.answer
  
  if (isCorrect) {
    practiceScore++
  }

  const options = document.querySelectorAll('#practice-options-list .option-item')
  options.forEach((opt, idx) => {
    if (idx === question.answer) {
      opt.classList.add('correct')
    } else if (idx === selectedIndex && !isCorrect) {
      opt.classList.add('wrong')
    }
  })

  // 显示解析
  document.getElementById('practice-explanation-text').textContent = question.explanation || '暂无解析'
  document.getElementById('practice-explanation').style.display = 'block'

  document.getElementById('next-practice-btn').style.display = 'inline-block'
  document.getElementById('next-practice-btn').textContent = practiceCurrent < practiceData.length - 1 ? '下一题 →' : '查看结果'
  
  showPracticeAnswer = true
}

// 下一题
function nextPracticeQuestion() {
  if (practiceCurrent < practiceData.length - 1) {
    practiceCurrent++
    loadPracticeQuestion()
  } else {
    finishPractice()
  }
}

// 完成练习
function finishPractice() {
  practiceFinished = true
  const score = practiceScore
  const total = practiceData.length
  const percentage = Math.round((score / total) * 100)

  let resultIcon, resultTitle, resultDesc
  if (percentage >= 80) {
    resultIcon = '🎉'
    resultTitle = '太棒了！'
    resultDesc = '错题掌握得很好！'
  } else if (percentage >= 60) {
    resultIcon = '👍'
    resultTitle = '不错！'
    resultDesc = '继续加油，还有进步空间！'
  } else {
    resultIcon = '💪'
    resultTitle = '继续努力！'
    resultDesc = '建议再多复习一下！'
  }

  document.getElementById('result-icon').textContent = resultIcon
  document.getElementById('result-score').textContent = `${score} / ${total}`
  document.getElementById('result-title').textContent = resultTitle
  document.getElementById('result-desc').textContent = resultDesc

  document.getElementById('practice-question').style.display = 'none'
  document.getElementById('practice-result').style.display = 'block'
  document.getElementById('next-practice-btn').style.display = 'none'
  document.getElementById('restart-practice-btn').style.display = 'inline-block'
}

// 重新练习
function restartPractice() {
  startPracticeQuiz()
}

// 清空所有错题
function clearAll() {
  if (confirm('确定要清空所有错题吗？此操作不可恢复！')) {
    clearWrongQuestions()
  }
}

// 返回首页
function goHome() {
  window.location.href = 'index.html'
}

// 去做题
function goToQuiz() {
  window.location.href = 'quiz.html'
}

// HTML转义
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 点击模态框外部关闭
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
}
