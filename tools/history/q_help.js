// helper for باب القرآن lessons
const TB = n => 'https://shamela.ws/book/1969/' + n;
const TBN = 'التبيان في آداب حملة القرآن للنووي';
const ML = 'الموسوعة الفقهية الكويتية';
const tb = (n, extra) => TBN + (extra ? ' (' + extra + ')' : '') + ': ' + TB(n);
const ml = (entry, url) => ML + '، مدخل ' + entry + ': ' + url;
function L(o) {
  const cells = (arr, p) => arr.map((c, i) => ({ id: p + (i + 1), t: c[0], d: c[1], ref: c[2] }));
  return {
    id: o.id, title: o.title, hukm: o.hukm, hukmRef: o.hukmRef, definition: o.definition,
    labels: { c: o.label || 'ما في هذا الدرس', p: '', o: '', s: '', n: '' },
    fiqh: { conditions: cells(o.cells, 'c'), pillars: [], obligations: [], sunan: [], nullifiers: [] },
    steps: o.steps.map((s, i) => ({ n: i + 1, name: s[0], action: s[1], dhikr: 'لا يُذكر هنا ذكر مخصوص لهذه الخطوة.', dhikrNone: true, whisper: '', ref: s[2] })),
    meaning: { why: o.why.map((w, i) => ({ id: 'm' + (i + 1), t: w[0], d: w[1], kind: w[3] || 'تأمل', ref: w[2] })) },
    evidence: [],
    khilaf: (o.khilaf || []).map((k, i) => ({ id: 's' + (i + 1), issue: k[0], v: { hanafi: k[1], maliki: k[2], shafii: k[3], hanbali: k[4] }, note: k[5] })),
    mistakes: o.mistakes.map((m, i) => ({ id: 'x' + (i + 1), t: m[0], d: m[1] })),
    quiz: o.quiz.map(q => ({ q: q[0], o: q[1], a: q[2], why: q[3] }))
  };
}
module.exports = { L, tb, ml, TB, TBN, ML };
