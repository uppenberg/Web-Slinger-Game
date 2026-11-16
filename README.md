# Näthjälten

## Starta och installera

PWA och offline kräver en lokal webbserver eller HTTPS. Starta spelet via en webbserver; att öppna HTML-filen direkt med `file://` fungerar inte säkert och aktiverar inte offline-installationen. Starta i den här mappen med:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Öppna http://localhost:8000 i Chrome eller Edge. Låt sidan laddas färdigt medan servern körs. Välj webbläsarens installationsknapp i adressfältet eller dess meny för att installera spelet. På surfplatta behöver spelet vara tillgängligt via HTTPS för att kunna installeras; localhost på datorn är inte surfplattans localhost. Tillvägagångssättet för installation beror på webbläsaren.

Efter första laddningen ska spelet och Three.js finnas i offline-cache. När servern stängts kan den installerade appen eller samma URL öppnas offline. Tillgängligheten till svenska röster offline beror på operativsystemet; textremsor visas också. Spela en gång online eller via servern efter ändringar så att den nya versionen kan installeras.

## Röster

Se [röstmanuset](ljud/ROSTMANUS.txt). MP3-filer är valfria. Lägg dem i `ljud/`, starta om servern om den stoppats och ladda om spelet med nätverk/server tillgänglig. Låt sidan vara öppen en stund så att ljudfilerna hämtas till offline-cachen. Utan inspelningar används webbläsarens svenska talsyntes om en sådan röst finns; uppläsning av namn kräver också talsyntes.
