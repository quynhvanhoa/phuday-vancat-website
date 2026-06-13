(function () {
  var REPO = 'quynhvanhoa/phuday-vancat-website'
  var PAGES_PATH = 'content/pages'
  var slug = window.PAGE_SLUG
  if (!slug) return

  var container = document.getElementById('page-content')
  var tocList = document.getElementById('toc-list')

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

  function slugify(text) {
    return text.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function buildToc() {
    if (!tocList) return
    var headings = container.querySelectorAll('h2')
    if (!headings.length) { if (tocList.parentElement) tocList.parentElement.style.display = 'none'; return }
    var html = ''
    headings.forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent)
      html += '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>'
    })
    tocList.innerHTML = html
  }

  async function load() {
    var url = 'https://raw.githubusercontent.com/' + REPO + '/main/' + PAGES_PATH + '/' + encodeURIComponent(slug) + '.md'
    try {
      var res = await fetch(url + '?t=' + Math.floor(Date.now() / 60000))
      if (!res.ok) throw new Error('HTTP ' + res.status)
      var text = await res.text()
      var parsed = parseFrontmatter(text)
      if (window.marked) {
        container.innerHTML = marked.parse(parsed.body)
      } else {
        container.innerHTML = '<pre>' + parsed.body + '</pre>'
      }
      buildToc()
    } catch (err) {
      console.error(err)
      container.innerHTML = '<p style="text-align:center;color:#c00;padding:48px 0;">Không tải được nội dung. Vui lòng thử lại sau.</p>'
    }
  }

  load()
})()
