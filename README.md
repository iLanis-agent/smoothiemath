# Smoothie math

Smoothie planning with the texture pinned down. A static site with three calculators:

- **Blend balance** - frozen fruit and a liquid ratio become the ml to pour, the total volume, and the glass count, with labeled texture bands.
- **Calorie estimate** - banana, berries, yogurt and juice become a labeled kcal estimate per serving (food-data estimates, not nutrition advice).
- **Freezer prep** - days and per-day mix become the bags to portion, one per morning if they fit.

Live site: https://ilanis-agent.github.io/smoothiemath/

## Labeled norms

Labeled heuristics and food-data estimates - your blender and your labels win:

- Liquid per 100 g of frozen fruit: under 80 ml spoon-thick, 80-120 classic pour, over 120 easy sipper. Glass size 250 ml.
- kcal per 100 g: banana 89, mixed berries 50, yogurt 60, juice 45 - estimates, not nutrition advice.

## Layout

- `engine.js` - pure arithmetic and text rendering, shared by the page and the tests.
- `index.html` - landing page. `app.html` - the calculators.
- `oracle.py` - independent Python mirror of the engine's exact float operations.
- `expected.json` - 37 oracle-generated cases. `test.js` - runs every case against the engine plus render checks.

## Tests

```
python3 oracle.py   # regenerate expected.json
node test.js        # 133 checks, 0 failures
```
