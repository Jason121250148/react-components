import { merge, forEach, map, sortBy } from 'lodash'

import { requiredParamsCheck } from './common'

const defaultOptions = {
  vScale: 100,
  hScale: 100,
  scaleAnchorX: 0,
  scaleAnchorY: 0,
}
const defaultImgSets = {
  canScale: true,
  index: 0,
}

/**
 * 合并图片组成一张图片
 * @param {object} options 合并图片选项配置
 * options: {
 *  width, height, 原图长宽，即canvas长宽
 *  vScale, hScale, 垂直和水平拉伸比例
 *  scaleAnchorX, scaleAnchorY, 拉伸锚点
 * }
 * @param {array} imgSets 待合并的图片集
 * img: {
 *  url, width, height, left, top,
 *  canScale, 是否跟随options.vScale和options.hScale进行拉伸
 *  index, 层级(相同的层级根据数组中的顺序渲染)
 * }
 * @returns {base64} 合成图片数据
 */
function mergeImgs(options = {}, imgSets = []) {
  const isLegalOptions = requiredParamsCheck(options, ['width', 'height'])
  const isLegalImgSets = requiredParamsCheck(imgSets, ['url', 'width', 'height', 'left', 'top'])
  if (!isLegalOptions) return Promise.reject(new Error('options param is not completed, please check'))
  if (!isLegalImgSets) return Promise.reject(new Error('imgSets param is not completed, please check'))

  const finalOptions = merge({}, defaultOptions, options)
  let finalImgSets = map(imgSets, img => merge({}, defaultImgSets, img))

  const canvas = document.createElement('canvas')
  canvas.width = finalOptions.hScale >= 100 ? finalOptions.width * finalOptions.hScale / 100 : finalOptions.width
  canvas.height = finalOptions.vScale >= 100 ? finalOptions.height * finalOptions.vScale / 100 : finalOptions.height
  const canvasContext = canvas.getContext('2d')

  // 根据index和数组中的顺序将finalImgSets升序排序
  finalImgSets = sortBy(finalImgSets, ['index'])
  const finalImgSetsPro = map(finalImgSets, img => (
    new Promise((resolve) => {
      const image = new Image()
      image.crossOrigin = 'Anonymous'
      image.onload = () => resolve({ image, img })
      image.src = img.url
    })
  ))
  return new Promise((resolve) => {
    Promise.all(finalImgSetsPro).then((imgData) => {
      forEach(imgData, ({ image, img }) => {
        let { left, top, width, height } = img
        if (img.canScale) {
          left = finalOptions.scaleAnchorX + (left - finalOptions.scaleAnchorX) * (finalOptions.hScale / 100)
          top = finalOptions.scaleAnchorY + (top - finalOptions.scaleAnchorY) * (finalOptions.vScale / 100)
          width *= (finalOptions.hScale / 100)
          height *= (finalOptions.vScale / 100)
        }
        if (finalOptions.hScale >= 100) {
          left += finalOptions.scaleAnchorX / finalOptions.width * (finalOptions.hScale - 100) / 100 * finalOptions.width
        }
        if (finalOptions.vScale >= 100) {
          top += finalOptions.scaleAnchorY / finalOptions.height * (finalOptions.vScale - 100) / 100 * finalOptions.height
        }
        canvasContext.drawImage(image, 0, 0, img.width, img.height, left, top, width, height)
      })
    }).then(() => {
      resolve(canvas.toDataURL('image/png'))
    })
  })
}

export default mergeImgs