/**
 * Create a cropped image from a source image and crop pixels
 * All logic in English.
 */
/**
 * Create a cropped image from a source image, crop pixels, and rotation
 */
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation: number = 0,
  targetSize: number = 350
): Promise<Blob | null> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const rotRad = (rotation * Math.PI) / 180
  const { width: bWidth, height: bHeight } = getRadianBounds(
    image.width,
    image.height,
    rotRad
  )

  // Set canvas size to the bounding box of the rotated image
  canvas.width = bWidth
  canvas.height = bHeight

  // Translate to center and rotate
  ctx.translate(bWidth / 2, bHeight / 2)
  ctx.rotate(rotRad)
  ctx.translate(-image.width / 2, -image.height / 2)

  // Draw rotated image
  ctx.drawImage(image, 0, 0)

  // Extract the cropped portion from the rotated image
  const croppedCanvas = document.createElement('canvas')
  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) return null

  croppedCanvas.width = targetSize
  croppedCanvas.height = targetSize

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetSize,
    targetSize
  )

  // As a blob
  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/webp', 0.8)
  })
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

function getRadianBounds(width: number, height: number, rotation: number) {
  const cos = Math.abs(Math.cos(rotation))
  const sin = Math.abs(Math.sin(rotation))

  return {
    width: width * cos + height * sin,
    height: width * sin + height * cos,
  }
}
