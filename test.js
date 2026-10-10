'use strict';
const e = require('./engine.js');
const cases = require('./expected.json');
let checks = 0, fails = 0;
function eq(a, b, label) {
  checks++;
  if (a !== b) { fails++; console.log('FAIL', label, 'engine:', a, 'oracle:', b); }
}
for (const c of cases) {
  let r, text;
  if (c.tool === 'blend') { r = e.blendBalance(...c.args); text = e.renderBlend(r); }
  else if (c.tool === 'cal') { r = e.calorieEstimate(...c.args); text = e.renderCal(r); }
  else { r = e.prepBags(...c.args); text = e.renderPrep(r); }
  const keys = new Set([...Object.keys(r), ...Object.keys(c.expect)]);
  for (const k of keys) eq(JSON.stringify(r[k]), JSON.stringify(c.expect[k]), c.tool + ' ' + JSON.stringify(c.args) + ' .' + k);
  checks++;
  if (r.error) { if (text !== r.error) { fails++; console.log('FAIL render error passthrough', text); } }
  else if (typeof text !== 'string' || text.length < 5 || /error|undefined|NaN/.test(text)) { fails++; console.log('FAIL render text', text); }
}
eq(e.renderBlend(e.blendBalance(300,100,250)), '300 ml of liquid for a classic pour - 600 ml total, about 2.4 glasses.', 'render blend default');
eq(e.renderCal(e.calorieEstimate(120,150,100,200,2)), 'About 331.8 kcal in the blender, 165.9 kcal per serving (labeled estimate).', 'render cal default');
eq(e.renderPrep(e.prepBags(5,250,250)), '1250 g of mix in 5 bags of 250 g - one bag per day - grab and blend.', 'render prep default');
console.log(checks + ' checks, ' + fails + ' failures over ' + cases.length + ' cases');
process.exit(fails ? 1 : 0);
