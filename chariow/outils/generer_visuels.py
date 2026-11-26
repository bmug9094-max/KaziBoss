"""Génère les visuels (couvertures) et les PDF de bienvenue des 3 produits Chariow, via Chrome headless."""
import pathlib
import subprocess
import sys

OUT = pathlib.Path(sys.argv[1])
TMP = pathlib.Path(sys.argv[2])
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
ICON = (pathlib.Path(sys.argv[3]) / 'icon.svg').read_text(encoding='utf-8')
ICON = ICON.replace('width="512" height="512"', 'width="100%" height="100%"', 1)

PRODUCTS = [
    {
        'slug': 'pack-agri-business',
        'emoji': '🚢',
        'kicker': 'Pack premium KaziBoss',
        'title': 'Agri&#8209;Business &amp; Import&#8209;Export',  # traits d'union insécables
        'tagline': 'Remonte la chaîne de valeur, de la récolte au conteneur.',
        'perks': ['6 scénarios exclusifs : récolte, conteneur, douane', 'Secteur Agri-Business &amp; Transformation débloqué', 'Module 4 « Croissance &amp; Équipe »', 'Badge Exportateur'],
        'price': '5 $',
        'accent': '#10B981',
    },
    {
        'slug': 'pack-vies-illimitees',
        'emoji': '❤️‍🔥',
        'kicker': 'Pack premium KaziBoss',
        'title': 'Vies Illimitées',
        'tagline': 'Rejoue sans limite, apprends de chaque faillite.',
        'perks': ['Secondes chances gratuites et illimitées', 'Plusieurs secondes chances dans le même mois', 'Analyse de faillite à chaque fois', 'Soutiens un jeu éducatif africain'],
        'price': '3 $',
        'accent': '#EF4444',
    },
    {
        'slug': 'digital-growth',
        'emoji': '📊',
        'kicker': 'Ressources réelles · fichier Excel',
        'title': 'Digital Growth',
        'tagline': 'Les modèles automatisés pour ta vraie boutique.',
        'perks': ['Journal de caisse : solde calculé tout seul', 'Calculateur de marge &amp; stock avec alertes', 'Tableau de bord mensuel avec graphique', 'Excel, Google Sheets ou téléphone'],
        'price': '10 $',
        'accent': '#38BDF8',
    },
]

BASE_CSS = """
* { box-sizing: border-box; margin: 0; }
body { font-family: 'Segoe UI', Arial, sans-serif; background: #0F172A; color: #F8FAFC; }
.logo { display: flex; align-items: center; gap: 14px; font-weight: 800; letter-spacing: -0.5px; }
.logo .ic { width: 56px; height: 56px; }
.logo b { color: #F59E0B; }
.kicker { text-transform: uppercase; letter-spacing: 3px; font-weight: 800; font-size: 18px; }
ul { list-style: none; padding: 0; }
li { display: flex; gap: 12px; align-items: flex-start; }
li::before { content: '✓'; font-weight: 900; }
.price { display: inline-block; background: #F59E0B; color: #0F172A; font-weight: 900; border-radius: 999px; }
"""


def cover_html(p, w, h):
    square = w == h
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_CSS}
html, body {{ width: {w}px; height: {h}px; overflow: hidden; }}
.wrap {{ position: relative; width: 100%; height: 100%; padding: {56 if square else 64}px;
  background: radial-gradient(circle at 85% 15%, {p['accent']}55, transparent 45%),
              radial-gradient(circle at 10% 95%, #F59E0B33, transparent 40%), #0F172A; }}
.logo {{ font-size: 32px; }}
.emoji {{ position: absolute; right: {64 if square else 80}px; top: {56 if square else 150}px; font-size: {220 if square else 230}px; line-height: 1;
  filter: drop-shadow(0 18px 40px rgba(0,0,0,.45)); }}
.kicker {{ color: {p['accent']}; margin-top: {250 if square else 56}px; font-size: {22 if square else 18}px; }}
h1 {{ font-size: {88 if square else 72}px; line-height: 1.02; font-weight: 900; margin-top: 14px; max-width: {960 if square else 760}px; letter-spacing: -1.5px; }}
.tag {{ font-size: {32 if square else 26}px; color: #CBD5E1; margin-top: 18px; max-width: {900 if square else 700}px; }}
ul {{ margin-top: {44 if square else 30}px; font-size: {30 if square else 24}px; display: grid; gap: {18 if square else 12}px; max-width: {720 if square else 720}px; }}
li::before {{ color: {p['accent']}; }}
.price {{ position: absolute; right: {56 if square else 80}px; bottom: {56 if square else 64}px; font-size: 40px; padding: 14px 34px; }}
</style></head><body><div class="wrap">
<div class="logo"><div class="ic">{ICON}</div><span>Kazi<b>Boss</b></span></div>
<div class="emoji">{p['emoji']}</div>
<p class="kicker">{p['kicker']}</p>
<h1>{p['title']}</h1>
<p class="tag">{p['tagline']}</p>
<ul>{''.join(f'<li>{x}</li>' for x in p['perks'])}</ul>
<span class="price">{p['price']}</span>
</div></body></html>"""


WELCOME = {
    'pack-agri-business': """
<h2>Ton pack s'active tout seul</h2>
<p>Si tu as payé depuis l'application KaziBoss, ton pack est <b>déjà actif</b> sur ton compte. Ouvre l'app : les nouveautés t'attendent.</p>
<h2>Ce qui est débloqué</h2>
<ul><li><b>Onglet Jouer</b> : choisis le secteur « Agri-Business &amp; Transformation » et découvre 6 scénarios exclusifs (récolte, conteneur, douane…).</li>
<li><b>Onglet Apprendre</b> : le module 4 « Croissance &amp; Équipe » est ouvert.</li>
<li><b>Onglet Boutique</b> : ton badge Exportateur 🚢 apparaît.</li></ul>""",
    'pack-vies-illimitees': """
<h2>Ton pack s'active tout seul</h2>
<p>Si tu as payé depuis l'application KaziBoss, ton pack est <b>déjà actif</b> sur ton compte.</p>
<h2>Comment en profiter</h2>
<ul><li>Quand ta boutique fait faillite, le bouton « Seconde chance » est maintenant <b>gratuit</b>.</li>
<li>Tu peux l'utiliser <b>autant de fois que tu veux</b>, même plusieurs fois dans le même mois.</li>
<li>Lis bien l'analyse de faillite à chaque fois : c'est là que tu progresses le plus.</li></ul>""",
    'digital-growth': """
<h2>Ton fichier</h2>
<p>Le fichier <b>KaziBoss-Digital-Growth.xlsx</b> est joint à cet achat. Il s'ouvre avec Excel, Google Sheets (gratuit, aussi sur téléphone) ou LibreOffice.</p>
<h2>Démarrer en 5 minutes</h2>
<ul><li><b>Paramètres</b> : nom de ta boutique, devise, taux de change, caisse de départ.</li>
<li><b>Journal de caisse</b> : chaque soir, note tes entrées et sorties. Le solde se calcule tout seul.</li>
<li><b>Marge &amp; Stock</b> : une ligne par produit, tu vois ta vraie marge et quoi recommander.</li>
<li><b>Tableau de bord</b> : rien à remplir, ton mois en un coup d'œil.</li></ul>
<p class="muted">Les cellules jaunes sont à remplir, les blanches se calculent seules. Les premières lignes sont des exemples à remplacer.</p>""",
}


def welcome_html(p):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_CSS}
@page {{ size: A4; margin: 0; }}
body {{ background: #fff; color: #0F172A; }}
.page {{ padding: 48px 56px; }}
.band {{ background: #0F172A; color: #F8FAFC; border-radius: 24px; padding: 32px 36px; position: relative; overflow: hidden; }}
.band .logo {{ font-size: 24px; }} .band .logo .ic {{ width: 44px; height: 44px; }}
.band h1 {{ font-size: 40px; margin-top: 20px; font-weight: 900; }}
.band p {{ color: #CBD5E1; margin-top: 6px; font-size: 16px; }}
.band .e {{ position: absolute; right: 32px; top: 28px; font-size: 96px; }}
h2 {{ font-size: 20px; margin-top: 30px; color: #B45309; }}
p {{ font-size: 15px; line-height: 1.6; margin-top: 8px; }}
ul {{ margin-top: 10px; display: grid; gap: 10px; font-size: 15px; line-height: 1.5; }}
li::before {{ color: {p['accent']}; }}
.help {{ margin-top: 36px; padding: 18px 22px; background: #F1F5F9; border-radius: 16px; font-size: 14px; }}
.muted {{ color: #475569; font-size: 13px; }}
</style></head><body><div class="page">
<div class="band"><div class="logo"><div class="ic">{ICON}</div><span>Kazi<b>Boss</b></span></div>
<span class="e">{p['emoji']}</span><h1>Merci pour ton achat !</h1><p>{p['title']} · {p['tagline']}</p></div>
{WELCOME[p['slug']]}
<div class="help"><b>Un souci ?</b> Pack non activé : dans l'app, onglet Boutique, touche « Restaurer mes achats » (connecte-toi avec l'email utilisé pour le paiement).
Toujours bloqué ? Écris-nous à <b>bmug9094@gmail.com</b> avec ta référence de paiement Chariow.</div>
</div></body></html>"""


def chrome(args):
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-pdf-header-footer', *args],
                   check=True, capture_output=True, timeout=120)


def banner_html(p, w=1400, h=600):
    """Bannière de page produit Chariow : affichée recadrée (≈ 2,34:1 dans l'éditeur, 2,7:1 ailleurs).
    Marges larges pour que le contenu reste visible quel que soit le recadrage."""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_CSS}
html, body {{ width: {w}px; height: {h}px; overflow: hidden; }}
.wrap {{ position: relative; width: 100%; height: 100%; padding: 92px 120px;
  background: radial-gradient(circle at 80% 20%, {p['accent']}55, transparent 45%),
              radial-gradient(circle at 5% 100%, #F59E0B33, transparent 40%), #0F172A; }}
.logo {{ font-size: 28px; }} .logo .ic {{ width: 48px; height: 48px; }}
.kicker {{ color: {p['accent']}; margin-top: 34px; font-size: 17px; }}
h1 {{ font-size: 70px; line-height: 1.02; font-weight: 900; margin-top: 10px; max-width: 900px; letter-spacing: -1.5px; }}
.tag {{ font-size: 26px; color: #CBD5E1; margin-top: 14px; max-width: 880px; }}
.emoji {{ position: absolute; right: 150px; top: 120px; font-size: 220px; line-height: 1; filter: drop-shadow(0 18px 40px rgba(0,0,0,.45)); }}
.price {{ position: absolute; right: 140px; bottom: 90px; font-size: 38px; padding: 12px 32px; }}
</style></head><body><div class="wrap">
<div class="logo"><div class="ic">{ICON}</div><span>Kazi<b>Boss</b></span></div>
<div class="emoji">{p['emoji']}</div>
<p class="kicker">{p['kicker']}</p>
<h1>{p['title']}</h1>
<p class="tag">{p['tagline']}</p>
<span class="price">{p['price']}</span>
</div></body></html>"""


OUT.mkdir(parents=True, exist_ok=True)
TMP.mkdir(parents=True, exist_ok=True)
for p in PRODUCTS:
    for w, h, suffix in ((1280, 720, '1280x720'), (1080, 1080, '1080x1080'), (1400, 600, 'banniere-1400x600')):
        html = TMP / f"{p['slug']}-{suffix}.html"
        html.write_text(banner_html(p, w, h) if suffix.startswith('banniere') else cover_html(p, w, h), encoding='utf-8')
        # Chrome headless impose une largeur mini de 500 px : nos formats sont plus grands, pas de rognage.
        chrome([f'--window-size={w},{h}', '--force-device-scale-factor=1', f'--screenshot={OUT / (p["slug"] + "-" + suffix + ".png")}', html.as_uri()])
    page = TMP / f"{p['slug']}-bienvenue.html"
    page.write_text(welcome_html(p), encoding='utf-8')
    chrome([f'--print-to-pdf={OUT / (p["slug"] + "-bienvenue.pdf")}', page.as_uri()])
    print('ok', p['slug'])
