/**
 * 首页：Banner 跳转、筛选与快捷标签配置
 */

/** 顶部 Banner 点击跳转的酒店 ID（广告位） */
export const BANNER_HOTEL_ID = '1';

/** 快捷标签 */
export const QUICK_TAGS = [
  '亲子',
  '豪华',
  '免费停车场',
  '含早餐',
  '近地铁',
  '温泉',
  '海景',
] as const;

/** 星级筛选 */
export const STAR_OPTIONS = [
  {label: '三星', value: '3'},
  {label: '四星', value: '4'},
  {label: '五星', value: '5'},
] as const;

/** 价格区间筛选 */
export const PRICE_OPTIONS = [
  {label: '经济', value: '0-300'},
  {label: '舒适', value: '300-500'},
  {label: '高档', value: '500-800'},
  {label: '豪华', value: '800+'},
] as const;
