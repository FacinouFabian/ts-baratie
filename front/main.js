const readline = require('linebyline')
const cvs = document.getElementById('snake')
const ctx = cvs.getContext('2d')
let cells = []

window.onload = function() {

    // read all lines
    rl = readline('text.txt')

    let enterIndex = 0
    let exitIndex = 0
    let mapSize = []

    // listen for `line` event
    rl.on('line', (line, lineCount, byteCount) => {
        const regex = /^\d+.*x\d+$/gm
        if (line.match(regex)){
            const sizes = line.split('x')
            mapSize.push(sizes[0])
            mapSize.push(sizes[1])       
        } 
        if (!line.match(regex)) {
            let tab = line.split('')
            for (const elt in tab){
                if (tab[elt] === '1'){
                    enterIndex = 'line ' + lineCount + ', Position : ' + elt 
                }
                if (tab[elt] === '2'){
                    exitIndex = 'line ' + lineCount + ', Position : ' + elt 
                }
            }
        }

    }).on('error', (err) => {
        console.error(err)

    }).on('end', (err) => {
        init(mapSize[0], mapSize[1])
        draw(608, 600)
    /*     console.log('MapSize: ' + mapSize)
        console.log('Enter: ' + enterIndex)
        console.log('Exit: ' + exitIndex) */
    })

}

function init(rows, col){
    for (let i = 0; i < rows; i++) {
        cells[i] = []
        for (let j = 0; j < col; j++) {
          cells[i][j] = new Array(i, j)
        }
    }
    console.log(cells)
}

function draw(w,h){
    ctx.canvas.width = w
    ctx.canvas.height = h
    ctx.lineWidth = 2
    cells.forEach(x =>
      x.forEach(c => {
        c.draw(ctx, 4)
      })
    )
}