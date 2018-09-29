import home from '@/views/public/Home'
import department from '@/views/organization/department/Index'
import position from '@/views/organization/position/Index'
import user from '@/views/organization/user/Index'
import menu from '@/views/system/menu/Index'
import addMenu from '@/views/system/menu/Add'
import rule from '@/views/system/rule/Index'
import addRule from '@/views/system/rule/Add'
import setting from '@/views/system/setting/Index'

let comps = {
  'home': home,
  'menu': menu,
  'addMenu': addMenu,
  'department': department,
  'position': position,
  'user': user,
  'rule': rule,
  'addRule': addRule,
  'setting': setting
}
export default comps
