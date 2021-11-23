# Create RPG game with Three.js

Create a role-playing game!

Repo: https://github.com/mudroljub/create-rpg-game

## Start

```
npm i
live-server
```

## Curriculum

<!-- You should know how to [create a scene](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene) in Three.js. We will jump over that very first lesson. -->

### Geometry

- [x] create a box
- [x] create a lot of boxes
- [x] create other basic shapes
- [x] add texture

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

### 2D Renderer

- [x] crtati prvo lice (Savo)
  - [x] crtati nisan u centru ekrana
  - [x] weapon shaking
  - [x] crtati 3d igraca na 2d maloj mapi
- [x] razdvojiti CanvasRenderer klasu na SmallMapRenderer i FirstPersonRenderer
- [x] malu mapu iscrtavati samo nakon promene tipki

### Camera

- [x] dodati kameru iz prvog lica (fps)
- [x] dodati kameru odozgo (orbit)
- [x] menjati kamere na taster
- [x] srediti redom kamere po scenama
- [ ] kreirati finalne kamere i kontrole (da moze da gleda levo-desno i gore-dole i sl.)

### Collision

- [x] dodati koliziju kako se ne bi prolazilo kroz predmete
  - [x] probati koliziju bacanjem zraka
  - [x] probati koliziju geometrijom
- [x] postaviti lavirint sa kolizijom

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

### 3D Models

- [x] dodati 3d model
- [x] dodati animirani 3d model
  - [x] ucitati fbx zensku iz rpg-a
  - [x] kontrolama menjati animacije (kretanje, trčanje, skok...)
- [x] srediti pufnicu (dodati jos malo geometrije i neku boju, materijal, teksturu...)
  - [x] probati da Kamenko bude od lave (vidi shader example)
- [x] odvojiti klase Player i Model
- [x] napraviti izvedene klase koje nasledjuju Model (Dupechesh, Robotko, Girl i sl)
- [x] spojiti klase Avatar i Player

### Scenes

- [x] dodati kišu
- [x] napraviti 3D kišu
- [x] napraviti sneg
- [ ] dodati NPC karaktere
  - https://www.script-tutorials.com/demos/474/index3.html
- [ ] dodati neke modele vozila i kuca
  - [ ] dodati tenk kako se krece
  - [ ] cepelin u vazduhu (vinci aerial screw, santos dumont airship)
- [ ] scena svemir (model ring arcology)
- [ ] avion leti (morane-saulnier aircraft ili british aircraft se 5a)

### Physics

- [ ] dodati fiziku https://github.com/chandlerprall/Physijs
- [ ] dodati fiziku na proceruralni zamak i top koji puca i rusi zidine
- [ ] tenk (steam tenk) koji gazi prepreke
  - http://127.0.0.1:8080/15-fizika/70-vozilo/
  - http://127.0.0.1:8080/15-fizika/75-vozilo-razbija/

### Gameplay

- [ ] napraviti inventar
- [ ] postaviti objekte za sakupljanje i okidace za njih
  - https://www.the-art-of-web.com/javascript/maze-game/#box1 (2D)
  - https://threejs.org/examples/?q=cube#webgl_interactive_cubes
  - https://threejsfundamentals.org/threejs/lessons/threejs-picking.html
  - https://codepen.io/kintel/pen/ZboOxw

### Levels

- [ ] bežanje od štuke koja bombarduje
- [ ] skrivanje od reflektora logora
- [ ] razaranje zamka topom (dodati fiziku)

### Ostalo

- [ ] Dodati panoramu (skybox) nebo/zvezde
- [ ] probati VR
  - https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content
  - https://ski-mountain-vr.herokuapp.com/
- [ ] dodati preloader (ima u 3D-RPG-Game-With-THREE.js)
- [ ] naci vismapu sutjeske
  - http://www.smartjava.org/content/threejs-render-real-world-terrain-heightmap-using-open-data/
  - https://blog.mapbox.com/bringing-3d-terrain-to-the-browser-with-three-js-410068138357
- [ ] dodati eksplozije
    - http://jeromeetienne.github.io/fireworks.js/

## Documentation

Raycaster arrow helper:

```
scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300))
```

All libraries in `/libs` folder are updated by hand to support ES6 export.

## Resources

- https://github.com/mudroljub/javaskript-igrice-primeri (3d mapa)
- https://github.com/skolakoda/teorija-razvoja-igara
- https://github.com/skolakoda/ucimo-razvoj-igara

- https://github.com/mudroljub/savo-mitraljezac
- https://github.com/mudroljub/igrica-partizani
- https://github.com/yakudoo/TheAviator
- https://github.com/juwalbose/ThreeJSEndlessRunner3D
- https://github.com/mudroljub/1943
