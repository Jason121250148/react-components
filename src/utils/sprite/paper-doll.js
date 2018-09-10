import { merge } from 'lodash'

import { requiredParamsCheck } from './common'
import mergeImgs from './mergeImgs'

const defaultOptions = {
  previewScale: 100,
}

/**
 * 合并图片组成一张图片
 * @param {object} options 合并图片选项配置
 * options: {
 *  viewWidth, viewHeight, 生成图片的展示长宽，如超过，需等比缩放
 *  previewScale, 根据viewWidth和viewHeight生成图片后，根据（width/2, 0）为锚点缩放整图
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
const genPreviewSrc = (options, imgSets) => {
  const isLeagalOptions = requiredParamsCheck(options, ['width', 'height'])
  if (!isLeagalOptions) return Promise.reject(new Error('options param is not completed, please check'))
  const finalOptions = merge({}, defaultOptions, { viewWidth: options.width, viewHeight: options.height }, options)

  return mergeImgs(finalOptions, imgSets).then((src) => {
    const canvas = document.createElement('canvas')
    canvas.width = finalOptions.viewWidth
    canvas.height = finalOptions.viewHeight
    const canvasContext = canvas.getContext('2d')

    let dLeft = 0
    let dTop = 0
    let dWidth = finalOptions.viewWidth
    let dHeight = finalOptions.viewHeight
    // 根据viewWidth和viewHeight进行第一次等比缩放
    if (finalOptions.viewWidth / finalOptions.viewHeight >= finalOptions.width / finalOptions.height) {
      const scale = finalOptions.viewHeight / finalOptions.height
      dWidth = finalOptions.width * scale
      dHeight = finalOptions.height * scale
      dLeft = (finalOptions.viewWidth - dWidth) / 2
    } else {
      const scale = finalOptions.viewWidth / finalOptions.width
      dHeight = finalOptions.height * scale
      dWidth = finalOptions.width * scale
      dTop = (finalOptions.viewHeight - dHeight) / 2
    }

    // 根据previewScale以（width/2, 0）进行第二次缩放，但依然只截取viewWidth和viewHeight部分
    dLeft -= (finalOptions.previewScale - 100) / 100 * dWidth / 2
    dWidth *= finalOptions.previewScale / 100
    dHeight *= finalOptions.previewScale / 100

    return new Promise((resolve) => {
      const image = new Image()
      image.onload = () => {
        canvasContext.drawImage(image, 0, 0, finalOptions.width, finalOptions.height, dLeft, dTop, dWidth, dHeight)
        console.log(canvas.toDataURL('image/png'))
        resolve(canvas.toDataURL('image/png'))
      }
      image.src = src
    })
  })
}

export { genPreviewSrc }