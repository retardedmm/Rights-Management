<template>
  <div class="app-container">
    角色列表

    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input
                style="width: 100%"
                v-model="Obj.roleName"
                placeholder="角色名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="fetchData()"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetData()"
            >重置</el-button
          >
        </el-row>
      </el-form>
    </div>

    <!-- 添加按钮 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add"
        >添 加</el-button
      >
      <el-button class="btn-add" size="mini" @click="deleteMoreRole()"
        >批量删除</el-button
      >
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%; margin-top: 10px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scope.row.id)"
            title="修改"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeDataById(scope.row.id)"
            title="删除"
          />
          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignAuth(scope.row)" title="分配权限"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />

    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="dataForm"
        :model="sysRole"
        label-width="150px"
        size="small"
        style="padding-right: 40px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          size="small"
          icon="el-icon-refresh-right"
          >取 消</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="saveOrUpdate()"
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api/system/role.js";
export default {
  // 定义初始化变量，一般存放返回的数据
  data() {
    return {
      page: 1,
      total: 0,
      limit: 4,
      Obj: {},
      list: [],
      listLoading: true, // 数据是否正在加载
      dialogVisible: false,
      sysRole: {},
      selection: [], //复选框是否选中的数据
    };
  },

  // 在渲染页面之前会调用此方法
  created() {
    this.fetchData();
  },

  // 定义方法
  methods: {
    //重置按钮，搜索框重置
    resetData() {
      this.Obj = {};
      this.fetchData();
    },

    //获取数据
    fetchData(pageNum = 1) {
      this.listLoading = false;
      this.page = pageNum;
      // ajax发送请求，已在导入的包中进行了封装
      api.getListByPage(this.page, this.limit, this.Obj).then((response) => {
        //console.log(response)
        this.list = response.data.records;
        this.total = response.data.total;
      });
    },

    //根据id进行删除的按钮点击事件
    removeDataById(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api.deleteById(id).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.fetchData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //添加权限管理角色,弹出添加对话框
    add() {
      //先清空，以防上次是修改或添加后遗留的数据
      this.sysRole = {};
      //把对话框的dialogVisible改为true表示将对话框弹出
      this.dialogVisible = true;
    },

    //添加或者修改
    saveOrUpdate() {
      if (!this.sysRole.id) {
        this.addRole();
      } else {
        this.update();
      }
    },

    //添加权限管理角色具体实现
    addRole() {
      api.addRole(this.sysRole).then((response) => {
        this.$message.success(response.message || "操作成功");
        this.dialogVisible = false;
        this.fetchData();
      });
    },

    //修改数据信息第一步:查询后回显
    edit(id) {
      this.dialogVisible = true;
      api.getRoleById(id).then((response) => {
        this.sysRole = response.data;
      });
    },

    //修改数据信息第二步:修改信息
    update() {
      api.update(this.sysRole).then((response) => {
        this.$message.success(response.message || "操作成功");
        this.dialogVisible = false;
        this.fetchData();
      });
    },

    //每次点击复选框按钮时会触发此方法
    handleSelectionChange(selection) {
      this.selection = selection;
    },

    //根据id批量删除
    deleteMoreRole() {
      if (this.selection.length === 0) {
        this.$message.warning("请选择要删除的记录！");
        return;
      }
      var ids = [];
      for (var i = 0; i < this.selection.length; i++) {
        ids.push(this.selection[i].id);
      }

      this.$confirm("此操作将永久删除这些权限用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          api.deleteMoreRole(ids).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.fetchData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //跳转进行分配菜单权限
    showAssignAuth(row){
      this.$router.push('/system/assignAuth?id='+row.id+'&roleName='+row.roleName);
    }

  },
};
</script>