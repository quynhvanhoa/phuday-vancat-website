// Public content loader - reads data from localStorage and hydrates static pages.
// If no admin data exists, seeds it with defaults so admin and public start in sync.
(function() {
    const STORAGE_KEY = 'phuday_data_v1';

    const POST_CATEGORIES = {
        'su-kien': 'Sự kiện', 'le-hoi': 'Lễ hội',
        'hoat-dong': 'Hoạt động xã hội', 'chuyen-de': 'Chuyên đề', 'thong-bao': 'Thông báo'
    };
    const GALLERY_CATEGORIES = {
        'kien-truc': 'Kiến trúc — Không gian',
        'le-hoi': 'Lễ hội — Sự kiện',
        'hau-dong': 'Nghi lễ hầu đồng',
        'tu-lieu': 'Tư liệu cũ — Ảnh xưa'
    };

    // Seed data — kept in sync with admin/assets/js/data.js DEFAULT_DATA
    const DEFAULT_DATA = {
        settings: {
            siteName: 'Phủ Dầy Vân Cát',
            tagline: 'Nơi Mẫu giáng sinh lần thứ hai',
            phone: '',
            email: 'lienhe@phudayvancat.vn',
            address: 'Phủ Dầy Vân Cát, xã Kim Thái, huyện Vụ Bản, tỉnh Ninh Bình',
            openHours: 'Tất cả các ngày, 06:00 — 19:00',
            bankInfo: ''
        },
        posts: [
            { id: 1, title: 'Khánh thành công trình trùng tu Cung Đệ Tam', slug: 'khanh-thanh-cung-de-tam', category: 'su-kien', excerpt: 'Sau hơn một năm trùng tu, Cung Đệ Tam được khánh thành đúng vào dịp Tiệc Mẫu tháng Ba.', content: 'Sau hơn một năm trùng tu, Cung Đệ Tam được khánh thành đúng vào dịp Tiệc Mẫu tháng Ba, mở ra giai đoạn mới gìn giữ di sản.', date: '2026-05-18', published: true },
            { id: 2, title: 'Hội thi hát văn truyền thống Phủ Dầy 2026', slug: 'hoi-thi-hat-van-2026', category: 'le-hoi', excerpt: 'Hội thi quy tụ các cung văn, thanh đồng từ khắp các tỉnh thành về dâng kính Mẫu.', content: 'Hội thi hát văn truyền thống Phủ Dầy 2026 quy tụ các cung văn, thanh đồng từ khắp các tỉnh thành.', date: '2026-05-10', published: true },
            { id: 3, title: 'Lễ rước Mẫu — Truyền thống nghìn năm', slug: 'le-ruoc-mau', category: 'le-hoi', excerpt: 'Đoàn rước Mẫu qua các phủ chính tại quần thể Phủ Dầy thu hút hàng vạn người dân hành hương.', content: 'Đoàn rước Mẫu qua các phủ chính tại quần thể Phủ Dầy.', date: '2026-05-03', published: true }
        ],
        events: [
            { id: 1, title: 'Tiệc Mẫu Liễu Hạnh — Tiệc chính', lunarDate: '03/03 ÂL', description: 'Tiệc lớn nhất trong năm, kỷ niệm ngày Thánh Mẫu hóa thân.', type: 'tiec' },
            { id: 2, title: 'Tiệc Quan Lớn Đệ Tam', lunarDate: '24/06 ÂL', description: 'Tưởng nhớ Quan Lớn Đệ Tam Thoải Phủ.', type: 'tiec' },
            { id: 3, title: 'Tiệc Chầu Lục Sơn Trang', lunarDate: '12/09 ÂL', description: 'Tiệc tưởng niệm Chầu Lục — vị Chầu cai quản miền sơn lâm.', type: 'tiec' },
            { id: 4, title: 'Tiệc Ông Hoàng Mười', lunarDate: '10/10 ÂL', description: 'Tiệc tưởng nhớ Ông Hoàng Mười.', type: 'tiec' },
            { id: 5, title: 'Tiệc Cô Đôi Thượng Ngàn', lunarDate: '02/02 ÂL', description: 'Tưởng nhớ Cô Đôi — vị Thánh Cô hầu cận Mẫu Thượng Ngàn.', type: 'tiec' }
        ],
        gallery: [
            { id: 1, title: 'Cổng Tam Quan', category: 'kien-truc', imageDataUrl: '' },
            { id: 2, title: 'Tiền tế', category: 'kien-truc', imageDataUrl: '' },
            { id: 3, title: 'Trung từ', category: 'kien-truc', imageDataUrl: '' },
            { id: 4, title: 'Cung Cấm', category: 'kien-truc', imageDataUrl: '' },
            { id: 5, title: 'Lễ rước Mẫu', category: 'le-hoi', imageDataUrl: '' },
            { id: 6, title: 'Hội kéo chữ', category: 'le-hoi', imageDataUrl: '' }
        ]
    };

    // Load data with this priority:
    // 1. localStorage (admin's draft / edits in this browser)
    // 2. content.json (published content on server)
    // 3. DEFAULT_DATA (seeded fallback)
    async function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch {}

        try {
            const inEn = window.location.pathname.includes('/en/');
            const url = inEn ? '../content.json' : 'content.json';
            const res = await fetch(url, { cache: 'no-store' });
            if (res.ok) {
                const json = await res.json();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
                return json;
            }
        } catch {}

        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
        return DEFAULT_DATA;
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function formatDate(iso) {
        if (!iso) return '';
        try {
            const [y, m, d] = iso.split('-');
            return `${d} · ${m} · ${y}`;
        } catch { return iso; }
    }

    function renderNewsItem(post) {
        return `
            <article class="news-item">
                <div class="news-image"></div>
                <div class="news-body">
                    <div class="news-date">${formatDate(post.date)}</div>
                    <h3><a href="bai-viet.html?id=${post.id}" style="color:inherit">${escapeHtml(post.title)}</a></h3>
                    <p>${escapeHtml(post.excerpt || '')}</p>
                    <a href="bai-viet.html?id=${post.id}" class="card-link">Đọc tiếp →</a>
                </div>
            </article>
        `;
    }

    function hydrateHomeNews(data) {
        const newsGrid = document.querySelector('section .news-grid');
        if (!newsGrid || !data.posts) return;
        const published = data.posts.filter(p => p.published !== false);
        published.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        const recent = published.slice(0, 3);
        if (recent.length > 0) {
            newsGrid.innerHTML = recent.map(renderNewsItem).join('');
        } else {
            newsGrid.innerHTML = '<p style="text-align:center; padding:40px; color:var(--color-text-light); grid-column:1/-1;">Chưa có tin tức nào.</p>';
        }
    }

    function hydrateNewsPage(data) {
        const newsGrid = document.querySelector('.news-grid');
        if (!newsGrid || !data.posts) return;
        const published = data.posts.filter(p => p.published !== false);
        published.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        if (published.length > 0) {
            newsGrid.innerHTML = published.map(renderNewsItem).join('');
        } else {
            newsGrid.innerHTML = '<p style="text-align:center; padding:40px; color:var(--color-text-light); grid-column:1/-1;">Chưa có bài viết nào.</p>';
        }
    }

    function hydrateEventsPage(data) {
        const timeline = document.querySelector('.timeline');
        if (!timeline || !data.events) return;
        if (data.events.length > 0) {
            timeline.innerHTML = data.events.map(e => `
                <div class="timeline-item">
                    <div class="timeline-date">${escapeHtml(e.lunarDate || e.gregorianDate || '')}</div>
                    <div class="timeline-content">
                        <h4>${escapeHtml(e.title)}</h4>
                        <p>${escapeHtml(e.description || '')}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    function hydrateGalleryPage(data) {
        if (!data.gallery || data.gallery.length === 0) return;
        const grids = document.querySelectorAll('.gallery-grid');
        if (grids.length === 0) return;

        const byCategory = {
            'kien-truc': data.gallery.filter(g => g.category === 'kien-truc'),
            'le-hoi': data.gallery.filter(g => g.category === 'le-hoi'),
            'hau-dong': data.gallery.filter(g => g.category === 'hau-dong'),
            'tu-lieu': data.gallery.filter(g => g.category === 'tu-lieu')
        };
        const order = ['kien-truc', 'le-hoi', 'hau-dong', 'tu-lieu'];

        order.forEach((cat, idx) => {
            if (idx >= grids.length) return;
            const items = byCategory[cat];
            if (items.length === 0) return;
            grids[idx].innerHTML = items.map(img => `
                <div class="gallery-item" ${img.imageDataUrl ? `style="background-image:url('${img.imageDataUrl}'); background-size:cover; background-position:center;"` : ''}>
                    <div class="gallery-caption">${escapeHtml(img.title)}</div>
                </div>
            `).join('');
        });
    }

    function hydrateContactInfo(data) {
        if (!data.settings) return;
        const s = data.settings;

        document.querySelectorAll('[data-field]').forEach(el => {
            const field = el.dataset.field;
            if (s[field]) el.textContent = s[field];
        });

        if (s.email) {
            document.querySelectorAll('a[href^="mailto:"]').forEach(a => { a.href = 'mailto:' + s.email; });
        }
        if (s.phone) {
            document.querySelectorAll('a[href^="tel:"]').forEach(a => { a.href = 'tel:' + s.phone.replace(/\s/g, ''); });
        }
    }

    function injectAdminLink() {
        const inAdmin = window.location.pathname.includes('/admin/');
        if (inAdmin) return;
        const inEn = window.location.pathname.includes('/en/');
        const adminPath = inEn ? '../admin/index.html' : 'admin/index.html';

        const btn = document.createElement('a');
        btn.href = adminPath;
        btn.textContent = '🔧 Quản trị';
        btn.title = 'Truy cập trang quản trị nội dung';
        btn.style.cssText = `
            position: fixed; bottom: 24px; right: 24px;
            padding: 10px 18px; background: #2E1A0E; color: #D4AF37;
            border-radius: 24px; font-size: 0.9rem; font-weight: 600;
            text-decoration: none; box-shadow: 0 4px 16px rgba(0,0,0,0.25);
            z-index: 99; font-family: 'Be Vietnam Pro', sans-serif;
            transition: transform 0.2s;
        `;
        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
        document.body.appendChild(btn);
    }

    async function init() {
        const data = await loadData();
        if (!data) return;

        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';

        if (filename === 'index.html' || path.endsWith('/website/') || path.endsWith('/')) {
            hydrateHomeNews(data);
        }
        if (filename === 'tin-tuc.html' || filename === 'news.html') {
            hydrateNewsPage(data);
        }
        if (filename === 'le-hoi.html' || filename === 'festival.html') {
            hydrateEventsPage(data);
        }
        if (filename === 'thu-vien.html' || filename === 'gallery.html') {
            hydrateGalleryPage(data);
        }

        hydrateContactInfo(data);
        injectAdminLink();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
