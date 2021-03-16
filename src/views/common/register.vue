<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">享同开源</h2>
          <p class="brand-info__intro">xtoon-boot是一款基于DDD领域模型<br>的SAAS开源框架</p>
        </div>
        <div class="register-main">
          <h3 class="login-title">注册租户</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="tenantName" label="租户名称" style="margin-bottom: 10px;">
              <el-input v-model="dataForm.tenantName" placeholder="租户名称"></el-input>
            </el-form-item>
            <el-form-item prop="tenantCode" label="租户编码" style="margin-bottom: 10px;">
              <el-input v-model="dataForm.tenantCode" placeholder="租户编码"></el-input>
            </el-form-item>
            <el-form-item prop="mobile" label="手机号" style="margin-bottom: 10px;">
              <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="userName"
                          label="用户名" style="margin-bottom: 10px;">
              <el-input placeholder="请输入用户名"
                        v-model="dataForm.userName"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="password"
                          label="设置密码" style="margin-bottom: 10px;">
              <el-input placeholder="请输入密码"
                        show-password
                        v-model="dataForm.password"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword"
                          label="确认密码">
              <el-input placeholder="请输入密码"
                        show-password
                        v-model="dataForm.checkPassword"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="captcha" style="margin-bottom: 0px;">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">注册</el-button>
            </el-form-item>
            <div class="tl">
              <span>已有平台账号？</span><el-button  @click="$router.push({name:'login'})">立即登录</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  import { isMobile } from '@/utils/validate'
  export default {
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.dataForm.checkPassWord !== '') {
            this.$refs.dataForm.validateField('checkPassword')
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.dataForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      const validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        dataForm: {
          tenantName: '',
          tenantCode: '',
          userName: '',
          mobile: '',
          password: '',
          checkPassword: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          tenantName: [
            { required: true, message: '租户名称不能为空', trigger: 'blur' }
          ],
          tenantCode: [
            { required: true, message: '租户编码不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: validateMobile, trigger: 'blur' }],
          password: [{ validator: validatePass, trigger: 'blur' }],
          checkPassword: [{ validator: validatePass2, trigger: 'blur' }],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      this.getCaptcha()
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/registerTenant'),
              method: 'post',
              data: this.$http.adornData({
                'tenantName': this.dataForm.tenantName,
                'tenantCode': this.dataForm.tenantCode,
                'userName': this.dataForm.userName,
                'mobile': this.dataForm.mobile,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message.success('注册成功')
                this.$router.push({
                  name: 'login'
                })
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login-back.png);
      background-size: 1000px 820px;
      background-repeat:no-repeat;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 370px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      font-size: 18px;
      line-height: 1.58;
      opacity: .6;
    }
    .register-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 50px 60px 50px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }

</style>
