# Vefforritun 2 2024, verkefni 2, sýnilausn

Sjá lýsingu á verkefni í [readme-v2.md](readme-v2.md) eða [á GitHub](https://github.com/vefforritun/vef2-2024-v2).

## Keyrsla

Til að keyra verkefnið þarf að hafa:

- `node` útgáfu 20 uppsett
- `postgresql` uppsett og keyrandi
- `.env` skrá með viðeigandi gildum, sjá `.env.example`

Síðan þarf að keyra:

```bash
createdb vef2-2024-v2 # ef annað nafn á gagnagrunn þarf að uppfæra .env
npm install
npm run setup # setur upp gagnagrunn og setur inn gögn
npm run test # keyrir lint og test
npm run dev # keyrir dev útgáfu af verkefni
npm start # keyrir production útgáfu af verkefni
```

### Gögn

Gögn sem sett eru inn eru unnin beint úr JSON skrám sem fylgja í `./data`. Einnig væri hægt að handvirkt færa þau yfir í `insert.sql` skránna. Þessi keyrsla er í gegnum `./src/setup.js` skránna og hægt keyra með:

```bash
npm run setup
```

## Uppsetning í hýsingu

TBD

## Útfærsla

Verkefninu er skipt í möppur:

- `src` geymir allan kóða
- `src/lib` geymir kóða sem auðvelt er að einangra og útbúa próf fyrir
- `src/routes` geymir allar slóðir (routes) sem hægt er að nálgast
- `views` geymir EJS template skrár

Kóði hefur skjölun í formi [JSDoc](https://jsdoc.app/) ásamt athugasemdum þar sem við á.

### Logger

### Hlutir sem mættu betur fara

- Valmynd ætti að sýna hvaða síða er valin
- Eitthvað af tvítekningu sem ætti að laga
- `src/lib/logger.js` er einfaldur logger sem skrifar út í `console`, það væri hægt að útfæra með `winston` eða öðrum logger sem skrifar í skrá
- `getGames()` í `src/lib/db.js` skilar að hámarki 100 leikjum, það ætti að útfæra með pagination, þetta á líka við útfærslu á stöðu sem ætti að reikna í gagnagrunni eða við hverja skráningu á leik

### TODO

- [ ] Notendur í gagnagrunn
