// ===== 공통 유틸리티 =====

// 관리자 인증 상태
const ADMIN_CREDENTIALS = { id: 'admin', pw: 'admin' };
const ADMIN_SESSION_KEY = 'aircraft_admin_session';

function isAdminLoggedIn() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

function adminLogin(id, pw) {
  if (id === ADMIN_CREDENTIALS.id && pw === ADMIN_CREDENTIALS.pw) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    return true;
  }
  return false;
}

function adminLogout() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

// 날짜 포맷
function formatDate(timestamp) {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const diffMin = Math.floor(diff / 60000);
  const diffHour = Math.floor(diff / 3600000);
  const diffDay = Math.floor(diff / 86400000);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).replace(/\. /g, '.').replace('.', '년 ').replace('.', '월 ') + '일';
}

// 토스트 메시지
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || icons.info}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// HTML 이스케이프
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 마크다운 간단 변환 (제목, 굵기, 표)
function renderMarkdown(text) {
  if (!text) return '';
  let html = escapeHtml(text);

  // 표 변환
  const tableRegex = /\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/gm;
  html = html.replace(tableRegex, (match, header, rows) => {
    const headers = header.split('|').map(h => h.trim()).filter(Boolean);
    const headerHtml = headers.map(h => `<th>${h}</th>`).join('');
    const rowsHtml = rows.trim().split('\n').map(row => {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean);
      return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
    }).join('');
    return `<table class="spec-table"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
  });

  // ## 제목
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  // **굵기**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // - 목록
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((<li>.+<\/li>\n?)+)/g, '<ul>$1</ul>');
  // 줄바꿈
  html = html.replace(/\n(?!<)/g, '<br>');

  return html;
}

// 네비게이션 햄버거
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // 현재 페이지 활성화
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // 관리자 로그인 상태에 따라 버튼 텍스트 변경
  const adminBtn = document.querySelector('.nav-admin-btn');
  if (adminBtn && isAdminLoggedIn()) {
    adminBtn.textContent = '🔓 관리자 모드';
  }
});
