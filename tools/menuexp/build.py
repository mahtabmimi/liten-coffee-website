"""Builds the experimental Menus page (preview only) from the live menus.html."""
import sys, html, re
sys.path.insert(0, sys.argv[3])
from drinks import DRINKS, NOTES
from food import FOOD, FOOD_NOTES

src, out = sys.argv[1], sys.argv[2]
page = open(src, encoding='utf-8').read()
e = html.escape

def item(name, price, desc, extras=()):
    d = f'\n          <p class="mi-desc">{e(desc)}</p>' if desc else ''
    d += ''.join(f'\n          <p class="mi-extra">{e(x)}</p>' for x in extras)
    return (f'        <li class="mi">\n'
            f'          <div class="mi-row"><span class="mi-name">{e(name)}</span><span class="mi-price">{e(price)}</span></div>{d}\n'
            f'        </li>')

def details(title, items, note, open_, group):
    cls = 'past-event menu-cat signatures' if title == 'Signatures' else 'past-event menu-cat'
    lis = '\n'.join(item(*i) for i in items)
    n = f'\n      <p class="menu-note">{e(note)}</p>' if note else ''
    op = ' open' if open_ else ''
    lead = '\n      <p class="menu-lead">All double shots</p>' if title == 'Coffee' else ''
    return f'''    <details class="{cls}" name="{group}"{op}>
      <summary><span>{e(title)}</span></summary>
      <div class="menu-body">{lead}
      <ul class="menu-list">
{lis}
      </ul>{n}
      </div>
    </details>'''

food_cats = '\n'.join(details(t, its, None, False, 'food') for t, its in FOOD)
food_notes = '\n'.join(f'    <p class="menu-note">{e(n)}</p>' for n in FOOD_NOTES)

cats = [details(t, its, n, False, 'drinks') for t, its, n in DRINKS]

notes = '\n'.join(f'    <p class="menu-note">{e(n)}</p>' for n in NOTES)

main = f'''<main class="frame menus-main menu-x">
  <div class="menus-top">
    <div>
    <h1 class="page-title">Menus</h1>
    <div class="intro menu-intro body-20">
      <p>Our food and drinks are carefully selected, crafted and sourced. Our house coffee is by Origin Coffee Roasters from Brasil naturally processed and we use The Estate Dairy full fat &amp; semi-skimmed milk and Oatly oat milk.</p>
    </div>
    </div>
    <img class="menus-photo" src="assets/images/Bun_and_cup_image.jpg" alt="A cardamom bun on a paper bag next to a Liten takeaway cup with the apron doodle" width="400" height="250">
  </div>

  <h2 class="events-heading">Drinks</h2>
  <div class="drinks-menu">
{chr(10).join(cats)}
{notes}
  </div>

  <h2 class="events-heading past">Food</h2>
  <div class="drinks-menu food-menu">
{food_cats}
{food_notes}
  </div>

  <section class="event food-row" aria-label="Pastries and treats">
    <div class="event-text">
      <h3 class="heading-sans">Pastries, snacks &amp; treats</h3>
      <p class="body-20">Come on in to see our daily stock of pastries, snacks &amp; treats.</p>
    </div>
  </section>
</main>'''

page = re.sub(r'<main class="frame menus-main">.*?</main>', main, page, flags=re.S)
# the soft open/close accordion lives in js/main.js
page = page.replace('<link rel="stylesheet" href="css/style.css?v=2">',
                    '<link rel="stylesheet" href="css/style.css?v=2">\n<link rel="stylesheet" href="css/menus.css">')
assert 'css/menus.css' in page and 'drinks-menu' in page
open(out, 'w', encoding='utf-8').write(page)
print('wrote', out)
