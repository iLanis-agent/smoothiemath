# Smoothie math oracle - mirrors engine.js float ops exactly (math.floor(x+0.5) == JS Math.round for positive magnitudes).
import json, math

def round1(x):
    return math.floor(x * 10 + 0.5) / 10

def blend_balance(fruitG, liquidPer100, glassMl):
    if not (fruitG > 0): return {"error": "fruit must be positive"}
    if not (liquidPer100 > 0): return {"error": "liquid ratio must be positive"}
    if not (glassMl > 0): return {"error": "glass size must be positive"}
    liquid = round1(fruitG * liquidPer100 / 100)
    total = round1(fruitG + liquid)
    glasses = round1(total / glassMl)
    band = "spoon-thick" if liquidPer100 < 80 else ("classic pour" if liquidPer100 <= 120 else "easy sipper")
    return {"liquid": liquid, "total": total, "glasses": glasses, "band": band}

def calorie_estimate(bananaG, berryG, yogurtG, juiceMl, servings):
    if not (bananaG >= 0 and berryG >= 0 and yogurtG >= 0 and juiceMl >= 0): return {"error": "amounts must not be negative"}
    if bananaG + berryG + yogurtG + juiceMl == 0: return {"error": "the blender is empty"}
    if not (servings > 0): return {"error": "servings must be positive"}
    kcal = round1(bananaG * 0.89 + berryG * 0.5 + yogurtG * 0.6 + juiceMl * 0.45)
    return {"kcal": kcal, "per": round1(kcal / servings)}

def prep_bags(days, perDayG, bagMaxG):
    if not (days > 0): return {"error": "days must be positive"}
    if not (perDayG > 0): return {"error": "per-day mix must be positive"}
    if not (bagMaxG > 0): return {"error": "bag size must be positive"}
    total = round1(days * perDayG)
    bags = math.ceil(days * perDayG / bagMaxG)
    perBag = round1(total / bags)
    verdict = "one bag per day - grab and blend" if bags == days else "%d bags for %d days - split each morning or rebag" % (bags, days)
    return {"total": total, "bags": bags, "perBag": perBag, "verdict": verdict}

cases = []
def bb(*a): cases.append({"tool": "blend", "args": list(a), "expect": blend_balance(*a)})
def ce(*a): cases.append({"tool": "cal", "args": list(a), "expect": calorie_estimate(*a)})
def pb(*a): cases.append({"tool": "prep", "args": list(a), "expect": prep_bags(*a)})

# blend: happy
bb(300, 100, 250)   # defaults
bb(300, 60, 250)    # spoon-thick
bb(300, 150, 250)   # sipper
bb(200, 80, 300)    # 80 is classic boundary
bb(200, 79.9, 300)  # thick
bb(200, 120, 200)   # classic boundary
bb(200, 121, 200)   # sipper
bb(500, 90, 330)    # decimals: 950/330=2.9
bb(150, 100, 250)
# blend: errors
bb(0, 100, 250)
bb(-300, 100, 250)
bb(300, 0, 250)
bb(300, 100, 0)

# cal: happy
ce(120, 150, 100, 200, 2)   # defaults 331.8 / 165.9
ce(100, 0, 0, 0, 1)         # banana only 89
ce(0, 200, 0, 0, 2)         # berries only 100/50
ce(0, 0, 250, 0, 1)         # yogurt only 150
ce(0, 0, 0, 400, 4)         # juice only 180/45
ce(120, 150, 100, 200, 1)   # single serving
ce(60.5, 88.8, 45.5, 150, 3)  # decimals
ce(200, 200, 200, 200, 2)   # 398/199
# cal: errors
ce(-10, 150, 100, 200, 2)
ce(120, -5, 100, 200, 2)
ce(0, 0, 0, 0, 2)
ce(120, 150, 100, 200, 0)
ce(120, 150, 100, 200, -1)

# prep: happy
pb(5, 250, 250)     # one bag per day
pb(7, 300, 500)     # 5 bags of 420 for 7 days
pb(3, 200, 200)     # exact
pb(1, 250, 250)     # single day
pb(10, 180, 600)    # 3 bags of 600
pb(6, 333.3, 500)   # decimals: 2000/500=4 bags of 500? 1999.8/500=3.9996->4, perBag 500? 1999.8/4=500 - round1(499.95)=500? floor(4999.5+0.5)=5000 -> 500.0
pb(4, 275, 400)     # 1100/400=2.75 -> 3 bags of 366.7
# prep: errors
pb(0, 250, 250)
pb(5, 0, 250)
pb(5, 250, 0)
pb(-3, 250, 250)

with open("expected.json", "w") as f:
    json.dump(cases, f, indent=1)
print(len(cases), "cases written")
