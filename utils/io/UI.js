const baseControls = {
  '←': 'left',
  '→': 'right',
  '↑': 'forward',
  '↓': 'backward',
  CapsLock: 'run',
  Space: 'jump',
}

/** CONTROLS STYLE */

export default class UI {
  constructor({ title = 'CONTROLS', controls = baseControls } = {}) {
    this.title = title
    this.controls = controls
    this.addUIControls(title, controls)
  }

  addUIControls(title, controls) {
    const div = document.createElement('div')
    div.className = 'controls'
    const h3 = document.createElement('h3')
    h3.innerHTML = title + ' ▼'

    const content = document.createElement('div')
    content.innerHTML = Object.keys(controls).map(key =>
      `<p><b>${key}</b> ${controls[key]}</p>`
    ).join('')

    h3.addEventListener('click', () => {
      content.style.display = content.style.display == 'none' ? 'block' : 'none'
      const icon = content.style.display == 'none' ? ' ►' : ' ▼'
      h3.innerHTML = title + icon
    })

    div.appendChild(h3)
    div.appendChild(content)
    document.body.appendChild(div)
  }

  addStartScreen({ title, innerHTML, callback }) {
    const div = document.createElement('div')
    div.className = 'start-screen'
    if (title) div.innerHTML = `<h2>${title}</h2>`

    const selectDiv = document.createElement('div')
    selectDiv.innerHTML = innerHTML
    selectDiv.addEventListener('click', e => callback(e, div))

    div.appendChild(selectDiv)
    document.body.appendChild(div)
  }
}