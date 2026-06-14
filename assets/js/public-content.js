// Public settings loader — fetch settings from GitHub and inject into [data-field] elements.
(function () {
  var REPO = 'quynhvanhoa/phuday-vancat-website'
  var SETTINGS_URL = 'https://raw.githubusercontent.com/' + REPO + '/main/content/settings/general.md'
  var CACHE_KEY = 'phuday_settings_v1'
  var CACHE_TTL = 5 * 60 * 1000

  function parseFrontmatter(text) {
    var m = text.match(/^---\r?\n([\s\S]+?)\r?\n---/)
    if (!m) return {}
    try {
      return jsyaml.load(m[1]) || {}
    } catch (e) {
      console.error('YAML parse error', e)
      return {}
    }
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
