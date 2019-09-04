

Page({
  data: {
    startDate: new Date().getTime(),
    type: 'date'
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
