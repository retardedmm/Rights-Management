/**
 * 前端到后端的接口调用
 * user.js 是只关于用户操作方面的接口调用
 */
 import request from '@/utils/request'

 const pre_route = '/admin/system/sysUser';

 export default {

   //通过分页查询用户信息
   getListByPage(page, limit, Obj) {
     return request({
       url: `${pre_route}/${page}/${limit}`,
       method: 'get',
       params: Obj
     })
   },

     //添加用户
  addUser(user) {
    return request({
      url: `${pre_route}/addUser`,
      method: 'post',
      data: user
    })
  },

    //通过id删除用户
    deleteById(id) {
        return request({
          url: `${pre_route}/delete/${id}`,
          method: 'delete'
    
        })
      },

        //通过id查询数据
  getUserById(id){
    return request({
      url: `${pre_route}/findOne/${id}`,
      method: 'get',
    })
  },

    //修改用户信息
    update(user){
        return request({
          url: `${pre_route}/update`,
          method: 'put',
          data: user
        })
      },

        //根据id批量删除
  deleteMoreUser(ids){
    return request({
      url: `${pre_route}/deleteMore`,
      method: 'delete',
      data: ids,
    })
  },

  //更改用户状态
  updateStatus(id,status){
    return request({
        url: `${pre_route}/updateStatus/${id}/${status}`,
        method: 'put',
    })
  }

 }
