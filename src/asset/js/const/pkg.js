import PU_HUO_PNG from '../../img/app/puhuo@3x.png';
import WEI_XIAN_PIN_PNG from '../../img/app/weixianpin@3x.png';
import DA_JIAN_PNG from '../../img/app/dajian@3x.png';
import LENG_CANGE_PNG from '../../img/app/lengcang@3x.png';

// 货源搜索图标菜单
export const MENUS = [
  {
    id: 1,
    name: '普货',
    icon: PU_HUO_PNG,
    url: './sp-pkg-search.html',
  }, {
    id: 2,
    name: '危险品',
    icon: WEI_XIAN_PIN_PNG,
    url: './sp-pkg-search.html'
  }, {
    id: 3,
    name: '大件',
    icon: DA_JIAN_PNG,
    url: './sp-pkg-search.html'
  }, {
    id: 4,
    name: '冷藏',
    icon: LENG_CANGE_PNG,
    url: './sp-pkg-search.html'
  }
];

// 发货草稿
export const PKG_DRAFT = 'pkg-pub';
// 货物信息
export const PKG_INFO_DATA = 'pkg_info_data';
// 用车要求信息
export const PKG_TRUCK_USE_DATA = 'pkg_truck_info_data';
// 发货备注
export const PKG_MEMO = 'pkg-pub-memo';
// 发货页面用户
export const PAGE_TYPE = 'shipper_page';

// 用车方式
export const TRUCK_USE_TYPES = [
  {
    name: '整车',
    id: 1
  }, {
    name: '可拼车',
    id: 2
  }
];

// 仅需要选择车型的用车方式
export const JUST_SELECT_TRUCK_TYPE = 2;
// 默认用车方式
export const DEFAULT_TRUCK_USE_TYPE_ID = 1;
// 默认装货方式
export const DEFAULT_LOAD_TYPE_ID = 0;
// 默认结算方式
export const DEFAULT_PAYMENT_TYPE_ID = 1;
