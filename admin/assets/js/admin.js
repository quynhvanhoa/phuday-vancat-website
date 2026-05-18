// Admin core: auth, toast, modal, layout helpers
const AUTH_KEY = 'phuday_auth';
const DEMO_USER = 'admin';
const DEMO_PASS = 'phuday2026';

const Auth = {
    login(user, pass) {
        if (user === DEMO_USER && pass === DEMO_PASS) {
            sessionStorage.setItem(AUTH_KEY, JSON.stringify({ user, loginAt: Date.now() }));
            return true;
        }
        return false;
    },
    logout() {
        sessionStorage.removeItem(AUTH_KEY);
        window.location.href = 'index.html';
    },
    check() {
        const raw = sessionStorage.getItem(AUTH_KEY);
        if (!raw) {
            window.location.href = 'index.html';
            return null;
        }
        return JSON.parse(raw);
    },
    current() {
        const raw = sessionStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    }
};

function toast(message, type = 'success') {
    let el = document.querySelector('.toast');
    if (!el) {
        el = document.createElement('div');
        el.className = 'toast';
        document.body.appendChild(el);
    }
    el.className = 'toast ' + type;
    el.textContent = message;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2800);
}

function confirmModal({ title, message, confirmLabel = 'Xóa', confirmClass = 'btn-danger' }) {
    return new Promise(resolve => {
        const wrap = document.createElement('div');
        wrap.className = 'modal-overlay show';
        wrap.innerHTML = `
            <div class="modal">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="modal-actions">
                    <button class="btn" data-action="cancel">Hủy</button>
                    <button class="btn ${confirmClass}" data-action="confirm">${confirmLabel}</button>
                </div>
            </div>
        `;
        document.body.appendChild(wrap);
        wrap.addEventListener('click', e => {
            if (e.target === wrap || e.target.dataset.action === 'cancel') {
                document.body.removeChild(wrap);
                resolve(false);
            }
            if (e.target.dataset.action === 'confirm') {
                document.body.removeChild(wrap);
                resolve(true);
            }
        });
    });
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDate(iso) {
    if (!iso) return '—';
    try {
        const d = new Date(iso);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return iso; }
}

function slugify(str) {
    return String(str || '')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function renderUserChip() {
    const auth = Auth.current();
    if (!auth) return '';
    const initial = (auth.user || 'A').charAt(0).toUpperCase();
    return `
        <div class="user-chip">
            <div class="user-avatar">${initial}</div>
            <span>${escapeHtml(auth.user)}</span>
        </div>
        <button class="btn btn-sm" onclick="Auth.logout()">Đăng xuất</button>
    `;
}

function renderSidebar(activePage) {
    const items = [
        { href: 'dashboard.html', icon: '📊', label: 'Dashboard', key: 'dashboard' },
        { href: 'posts.html', icon: '📝', label: 'Bài viết', key: 'posts' },
        { href: 'events.html', icon: '📅', label: 'Sự kiện / Tiệc', key: 'events' },
        { href: 'gallery.html', icon: '🖼️', label: 'Thư viện ảnh', key: 'gallery' },
        { href: 'settings.html', icon: '⚙️', label: 'Cài đặt', key: 'settings' }
    ];
    return `
        <div class="sidebar-header">
            <div class="sidebar-logo">
                <div class="sidebar-logo-icon">慕</div>
                <div>
                    <div class="sidebar-logo-text">Phủ Dầy Vân Cát</div>
                    <div class="sidebar-logo-sub">Quản trị nội dung</div>
                </div>
            </div>
        </div>
        <nav class="sidebar-nav">
            ${items.map(i => `
                <a href="${i.href}" class="${activePage === i.key ? 'active' : ''}">
                    <span class="icon">${i.icon}</span> ${i.label}
                </a>
            `).join('')}
        </nav>
        <div class="sidebar-footer">
            <a href="../index.html" target="_blank">⇲ Xem website</a>
        </div>
    `;
}

function initAdminLayout(activePage, title) {
    Auth.check();
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.innerHTML = renderSidebar(activePage);
    const topbarTitle = document.querySelector('.topbar h1');
    if (topbarTitle && title) topbarTitle.textContent = title;
    const topbarActions = document.querySelector('.topbar-actions');
    if (topbarActions) topbarActions.innerHTML = renderUserChip();
}
