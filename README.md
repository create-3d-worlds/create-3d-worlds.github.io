# Create a 3D game with Three.js

Create a 3D game with Three.js.

## Start

```
npm i
live-server
```

## TODO

### General

- [x] ažurirati verziju (na 119)
- [ ] ažurirati verziju (na 125)
- [ ] ažurirati verziju na poslednju
- [x] svuda srediti svetla
  - [x] hemLight to lights.js
- [x] dodati `mesh.castShadow = true` i `mesh.receiveShadow = true` gde treba
- [x] dovesti veličine u razmeru 1px : 1m
- [x] isprobati nove 3d modele
  - [x] organizovati modele tematski
  - [x] izbaciti nightelf-priest
- [x] veličina nekih modela ne radi (dae format zeza, izbegavati)
- [x] pomeriti foldere sa igračem u scenu
- [ ] move 1943 ground to helpers

### Geometry

- [x] create a box
- [x] create a lot of boxes
- [x] create other basic shapes
- [x] add texture
- [x] dodati primere drveća u geometriju

### Particles

- [x] napraviti 3D kišu
  - [ ] kiša da prati igraca
- [x] napraviti sneg
  - [x] zastariti Snow, ukloniti iz Savo
- [x] probati eksplozije
- [x] odvojiti pomagala za čestice
- [x] implementirati BufferGeometry
  - [x] handle different vertex velocity

### Tilemaps

- [x] napraviti nekoliko *tilemap*-a
  - [x] implementirati algoritam za pravljenje lavirinta
- [x] renderovati mapu u 2d
- [x] renderovati mapu u 3d
  - [x] renderovati mapu sa teksturama
  - [x] dodati parametar za niže zidove
- [x] prikazati polozaj igraca iz 3D mape na 2D mapi
  - [x] da radi i kad je negativno izvorište 3D mape
- [x] spojiti 3D i 2D Tilemap
- [x] reuse randomWalls method

### Terrain (procedural generation, heightmap, textures)

- [x] napraviti tlo
- [x] dodati koliziju na tlo
- [x] proceduralno kreirati okruženje
  - [x] dodati drveće, zgrade
  - [x] dodati sanduke sa teksturom
- [x] prebaciti da tlo bude okruglo (moze samo kad je ravna podloga)
- [x] heightmap
- [x] heightmap with texture
- [x] kreirati stepenice u krug od kocki
- [x] kreirati funkciju similarColor
- [x] proceduralni grad: promeniti boju krova

### 2D Renderer

- [x] crtati prvo lice (Savo)
  - [x] crtati nisan u centru ekrana
  - [x] weapon shaking
  - [x] crtati 3d igraca na 2d maloj mapi
- [x] razdvojiti CanvasRenderer klasu na Map2DRenderer i FPSRenderer
- [x] malu mapu iscrtavati samo nakon promene tipki

### Camera

- [x] dodati kameru iz prvog lica (fps)
- [x] dodati kameru odozgo (orbit)
- [x] menjati kamere na taster
- [x] srediti redom kamere po scenama
- [x] da moze da gleda levo-desno i gore-dole i sl. (vidi stairway-to-heaven)

### Player

- [x] dodati igraca
- [x] prikazati polozaj igraca na mapi
- [x] omogućiti 2d kretanje kroz mapu
- [x] omogućiti 3d kretanje kroz mapu
- [x] dodati skakanje
  - [x] srediti skok i padanje
  - [x] srediti penjanje uz stepenice
- [x] dodati kontrole i na strelice
- [x] dodati dugme (m) za otvaranje/zatvaranje mape
- [x] dodati koliziju kako se ne bi prolazilo kroz predmete
  - [x] probati koliziju bacanjem zraka
  - [x] probati koliziju geometrijom
- [x] postaviti lavirint sa kolizijom
- [x] srediti Player handleInput
- [x] spojiti animacije sa pokretom
- [x] ukloniti argument transparent, srediti Savo

### 3D Models

- [x] dodati 3d model
- [x] dodati animirani 3d model
  - [x] ucitati fbx zensku iz rpg-a
  - [x] kontrolama menjati animacije (kretanje, trčanje, skok...)
- [x] srediti pufnicu (dodati jos malo geometrije i neku boju, materijal, teksturu...)
  - [x] probati da Avatar bude od lave (vidi shader example)
- [x] odvojiti klase Player i Model
- [x] napraviti izvedene klase koje nasledjuju Model (Dupechesh, Robotko, Girl i sl)
- [x] spojiti klase Avatar i Player
- [x] spojiti klase Player i Model
  - [x] obrisati naslednice
- [x] srediti da se ne ponavlja animacija skakanja
- [x] srediti da se ne ponavljaju jednokratne animacije (napad, specijal, itd) 
- [x] ako je skok blokiran da pada
- [x] da ne korača u skoku kad ide napred
- [x] srediti animacije modela (vidi stairway-girl)
- [x] ubrzati animaciju po potrebi (u odnosu na brzinu, nazad sporije i sl.)

### Physics

- [x] odvojiti fizička pomagala
- [x] videti nove primere
  - [ ] lomi materijale https://threejs.org/examples/?q=physics#physics_ammo_break
- [ ] domine: da manja obara veću
- [ ] Razaranje zamka topom
  - [ ] dodati proceduralni zamak (vidi zamak-fizika, gradjevina-physijs)
  - [ ] dodati top (ima model)
  - [ ] top puca i rusi zidine (vidi ball-trowing)
    https://rawgit.com/mmmovania/Physijs_Tutorials/master/Shooting.html
- [ ] Steampunk vozilo
  - [ ] dodati fiziku na steam tenk ili lokomotivu (vidi vozilo-physijs)
  - [ ] da gazi i gura prepreke
    http://127.0.0.1:8080/15-fizika/70-vozilo/
    http://127.0.0.1:8080/15-fizika/75-vozilo-razbija/

### AI
- [x] probati ai https://github.com/erosmarcon/three-steer
- [ ] odvojiti ai pomagala
- [ ] postaviti ai scenu sa modelima

### Scenes and examples

- [x] Savo (ww2 fps)
  - [x] dodati kišu
  - [x] srediti boju kiše
  - [ ] dodati NPC karaktere (vidi 80-primeri/80-nemesis)
    - https://www.script-tutorials.com/demos/474/index3.html
  - [ ] dodati neke modele vozila i kuca
  - [ ] dodati tenk kako prolazi
  - [ ] dodati munje https://threejs.org/examples/?q=light#webgl_lightningstrike
  - [ ] dodati pucanje

- [ ] Svemir 
  - [ ] dodati model ring space-arcology
  - [ ] dodati zvezdani svod
  - [ ] bolja distribucija zvezda (perlin noise)
  - [ ] probati letenje kroz zvezde
  - [ ] sletanje na platformu (naći 2d primer)
    - [ ] sletanje na mesec (textured moon)
  - [ ] dodati proceduralnu planetu http://colordodge.com/ProceduralPlanet/?seed=Ridi%20Genow

- [x] Avion leti
  - [x] dodati suncevu svetlost (https://threejs.org/examples/webgl_lights_hemisphere.html)
  - [x] dodati senku i maglu (vidi 3d-warplane)
  - [x] dodati sunce
  - [x] srediti komande: skretanje, spuštanje, dizanje, brzinu
  - [-] dodati oblake (teško)
  - [x] dodati drveće

- [x] Zepelin leti
  - [x] dodati raycast
  - [x] dodati teren-dinamicki
  - [x] probati raycast za teren-dinamicki (ne mere)
  - [x] automatski podizati ako je preblizu zemlje
  - [x] srediti sletanje
  - [x] prikazati komande
  - [x] probati pticu
  - [x] cepelin da prvo poleti pa ubrza (avion prvo ubrza pa poleti)

- [ ] Grad
  - [x] srediti grad
  - [x] srediti grad-prozori
  - [x] optimizovati grad-prozori
  - [x] srediti uličnu rasvetu
  - [x] srediti rotaciju spojenih zgrada
  - [x] ostaviti prostor za park ili trg u centru grada (logika za krug i kvadrat)
  - [ ] dodati park ili trg u centru
  - [ ] dodati drveće, za zeleni grad
  - [ ] ubaciti prvo lice u scenu

- [ ] Fantasy scena
  - [ ] dodati modele (vidi rad-sa-modelima)
  - [ ] cepelin u vazduhu (vinci aerial screw, santos dumont airship)
  - [ ] karakter dolazi do kuće i ulazi (vidi 50-rad-sa-modelima/35-kuca-unutrasnost)
  - [ ] uzima predmete (50-rad-sa-modelima/80-uzimanje-predmeta/)
  - [ ] oblaci, životinje, zamak (vidi 80-primeri/90-simulacija-sveta)

- [ ] 1943
  - [x] integrisati u projekat
  - [x] srediti model aviona
  - [ ] dodati izbor aviona
  - [ ] dodati drveće
  - [ ] dodati objekte
  - [ ] pomeriti u scene

- [ ] Endless runner
  - [x] prikazivati poene
  - [ ] probati konja ili dabra

- [ ] Solar system
  - [ ] ubaciti planete sa teksturom
  - [ ] napraviti sunce sa teksturom

- [ ] Nemesis
  - [ ] dodati igrača
  - [ ] srediti koliziju sa zidom 
  - [ ] dodati ai modele

### Ostalo

- [x] isprobati lagani prelaz (lerp ili tween.js)
- [ ] dodati panoramu (skybox), nebo/zvezde (vidi 50-svod)
- [ ] dodati UI komande redom
- [ ] popraviti HTML margine
- [ ] optimizacija 
  - https://twitter.com/mrdoob/status/966609115140128768
  - https://attackingpixels.com/tips-tricks-optimizing-three-js-performance/
- [ ] probati VR
  - https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content
  - https://ski-mountain-vr.herokuapp.com/
- [ ] dodati preloader (ima u 3D-RPG-Game-With-THREE.js)
- [ ] naci vismapu sutjeske
  - http://www.smartjava.org/content/threejs-render-real-world-terrain-heightmap-using-open-data/
  - https://blog.mapbox.com/bringing-3d-terrain-to-the-browser-with-three-js-410068138357
- [x] dodati lavu (dodato na lava-avatar)

## Documentation

Raycaster arrow helper:

```
scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300))
```

Axes helper:

```
scene.add(new THREE.AxesHelper(50))
```

All libraries in `/libs` folder are updated manually to support ES6 export.

Prevent OrbitControls bellow ground:

```
controls.maxPolarAngle = Math.PI / 2 - 0.1
```

## Sources

Examples are from theese great books and tutorials:

* 3D Game Programming for Kids (Chris Strom)
* [Interactive 3D Graphics](https://in.udacity.com/course/interactive-3d-graphics--cs291/) (Eric Haines)
* [Three.js tutorials by example](http://stemkoski.github.io/Three.js/) (Lee Stemkoski)
* [WebGL and Three.js Fundamentals](https://github.com/alexmackey/threeJsBasicExamples) (Alex Mackey)
* [Examples created by Yomotsu using THREE.js](http://yomotsu.github.io/threejs-examples/) (Akihiro Oyamada)
* [Learning Threejs](https://github.com/josdirksen/learning-threejs) (Jos Dirksen)
* [Essential Three.js](https://github.com/josdirksen/essential-threejs) (Jos Dirksen)
* [Three.js Cookbook](https://github.com/josdirksen/threejs-cookbook) (Jos Dirksen)
* [How to Design 3D Games with Web Technology - Book 01: Three. Js - HTML5 and WebGL](https://thefiveplanets.org/b01/) (Jordi Josa)

Free 3D Models are from sketchfab.com and other respected sites.
