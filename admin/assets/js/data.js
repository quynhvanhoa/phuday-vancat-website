// Data management for Phủ Dầy Vân Cát admin
// Storage: browser localStorage (demo / single-device).
const STORAGE_KEY = 'phuday_data_v1';

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
        {
            id: 1,
            title: 'Khánh thành công trình trùng tu Cung Đệ Tam',
            slug: 'khanh-thanh-cung-de-tam',
            category: 'su-kien',
            excerpt: 'Sau hơn một năm trùng tu, Cung Đệ Tam được khánh thành đúng vào dịp Tiệc Mẫu tháng Ba.',
            content: 'Sau hơn một năm trùng tu, Cung Đệ Tam được khánh thành đúng vào dịp Tiệc Mẫu tháng Ba, mở ra giai đoạn mới gìn giữ di sản. Lễ khánh thành quy tụ đông đảo tín hữu, các nhà nghiên cứu và đại diện chính quyền địa phương.',
            date: '2026-05-18',
            published: true
        },
        {
            id: 2,
            title: 'Hội thi hát văn truyền thống Phủ Dầy 2026',
            slug: 'hoi-thi-hat-van-2026',
            category: 'le-hoi',
            excerpt: 'Hội thi quy tụ các cung văn, thanh đồng từ khắp các tỉnh thành về dâng kính Mẫu.',
            content: 'Hội thi hát văn truyền thống Phủ Dầy 2026 quy tụ các cung văn, thanh đồng từ khắp các tỉnh thành về dâng kính Mẫu, tôn vinh nghệ thuật hát văn — di sản phi vật thể đại diện của nhân loại.',
            date: '2026-05-10',
            published: true
        },
        {
            id: 3,
            title: 'Lễ rước Mẫu — Truyền thống nghìn năm',
            slug: 'le-ruoc-mau',
            category: 'le-hoi',
            excerpt: 'Đoàn rước Mẫu qua các phủ chính tại quần thể Phủ Dầy thu hút hàng vạn người dân hành hương.',
            content: 'Đoàn rước Mẫu qua các phủ chính tại quần thể Phủ Dầy thu hút hàng vạn người dân hành hương từ khắp nơi đổ về.',
            date: '2026-05-03',
            published: true
        }
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

const POST_CATEGORIES = {
    'su-kien': 'Sự kiện',
    'le-hoi': 'Lễ hội',
    'hoat-dong': 'Hoạt động xã hội',
    'chuyen-de': 'Chuyên đề',
    'thong-bao': 'Thông báo'
};

const GALLERY_CATEGORIES = {
    'kien-truc': 'Kiến trúc — Không gian',
    'le-hoi': 'Lễ hội — Sự kiện',
    'hau-dong': 'Nghi lễ hầu đồng',
    'tu-lieu': 'Tư liệu cũ — Ảnh xưa'
};

const Data = {
    // Synchronous load from localStorage. If empty, returns default seed.
    // For first-time load of live content.json, call loadFromServer() first.
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                this.save(DEFAULT_DATA);
                return JSON.parse(JSON.stringify(DEFAULT_DATA));
            }
            return JSON.parse(raw);
        } catch (e) {
            console.error('Failed to load data', e);
            return JSON.parse(JSON.stringify(DEFAULT_DATA));
        }
    },
    // Fetch the live content.json from the server. Use to pull current
    // published content into admin (e.g. after deploying to GitHub Pages).
    async loadFromServer() {
        try {
            const res = await fetch('../content.json', { cache: 'no-store' });
            if (res.ok) {
                const json = await res.json();
                this.save(json);
                return json;
            }
        } catch (e) { console.error('loadFromServer failed', e); }
        return null;
    },
    // Publish: download content.json file ready to commit to repo.
    publish() {
        const data = this.load();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content.json';
        a.click();
        URL.revokeObjectURL(url);
    },
    save(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    reset() {
        localStorage.removeItem(STORAGE_KEY);
        return this.load();
    },
    export() {
        const data = this.load();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `phuday-content-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },
    import(jsonText) {
        const parsed = JSON.parse(jsonText);
        this.save(parsed);
        return parsed;
    },
    nextId(collection) {
        const data = this.load();
        const items = data[collection] || [];
        return items.length === 0 ? 1 : Math.max(...items.map(i => i.id || 0)) + 1;
    },
    add(collection, item) {
        const data = this.load();
        item.id = this.nextId(collection);
        if (!data[collection]) data[collection] = [];
        data[collection].push(item);
        this.save(data);
        return item;
    },
    update(collection, id, updates) {
        const data = this.load();
        const items = data[collection] || [];
        const idx = items.findIndex(i => i.id === id);
        if (idx >= 0) {
            items[idx] = { ...items[idx], ...updates, id };
            this.save(data);
            return items[idx];
        }
        return null;
    },
    remove(collection, id) {
        const data = this.load();
        const items = data[collection] || [];
        const filtered = items.filter(i => i.id !== id);
        data[collection] = filtered;
        this.save(data);
    },
    get(collection, id) {
        const data = this.load();
        return (data[collection] || []).find(i => i.id === id);
    },
    list(collection) {
        const data = this.load();
        return data[collection] || [];
    },
    getSettings() { return this.load().settings; },
    saveSettings(settings) {
        const data = this.load();
        data.settings = { ...data.settings, ...settings };
        this.save(data);
    }
};
