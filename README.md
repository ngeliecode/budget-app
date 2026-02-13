# 💰 Budget App

En enkel budgetapplikation där användaren kan registrera inkomster och utgifter, kategorisera dem och få en automatiskt beräknad balans. Datan sparas i webbläsarens localStorage för att finnas kvar mellan sidladdningar. Projektet är utvecklat som en del av kursen JavaScript inom programmet Frontend Developer.

## 📸 Screenshots 

<p>
  <img src="public/01_screenshot_dark_theme.png" width="300"/>&nbsp;&nbsp;
  <img src="public/02_screenshot_dark_theme.png" width="300"/>
</p>

🌐 Besök live-sidan [här](https://medieinstitutet.github.io/fed25d-js-inl-2-budget-app-ngeliecode/)

## 🛠 Tekniker och verktyg

**Språk:** TypeScript, HTML, CSS

**Verktyg:** Vite, Prettier

**Pakethanterare:** npm

## 🔎 Validering

- [W3C HTML Validator](https://validator.w3.org/)
- [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)

HTML-koden har granskats och justerats för att uppfylla W3C:s standard för korrekt semantik och struktur. Informationsnotiser relaterade till Prettiers självstängande syntax (`/>`) identifierades, men bedömdes inte påverka sidans giltighet och har därför inte åtgärdats.

CSS-validatorn genererade en varning relaterad till CSS-variabler. Min förståelse är att validatorn kan läsa exempelvis `var(--main-color)` men inte vilket värde variabeln faktiskt får. Validatorn kan därför inte analysera det faktiska värdet. Jag valde att inte åtgärda dessa varningar efter att ha kontrollerat att variablerna fungerar korrekt i webbläsaren.

## 🧭 Tillgänglighetskontroll

- Firefox Accessibility Inspector
- Chrome Lighthouse

Applikationen har testats och justerats utifrån de brister som identifierades i verktygen, exempelvis saknade label-kopplingar och otillräcklig färgkontrast.
