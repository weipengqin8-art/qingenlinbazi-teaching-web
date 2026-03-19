// 首页逻辑
document.addEventListener('DOMContentLoaded', function() {
  renderCourseList();
  updateQuizCount();
  updateWrongCount();
});

// 渲染课程列表
function renderCourseList() {
  const courseList = document.getElementById('course-list');
  courseList.innerHTML = '';

  Object.keys(courseData).forEach(key => {
    const course = courseData[key];
    const div = document.createElement('div');
    div.className = 'course-card';
    div.onclick = () => goToCourse(key);
    div.innerHTML = `
      <div class="course-icon">📖</div>
      <div class="course-info">
        <div class="course-title">${course.title}</div>
        <div class="course-desc">${course.subtitle}</div>
      </div>
      <div class="arrow">›</div>
    `;
    courseList.appendChild(div);
  });
}

// 更新题目数量
function updateQuizCount() {
  document.getElementById('quiz-count').textContent = `${quizData.length}道选择题，检验学习成果`;
}

// 跳转到课程详情页
function goToCourse(courseKey) {
  sessionStorage.setItem('currentCourse', courseKey);
  window.location.href = 'course.html';
}

// 更新错题数量
function updateWrongCount() {
  try {
    const wrongQuestions = JSON.parse(localStorage.getItem('bazi_wrong_questions') || '[]');
    const wrongCountEl = document.getElementById('wrong-count');
    if (wrongCountEl) {
      wrongCountEl.textContent = `${wrongQuestions.length}道错题，查看和练习`;
    }
  } catch (e) {
    console.error('读取错题数量失败:', e);
  }
}

// 跳转到题目练习页
function goToQuiz() {
  window.location.href = 'quiz.html';
}

// 跳转到错题本
function goToWrongQuestions() {
  window.location.href = 'wrong-questions.html';
}
