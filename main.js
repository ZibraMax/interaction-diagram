function between(n,a,b,tol=1*10**-6) {
    var min = Math.min(a, b)
    var max = Math.max(a, b)
    return n > (min-tol) && n < (max+tol);
}
function guardarEstado() {
    imgDATA = ctx.getImageData(0,0,canvas.width,canvas.height)
}

function sumVectores(v1,v2) {
  	return [v1[0]+v2[0],v1[1]+v2[1]]
}

function restarVectores(v1,v2) {
    return [v1[0]-v2[0],v1[1]-v2[1]]
}

function lineaDesdePuntos(v1,v2,plot=false) {
    if (plot) {
        drawLine(v1[0],v1[1],v2[0],v2[1])
        drawPoint(v1[0],v1[1])
        drawPoint(v2[0],v2[1])
    }
    return [v1,v2]
}

function multVector(v,m) {
    return [v[0]*m,v[1]*m]
}

function normalizar(v) {
    let h = Math.sqrt(v[0]**2+v[1]**2)
    return [v[0]/h,v[1]/h]
}

function dot(v1,v2) {
    return v1[0]*v2[0]+v1[1]*v2[1]
}

function multEscalar(v,k) {
    return [v[0]*k,v[1]*k]
}

function offsetPoligono(puntos,d) {
    let n = puntos.length
    let pol = []
    for (var i = 0; i < puntos.length-1; i++) {
        pol.push([puntos[i],puntos[i+1]])
    }
    pol.push([puntos[n-1],puntos[0]])
    let pprimas = []
    let poliprima = []
    for (var i = 1; i < n; i++) {
        let li = pol[i-1]
        let ld = pol[i]
        let na = normalizar(normalesLinea(li[0],li[1])[0])
        let nb = normalizar(normalesLinea(ld[0],ld[1])[0])
        let bis = normalizar(sumVectores(na,nb))
        let l = d/Math.sqrt(1+dot(na,nb))
        pprimas.push(sumVectores(li[1],multEscalar(bis,l)))
    }
    let li = pol[n-1]
    let ld = pol[0]
    let na = normalizar(normalesLinea(li[0],li[1])[0])
    let nb = normalizar(normalesLinea(ld[0],ld[1])[0])
    let bis = normalizar(sumVectores(na,nb))
    let l = d/Math.sqrt(1+dot(na,nb))
    pprimas.push(sumVectores(li[1],multEscalar(bis,l)))
    return pprimas
}

function normalesLinea(p1,p2) {
    let l = lineaDesdePuntos(p1,p2)
    let deltas = restarVectores(l[1],l[0])
    let pbase = [l[0][0]/2+l[1][0]/2,l[0][1]/2+l[1][1]/2]
    return [[deltas[1],-deltas[0]],[-deltas[1],deltas[0]]]
}

function drawFlecha(pbase,angle,der=true) {
    let l1 = rotateCoords([-1, -1],angle)
    let l2 = rotateCoords([-1, 1],angle)
    drawLine(pbase[0], pbase[1], pbase[0]+l1[0], pbase[1]+l1[1])
    drawLine(pbase[0], pbase[1], pbase[0]+l2[0], pbase[1]-l2[1])
}

function drawVector(v,pbase=[0,0]) {
    drawLine(pbase[0],pbase[1],pbase[0]+v[0],pbase[1]+v[1])
    let linea = [pbase,sumVectores(pbase,v)]
    let deltas = restarVectores(linea[1],linea[0])
    let h = Math.sqrt(deltas[0]**2+deltas[1]**2)
    let theta = Math.asin(deltas[1]/h)
    if (deltas[0]<0) {
        theta = Math.PI-theta
    }
    drawFlecha([pbase[0]+v[0],pbase[1]+v[1]],theta)
}
function rotateCoords(p,theta) {
    let c = Math.cos(theta)
    let s = Math.sin(theta)
    return [p[0]*c-p[1]*s,p[0]*c+p[1]*s]
}

function drawPoint(x, y, radius=1, context=ctx,anotation=true) {

    mult = (W-margen*2)/coordenadaMaxima
    context.beginPath()
    context.arc(x*mult + margen , (W-margen) - y*mult, radius*mult, 0, 2 * Math.PI, true)
    context.fill()
    if (anotation) {
        ctx.fillText(x.toFixed(1) + ';' + y.toFixed(1),x*mult + margen, (W-margen) - y*mult-radius*mult-10)
    }
    context.closePath()
}

function drawLine(xi, yi, xf, yf, dash = [], color=colorPrincipal, context=ctx) {
  	mult = (W-margen*2)/coordenadaMaxima
  	context.setLineDash(dash)
    context.beginPath()
    context.strokeStyle = color
    context.lineWidth = "2"
    context.moveTo(xi*mult + margen , (W-margen) - yi*mult)
    context.lineTo(xf*mult + margen , (W-margen) - yf*mult)
    context.stroke()
    context.closePath()
}

function test(n=10,l=coordenadaMaxima/4) {
    let ht = Math.PI*2/n
    let pbase = [coordenadaMaxima/2,coordenadaMaxima/2]
    for (var i = 0; i < n; i++) {
        drawVector([l*Math.cos(i*ht),l*Math.sin(i*ht)],pbase)
    }
}
function darAreaYCentroide(poligono) {
    let puntosAsections = [...poligono]
    puntosAsections.push(poligono[0])
    ase = new ASection(puntosAsections)
    return [ase.area,[ase.centroideX,ase.centroideY]]
}
function createPoligon(n=200,r=coordenadaMaxima/2,d=-0.06) {
    //let puntos = [[0,0],[0.5,0],[0.5,0.8],[0,0.8]]
    // let puntos = [[2/5,1/5],[3/5,1/5],[5/5,4/5],[3/5,5/5],[2/5,5/5],[0/5,4/5]]
    // let lineas = []
    let ht = Math.PI*2/n
    let puntos =[]
    for (var i = 0; i < n; i++) {
        let theta = i*ht
        puntos.push([coordenadaMaxima/2+r*Math.cos(theta),coordenadaMaxima/2+r*Math.sin(theta)])
    }
    X = []
    Y = []
    for (var i = 0; i < puntos.length; i++) {
        X.push(puntos[i][0])
        Y.push(puntos[i][1])
    }
    coordenadaMaxima = Math.max(...X,...Y)
    h = Math.max(...Y)-Math.min(...Y)
    let puntosRc = offsetPoligono(puntos,d)
    guardarEstado()
    return [puntos,puntosRc]
}
function dibujarPoligono() {
    for (var i = 0; i < poligonoActual.length-1; i++) {
        drawLine(poligonoActual[i][0], poligonoActual[i][1], poligonoActual[i+1][0], poligonoActual[i+1][1], dash = [], color=colorPrincipal)
        drawLine(poligonoRecubrimiento[i][0], poligonoRecubrimiento[i][1], poligonoRecubrimiento[i+1][0], poligonoRecubrimiento[i+1][1], dash = [5,5], color='gray')
    }
    drawLine(poligonoActual[i][0], poligonoActual[i][1], poligonoActual[0][0], poligonoActual[0][1], dash = [], color=colorPrincipal)
    drawLine(poligonoRecubrimiento[i][0], poligonoRecubrimiento[i][1], poligonoRecubrimiento[0][0], poligonoRecubrimiento[0][1], dash = [5,5], color='gray')
    guardarEstado()
}
function moviendo(event) {
    let x = event.offsetX
    let y = event.offsetY
    if (poniendoVarilla) {
        let u = proveNear(x,y)
        x = u[0]
        y = u[1]
        ctx.putImageData(imgDATA,0,0)
        ctx.strokeStyle = 'black'
        ctx.setLineDash([])
        ctx.fillText("("+ (x/mult-margen/mult).toFixed(3) +", "+ (coordenadaMaxima-y/mult+margen/mult).toFixed(3) +")", x - 10 ,y -10);
        ctx.beginPath()
        ctx.arc(x,y,r*mult,0,2*Math.PI)
        ctx.stroke()
        ctx.closePath()
    }
}

function proveNear(x,y) {
    let near = H
    let selected = [x,y]
    let x1 = 0
    let y1 = 0
    for (var i = 0; i < indicesMov.length; i++) {
        x1 = indicesMov[i][0]
        y1 = indicesMov[i][1]
        let d = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y))
        if (d < near) {
            near = d
            selected = indicesMov[i]
        }
    }
  return selected
}

function generarGrilla() {
    Xrec = []
    Yrec = []
    X = []
    Y = []
    for (var i = 0; i < poligonoRecubrimiento.length; i++) {
        Xrec.push(poligonoRecubrimiento[i][0])
        Yrec.push(poligonoRecubrimiento[i][1])
        X.push(poligonoActual[i][0])
        Y.push(poligonoActual[i][1])
    }
    let maxx = Math.max(...Xrec)
    let minx = Math.min(...Xrec)
    let maxy = Math.max(...Yrec)
    let miny = Math.min(...Yrec)

    let dx = maxx-minx
    let dy = maxy-miny
    let nx = Math.ceil(dx/presicionDeGrilla)
    let ny = Math.ceil(dy/presicionDeGrilla)

    indicesMov = []
    for (var i = 0; i < nx; i++) {
        for (var j = 0; j < ny; j++) {
            if (pip(poligonoRecubrimiento,[minx + i*presicionDeGrilla,miny+j*presicionDeGrilla])) {
                indicesMov.push([(minx + i*presicionDeGrilla)*mult + margen, (W-margen) - (miny+j*presicionDeGrilla)*mult])
            }
        }
    }
}
function pip(vs, point) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
}

function encontrarAreaConcreto(a) {
    let maxy = Math.max(...Y)
    let miny = Math.min(...Y)
    let dy = maxy-miny
    a = miny + dy-a

    // drawLine(0,a,coordenadaMaxima,a, dash = [5,5], color='red')
    guardarEstado()

    let intersecciones = []
    let ppc = []
    let lineas = []
    for (var i = 0; i < poligonoActual.length-1; i++) {
        lineas.push([[poligonoActual[i][0],poligonoActual[i][1]],[poligonoActual[i+1][0],poligonoActual[i+1][1]]])
    }
    lineas.push([[poligonoActual[i][0],poligonoActual[i][1]],[poligonoActual[0][0],poligonoActual[0][1]]])
    for (var i = 0; i < lineas.length; i++) {
        if (lineas[i][0][1]>=a) {
            ppc.push(lineas[i][0])
        }
        interseccion = intersectLines(0,a,coordenadaMaxima,a,lineas[i][0][0],lineas[i][0][1],lineas[i][1][0],lineas[i][1][1])
        try {
            if (isBetween(interseccion,lineas[i])) {
                intersecciones.push(interseccion)
                ppc.push(interseccion)
            }
        } catch (e) {
            console.log(e)
        }
    }
    // for (var i = 0; i < ppc.length; i++) {
    //     drawPoint(ppc[i][0],ppc[i][1],dy/70)
    // }
    return darAreaYCentroide(ppc)
}
function isBetween(p,linea) {
    let count = 0
    if (between(p[0],linea[0][0],linea[1][0])) {
        count++
    }
    if (between(p[1],linea[0][1],linea[1][1])) {
        count++
    }
    return count == 2
}

function definirBarraActual(b) {
    barraActual = b
    r = barras[barraActual][1]/2
}
function click_canvas(event) {
    ctx.clearRect(0,0,W,H)
    let x = event.offsetX
    let y = event.offsetY
    if (poniendoVarilla) {
        let u = proveNear(x,y)
        x = u[0]
        y = u[1]
        let varillaNueva = [barraActual,(x-margen)/mult,coordenadaMaxima-(y-margen)/mult]
        varillas.push(varillaNueva)
    }
    graficarVarillas()
    didi()
}
function graficarVarillas() {
    dibujarPoligono()
    for (var i = 0; i < varillas.length; i++) {
        ctx.strokeStyle = 'black'
        ctx.setLineDash([])
        ctx.beginPath()
        let x = varillas[i][1]*mult+margen
        let y = (coordenadaMaxima-varillas[i][2])*mult+margen
        let r = barras[varillas[i][0]][1]/2*mult
        ctx.fillText('#' + varillas[i][0],x-5,y-r-4)
        ctx.shadowBlur = 3
        ctx.shadowColor = 'black'
        ctx.shadowOffsetX = 3
        ctx.shadowOffsetY = 3
        ctx.arc(x,y,r,0,2*Math.PI)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.shadowColor = 'black'
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
    }
    guardarEstado()
}
function mouseFuera() {
    ctx.putImageData(imgDATA,0,0)
}
//=======================================================
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const W = canvas.width
const H = canvas.height
var margen = 30
var colorPrincipal = 'black'
var colorSecundario = 'white'
var coordenadaMaxima = 0.55
var mult = (W-margen*2)/coordenadaMaxima
var imgDATA = ctx.getImageData(0,0,canvas.width,canvas.height)
var presicionDeGrilla = 0.01
var poniendoVarilla = true
var h = 0

var arregloParcial = createPoligon()
var poligonoActual = arregloParcial[0]
var poligonoRecubrimiento = arregloParcial[1]
var indicesMov = []

var varillas = []
var X = []
var Y = []
var Xrec = []
var Yrec = []

var fy = 420000
var ecu = 0.003
var ey = 0.0021
var fc = 20680

var dprima = 0.06

//=============================================
function calcularDeformaciones(c) {
    for (var i = 0; i < varillas.length; i++) {
        let coordY = varillas[i][2]
        varillas[i][3] = Math.abs(ecu*(Math.abs(h-coordY)/c-1))
        varillas[i][4] = -(ecu*(Math.abs(h-coordY)/c-1))/varillas[i][3]
        varillas[i][5] = varillas[i][3] >= ey ? fy : 200000000*varillas[i][3]
        varillas[i][6] = ((h-coordY)-h/2)
    }
}
function b1(fc) {
    if (fc/1000 <= 28) {
        return 0.85
    } else if (fc/1000 <= 56) {
        return 0.85 - 0.05/7*(fc/1000-28)
    } else {
        return 0.65
    }
}
function pnominal(c) {
    let pc = 0.85*(fc)*encontrarAreaConcreto(b1(fc)*c)[0]
    let psp = 0
    let psn = 0
    for (var i = 0; i < varillas.length; i++) {
        psn += (varillas[i][4]>0)*varillas[i][4]*(barras[varillas[i][0]][0]/10000)*varillas[i][5]
        psp += (varillas[i][4]<0)*varillas[i][4]*(barras[varillas[i][0]][0]/10000)*varillas[i][5]
    }
    return [pc,psp,psn]
}
function mnominal(c) {
    let concreto = encontrarAreaConcreto(b1(fc)*c)
    let mnc = -0.85*(fc)*concreto[0]*(concreto[1][1]-Math.min(...Y)-h/2)
    let msn = 0
    let msp = 0
    for (var i = 0; i < varillas.length; i++) {
        msn += (varillas[i][4]>0)*varillas[i][4]*(barras[varillas[i][0]][0]/10000)*varillas[i][5]*varillas[i][6]
        msp += (varillas[i][4]<0)*varillas[i][4]*(barras[varillas[i][0]][0]/10000)*varillas[i][5]*varillas[i][6]
    }
    return [-mnc , -msn , -msp]
}

function di(n) {
    let paso = h/n
    let result = []
    let as = 0
    for (var i = 0; i < varillas.length; i++) {
        as += barras[varillas[i][0]][0]
    }
    result.push([-fy*as/10000,0])

    for (var i = 0; i <= n; i++) {
        let c = paso * i
        calcularDeformaciones(c)
        let a = pnominal(c)
        let p = mnominal(c)
        let o = a[0]+a[1]+a[2]
        let oo = p[0]+p[1]+p[2]
        if (!isNaN(o) && !isNaN(oo)) {
            result.push([o,oo])
        }
    }
    result.push([(encontrarAreaConcreto(h)[0]-as/10000)*0.85*fc+fy*as/10000,0])
    return result
}

function getCol(matrix, col){
   var column = [];
   for(var i=0; i<matrix.length; i++){
      column.push(matrix[i][col]);
   }
   return column;
}

function didi() {
    let g1 = di(100)
    let trace = {
      x: getCol(g1, 1),
      y: getCol(g1, 0),
      mode: 'lines',
      name: 'Nominal'
    }
    let layout = {
      title:'Diagrama de Interacción',
      xaxis: {
        title:'Momento [KN-m]'
      },
      yaxis: {
        title:'Carga Axial [KN]'
      }
    }
    data = [trace]
    Plotly.newPlot('myPlot', data,layout)
}



dibujarPoligono()
generarGrilla()


//========================================================
var barraActual = 11
var barras = []
barras[2] = []
barras[3] = []
barras[4] = []
barras[5] = []
barras[6] = []
barras[7] = []
barras[8] = []
barras[9] = []
barras[10] = []
barras[11] = []
barras[14] = []
barras[18] = []

//Area
barras[2][0] = 0.32
barras[3][0] = 0.71
barras[4][0] = 1.29
barras[5][0] = 1.99
barras[6][0] = 2.86
barras[7][0] = 3.87
barras[8][0] = 5.1
barras[9][0] = 6.45
barras[10][0] = 8.19
barras[11][0] = 10.06
barras[14][0] = 14.52
barras[18][0] = 25.81

//Diametro
barras[2][1] = 6.4/1000
barras[3][1] = 9.5/1000
barras[4][1] = 12.7/1000
barras[5][1] = 15.9/1000
barras[6][1] = 19.1/1000
barras[7][1] = 22.2/1000
barras[8][1] = 25.4/1000
barras[9][1] = 28.7/1000
barras[10][1] = 32.3/1000
barras[11][1] = 35.8/1000
barras[14][1] = 43/1000
barras[18][1] = 57.3/1000

var r = barras[barraActual][1]/2