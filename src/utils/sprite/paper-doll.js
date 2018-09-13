import { merge, map, find, forEach } from 'lodash'

import { requiredParamsCheck, uploadDataURL, idFromUrl } from './common'
import mergeImgs from './merge-imgs'
import generateSprite from './generate-sprite'

const defaultOptions = {
  // previewScale: 100,
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
 * @param {array} imgUnits 待合并的图片集
 * unit: {
 *  url, width, height, left, top,
 *  canScale, 是否跟随options.vScale和options.hScale进行拉伸
 *  index, 层级(相同的层级根据数组中的顺序渲染)
 * }
 * @returns {base64} 合成图片数据
 */
const genPreviewSrc = (options = {}, imgUnits = []) => {
  const isLegalOptions = requiredParamsCheck(options, ['width', 'height'])
  if (!isLegalOptions) return Promise.reject(new Error('options param is not completed, please check'))
  const finalOptions = merge({}, defaultOptions, options)
  // const scaleWidth = finalOptions.hScale >= 100 ? finalOptions.width * finalOptions.hScale / 100 : finalOptions.width
  // const scaleHeight = finalOptions.vScale >= 100 ? finalOptions.height * finalOptions.vScale / 100 : finalOptions.height

  // return mergeImgs(finalOptions, imgUnits).then((src) => {
  //   const canvas = document.createElement('canvas')
  //   canvas.width = finalOptions.viewWidth
  //   canvas.height = finalOptions.viewHeight
  //   const canvasContext = canvas.getContext('2d')

  //   let dLeft = 0
  //   let dTop = 0
  //   let dWidth = finalOptions.viewWidth
  //   let dHeight = finalOptions.viewHeight
  //   // 1. 根据viewWidth和viewHeight进行第一次等比缩放
  //   if (finalOptions.viewWidth / finalOptions.viewHeight >= scaleWidth / scaleHeight) {
  //     const scale = finalOptions.viewHeight / scaleHeight
  //     dWidth = scaleWidth * scale
  //     dHeight = scaleHeight * scale
  //     dLeft = (finalOptions.viewWidth - dWidth) / 2
  //   } else {
  //     const scale = finalOptions.viewWidth / scaleWidth
  //     dHeight = scaleHeight * scale
  //     dWidth = scaleWidth * scale
  //     dTop = (finalOptions.viewHeight - dHeight) / 2
  //   }

  //   // 2. 根据previewScale以（width/2, 0）进行第二次缩放，但依然只截取viewWidth和viewHeight部分
  //   dLeft -= (finalOptions.previewScale - 100) / 100 * dWidth / 2
  //   dWidth *= finalOptions.previewScale / 100
  //   dHeight *= finalOptions.previewScale / 100

  //   return new Promise((resolve) => {
  //     const image = new Image()
  //     image.onload = () => {
  //       canvasContext.drawImage(image, 0, 0, scaleWidth, scaleHeight, dLeft, dTop, dWidth, dHeight)
  //       resolve(canvas.toDataURL('image/png'))
  //     }
  //     image.src = src
  //   })
  // })
  return mergeImgs(finalOptions, imgUnits)
}

/**
 * 生成基本造型和差分雪碧图信息及相应缩略图
 * @param {object} options 合并图片选项配置
 * options: {
 *  viewWidth, viewHeight, 生成图片的展示长宽，如超过，需等比缩放
 *  width, height, 原图长宽，即canvas长宽
 *  vScale, hScale, 垂直和水平拉伸比例
 *  scaleAnchorX, scaleAnchorY, 拉伸锚点
 * }
 * @param {array} basicUnits 基本造型待合并的图片集
 * unit: {
 *  url, width, height, left, top,
 *  canScale, 是否跟随options.vScale和options.hScale进行拉伸
 *  index, 层级(相同的层级根据数组中的顺序渲染)
 * }
 * @param {object} presetUnits 差分造型和其待合并的图片对应关系
 * {
 *  id: [unit],
 * }
 * unit: 同basicUnits的unit
 * @returns {object} 雪碧图组
 * {
 *  atlas: object, 雪碧图组信息
 *  basicPreviewUrl: string, 基本造型预览图
 *  presetPreviews: Object, 差分和其预览图对应关系
 * }
 */
const genSpriteSets = (options = {}, basicUnits = [], presetUnits = {}) => {
  const isLegalOptions = requiredParamsCheck(options, ['width', 'height'])
  if (!isLegalOptions) return Promise.reject(new Error('options param is not completed, please check'))
  const finalOptions = merge({}, defaultOptions, { viewWidth: options.width, viewHeight: options.height }, options)

  const basicPreviewUrl = genPreviewSrc(finalOptions, basicUnits).then(src => (uploadDataURL(src, '')))
  const presetPreviews = Promise.all(map(presetUnits, (value, key) => (
    genPreviewSrc(finalOptions, [...basicUnits, ...value]).then(src => (
      uploadDataURL(src, '').then(({ url }) => ({ presetId: key, url }))
    ))
  )))
  const allUnitsArr = [basicUnits, ...map(presetUnits, value => value)]
  const atlasPro = Promise.all(map(allUnitsArr, unitArr => generateSprite({
    maxWidth: 4096,
    maxHeight: 4096,
  }, unitArr).then(res => (
    // 上传文件，替换返回结果中的src为url
    Promise.all(map(res.sprite, sprite => (
      uploadDataURL(sprite.src, '').then(({ url, size }) => {
        const newSprite = { ...sprite }
        delete newSprite.src
        newSprite.url = url
        newSprite.size = size
        return newSprite
      })
    ))).then(sprite => ({ sprite, imgs: res.imgs }))
  ))))
  return Promise.all([basicPreviewUrl, presetPreviews, atlasPro]).then((res) => {
    const presetPreviewsRes = {}
    forEach(res[1], (item) => {
      presetPreviewsRes[item.presetId] = item.url
    })
    const atlas = {}
    forEach(res[2], (item) => {
      forEach(item.sprite, (sp) => {
        atlas[idFromUrl(sp.url)] = {
          id: sp.id,
          url: sp.url,
          width: sp.width,
          height: sp.height,
          size: sp.size,
        }
      })
      forEach(item.imgs, (img) => {
        const matchSp = find(item.sprite, sp => sp.id === img.spriteId)

        atlas[idFromUrl(img.url)] = {
          x: img.x,
          y: img.y,
          width: img.width,
          height: img.height,
          spriteImgId: idFromUrl(matchSp.url),
        }
      })
    })

    return {
      atlas,
      basicPreviewUrl: res[0].url,
      presetPreviews: presetPreviewsRes,
    }
  })
}

export { genPreviewSrc, genSpriteSets }