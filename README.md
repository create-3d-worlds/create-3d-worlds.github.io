# create-rpg-game

Create a role-playing game!

Repo: https://github.com/mudroljub/create-rpg-game

## Plan

### Mapa (*tilemaps*)

- [x] napraviti nekoliko *tilemap*-a
  - [x] implementirati algoritam za pravljenje lavirinta
- [x] renderovati mapu u 2d
- [x] renderovati mapu u 3d
  - [x] renderovati mapu sa teksturama

### Igrac

- [x] dodati igraca
- [x] prikazati polozaj igraca na mapi
- [x] omogućiti 2d kretanje kroz mapu
- [x] omogućiti 3d kretanje kroz mapu

### Kamere

- [x] dodati kameru iz prvog lica (fps)
- [x] dodati kameru odozgo (orbit)
- [ ] menjati kamere

### Kolizija

- [x] dodati koliziju kako se ne bi prolazilo kroz predmete
  - [x] implementirati koliziju bacanjem zraka
  - [ ] implementirati koliziju geometrijom
- [x] postaviti lavirint sa kolizijom

### Prodecuralna geometrija

- [x] napraviti tlo
- [ ] dodati koliziju na tlo
  - https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-how-to-use-a-raycaster
  - https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-raycasting-part-2
- [ ] dodati osnovnu geometriju
  - [ ] dodati okruzenje (drveće, nebo, zgrade)
  - [ ] dodati neke oblike (sanduke i slicno)
- [ ] proceduralno kreirati okruženje
- pogledati:
  - https://github.com/IceCreamYou/THREE.Terrain
  - https://codepen.io/al-ro/pen/jJJygQ
  - https://subscription.packtpub.com/book/web_development/9781783980864/5/ch05lvl1sec34/creating-a-3d-terrain-from-scratch
  - https://threejs.org/examples/webgl_terrain_dynamic.html

### Modeli

- [ ] ucitati 3d model igraca
  - [ ] animirati model (kretanje, trčanje, skok...)
  - [ ] da se vide ruke iz prvog lica
- [ ] dodati NPC karaktere
- [ ] ucitati raspolozive modele vozila i kuca
  - [ ] dodati avion kako nadlece
  - [ ] dodati tenk kako se krece
- [ ] reagovati na koliziju

### Fizika

- [ ] dodati fiziku https://github.com/chandlerprall/Physijs

### Mehanika igre

- [ ] napraviti inventar
- [ ] postaviti objekte za sakupljanje i okidace za njih
  - https://www.the-art-of-web.com/javascript/maze-game/#box1 (2D)
  - https://threejs.org/examples/?q=cube#webgl_interactive_cubes
  - https://threejsfundamentals.org/threejs/lessons/threejs-picking.html
  - https://codepen.io/kintel/pen/ZboOxw

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
