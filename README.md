# Näthjälten

## Starta och installera

Öppna projektmappen i Visual Studio Code, högerklicka på `index.html` och välj **Open with Live Server**. Låt Live Server köras medan du spelar. Att öppna HTML-filen direkt med `file://` fungerar inte säkert och aktiverar inte offline-installationen.

För att installera webbappen, låt sidan laddas färdigt och använd webbläsarens installationsknapp eller meny. På surfplatta behöver spelet vara tillgängligt via HTTPS för offline-installation; localhost på datorn är inte surfplattans localhost.

Efter första laddningen ska spelet och Three.js finnas i offline-cache. När servern stängts kan den installerade appen eller samma URL öppnas offline. Tillgängligheten till svenska röster offline beror på operativsystemet; textremsor visas också. Spela en gång online eller via servern efter ändringar så att den nya versionen kan installeras.

## Röster

Se [röstmanuset](ljud/ROSTMANUS.txt). MP3-filer är valfria. Lägg dem i `ljud/`, starta om servern om den stoppats och ladda om spelet med nätverk/server tillgänglig. Låt sidan vara öppen en stund så att ljudfilerna hämtas till offline-cachen. Utan inspelningar används webbläsarens svenska talsyntes om en sådan röst finns; uppläsning av namn kräver också talsyntes.

## 3D-modeller

Kattmodellen `models/cat.glb` är **Cat Grooming (Grey Tabby)** från [3D Assets](https://3dassets.dev/assets/companion-animals-and-pet-home-cat-grooming-grey-tabby-ed3a72c5), CC0 1.0. Den lagras lokalt och cachas för offline-användning. GLTFLoader och BufferGeometryUtils kommer från Three.js 0.160.1.

Hjältemodellen `models/spiderman.glb` är [Spiderman](https://sketchfab.com/3d-models/spiderman-b0e695e8483f46f88943173a70be9709) av nitwit.friends, licensierad under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Spelet använder modellens inbyggda animationer för bland annat vila, löpning och svingning.

Den valbara modellen `models/hatch_spidey_2.glb` är [Hatch Spidey 2](https://sketchfab.com/3d-models/hatch-spidey-2-8b603f1f18704192bdba83f65ac4cde5) av spider-blood, licensierad under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Spelet använder dess egna hopp- och svinganimationer samt återanvänder rotationsspår för vila och löpning från den andra modellen.

Rhino-modellen `models/rhino.glb` är [Rhino - Marvel Strike Force](https://sketchfab.com/3d-models/rhino-marvel-strike-force-c823f16878684b3eb72ce94d96cfcab0) av Kabiidev, licensierad under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Egna animationer används för bland annat reaktion; spelet försöker anpassa Spideys löpning till Rhino-skelettet.

Venom-modellen är [Fortnite Venom Extreme](https://sketchfab.com/3d-models/fortnite-venom-extreme-e75bdab0dafb4586b87b85f9a499a1a5) av 20062020year, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Shocker-modellen är [Shocker - Marvel Strike Force](https://sketchfab.com/3d-models/shocker-marvel-strike-force-e0c6d65d0261496d9789e5ddb5baa5d8) av Kabiidev, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Egna animationsspår respektive anpassade rotationsspår används där de finns.
