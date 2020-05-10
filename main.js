const width = document.querySelector('body').clientWidth
const height = document.querySelector('body').clientHeight

const [canvas, ctx] = createCanvas()

let frame = 0
let maxFrame = -1

let globalScale = 2
let speedScale = 0.5 * globalScale
let distanceScale = 30 * globalScale
let radiusScale = 0.3 * globalScale

class Planet {
  constructor(canvas, options, orbit) {
    this.canvas = canvas

    this.isAttached = false
    this.children = []

    if (!orbit) {
      this.x = width / 2
      this.y = height / 2
    }

    else {
      this.isAttached = true
      const { centerObject, distance, period } = orbit

      centerObject.registerChildren(this)
      this.centerObject = centerObject
      this.distance = distance * distanceScale
      this.speed = 2 * Math.PI / period * speedScale
      this.argument = 0

      this.x = Math.cos(this.argument) * this.distance + this.centerObject.x
      this.y = Math.sin(this.argument) * this.distance + this.centerObject.y
    }

    this.radius = options.radius * radiusScale
    this.color = options.color
  }

  registerChildren(planet) {
    this.children.push(planet)
  }

  render() {
    this.canvas.beginPath()
    this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    this.canvas.lineWidth = 2
    this.canvas.fillStyle = this.color
    this.canvas.fill()
    this.canvas.closePath()

    this.children.forEach(child => child.render())
  }

  move() {
    if (!this.isAttached) {
      this.x = width / 2
      this.y = height / 2
    }

    else {
      this.argument += this.speed
      this.x = Math.cos(this.argument) * this.distance + this.centerObject.x
      this.y = Math.sin(this.argument) * this.distance + this.centerObject.y
    }

    this.render()
    this.children.forEach(child => child.move())
  }
}

function createCanvas() {
  /* Create the element */
  const canvas = document.createElement('canvas')

  /* Set the canvas width and height */
  canvas.width = width
  canvas.height = height

  /* Append the element to the body */
  document.querySelector('body').append(canvas)

  /* Return the canvas and the context */
  return [canvas, canvas.getContext('2d')]
}

function clear() {
  /* Create the gradient */
  const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width)
  gradient.addColorStop(0, "rgba(18,18,18,0.5)")
  gradient.addColorStop(1, "rgba(18,18,18,0.5)")

  /* Add the gradient to the canvas */
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

let earth = new Planet(ctx, { color: "#8bc3f7", radius: 3 })

let moon = new Planet(ctx, { color: "#d3d3d3", radius: 1 }, { centerObject: earth, distance: 0.002, period: 27 })

let sun = new Planet(ctx, { color: "#f8ed93", radius: 16 }, { centerObject: earth, distance: 1, period: 365 })

let mercury = new Planet(ctx, { color: "#ffa500", radius: 1 }, { centerObject: sun, distance: 0.4, period: 88 })
let venus = new Planet(ctx, { color: "#A52A2A", radius: 2 }, { centerObject: sun, distance: 0.7, period: 225 })
let mars = new Planet(ctx, { color: "#FF4500", radius: 3.5 }, { centerObject: sun, distance: 1.5, period: 687 })

let jupiter = new Planet(ctx, { color: "#c99039", radius: 15 }, { centerObject: sun, distance: 5.2, period: 4380 })
let saturne = new Planet(ctx, { color: "#ead6b8", radius: 10 }, { centerObject: sun, distance: 9.5, period: 10585 })
let uranus = new Planet(ctx, { color: "#d1e7e7", radius: 10 }, { centerObject: sun, distance: 19.6, period: 30660 })
let neptune = new Planet(ctx, { color: "#c6d3e3", radius: 10 }, { centerObject: sun, distance: 30, period: 49275 })


function update() {
  /* Clear the background */
  clear()

  earth.move()

  /* Set the next update */
  frame++
  if (maxFrame === -1 || frame < maxFrame) requestAnimationFrame(update)
}

update()
