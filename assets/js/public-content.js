// Public settings loader — fetch settings from GitHub and inject into [data-field] elements.
(function () {
  var REPO = 'quynhvanhoa/phuday-vancat-website'
  var SETTINGS_URL = 'https://raw.githubusercontent.com/' + REPO + '/main/content/settings/general.md'
  var CACHE_KEY = 'phuday_settings_v1'
  var CACHE_TTL = 5 * 60 * 1000

  function parseFrontmatter(text) {
    var m = text.match(/^---\r?\n([\s\S]+?)\r?\n---/)
    if (!m) return {}
    var data = {}
    var lines = m[1].split('\n')
    var i = 0
    while (i < lines.length) {
      var line = lines[i]
      var idx = line.indexOf(':')
      if (idx === -1) { i++; continue }
      var key = line.slice(0, idx).trim()
      var val = line.slice(idx + 1).trim()
      if (val === '|' || val === '>') {
        var multi = []
        i++
        while (i < lines.length && /^\s/.test(lines[i])) {
          multi.push(lines[i].replace(/^ {1,2}/, ''))
          i++
        }
        data[key] = multi.join(val === '|' ? '\n' : ' ')
      } else {
        data[key] = val.replace(/^["']|["']$/g, '')
        i++
      }
    }
    return data
  }

  function hydrate(settings) {
    document.querySelectorAll('[data-field]').forEach(function (el) {
      var key = el.dataset.field
      if (settings[key]) el.textContent = settings[key]
    })

    if (settings.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
        a.href = 'mailto:' + settings.email
      })
    }
    if (settings.phone) {
      var tel = settings.phone.replace(/\s/g, '')
      document.querySelectorAll('a[href^="tel:"]').forEach(function (a) { a.href = 'tel:' + tel })
    }
    if (settings.facebook) {
      document.querySelectorAll('a[data-link="facebook"]').forEach(function (a) {
        a.href = settings.facebook
        if (settings.facebook_label) a.textContent = settings.facebook_label
      })
    }
  }

  async function load() {
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
      if (cached && (Date.now() - cached.time < CACHE_TTL)) {
        hydrate(cached.data)
        return
      }
    } catch (e) {}

    try {
      var res = await fetch(SETTINGS_URL + '?t=' + Math.floor(Date.now() / 60000))
      if (!res.ok) return
      var text = await res.text()
      var data = parseFrontmatter(text)
      localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data: data }))
      hydrate(data)
    } catch (err) { console.error(err) }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load)
  } else {
    load()
  }
})()
