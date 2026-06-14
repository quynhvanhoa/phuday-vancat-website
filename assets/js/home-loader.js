(function () {
  var REPO = 'quynhvanhoa/phuday-vancat-website'

  function parseFrontmatter(text) {
    var m = text.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n?([\s\S]*)$/)
    if (!m) return { data: {}, body: text }
    try {
      return { data: jsyaml.load(m[1]) || {}, body: m[2] }
    } catch (e) {
      console.error('YAML parse error', e)
      return { data: {}, body: m[2] }
    }
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso)
      if (isNaN(d)) return iso
      return ('0' + d.getDate()).slice(-2) + ' · ' + ('0' + (d.getMonth() + 1)).slice(-2) + ' · ' + d.getFullYear()
    } catch (e) { return iso }
  }

  async function loadHomeContent() {
    try {
      var url = 'https://raw.githubusercontent.com/' + REPO + '/main/content/pages/index.md?t=' + Math.floor(Date.now() / 60000)
      var res = await fetch(url)
      if (!res.ok) return
      var text = await res.text()
      var parsed = parseFrontmatter(text)
      var d = parsed.data

      var titleEl = document.getElementById('hero-title')
      if (titleEl && d.title) titleEl.textContent = d.title

      var subtitleEl = document.getElementById('hero-subtitle')
      if (subtitleEl && d.hero_subtitle) subtitleEl.innerHTML = esc(d.hero_subtitle).replace(/\n/g, '<br>')

      var welcomeTitleEl = document.getElementById('welcome-title')
      if (welcomeTitleEl && d.welcome_title) welcomeTitleEl.textContent = d.welcome_title

      var welcomeTextEl = document.getElementById('welcome-text')
      if (welcomeTextEl) {
        var body = parsed.body.trim()
        var inner = window.marked ? marked.parseInline(body) : esc(body)
        welcomeTextEl.innerHTML = inner +
          (d.welcome_signature ? '<cite>— ' + esc(d.welcome_signature) + '</cite>' : '')
      }

      if (d.hero_image) {
        var hero = document.getElementById('hero-section')
        if (hero) {
          hero.style.backgroundImage =
            'linear-gradient(rgba(46,26,14,0.55), rgba(46,26,14,0.55)), url(\'' + d.hero_image + '\')'
          hero.style.backgroundSize = 'cover'
          hero.style.backgroundPosition = 'center'
        }
      }

      if (d.welcome_image) {
        var wImg = document.getElementById('welcome-image')
        if (wImg) {
          wImg.style.background = 'url(\'' + d.welcome_image + '\') center/cover no-repeat'
          wImg.textContent = ''
        }
      }

      ;['tour', 'worship', 'feast', 'donate'].forEach(function (key) {
        var img = d['card_' + key + '_image']
        if (!img) return
        var iconEl = document.getElementById('card-icon-' + key)
        if (!iconEl) return
        iconEl.style.backgroundImage = 'url(\'' + img + '\')'
        iconEl.style.backgroundSize = 'cover'
        iconEl.style.backgroundPosition = 'center'
        iconEl.textContent = ''
      })
    } catch (err) { console.error(err) }
  }

  async function loadLatestPosts() {
    var grid = document.getElementById('latest-news')
    if (!grid) return
    try {
      var cached = JSON.parse(localStorage.getItem('phuday_posts_v1') || 'null')
      var posts
      if (cached && (Date.now() - cached.time < 5 * 60 * 1000)) {
        posts = cached.posts
      } else {
        var res = await fetch('https://api.github.com/repos/' + REPO + '/contents/content/posts', {
          headers: { Accept: 'application/vnd.github.v3+json' }
        })
        if (!res.ok) throw new Error('HTTP ' + res.status)
        var files = (await res.json()).filter(function (f) { return f.name.endsWith('.md') })
        posts = await Promise.all(files.map(async function (f) {
          var r = await fetch(f.download_url)
          var t = await r.text()
          var p = parseFrontmatter(t)
          return Object.assign({ filename: f.name, body: p.body }, p.data)
        }))
        posts.sort(function (a, b) { return new Date(b.date || 0) - new Date(a.date || 0) })
        localStorage.setItem('phuday_posts_v1', JSON.stringify({ time: Date.now(), posts: posts }))
      }

      var latest = posts.slice(0, 3)
      if (!latest.length) {
        grid.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">Chưa có bài viết nào.</p>'
        return
      }
      grid.innerHTML = latest.map(function (p) {
        var slug = p.filename.replace(/\.md$/, '')
        var href = 'bai-viet.html?slug=' + encodeURIComponent(slug)
        var img = p.thumbnail
          ? '<a href="' + href + '" class="news-image" style="background-image:url(\'' + esc(p.thumbnail) + '\');background-size:cover;background-position:center;display:block;"></a>'
          : '<a href="' + href + '" class="news-image" style="display:block;"></a>'
        var excerpt = p.excerpt || p.body.replace(/#{1,6}\s[^\n]+/g, '').replace(/[*_`\[\]!]/g, '').trim().slice(0, 110) + '…'
        return '<article class="news-item">' +
          img +
          '<div class="news-body">' +
          (p.date ? '<div class="news-date">' + formatDate(p.date) + '</div>' : '') +
          '<h3><a href="' + href + '" style="color:inherit;text-decoration:none;">' + esc(p.title || '(Không có tiêu đề)') + '</a></h3>' +
          '<p>' + esc(excerpt) + '</p>' +
          '<a href="' + href + '" class="card-link">Đọc tiếp →</a>' +
          '</div></article>'
      }).join('')
    } catch (err) {
      console.error(err)
      grid.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">Không tải được tin tức.</p>'
    }
  }

  loadHomeContent()
  loadLatestPosts()
})()
