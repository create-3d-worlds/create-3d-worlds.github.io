# create-rpg-game

Create a role-playing game!

Repo: https://github.com/mudroljub/create-rpg-game

## Plan

### Mape (*tilemaps*)

- [x] napraviti nekoliko *tilemap*-a
  - [x] dodati algoritam za pravljenje lavirinta
- [x] renderovati mapu u 2d
- [x] renderovati mapu u 3d
  - [x] renderovati mapu sa teksturama
- [x] prikazati polozaj igraca na mapi
- [x] omogućiti 2d kretanje kroz mapu (odozgo)
- [x] omogućiti 3d kretanje kroz mapu iz prvog lica

### Kolizija

- [ ] dodati koliziju kako se ne bi prolazilo kroz drvece i zidove
- [ ] implementirati bacanje zraka:
  - https://blog.webmaestro.fr/collisions-detection-three-js-raycasting/
  - https://threejsfundamentals.org/threejs/lessons/threejs-picking.html
  - https://codepen.io/kintel/pen/ZboOxw
  - https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-how-to-use-a-raycaster
  - https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-raycasting-part-2

### Scena

- [ ] postaviti tlo
- [ ] dodati osnovnu geometriju
  - [ ] dodati okruzenje (drveće, nebo, zgrade)
  - [ ] dodati neke oblike (sanduke i slicno)
- [ ] postaviti i kamere
- [ ] proceduralno kreirati okruženje

### Karakter

- [ ] dodati ruke koje se vide i pogled iz prvog lica
- [ ] ucitati 3d model junaka
- [ ] animirati 3d karakter (kretanje, trčanje, skok...)
- [ ] dodati kameru odozgo i iza

### Modeli

- [ ] dodati NPC karaktere
- [ ] ucitati raspolozive modele vozila i kuca
- [ ] dodati avion kako nadlece
- [ ] dodati tenk kako se krece
- [ ] reagovati na koliziju
- [ ] dodati fiziku https://github.com/chandlerprall/Physijs

### Mehanika igre

- [ ] napraviti inventar
- [ ] postaviti objekte za sakupljanje i okidace za njih
  - https://www.the-art-of-web.com/javascript/maze-game/#box1

### Nivoi

- [ ] napraviti igrive nivoe
  - [ ] bežanje od štuke koja bombarduje
  - [ ] skrivanje od reflektora logora

## TODO

- probati VR https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content

## Resursi

- https://github.com/skolakoda/ucimo-threejs
- https://github.com/skolakoda/teorija-razvoja-igara
- https://github.com/skolakoda/ucimo-razvoj-igara
- https://github.com/mudroljub/mini-rpg
- https://github.com/mudroljub/savo-mitraljezac
- https://github.com/mudroljub/3D-RPG-Game-With-THREE.js
- https://github.com/mudroljub/threejs-monster
- https://github.com/mudroljub/rpg-threejs (school project)
- https://github.com/mudroljub/igrica-partizani
- https://github.com/mudroljub/avantura-1941
