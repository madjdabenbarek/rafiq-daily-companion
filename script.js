const API = 'https://ummahapi.com/api';
async function getData(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  if (!json.success) throw new Error('Réponse API invalide');
  return json.data;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function showError(id, msg) {
  document.getElementById(id).innerHTML =
    '<span class="err">' + esc(msg) + '</span>';
}
function dayOfYear() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
}
async function loadHijri() {
  try {
    const d = await getData('/today-hijri');
    const h = d.hijri;
    document.getElementById('hijri').innerHTML =
      esc(h.day + ' ' + h.month_name + ' ' + h.year) + ' AH' +
      '<div class="ar-month">' + esc(h.month_name_arabic) + '</div>' +
      '<div class="sub">' + esc(d.gregorian.formatted) + '</div>';
  } catch (e) {
    showError('hijri', 'Impossible de charger la date (' + e.message + ')');
  }
}
async function loadEvent() {
  try {
    const d = await getData('/islamic-events');
    const next = d.next_event;
    const cur = d.current_hijri_date.hijri;
    const info = d.events.find(e => e.name === next.name);
    let diff = ((next.month - cur.month + 12) % 12) * 29.53 + (next.day - cur.day);
    if (diff < 0) diff += 354;
    diff = Math.round(diff);

    document.getElementById('event').innerHTML =
      '<div class="event-name">' + esc(next.name) + '</div>' +
      '<div class="sub">' + esc(next.hijri_date) + '</div>' +
      (info ? '<div class="sub">' + esc(info.description) + '</div>' : '') +
      '<span class="badge">Dans environ ' + diff + ' jours</span>';
  } catch (e) {
    showError('event', 'Impossible de charger l\'événement (' + e.message + ')');
  }
}
const AYAHS = [
  [2, 255], [2, 286], [94, 5], [94, 6], [13, 28], [65, 3], [39, 53],
  [2, 152], [112, 1], [93, 3], [2, 153], [3, 173], [9, 51], [65, 2]
];

async function loadAyah() {
  try {
    const pick = AYAHS[dayOfYear() % AYAHS.length];

    const d = await getData('/quran/surah/' + pick[0] + '/ayah/' + pick[1]);
    const tr = d.verse.translations.french || d.verse.translations.sahih_international;

    document.getElementById('ayah').innerHTML =
      '<div class="ayah-ar">' + esc(d.verse.arabic) + '</div>' +
      '<div class="ayah-tr">' + esc(tr) + '</div>' +
      '<div class="ayah-ref">' + esc(d.surah.name_english) + ' · ' +
      esc(d.surah.name_arabic) + ' · ' + esc(d.verse.verse_key) + '</div>';
  } catch (e) {
    showError('ayah', 'Impossible de charger l\'ayah (' + e.message + ')');
  }
}
const duaCache = {}; 
let currentMood = 'morning';
let duaIndex = 0;

function renderDua() {
  const list = duaCache[currentMood];
  const x = list[duaIndex % list.length];

  document.getElementById('dua').innerHTML =
    '<div class="dua-title">' + esc(x.title) + '</div>' +
    '<div class="dua-ar">' + esc(x.arabic) + '</div>' +
    '<div class="dua-tr">' + esc(x.transliteration) + '</div>' +
    '<div class="dua-meaning">' + esc(x.translation) + '</div>' +
    '<div class="dua-meta">' + esc(x.source) +
      (x.repeat > 1 ? ' · À répéter ' + esc(x.repeat) + ' fois' : '') + '</div>' +
    (list.length > 1
      ? '<button class="next-btn" id="nextDua">Autre dua (' +
        ((duaIndex % list.length) + 1) + '/' + list.length + ')</button>'
      : '');

  const btn = document.getElementById('nextDua');
  if (btn) btn.addEventListener('click', () => { duaIndex++; renderDua(); });
}

async function loadDua(mood) {
  currentMood = mood;
  duaIndex = 0;
  document.getElementById('dua').innerHTML = 'Chargement...';
  try {
    if (!duaCache[mood]) {
      const d = await getData('/duas/category/' + mood);
      duaCache[mood] = d.duas;
    }
    if (!duaCache[mood].length) throw new Error('Aucune dua trouvée');
    renderDua();
  } catch (e) {
    showError('dua', 'Impossible de charger la dua (' + e.message + ')');
  }
}
document.getElementById('chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  loadDua(chip.dataset.mood);
});
loadHijri();
loadEvent();
loadAyah();
loadDua('morning');