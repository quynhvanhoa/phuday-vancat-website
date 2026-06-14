(function () {
  var REPO = 'quynhvanhoa/phuday-vancat-website'
  var PAGES_PATH = 'content/pages'
  var slug = window.PAGE_SLUG
  if (!slug) return

  var container = document.getElementById('page-content')
  var tocList = document.getElementById('toc-list')

  // page-loader runs even when there is no #page-content (e.g. lien-he uses only data-page-field).

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

  function slugify(text) {
    return text.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function buildToc() {
    if (!tocList) return
    var headings = Array.prototype.slice.call(container.querySelectorAll('h2, h3, h4'))
      .filter(function (h) { return !h.closest('.timeline, .mau-grid, .figure') })
    if (!headings.length) { if (tocList.parentElement) tocList.parentElement.style.display = 'none'; return }
    var html = ''
    headings.forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent)
      var level = parseInt(h.tagName.substring(1), 10)
      var indent = (level - 2) * 14
      html += '<li style="padding-left:' + indent + 'px"><a href="#' + h.id + '">' + h.textContent + '</a></li>'
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

      Object.keys(parsed.data).forEach(function (key) {
        document.querySelectorAll('[data-page-field="' + key + '"]').forEach(function (el) {
          el.textContent = parsed.data[key]
        })
      })

      if (container) {
        if (window.marked) {
          container.innerHTML = marked.parse(parsed.body)
        } else {
          container.innerHTML = '<pre>' + parsed.body + '</pre>'
        }
        buildToc()
      }
    } catch (err) {
      console.error(err)
      container.innerHTML = '<p style="text-align:center;color:#c00;padding:48px 0;">Không tải được nội dung. Vui lòng thử lại sau.</p>'
    }
  }

  load()
})()
