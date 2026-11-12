"""Writes the five Liten pages with a shared header and footer."""
import sys, pathlib

ROOT = pathlib.Path(sys.argv[1])

SQUIGGLE = ('<svg class="squiggle" viewBox="0 -1 76 9" preserveAspectRatio="xMinYMid slice" aria-hidden="true" focusable="false">'
            '<path pathLength="1" d="M 0 5.26 C 0 5.26 3.353 2.695 7.664 2.41 C 11.975 2.125 14.529 6.456 19.16 5.886 '
            'C 23.79 5.316 25.866 0.416 30.017 0.7 C 34.168 0.985 33.849 6.399 38.958 6.969 '
            'C 44.067 7.539 47.261 0 52.37 0 C 57.479 0 58.597 5.841 63.866 5.699 '
            'C 69.134 5.556 76 1.14 76 1.14"/></svg>')

NAV = [("whatson.html", "What's On"), ("menus.html", "Menus"),
       ("aboutus.html", "About Us"), ("faqs.html", "FAQs")]


def head(title, desc):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="assets/images/liten-wordmark.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap">
<link rel="preload" href="assets/fonts/InterDisplay-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/style.css?v=2">
</head>
<body>
"""


def header(current, compact):
    links = []
    for href, label in NAV:
        cur = ' aria-current="page"' if href == current else ''
        links.append(f'      <a href="{href}"{cur}>{label}{SQUIGGLE}</a>')
    cls = "site-header compact" if compact else "site-header"
    return f"""<header class="{cls}">
  <div class="frame header-inner">
    <a href="index.html" class="logo-link" aria-label="Liten, back to home">
      <img src="assets/images/liten-wordmark.png" alt="Liten" width="245" height="91">
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Open navigation"><span></span><span></span><span></span></button>
    <nav class="main-nav" id="main-nav" aria-label="Main">
{chr(10).join(links)}
    </nav>
  </div>
</header>
"""


FOOTER = """<footer class="site-footer">
  <div class="frame footer-grid">
    <div class="footer-col">
      <p class="footer-brand">LITEN COFFEE</p>
      <p class="footer-gloss">ˈli'tn.- meaning small in Swedish.</p>
    </div>
    <div class="footer-col">
      <h2 class="heading-sans">opening hours</h2>
      <div class="hours">
        <p class="hours-row"><span>Mon - Fri</span><b>|</b><span>7:30am  - 3pm</span></p>
        <p class="hours-row"><span>Sat</span><b>|</b><span>8:30am - 4pm</span></p>
        <p class="hours-row"><span>Sun</span><b>|</b><span>9:30am - 4pm</span></p>
      </div>
    </div>
    <div class="footer-col">
      <h2 class="heading-sans" id="contact">contact</h2>
      <p><a href="https://www.instagram.com/liten_coffeeshop/" target="_blank" rel="noopener">Instagram</a></p>
      <p>Phone Number</p>
      <p>Email</p>
    </div>
    <div class="footer-col">
      <h2 class="heading-sans">find us</h2>
      <div class="map-choice">
        <button class="map-toggle" type="button" aria-expanded="false" aria-controls="map-options">
          <span>1b Fairhazel Gardens</span>
          <span>NW6 3QE</span>
          <span>South Hampstead</span>
          <span class="sr-only">, choose a maps app</span>
        </button>
        <ul class="map-options" id="map-options">
          <li><a href="https://maps.apple.com/?q=Liten%20Coffee&amp;address=1b%20Fairhazel%20Gardens%2C%20London%20NW6%203QE" target="_blank" rel="noopener">Open in Apple Maps</a></li>
          <li><a href="https://www.google.com/maps/search/?api=1&amp;query=Liten%20Coffee%2C%201b%20Fairhazel%20Gardens%2C%20London%20NW6%203QE" target="_blank" rel="noopener">Open in Google Maps</a></li>
        </ul>
      </div>
    </div>
  </div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
"""

PAGES = {}

PAGES["index.html"] = ("Liten — Home",
    "Liten Coffee, a small neighbourhood cafe in South Hampstead serving quality coffee, tea and food.",
    None, False, """<h1 class="sr-only">Liten Coffee</h1>
<main class="frame">
  <p class="home-hero">Borne out of a love for coffee and community, Liten is the neighbourhood stop for quality drinks and conversation.</p>

  <div class="home-main">
    <div class="photo-row">
      <img class="photo" src="assets/images/Liten_Shop_image.png" alt="The Liten shopfront in South Hampstead with customers sitting outside" width="470" height="411">
      <img class="photo" src="assets/images/Coffee_Cups_image.png" alt="A stack of Liten branded coffee cups" width="470" height="411">
    </div>

    <div class="home-copy-1">
      <div class="copy body-21">
        <p>Opened in 2022, we’re a small cafe just by South Hampstead station serving Origin Coffee Roasters and a regular rotation of new, specially selected guest beans. We also prepare specialty teas, matcha and hot drinks with a daily stock of pastries, snacks and treats on our counter top from local bakeries. Selection of dairy, soy and oat milks served.</p>
        <p>To find out more about our food + drinks, take a look at our menus page :)</p>
      </div>
      <a class="pill" href="menus.html">menus</a>
    </div>

    <div class="photo-row second">
      <img class="photo" src="assets/images/Coffee_pour_image.png" alt="Filter coffee being poured beside a bag of beans" width="470" height="411">
      <img class="photo" src="assets/images/Matcha_Image.png" alt="Matcha being whisked" width="471" height="411">
    </div>

    <div class="home-copy-2">
      <a class="pill short" href="aboutus.html">about us</a>
      <div class="copy body-21">
        <p>Small but mighty, we have indoor and outside seating space with our bench and high-counter stools. Stop by to browse our selection of coffee beans, artisan chocolates and merch!</p>
        <p>If you've got any questions about the cafe check out our FAQs or give us a ring</p>
      </div>
    </div>
  </div>
</main>
""")

PAGES["whatson.html"] = ("Liten — What's On",
    "Events at Liten Coffee: Liten Run Club every Sunday and Sunday Chess Club.",
    "whatson.html", True, """<main class="frame whatson-main">
  <h1 class="page-title">What's On</h1>

  <h2 class="events-heading">Upcoming events</h2>

  <section class="event" aria-labelledby="run-club">
    <!-- RUN CLUB PHOTO: placeholder -->
    <div class="photo-placeholder" role="img" aria-label="Photo of Liten Run Club to come"></div>
    <div class="event-text">
      <h3 class="heading-sans" id="run-club">Liten Run Club</h3>
      <p class="body-20">A self-led, community-powered Sunday run. Your pace, your people, coffee afterwards.</p>
      <p class="event-details body-20">Every Sunday at 8:45am starting at Liten.<br>Just show up :)</p>
      <p class="body-20">Send us a message via <!-- EMAIL: swap #contact for mailto:address once the cafe confirms it --><a href="#contact">email</a> or <a href="https://www.instagram.com/liten_coffeeshop/" target="_blank" rel="noopener">Instagram</a> to join the Run Club WhatsApp group for updates.</p>
    </div>
  </section>

  <section class="event reverse" aria-labelledby="chess-club">
    <!-- CHESS CLUB PHOTO: placeholder -->
    <div class="photo-placeholder" role="img" aria-label="Photo of Sunday Chess Club to come"></div>
    <div class="event-text">
      <h3 class="heading-sans" id="chess-club">Sunday Chess Club</h3>
      <p class="body-20">We run a social chess club on a Sunday each month at our sister cafe Dawn Seal - check out their site to find out more.</p>
      <a class="pill dawn" href="https://thedawnseal.square.site/events" target="_blank" rel="noopener"><img src="assets/images/dawn-seal-logo.png" alt="Dawn Seal website" width="116" height="36"></a>
    </div>
  </section>

  <h2 class="events-heading past">Past events</h2>

  <div class="past-events">
    <details class="past-event">
      <summary><span>Kicking off the Liten Run Club</span></summary>
      <div class="past-body">
        <!-- FIRST RUN CLUB PHOTO: placeholder (still from the Instagram reel) -->
        <div class="photo-placeholder" role="img" aria-label="Photo from the first Liten Run Club to come"></div>
        <div class="past-text">
          <p class="past-date"><time datetime="2026-11-01">Sunday 1 November 2026</time></p>
          <p class="body-20">We kicked off our very first Liten Run Club: a self-led Sunday run from the cafe at your own pace, then coffee together afterwards. It's now on every Sunday.</p>
          <p class="body-20"><a href="https://www.instagram.com/reel/Dehci3Th-5P/" target="_blank" rel="noopener">Watch the reel on Instagram</a></p>
        </div>
      </div>
    </details>

    <details class="past-event">
      <summary><span>Community 5K with oac snacks</span></summary>
      <div class="past-body">
        <img class="poster" src="assets/images/Community_5K_poster.jpg" alt="Community 5K poster: Liten Coffee and oac, Sunday 27 September 2026, 8am, with a drawing of a coffee cup and a yoghurt bowl with berries" width="470" height="653" loading="lazy">
        <div class="past-text">
          <p class="past-date"><time datetime="2026-09-27">Sunday 27 September 2026</time></p>
          <p class="body-20">We ran (quite literally) a free community 5k from Liten to Primrose Hill and back! In collaboration with oac snacks who provided delicious protein balls and collagen crumb yoghurt bowls.</p>
        </div>
      </div>
    </details>
  </div>
</main>
""")

PAGES["menus.html"] = ("Liten — Menus",
    "Food and drinks menus at Liten Coffee, South Hampstead.",
    "menus.html", True, """<main class="frame menus-main">
  <h1 class="page-title">Menus</h1>
  <p class="intro body-20">Copy about menu</p>

  <div class="photo-row">
    <div class="menu-col">
      <!-- WATERMARK: remove the watermark wrapper once final photos are in -->
      <div class="watermark" data-watermark="PLACEHOLDER">
        <img class="photo" src="assets/images/Coffee_pour_image.png" alt="Filter coffee being poured beside a bag of beans" width="470" height="411">
      </div>
      <a class="pill" href="assets/pdfs/liten-drinks-menu.pdf" target="_blank" rel="noopener">drinks</a>
    </div>
    <div class="menu-col">
      <!-- WATERMARK: remove the watermark wrapper once final photos are in -->
      <div class="watermark" data-watermark="PLACEHOLDER">
        <img class="photo" src="assets/images/Pastries_image.jpg" alt="Croissants, pain suisse, cinnamon swirls and bliss balls on the Liten counter" width="470" height="411">
      </div>
      <a class="pill r34" href="assets/pdfs/liten-food-menu.pdf" target="_blank" rel="noopener">food</a>
    </div>
  </div>
</main>
""")

PAGES["aboutus.html"] = ("Liten — About Us",
    "The story of Liten Coffee and our sister cafe Dawn Seal.",
    "aboutus.html", True, """<main class="frame inner-main about-main">
  <h1 class="page-title">About Us</h1>
  <p class="gloss">ˈli'tn.- meaning small in Swedish.</p>
  <div class="story">
    <!-- ABOUT PHOTO: image frame left empty in Framer -->
    <div class="about-photo" role="img" aria-label="Photo to come"></div>
    <div class="story-text body-20">
      <p>Set up by X and X, this is our story of how Liten came to be…</p>
      <!-- PLACEHOLDER COPY: lorem ipsum until the owners send their story -->
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus, posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper.</p>
      <p>Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean lacinia bibendum nulla sed consectetur.</p>
    </div>
  </div>
  <div class="about-copy body-20">
    <div class="caps">
      <div class="caps-text">
        <p>If you want to rep Liten beyond our food and drinks, we’ve got a fresh run of baseball caps designed by X — ready to wear from the shop to wherever you’re headed next.</p>
        <!-- PLACEHOLDER COPY: lorem ipsum -->
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</p>
        <p>Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
      </div>
      <img class="caps-photo" src="assets/images/Liten_cap.jpg" alt="A navy Liten cap embroidered with 'LITEN at fairhazel gardens NW6', held up at a tennis match" width="300" height="400" loading="lazy">
    </div>
    <div class="dawn-row">
      <p>We also have a sister cafe - The Dawn Seal, nearby in Maida Vale with its own unique menu and hosting of events. Check out their site for more info.</p>
      <a class="pill dawn" href="https://thedawnseal.square.site/" target="_blank" rel="noopener"><img src="assets/images/dawn-seal-logo.png" alt="Dawn Seal website" width="116" height="36"></a>
    </div>
  </div>
</main>
""")

PAGES["faqs.html"] = ("Liten — FAQs",
    "Frequently asked questions about Liten Coffee.",
    "faqs.html", True, """<main class="frame inner-main faq-layout">
  <div class="faq-main">
    <h1 class="page-title">Frequently asked questions</h1>
    <dl class="faq-list">
      <dt>What type of coffee do you serve?</dt>
      <dd>We have a rotation of high quality coffee beans alongside our staple</dd>
      <dt>Do you have alternative milks?</dt>
      <dd>Yes of course, we use  Oatly Barista</dd>
    </dl>
  </div>
  <aside class="things">
    <h2 class="heading-sans">things to know</h2>
    <ul class="body-20">
      <li>Dog friendly</li>
      <li>Laptop friendly (except at busy times)</li>
      <li>Vegan &amp; gluten free food options</li>
      <li>Wheelchair accessible</li>
    </ul>
  </aside>
</main>
""")

for name, (title, desc, current, compact, body) in PAGES.items():
    (ROOT / name).write_text(head(title, desc) + header(current, compact) + "\n" + body + FOOTER, encoding="utf-8")
    print("wrote", name)

# Menus page: full drinks and food menu (content in menuexp/drinks.py and menuexp/food.py)
import subprocess, os
MX = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'menuexp')
subprocess.run([sys.executable, os.path.join(MX, 'build.py'), str(ROOT / 'menus.html'), str(ROOT / 'menus.html'), MX], check=True)
