// 课程详情页逻辑
let currentCourseKey = '';

document.addEventListener('DOMContentLoaded', function() {
  currentCourseKey = sessionStorage.getItem('currentCourse');
  if (!currentCourseKey || !courseData[currentCourseKey]) {
    goBack();
    return;
  }
  renderCourseContent();
});

// 渲染课程内容
function renderCourseContent() {
  const course = courseData[currentCourseKey];
  
  // 设置页面标题
  document.getElementById('course-title').textContent = course.title;
  document.title = course.title + ' - 秦根霖命理教学';

  const content = document.getElementById('course-content');
  content.innerHTML = '';

  (course.content || []).forEach(section => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'course-section';
    
    let pointsHtml = '';
    (section.points || []).forEach(point => {
      if (point.trim()) {
        pointsHtml += `
          <div class="course-point">
            <span class="course-point-icon">•</span>
            <span class="course-point-text">${escapeHtml(point)}</span>
          </div>
        `;
      }
    });

    sectionDiv.innerHTML = `
      <div class="course-section-title">${escapeHtml(section.title)}</div>
      <div class="course-points">
        ${pointsHtml}
      </div>
    `;
    content.appendChild(sectionDiv);
  });
}

// 返回
function goBack() {
  window.location.href = 'index.html';
}

// 跳转到题目练习页
function goToQuiz() {
  window.location.href = 'quiz.html';
}

// HTML转义
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
