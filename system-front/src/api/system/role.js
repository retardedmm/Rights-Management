/**
 * 前端到后端的接口调用
 * role.js 是只关于权限角色操作方面的接口调用
 */
import request from '@/utils/request'

const pre_route = '/admin/system/sysRole';

export default {
  //通过分页查询权限角色信息
  getListByPage(page, limit, Obj) {
    return request({
      url: `${pre_route}/${page}/${limit}`,
      method: 'get',
      params: Obj
    })
  },


  //通过id删除用户角色
  deleteById(id) {
    return request({
      url: `${pre_route}/remove/${id}`,
      method: 'delete'

    })
  },

  //添加角色
  addRole(role) {
    return request({
      url: `${pre_route}/addRole`,
      method: 'post',
      data: role
    })
  },

  //通过id查询数据
  getRoleById(id){
    return request({
      url: `${pre_route}/findOne/${id}`,
      method: 'get',
    })
  },

  //修改用户信息
  update(role){
    return request({
      url: `${pre_route}/update`,
      method: 'put',
      data: role
    })
  },

  //根据id批量删除
  deleteMoreRole(ids){
    return request({
      url: `${pre_route}/deleteMore`,
      method: 'delete',
      data: ids
    })
  },

  //根据用户id查询用户已分配的角色
getRolesByUserId(userId) {
  return request({
    url: `${pre_route}/getRoleByUserId/${userId}`,
    method: 'get'
  })
},

//分配角色
assignRoles(assginRoleVo) {
  return request({
    url: `${pre_route}/doAssign`,
    method: 'post',
    data: assginRoleVo
  })
}
}



