(function () {
  var REPO = 'quynhvanhoa/phuday-vancat-website'
  var POSTS_PATH = 'content/posts'
  var FILTER = window.POSTS_FILTER || {}
  var CACHE_KEY = 'phuday_posts_v1'
  var CACHE_TTL = 5 * 60 * 1000

  function parseFrontmatter(text) {
    var m = text.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n?([\s\S]*)$/)
    if (!m) return { data: {}, body: text }
    var data = {}
    m[1].split('\n').forEach(function (line) {
      var idx = line.indexOf(':')
      if (idx === -1) return
      var key = line.slice(0, idx).trim()
      var val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
      data[key] = val
    })
    return { data: data, body: m[2] }
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso)
      if (isNaN(d)) return iso
      return ('0' + d.getDate()).slice(-2) + ' · ' + ('0' + (d.getMonth() + 1)).slice(-2) + ' · ' + d.getFullYear()
    } catch (e) { return iso }
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }

  function applyFilter(posts) {
    if (FILTER.include) return posts.filter(function (p) { return p.category === FILTER.include })
    if (FILTER.exclude) return posts.filter(function (p) { return p.category !== FILTER.exclude })
    return posts
  }

  function renderCard(p) {
    var slug = p.filename.replace(/\.md$/, '')
    var href = 'bai-viet.html?slug=' + encodeURIComponent(slug)
    var img = p.thumbnail
      ? '<a href="' + href + '" class="news-image" style="background-image:url(\'' + esc(p.thumbnail) + '\');background-size:cover;background-position:center;display:block;"></a>'
      : '<a href="' + href + '" class="news-image" style="display:block;"></a>'
    var excerpt = p.excerpt || p.body.replace(/#{1,6}\s[^\n]+/g, '').replace(/[*_`\[\]!]/g, '').trim().slice(0, 130) + '…'
    return '<article class="news-item">' +
      img +
      '<div class="news-body">' +
      (p.date ? '<div class="news-date">' + formatDate(p.date) + '</div>' : '') +
      '<h3><a href="' + href + '" style="color:inherit;text-decoration:none;">' + esc(p.title || '(Không có tiêu đề)') + '</a></h3>' +
      '<p>' + esc(excerpt) + '</p>' +
      '<a href="' + href + '" class="card-link">Đọc tiếp →</a>' +
      '</div></article>'
  }

  function renderPosts(posts) {
    var grid = document.getElementById('news-grid')
    var list = document.getElementById('news-list')
    if (!grid) return
    posts = applyFilter(posts)
    if (!posts.length) {
      grid.innerHTML = '<p style="text-align:center;color:#888;padding:48px 0;">Chưa có bài viết nào.</p>'
      if (list) list.innerHTML = ''
      return
    }
    var SPLIT = 5
    var topPosts = posts.slice(0, SPLIT)
    var restPosts = posts.slice(SPLIT)
    grid.innerHTML = topPosts.map(renderCard).join('')
    if (list) list.innerHTML = restPosts.map(renderCard).join('')
  }

  async function loadPosts() {
    var grid = document.getElementById('news-grid')
    if (!grid) return

    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
      if (cached && (Date.now() - cached.time < CACHE_TTL)) {
        renderPosts(cached.posts)
        return
      }
    } catch (e) {}

    try {
      var res = await fetch('https://api.github.com/repos/' + REPO + '/contents/' + POSTS_PATH, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      })
      if (res.status === 404) { renderPosts([]); return }
      if (!res.ok) throw new Error('HTTP ' + res.status)

      var files = await res.json()
      var mdFiles = files.filter(function (f) { return f.name.endsWith('.md') })

      var posts = await Promise.all(mdFiles.map(async function (f) {
        var r = await fetch(f.download_url)
        var text = await r.text()
        var parsed = parseFrontmatter(text)
        return Object.assign({ body: parsed.body, filename: f.name }, parsed.data)
      }))

      posts.sort(function (a, b) {
        return new Date(b.date || 0) - new Date(a.date || 0)
      })

      localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), posts: posts }))
      renderPosts(posts)

    } catch (err) {
      console.error(err)
      grid.innerHTML = '<p style="text-align:center;color:#c00;padding:48px 0;">Không tải được bài viết. Vui lòng thử lại sau.</p>'
    }
  }

  loadPosts()
})()
