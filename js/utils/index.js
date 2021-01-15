/**
 * 获取一个位于某个区间的整数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
export const randomIntegerInRange = (min, max) => Math.random() * (max - min) + min;

/**
 * 获取一个位于某个区间的数字(非整数)
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
export const randomNumberInRange = (min, max) => Math.random() * (max - min) + min;