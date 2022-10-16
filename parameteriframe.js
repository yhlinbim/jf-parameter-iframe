JFCustomWidgetUtils.domReady(function () {
  class ParameterFrame {
    params;
    iframe = document.querySelector("#view");
    srcFields;

    constructor() {
      this.params = JFCustomWidget.getWidgetSettings();
      this.srcFields = this.params.URL.match(/[^{\}]+(?=})/g);
      this.updateFrame();
      this.srcFields.forEach(n=>{
        JFCustomWidget.listenFromField(n, "change", (res) => {
          this.updateFrame();
        });
      });
    }
    updateFrame = () => {
      let srcIDs = this.srcFields.map((n)=>n.split("_")[1]);
      JFCustomWidget.getFieldsValueById(
        srcIDs, (res)=>{
          let prefills = res.data.map((n)=>n.value);
          let i = 0;
          let fullURL=this.params.URL;
          prefills.forEach((n)=>{
            fullURL = fullURL.replace(`{${this.srcFields[i]}}`, n);
            i++;
          });
          this.iframe.setAttribute('src', fullURL);
        }
      );
    };
  }
  JFCustomWidget.subscribe("ready", function (data) {
    var widget = new ParameterFrame(data);
    JFCustomWidget.subscribe("submit", function () {
      JFCustomWidget.sendSubmit("Success.");
    });
  });
});
