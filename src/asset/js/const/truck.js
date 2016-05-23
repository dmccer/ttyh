import SHUN_FENG_CHE_PNG from '../../img/app/shunfengche@3x.png';
import HUI_CHENG_CHE_PNG from '../../img/app/huichengche@3x.png';
import ZHUAN_XIAN_PNG from '../../img/app/zhuanxian@3x.png';

// 添加车辆草稿
export const TRUCK_ADD_DRAFT = 'truck_add_draft';
// 发车页面用户
export const PAGE_TYPE = 'trucker_page';

// 选择的常跑路线
export const SELECTED_COMMON_ROUTE = 'selected_common_route';

// 车源搜索图标菜单
export const MENUS = [
  {
    id: 2,
    name: '顺风车',
    icon: SHUN_FENG_CHE_PNG,
    url: './sp-truck-search.html'
  }, {
    id: 1,
    name: '回程车',
    icon: HUI_CHENG_CHE_PNG,
    url: './sp-truck-search.html'
  }, {
    id: 3,
    name: '专线',
    icon: ZHUAN_XIAN_PNG,
    url: './sp-route.html'
  }
];
