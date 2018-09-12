import uuidv4 from 'uuid/v4'
import { map, forEach } from 'lodash'

import { requiredParamsCheck } from './common'
import mergeImgs from './merge-imgs'
import spritePack from './sprite-pack'

/**
 * 根据图片集生成雪碧图
 * @param {object} options 生成雪碧图选项配置
 * options: {
 *  maxWidth, maxHeight, 雪碧图最大长宽限制，如任意一边超出，则拆分为多张
 * }
 * @param {array} imgSets 图片集合
 * img: {
 *  url, width, height, 图片长宽
 * }
 * @returns {object} 雪碧图和图片集信息
 * {
 *  sprite: [{ width, height, src, id }...],
 *  imgs: [{ width, height, x, y, spriteId }...],
 * }
 */
function generateSprite(options = {}, imgSets = []) {
  const isLegalOptions = requiredParamsCheck(options, [])
  const isLegalImgSets = requiredParamsCheck(imgSets, ['url', 'width', 'height'])
  if (!isLegalOptions) return Promise.reject(new Error('options param is not completed, please check'))
  if (!isLegalImgSets) return Promise.reject(new Error('imgSets param is not completed, please check'))

  let unSpriteBlocks = imgSets
  const spritePro = []
  while (unSpriteBlocks.length > 0) {
    const spritePackRes = spritePack(options, unSpriteBlocks)
    unSpriteBlocks = spritePackRes.unSpriteBlocks

    const spriteBlocks = spritePackRes.spriteBlocks
    const spriteWidth = spriteBlocks.reduce((cur, item) => Math.max(cur, item.x + item.width), 0)
    const spriteHeight = spriteBlocks.reduce((cur, item) => Math.max(cur, item.y + item.height), 0)
    const mOptions = { width: spriteWidth, height: spriteHeight }
    const mImgSets = map(spriteBlocks, item => ({ ...item, left: item.x, top: item.y }))
    spritePro.push(mergeImgs(mOptions, mImgSets).then((src) => {
      const id = uuidv4()
      return {
        sprite: { id, width: spriteWidth, height: spriteHeight, src },
        imgs: map(mImgSets, item => ({ ...item, spriteId: id })),
      }
    }))
  }

  return Promise.all(spritePro).then((res) => {
    const result = { sprite: [], imgs: [] }
    forEach(res, (item) => {
      result.sprite.push(item.sprite)
      result.imgs = [...result.imgs, ...item.imgs]
    })
    return result
  })
}

export default generateSprite