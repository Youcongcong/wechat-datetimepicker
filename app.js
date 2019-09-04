//app.js
App({
  
  onLaunch() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {

        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    wx.onNetworkStatusChange(function (res) {
      if (['3g', '2g', 'none', 'unknown'].indexOf(res.networkType) > -1) {
        wx.showToast({
          title: '网络信号弱！',
          icon: 'none',
          duration: 2000
        })
      }
    })
    wx.loadFontFace({
      family: 'DINPRO',
      source: 'url("https://common.fcbox.com/cdn/dspwebchat/fonts/dinprobold.ttf")',
      success: function (res) {
      }
    })
    //https://common.fcbox.com/cdn/dspwebchat/fonts/SourceHan.ttf
    wx.loadFontFace({
      family: 'SourceHantwo',
      source: 'url("https://common.fcbox.com/cdn/dspwebchat/fonts/SourceHan2.ttf")',
      success: function (res) {
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.windowHeight = res.screenHeight
        this.globalData.windowHeighttwo = res.windowHeight

      },
    })
  },
  globalData: {
    windowHeighttwo: '',
    windowHeight: '',
    userInfo: null,
    selectedCode: '', // 行业选择
    phoneNum: '',
    planCode: '',
    industry: {},       // 缓存行业信息
    contactinfo: {},
    hotcity: [],   //热门城市
    //修改资质
    isUpdate: false,
    obj: {
      accountId: null,
      advertiserName: "",
      companyLicenseCode: "",
      companyLicensePicUrl: "",
      companyName: "",
      contactAddress: "",
      contactNumber: "",
      contacts: "",
      corporateIdCard: "",
      corporateIdCardFrontPicUrl: "",
      corporateIdCardNegativePicUrl: "",
      corporateName: "",
      email: "",
      icpPicUrl: "",
      id: '',
      industryLevelOneCode: "",
      industryLevelOneName: "",
      industryLevelTwoCode: "",
      industryLevelTwoName: "",
      industryPicUrl: "",
      qualificationCode: "",
      remark: '',
      siteName: "",
      siteUrl: "",
      uicId: '',
      updateEmp: "",
      userId: ''
    }
  }
})
