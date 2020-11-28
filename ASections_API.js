'use-strict'
//API-ASections
//Created and developed by David Arturo Rodriguez Herrera
class ASection {
	constructor(puntos, mult=1) {
		this.puntos = puntos
		this.mult = mult
		this.area = this.calcularArea()*this.mult
		this.centroide = this.calcularCentroide()
		this.centroideX = parseFloat(this.centroide.split(',')[0])
		this.centroideY = parseFloat(this.centroide.split(',')[1])
		this.inercia = this.mult*this.inerciaCentroidal()
		this.inerciaX = this.mult*this.inerciaX()
		this.inerciaY = this.mult*this.inerciaY()
	}
	calcularArea() {
		let area = 0;
		for (let i = 0; i < this.puntos.length - 1; i++) {
			area = area + this.puntos[i][0] * this.puntos[i + 1][1]
			area = area - this.puntos[i][1] * this.puntos[i + 1][0]
		}
		return (area/2)
	}
	calcularCentroide() {
		let centroideXTotal = 0
		let centroideYTotal = 0
		for (let i = 0; i < this.puntos.length -1; i++) {
			centroideXTotal += (parseFloat(this.puntos[i][0]) + parseFloat(this.puntos[i + 1][0]))*(parseFloat(this.puntos[i][0])*parseFloat(this.puntos[i + 1][1]) - parseFloat(this.puntos[i+1][0])*parseFloat(this.puntos[i][1]))
			centroideYTotal += (parseFloat(this.puntos[i][1]) + parseFloat(this.puntos[i + 1][1]))*(parseFloat(this.puntos[i][0])*parseFloat(this.puntos[i + 1][1]) - parseFloat(this.puntos[i+1][0])*parseFloat(this.puntos[i][1]))
		}

		centroideXTotal = centroideXTotal/(6*this.mult*this.area)
		centroideYTotal = centroideYTotal/(6*this.mult*this.area)
		return "" + centroideXTotal + "," + centroideYTotal
	}
	inerciaCentroidal() {
		let inercia = 0
		for (let i = 0; i < this.puntos.length - 1; i++) {
			let x = parseFloat(this.puntos[i][0]) - this.centroideX
			let x1 = parseFloat(this.puntos[i+1][0]) - this.centroideX
			let y = parseFloat(this.puntos[i][1]) - this.centroideY
			let y1 = parseFloat(this.puntos[i+1][1]) - this.centroideY
			inercia += (y*y +y*y1 + y1*y1)*(x*y1-x1*y)
		}
		return Math.abs(inercia/12)
	}
	inerciaX() {
		let inercia = 0
		for (let i = 0; i < this.puntos.length-1; i++) {
			let x = parseFloat(this.puntos[i][0])
			let x1 = parseFloat(this.puntos[i+1][0])
			let y = parseFloat(this.puntos[i][1])
			let y1 = parseFloat(this.puntos[i+1][1])
			inercia += (y*y +y*y1 + y1*y1)*(x*y1-x1*y)
		}
		return Math.abs(inercia/12)
	}
	inerciaY() {
		let inercia = 0
		for (let i = 0; i < this.puntos.length-1; i++) {
			let y = parseFloat(this.puntos[i][0])
			let y1 = parseFloat(this.puntos[i+1][0])
			let x = parseFloat(this.puntos[i][1])
			let x1 = parseFloat(this.puntos[i+1][1])
			inercia += (y*y +y*y1 + y1*y1)*(x*y1-x1*y)
		}
		return Math.abs(inercia/12)
	}
	rotarASection(angle) {
		let protados = rotateCoordinateSeries(this.puntos,angle)
		return new ASection(protados,this.mult)
	}
}
function AConjunto(ASections) {
	let centroideXTotal = 0
	let centroideYTotal = 0
	let inerciaTotal = 0
	let areTotal = 0
	for (let i = 0; i < ASections.length; i++) {
		areTotal += ASections[i].area
		centroideXTotal += ASections[i].area*ASections[i].centroideX
		centroideYTotal += ASections[i].area*ASections[i].centroideY
	}
	centroideXTotal = centroideXTotal/areTotal
	centroideYTotal = centroideYTotal/areTotal
	for (let i = 0; i < ASections.length; i++) {
		let inerciacero = ASections[i].inercia
		let distanciacuadrado = Math.pow(Math.abs(ASections[i].centroideY - centroideYTotal),2)
		let areaparcial = ASections[i].area
		inerciaTotal += inerciacero + areaparcial*distanciacuadrado
	}
	let nuevo = new ASection([],1)
	nuevo.area = areTotal
	nuevo.centroideX = centroideXTotal
	nuevo.centroideY = centroideYTotal
	nuevo.inercia = inerciaTotal
	nuevo.centroide = nuevo.centroideX + ',' + nuevo.centroideY
	nuevo.inerciaX = 0//nuevo.inercia+nuevo.area*Math.pow(nuevo.centroideY,2)
	nuevo.inerciaY = 0//nuevo.inercia+nuevo.area*Math.pow(nuevo.centroideX,2)
	return nuevo
}
function transformarCoordenadas(x,y,angle) {
	return [x*Math.cos(angle)-y*Math.sin(angle),x*Math.sin(angle)+y*Math.cos(angle)]
}
//Rota una serie de coordenadas en sentido antihorario. las deja en el cuadrante 1 del plano 
function rotateCoordinateSeries(coords,angle) {
	let result = []
	let coordmaxX = 0
	let coordmaxY = 0
	for (let i = 0; i < coords.length; i++) {
		result.push(transformarCoordenadas(coords[i].split(',')[0],coords[i].split(',')[1],angle).join())
		if (parseFloat(result[i].split(',')[0]) < coordmaxX) {
			coordmaxX = parseFloat(result[i].split(',')[0])
		}
		if (parseFloat(result[i].split(',')[1]) < coordmaxY) {
			coordmaxY = parseFloat(result[i].split(',')[1])
		}
	}
	for (let i = 0; i < result.length; i++) {
		let temporal = (parseFloat(result[i].split(',')[0]) - coordmaxX)+','+(parseFloat(result[i].split(',')[1]) - coordmaxY)
		result[i] = temporal
	}
	return result
}