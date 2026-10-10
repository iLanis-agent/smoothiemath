// Smoothie math engine - smoothie planning arithmetic.
// Pure functions, no DOM. All borrowed norms are labeled in the UI, not buried here.
'use strict';

function round1(x) { return Math.round(x * 10) / 10; }

// --- Blend balance -----------------------------------------------------------
// Labeled ratios of liquid per 100 g of frozen fruit: 60 thick, 100 classic,
// 150 sippable. Glass size labeled at 250 ml.
function blendBalance(fruitG, liquidPer100, glassMl) {
  if (!(fruitG > 0)) return { error: 'fruit must be positive' };
  if (!(liquidPer100 > 0)) return { error: 'liquid ratio must be positive' };
  if (!(glassMl > 0)) return { error: 'glass size must be positive' };
  var liquid = round1(fruitG * liquidPer100 / 100);
  var total = round1(fruitG + liquid);
  var glasses = round1(total / glassMl);
  var band = liquidPer100 < 80 ? 'spoon-thick' : liquidPer100 <= 120 ? 'classic pour' : 'easy sipper';
  return { liquid: liquid, total: total, glasses: glasses, band: band };
}

// --- Calorie estimate --------------------------------------------------------
// Labeled food-data estimates (kcal per 100 g): banana 89, mixed berries 50,
// yogurt 60, juice 45. Estimates, not nutrition advice.
function calorieEstimate(bananaG, berryG, yogurtG, juiceMl, servings) {
  if (!(bananaG >= 0) || !(berryG >= 0) || !(yogurtG >= 0) || !(juiceMl >= 0)) return { error: 'amounts must not be negative' };
  if (bananaG + berryG + yogurtG + juiceMl === 0) return { error: 'the blender is empty' };
  if (!(servings > 0)) return { error: 'servings must be positive' };
  var kcal = round1(bananaG * 0.89 + berryG * 0.5 + yogurtG * 0.6 + juiceMl * 0.45);
  var per = round1(kcal / servings);
  return { kcal: kcal, per: per };
}

// --- Freezer prep bags -------------------------------------------------------
// Bag the fruit mix ahead: days times the per-day mix, split into bags.
function prepBags(days, perDayG, bagMaxG) {
  if (!(days > 0)) return { error: 'days must be positive' };
  if (!(perDayG > 0)) return { error: 'per-day mix must be positive' };
  if (!(bagMaxG > 0)) return { error: 'bag size must be positive' };
  var total = round1(days * perDayG);
  var bags = Math.ceil(days * perDayG / bagMaxG);
  var perBag = round1(total / bags);
  var verdict = bags === days ? 'one bag per day - grab and blend' : bags + ' bags for ' + days + ' days - split each morning or rebag';
  return { total: total, bags: bags, perBag: perBag, verdict: verdict };
}

// --- Text rendering (shared by UI and tests) ---------------------------------
function renderBlend(r) {
  if (r.error) return r.error;
  return r.liquid + ' ml of liquid for a ' + r.band + ' - ' + r.total + ' ml total, about ' + r.glasses + ' glasses.';
}
function renderCal(r) {
  if (r.error) return r.error;
  return 'About ' + r.kcal + ' kcal in the blender, ' + r.per + ' kcal per serving (labeled estimate).';
}
function renderPrep(r) {
  if (r.error) return r.error;
  return r.total + ' g of mix in ' + r.bags + ' bags of ' + r.perBag + ' g - ' + r.verdict + '.';
}

var api = {
  round1: round1,
  blendBalance: blendBalance,
  calorieEstimate: calorieEstimate,
  prepBags: prepBags,
  renderBlend: renderBlend,
  renderCal: renderCal,
  renderPrep: renderPrep
};
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.SmoothieMath = api;
