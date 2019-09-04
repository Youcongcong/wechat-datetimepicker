

Page({
  data: {
    startDate: new Date().getTime(),
    type: 'year'
  },

  onShareAppMessage() {

  },
  chooseType(e){
    let type = e.currentTarget.dataset.type
    this.setData({ 
      type,
      startDate: new Date().getTime(),
    })
  },
  getTimesFn(e){
    console.log(e)
  },
  onLoad () {
    
  },
  onShow() {
    
  },
})
