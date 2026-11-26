"""Classeur KaziBoss Digital Growth : journal de caisse, marge & stock, tableau de bord mensuel."""
import datetime as dt
import sys

from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.comments import Comment
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

OUT = sys.argv[1]
JOURNAL_ROWS = int(sys.argv[2]) if len(sys.argv) > 2 else 1000  # lignes prêtes à remplir
PRODUCT_ROWS = int(sys.argv[3]) if len(sys.argv) > 3 else 150

F = 'Arial'
NAVY, GOLD, EMERALD, CORAL = '0F172A', 'F59E0B', '10B981', 'EF4444'
INPUT_FILL = PatternFill('solid', fgColor='FFF7D6')   # cellules à remplir
HEAD_FILL = PatternFill('solid', fgColor=NAVY)
TITLE_FONT = Font(name=F, size=18, bold=True, color=NAVY)
SUB_FONT = Font(name=F, size=10, italic=True, color='475569')
HEAD_FONT = Font(name=F, size=10, bold=True, color='FFFFFF')
BODY = Font(name=F, size=10)
BOLD = Font(name=F, size=10, bold=True)
INPUT_FONT = Font(name=F, size=10, color='1D4ED8')     # saisie = bleu
thin = Side(style='thin', color='CBD5E1')
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)
MONEY = '#,##0.00;[Red]-#,##0.00;"-"'
PCT = '0.0%;[Red]-0.0%;"-"'
DATE = 'DD/MM/YYYY'
CENTER = Alignment(horizontal='center', vertical='center', wrap_text=True)
WRAP = Alignment(wrap_text=True, vertical='top')

wb = Workbook()


def title(ws, text, sub):
    ws['A1'] = text
    ws['A1'].font = TITLE_FONT
    ws['A2'] = sub
    ws['A2'].font = SUB_FONT
    ws.sheet_view.showGridLines = False


def header(ws, row, labels, widths=None):
    for i, label in enumerate(labels, start=1):
        c = ws.cell(row=row, column=i, value=label)
        c.font, c.fill, c.alignment, c.border = HEAD_FONT, HEAD_FILL, CENTER, BOX
    ws.row_dimensions[row].height = 32
    if widths:
        for i, w in enumerate(widths, start=1):
            ws.column_dimensions[ws.cell(row=row, column=i).column_letter].width = w


# ───────────────────────── 1. MODE D'EMPLOI ─────────────────────────
ws = wb.active
ws.title = "Mode d'emploi"
title(ws, 'KaziBoss · Digital Growth', 'Les modèles automatisés pour gérer ta vraie boutique — édition 2026')
ws.column_dimensions['A'].width = 4
ws.column_dimensions['B'].width = 30
ws.column_dimensions['C'].width = 80
rows = [
    ('1. Paramètres', "Commence ici : nom de ta boutique, devise, taux de change, caisse de départ et l'année suivie. À faire une seule fois."),
    ('2. Journal de caisse', "Chaque jour, note chaque entrée et chaque sortie d'argent (date, motif, catégorie, montant). Le solde se calcule tout seul."),
    ('3. Marge & Stock', "Une ligne par produit : prix d'achat, frais, prix de vente et stock. Tu vois ta marge réelle, la valeur de ton stock et les produits à recommander."),
    ('4. Tableau de bord', "Rien à saisir : chaque mois, tes entrées, sorties, ton résultat et tes dépenses par catégorie, avec un graphique."),
    ('', ''),
    ('Légende', ''),
    ('Cellule jaune, texte bleu', 'À remplir par toi.'),
    ('Cellule blanche', 'Calculée automatiquement : ne pas modifier.'),
    ('', ''),
    ('Conseils', ''),
    ('Tous les soirs', 'Compte ta caisse et compare avec le solde du journal. Un écart ? Cherche-le tout de suite.'),
    ('Retraits perso', "Note-les avec la catégorie « Retrait perso / salaire » : c'est ainsi que tu sépares ta poche et la boutique."),
    ('Sauvegarde', "Garde une copie du fichier sur ton téléphone et sur Google Drive ou WhatsApp (message à toi-même)."),
    ('Les lignes d\'exemple', "Les premières lignes du journal et des produits sont des exemples : remplace-les par tes propres chiffres."),
]
for i, (k, v) in enumerate(rows, start=4):
    ws.cell(row=i, column=2, value=k).font = BOLD
    c = ws.cell(row=i, column=3, value=v)
    c.font, c.alignment = BODY, WRAP
ws['B10'].fill = INPUT_FILL
ws['B10'].font = Font(name=F, size=10, bold=True, color='1D4ED8')
for r in (9, 13):
    ws.cell(row=r, column=2).font = Font(name=F, size=11, bold=True, color=GOLD)

# ───────────────────────── 2. PARAMÈTRES ─────────────────────────
ps = wb.create_sheet('Paramètres')
title(ps, 'Paramètres', 'À remplir une seule fois. Les autres onglets utilisent ces valeurs.')
ps.column_dimensions['A'].width = 38
ps.column_dimensions['B'].width = 22
ps.column_dimensions['C'].width = 60
params = [
    ('Nom de la boutique', 'Boutique Mama Nadine', None, 'Affiché sur le tableau de bord.'),
    ('Devise des montants', '$', None, 'Ex. $, FC, FCFA. Tous les montants du fichier sont dans cette devise.'),
    ('Taux de change (FC ou FCFA pour 1 unité de devise)', 2900, '#,##0', 'Ex. 2 900 FC pour 1 $. Sert à afficher tes prix en monnaie locale. Mets à jour chaque semaine.'),
    ('Caisse au début du suivi', 100, MONEY, "L'argent présent dans la caisse le jour où tu commences le journal."),
    ('Année suivie par le tableau de bord', 2026, '0', 'Le tableau de bord affiche les 12 mois de cette année.'),
    ('Marge visée (% du prix de vente)', 0.25, '0%', 'Sert à calculer le « prix conseillé » de chaque produit.'),
]
for i, (label, val, fmt, note) in enumerate(params, start=4):
    ps.cell(row=i, column=1, value=label).font = BOLD
    c = ps.cell(row=i, column=2, value=val)
    c.font, c.fill, c.border = INPUT_FONT, INPUT_FILL, BOX
    if fmt:
        c.number_format = fmt
    n = ps.cell(row=i, column=3, value=note)
    n.font, n.alignment = SUB_FONT, WRAP
ps['B4'].comment = Comment('Exemple : à remplacer par le nom de ta boutique.', 'KaziBoss')
ps['B6'].comment = Comment('Ordre de grandeur RDC fin 2026 (1 USD ≈ 2 800 – 2 950 FC). À remplacer par le taux du jour.', 'KaziBoss')
P_NAME, P_CUR, P_RATE, P_START, P_YEAR, P_MARGIN = ("'Paramètres'!$B$4", "'Paramètres'!$B$5", "'Paramètres'!$B$6",
                                                     "'Paramètres'!$B$7", "'Paramètres'!$B$8", "'Paramètres'!$B$9")

CATEGORIES = ['Vente', 'Encaissement crédit client', 'Achat de stock', 'Transport', 'Loyer', 'Électricité / carburant',
              'Salaire employé', 'Retrait perso / salaire', 'Frais Mobile Money', 'Taxes / patente', 'Remboursement emprunt',
              'Autre entrée', 'Autre dépense']
ps['A12'] = 'Catégories du journal'
ps['A12'].font = Font(name=F, size=11, bold=True, color=GOLD)
ps['A13'] = 'Tu peux renommer ces catégories : la liste déroulante du journal et le tableau de bord suivent.'
ps['A13'].font = SUB_FONT
for i, cat in enumerate(CATEGORIES, start=14):
    c = ps.cell(row=i, column=1, value=cat)
    c.font, c.fill, c.border = INPUT_FONT, INPUT_FILL, BOX
CAT_FIRST, CAT_LAST = 14, 14 + len(CATEGORIES) - 1
CAT_RANGE = f"'Paramètres'!$A${CAT_FIRST}:$A${CAT_LAST}"

# ───────────────────────── 3. JOURNAL DE CAISSE ─────────────────────────
js = wb.create_sheet('Journal de caisse')
title(js, 'Journal de caisse', 'Une ligne par mouvement d\'argent. Le solde se calcule automatiquement.')
js['E2'] = '="Caisse de départ : "&TEXT(' + P_START + ',"#,##0.00")&" "&' + P_CUR
js['E2'].font = BOLD
HR = 4
header(js, HR, ['Date', 'Motif', 'Catégorie', 'Mode de paiement', 'Entrée', 'Sortie', 'Solde de caisse'],
       [13, 38, 26, 18, 14, 14, 17])
js['E4'] = '="Entrée ("&' + P_CUR + '&")"'
js['F4'] = '="Sortie ("&' + P_CUR + '&")"'
js['G4'] = '="Solde ("&' + P_CUR + '&")"'
first, last = HR + 1, HR + JOURNAL_ROWS
examples = [
    (dt.date(2026, 11, 2), 'Ventes de la journée', 'Vente', 'Cash', 42.5, None),
    (dt.date(2026, 11, 2), 'Riz 25 kg + huile chez le grossiste', 'Achat de stock', 'Mobile Money', None, 30),
    (dt.date(2026, 11, 3), 'Moto-taxi pour la livraison', 'Transport', 'Cash', None, 2),
]
for r in range(first, last + 1):
    for col in range(1, 7):
        c = js.cell(row=r, column=col)
        c.fill, c.font, c.border = INPUT_FILL, INPUT_FONT, BOX
    js.cell(row=r, column=1).number_format = DATE
    js.cell(row=r, column=5).number_format = MONEY
    js.cell(row=r, column=6).number_format = MONEY
    g = js.cell(row=r, column=7, value=f'=IF(AND(E{r}="",F{r}=""),"",{P_START}+SUM(E${first}:E{r})-SUM(F${first}:F{r}))')
    g.number_format, g.font, g.border = MONEY, BOLD, BOX
for i, ex in enumerate(examples):
    for col, v in enumerate(ex, start=1):
        if v is not None:
            js.cell(row=first + i, column=col, value=v)
js.cell(row=first, column=2).comment = Comment('Lignes d\'exemple : remplace-les par tes propres mouvements.', 'KaziBoss')
dv_cat = DataValidation(type='list', formula1=f'={CAT_RANGE}', allow_blank=True, showErrorMessage=True,
                        errorTitle='Catégorie', error='Choisis une catégorie dans la liste (modifiable dans Paramètres).')
dv_mode = DataValidation(type='list', formula1='"Cash,Mobile Money,Banque,Crédit fournisseur"', allow_blank=True)
dv_amt = DataValidation(type='decimal', operator='greaterThanOrEqual', formula1='0', allow_blank=True,
                        showErrorMessage=True, error='Saisis un montant positif (entrée OU sortie).')
dv_date = DataValidation(type='date', operator='between', formula1='DATE(2000,1,1)', formula2='DATE(2100,12,31)', allow_blank=True,
                         showErrorMessage=True, error='Saisis une date, par exemple 02/11/2026.')
for dv, rng in ((dv_cat, f'C{first}:C{last}'), (dv_mode, f'D{first}:D{last}'), (dv_amt, f'E{first}:F{last}'), (dv_date, f'A{first}:A{last}')):
    js.add_data_validation(dv)
    dv.add(rng)
js.conditional_formatting.add(f'G{first}:G{last}', CellIsRule(operator='lessThan', formula=['0'],
                              font=Font(name=F, bold=True, color=CORAL), fill=PatternFill('solid', fgColor='FEE2E2')))
js.freeze_panes = js.cell(row=first, column=1)
js.auto_filter.ref = f'A{HR}:G{last}'

# ───────────────────────── 4. MARGE & STOCK ─────────────────────────
ms = wb.create_sheet('Marge & Stock')
title(ms, 'Marge & Stock', 'Ton vrai coût, ta vraie marge, et les produits à recommander.')
HR2 = 4
header(ms, HR2, ["Produit", "Prix d'achat (unité)", 'Frais par unité (transport, pertes)', 'Coût de revient',
                 'Prix de vente', 'Marge par unité', 'Marge (% du prix)', 'Prix conseillé', 'Prix de vente (monnaie locale)',
                 'Stock actuel (unités)', "Seuil d'alerte", 'À commander ?', 'Valeur du stock (au coût)'],
       [30, 13, 16, 13, 13, 13, 12, 13, 16, 13, 12, 15, 16])
pfirst, plast = HR2 + 1, HR2 + PRODUCT_ROWS
products = [
    ('Savon de ménage (barre)', 0.40, 0.10, 0.80, 48, 20),
    ('Riz 1 kg', 1.10, 0.15, 1.50, 12, 15),
    ('Sucre 1 kg', 1.00, 0.10, 1.40, 30, 10),
]
for r in range(pfirst, plast + 1):
    for col in (1, 2, 3, 5, 10, 11):
        c = ms.cell(row=r, column=col)
        c.fill, c.font, c.border = INPUT_FILL, INPUT_FONT, BOX
    for col in (2, 3, 5):
        ms.cell(row=r, column=col).number_format = MONEY
    for col in (10, 11):
        ms.cell(row=r, column=col).number_format = '#,##0'
    f = {
        4: f'=IF(B{r}="","",B{r}+N(C{r}))',
        6: f'=IF(OR(D{r}="",E{r}=""),"",E{r}-D{r})',
        7: f'=IF(OR(F{r}="",N(E{r})=0),"",F{r}/E{r})',
        8: f'=IF(D{r}="","",IF({P_MARGIN}>=1,"",D{r}/(1-{P_MARGIN})))',
        9: f'=IF(E{r}="","",E{r}*{P_RATE})',
        12: f'=IF(OR(J{r}="",K{r}=""),"",IF(J{r}<=K{r},"⚠ À commander","OK"))',
        13: f'=IF(OR(D{r}="",J{r}=""),"",D{r}*J{r})',
    }
    for col, formula in f.items():
        c = ms.cell(row=r, column=col, value=formula)
        c.font, c.border = BODY, BOX
        c.number_format = {7: PCT, 9: '#,##0', 12: 'General'}.get(col, MONEY)
for i, p in enumerate(products):
    r = pfirst + i
    for col, v in zip((1, 2, 3, 5, 10, 11), p):
        ms.cell(row=r, column=col, value=v)
ms.cell(row=pfirst, column=1).comment = Comment("Lignes d'exemple (prix indicatifs en $) : remplace-les par tes produits.", 'KaziBoss')
ms.conditional_formatting.add(f'L{pfirst}:L{plast}', FormulaRule(formula=[f'LEFT(L{pfirst},1)="⚠"'],
                              font=Font(name=F, bold=True, color=CORAL), fill=PatternFill('solid', fgColor='FEE2E2')))
ms.conditional_formatting.add(f'F{pfirst}:F{plast}', CellIsRule(operator='lessThan', formula=['0'],
                              font=Font(name=F, bold=True, color=CORAL)))
ms.conditional_formatting.add(f'E{pfirst}:E{plast}', FormulaRule(formula=[f'AND(E{pfirst}<>"",H{pfirst}<>"",E{pfirst}<H{pfirst})'],
                              fill=PatternFill('solid', fgColor='FEF3C7')))
ms['I4'] = '="Prix de vente (x "&TEXT(' + P_RATE + ',"#,##0")&")"'
ms['H4'] = '="Prix conseillé (marge "&TEXT(' + P_MARGIN + ',"0%")&")"'
ms.freeze_panes = ms.cell(row=pfirst, column=2)
ms.auto_filter.ref = f'A{HR2}:M{plast}'
ms['A3'] = 'Prix de vente surligné en jaune pâle = sous le prix conseillé pour ta marge visée.'
ms['A3'].font = SUB_FONT

# ───────────────────────── 5. TABLEAU DE BORD ─────────────────────────
ds = wb.create_sheet('Tableau de bord')
ds.sheet_view.showGridLines = False
ds['A1'] = '="Tableau de bord · "&' + P_NAME
ds['A1'].font = TITLE_FONT
ds['A2'] = '="Année "&' + P_YEAR + '&" · montants en "&' + P_CUR + '&" · calculé depuis le journal de caisse"'
ds['A2'].font = SUB_FONT
for col, w in zip('ABCDEFGH', (16, 15, 15, 15, 17, 4, 30, 16)):
    ds.column_dimensions[col].width = w

J = "'Journal de caisse'"
JA, JC, JE, JF = (f'{J}!$A${first}:$A${last}', f'{J}!$C${first}:$C${last}',
                  f'{J}!$E${first}:$E${last}', f'{J}!$F${first}:$F${last}')
M = "'Marge & Stock'"

# Indicateurs clés
kpis = [
    ('Solde de caisse actuel', f'={P_START}+SUM({JE})-SUM({JF})', MONEY),
    ('Valeur du stock (au coût)', f'=SUM({M}!$M${pfirst}:$M${plast})', MONEY),
    ('Produits à recommander', f'=COUNTIF({M}!$L${pfirst}:$L${plast},"⚠*")', '0'),
    ('Marge moyenne (produits)', f'=IFERROR(AVERAGE({M}!$G${pfirst}:$G${plast}),0)', PCT),
]
# Étiquettes ligne 4, valeurs ligne 5, colonnes B à E
for i, (label, formula, fmt) in enumerate(kpis):
    lab = ds.cell(row=4, column=i + 2, value=label)
    lab.font, lab.alignment = Font(name=F, size=9, bold=True, color='475569'), CENTER
    v = ds.cell(row=5, column=i + 2, value=formula)
    v.font, v.alignment, v.number_format = Font(name=F, size=14, bold=True, color=NAVY), CENTER, fmt
    v.border = BOX
ds.row_dimensions[4].height = 28
ds.row_dimensions[5].height = 30
ds['A4'] = 'Aujourd\'hui'
ds['A4'].font = Font(name=F, size=9, bold=True, color=GOLD)

# Tableau mensuel
MR = 8
header(ds, MR, ['Mois', 'Entrées', 'Sorties', 'Résultat', 'dont retraits perso'])
months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
for i, name in enumerate(months, start=1):
    r = MR + i
    start = f'DATE({P_YEAR},{i},1)'
    end = f'DATE({P_YEAR},{i + 1},1)'
    ds.cell(row=r, column=1, value=name).font = BOLD
    ds.cell(row=r, column=2, value=f'=SUMIFS({JE},{JA},">="&{start},{JA},"<"&{end})')
    ds.cell(row=r, column=3, value=f'=SUMIFS({JF},{JA},">="&{start},{JA},"<"&{end})')
    ds.cell(row=r, column=4, value=f'=B{r}-C{r}')
    ds.cell(row=r, column=5, value=f'=SUMIFS({JF},{JA},">="&{start},{JA},"<"&{end},{JC},"Retrait perso / salaire")')
    for col in range(1, 6):
        c = ds.cell(row=r, column=col)
        c.border = BOX
        if col > 1:
            c.number_format, c.font = MONEY, BODY
tr = MR + 13
ds.cell(row=tr, column=1, value='Total année').font = BOLD
for col, L in zip(range(2, 6), 'BCDE'):
    c = ds.cell(row=tr, column=col, value=f'=SUM({L}{MR + 1}:{L}{MR + 12})')
    c.number_format, c.font, c.border = MONEY, BOLD, BOX
ds.conditional_formatting.add(f'D{MR + 1}:D{tr}', CellIsRule(operator='lessThan', formula=['0'], font=Font(name=F, bold=True, color=CORAL)))
ds.conditional_formatting.add(f'D{MR + 1}:D{tr}', CellIsRule(operator='greaterThan', formula=['0'], font=Font(name=F, bold=True, color='047857')))

# Dépenses par catégorie pour un mois choisi
ds['G7'] = 'Mois analysé (1 à 12)'
ds['G7'].font = BOLD
ds['H7'] = 11
ds['H7'].fill, ds['H7'].font, ds['H7'].border = INPUT_FILL, INPUT_FONT, BOX
ds.add_data_validation(dv_m := DataValidation(type='whole', operator='between', formula1='1', formula2='12',
                                              showErrorMessage=True, error='Saisis un numéro de mois entre 1 et 12.'))
dv_m.add('H7')
CR = 8
for col, label in ((7, 'Catégorie'), (8, 'Montant du mois')):
    c = ds.cell(row=CR, column=col, value=label)
    c.font, c.fill, c.alignment, c.border = HEAD_FONT, HEAD_FILL, CENTER, BOX
for i in range(len(CATEGORIES)):
    r = CR + 1 + i
    cat = ds.cell(row=r, column=7, value=f"='Paramètres'!A{CAT_FIRST + i}")
    cat.font, cat.border = BODY, BOX
    start = f'DATE({P_YEAR},$H$7,1)'
    end = f'DATE({P_YEAR},$H$7+1,1)'
    v = ds.cell(row=r, column=8, value=f'=SUMIFS({JE},{JA},">="&{start},{JA},"<"&{end},{JC},G{r})'
                                       f'+SUMIFS({JF},{JA},">="&{start},{JA},"<"&{end},{JC},G{r})')
    v.number_format, v.font, v.border = MONEY, BODY, BOX
ds.cell(row=CR + 1 + len(CATEGORIES), column=7, value='Entrées et sorties confondues, selon la catégorie.').font = SUB_FONT

chart = BarChart()
chart.type = 'col'
chart.title = 'Entrées et sorties par mois'
chart.y_axis.title = 'Montant'
chart.add_data(Reference(ds, min_col=2, max_col=3, min_row=MR, max_row=MR + 12), titles_from_data=True)
chart.set_categories(Reference(ds, min_col=1, min_row=MR + 1, max_row=MR + 12))
chart.height, chart.width = 8, 18
chart.roundedCorners = False
chart.legend.overlay = False
chart.title.overlay = False
chart.y_axis.title.overlay = False
chart.x_axis.delete = False
chart.y_axis.delete = False
chart.series[0].graphicalProperties.solidFill = EMERALD
chart.series[1].graphicalProperties.solidFill = CORAL
ds.add_chart(chart, f'A{tr + 3}')

# Onglet d'ouverture
wb.active = 0
for sheet in wb.worksheets:
    sheet.sheet_properties.tabColor = {'Mode d\'emploi': GOLD, 'Paramètres': GOLD, 'Tableau de bord': EMERALD}.get(sheet.title, NAVY)
wb.properties.title = 'KaziBoss Digital Growth'
wb.properties.creator = 'KaziBoss'
wb.save(OUT)
print('ok', OUT)
