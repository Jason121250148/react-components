import { has, forEach } from 'lodash'

/**
 * 检测某对象（若为数组，则依次检测数组中对象）的属性值是否包含必需值的所有参数
 * @param {object} params 待检测参数
 * @param {Array} requiredParams 必需的属性
 */
const requiredParamsCheck = (params, requiredParams) => {
  let legal = true
  const checkFunc = (ps) => {
    forEach(requiredParams, (rP) => {
      if (!has(ps, rP)) legal = false
    })
  }
  if (Array.isArray(params)) {
    forEach(params, param => checkFunc(param))
  } else {
    checkFunc(params)
  }
  return legal
}

const blob2PngFile = (blob, fileName) => new File(blob, fileName, {
  type: 'image/png',
})

export { requiredParamsCheck, blob2PngFile }