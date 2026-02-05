/**
 * 路由参数类型定义
 */
/** 首页传入列表页的查询条件 */
export type HotelListSearchParams = {
  keyword?: string;
  location?: string;
  checkIn?: string;   // YYYY-MM-DD
  checkOut?: string; // YYYY-MM-DD
  starLevel?: string;
  priceRange?: string;
  tags?: string[];
};

export type RootStackParamList = {
  Home: undefined;
  HotelList: HotelListSearchParams;
  HotelDetail: {hotelId: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
