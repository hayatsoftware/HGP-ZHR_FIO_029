sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/Device",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/DialogType",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    mobileLibrary,
    Filter,
    FilterOperator,
    Device,
    Dialog,
    Button,
    Label,
    Text,
    DialogType,
    MessageBox,
    Fragment,
    Sorter,
    Export,
    ExportTypeCSV,
    library,
    Spreadsheet
  ) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;
    var ButtonType = mobileLibrary.ButtonType;
    return BaseController.extend("hayat.hcm.orgchart.md.controller.Detail", {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      onInit: function () {
        // Model used to manipulate control states. The chosen values make sure,
        // detail page is busy indication immediately so there is no break in
        // between the busy indication for loading the view's meta data

        ///////////detaildetail oninit//////
        var oViewModel = new JSONModel({
          busy: false,
          delay: 0,
        });

        var variantDialogModel = new JSONModel({
          Hide: "X",
          Type: "",
          Variant: "",
          Varname: "Test",
        });

        this.setModel(variantDialogModel, "variantDialogModel");

        var poCreateDialogModel = new JSONModel({
          Hide: "X",
          Varid: "",
          Vartxt: "",
        });

        this.setModel(poCreateDialogModel, "poCreateDialogModel");

        this.bus = sap.ui.getCore().getEventBus();

        /**
         * Binds the view to the object path and expands the aggregated line items.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */

        ///////////detaildetail oninit//////

        this.getRouter()
          .getRoute("object")
          .attachPatternMatched(this._onObjectMatched, this);
        this.getRouter()
          .getRoute("master")
          .attachPatternMatched(this._onObjectMatched, this);
        // this.getRouter().getRoute("detailDetail").attachPatternMatched(this._onObjectMatched, this); //detaildetail dee var
        this.getRouter()
          .getRoute("master")
          .attachPatternMatched(this._toggleFull, this);
        this.getRouter()
          .getRoute("master")
          .attachPatternMatched(this._setFullScreen, this);
        this.setModel(oViewModel, "detailView");

        this.getOwnerComponent()
          .getModel()
          .metadataLoaded()
          .then(this._onMetadataLoaded.bind(this));

        this.bus = sap.ui.getCore().getEventBus();
        this.bus.subscribe(
          "Master",
          "refreshDetailPage",
          this._focusNode,
          this
        );

        // this.bus.subscribe("DetailDetail", "refreshDetailPage", this._onVariantSelect, this); // ??
        this.bus.subscribe(
          "DetailDetailVariant",
          "refreshDetailPage",
          this._onVariantSelect,
          this
        ); // ??

        this.yakaFilterChanged = false;
        this._type = "2";
        this._date = "";
        this._root = "50138326";
        this.expandedNodes = [];
        //this._setGraph();

        this.IFStaj = "";
        this.IFMerch = "";
        this.IF24Cancel = "";
        this.IF25Cancel = "";
        this.IFOnHold = "";
        this.IFMt = "";
        this.IFAd1 = "";
        this.IFAd2 = "";
        this.IFBsure = "";
        this.IFDkay = "";
        this.IFBosp = "X";

        this.IFBy = "X";
        this.IFMy = "X";
        this.IFGy = "X";

        this.isSidePanelOpen = false;

        var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();
        this._langu = "TR";
        if (sCurrentLocale.slice(0, 2)) {
          this._langu = sCurrentLocale.slice(0, 2).toUpperCase();
        }

        var legendModel = new JSONModel({
          TR:
            '<div id="legend-header" onclick="sap.ui.getCore().byId(\'' +
            this.getView().getId() +
            '\').getController().onLegendHeader()" style="color: green;cursor: pointer;"> <span class="legend" style="font-family: SAP-icons;font-size:1.5rem;">&#xe1ff;</span> </div> <div id="legend-content" style="display:none"> <div><div style="width: 16px;height:16px; background-color:#ffffff; display: inline-block; border-radius: 15px;"></div> Beyaz Yaka</div>  <div><div style="width: 16px;height:16px; background-color:#88d7ff; display: inline-block; border-radius: 15px;"></div> Mavi Yaka</div>  <div><div style="width: 16px;height:16px; background-color:#d4d4d4; display: inline-block; border-radius: 15px;"></div> Gri Yaka</div>          <div><div style="width: 16px;height:16px; background-color:#f8f298; display: inline-block; border-radius: 15px; border: 2px solid #ffffff"></div> Beyaz Yaka Boş</div> <div><div style="width: 16px;height:16px; background-color:#f8f298; display: inline-block; border-radius: 15px; border: 2px solid #88d7ff"></div> Mavi Yaka Boş</div> <div><div style="width: 16px;height:16px; background-color:#f8f298; display: inline-block; border-radius: 15px; border: 2px solid #5e5e5e"></div> Gri Yaka Boş</div> <div><div style="width: 16px;height:16px;display: inline-block;"><span class="icon-employee-approvals" style="font-family: SAP-icons;font-size:1rem;">&#xe0be;</span></div>Toplam Pozisyon</div> <div><div style="width: 16px;height:16px;display: inline-block;"><span class="icon-employee-approvals" style="font-family: SAP-icons;font-size:1rem;">&#xe07b;</span></div>Dolu Pozisyon</div> <div><div style="width: 16px;height:16px;display: inline-block;"><span class="icon-employee-approvals" style="font-family: SAP-icons;font-size:1rem;">&#xe0b4;</span></div>Boş Pozisyon</div> </div>',
          EN:
            '<div id="legend-header" onclick="sap.ui.getCore().byId(\'' +
            this.getView().getId() +
            '\').getController().onLegendHeader()" style="color: green;cursor: pointer;"> <span class="legend" style="font-family: SAP-icons;font-size:1.5rem;">&#xe1ff;</span> </div> <div id="legend-content" style="display:none" > <div><div style="width: 16px;height:16px; background-color:#ffffff; display: inline-block; border-radius: 15px;"></div> White Collar</div>  <div><div style="width: 16px;height:16px; background-color:#88d7ff; display: inline-block; border-radius: 15px;"></div> Blue Collar</div>  <div><div style="width: 16px;height:16px; background-color:#d4d4d4; display: inline-block; border-radius: 15px;"></div> Gray Collar</div>          <div><div style="width: 16px;height:16px; background-color:#f8f298; display: inline-block; border-radius: 15px; border: 2px solid #ffffff"></div> Vacant White Collar</div> <div><div style="width: 16px;height:16px; background-color:#f8f298; display: inline-block; border-radius: 15px; border: 2px solid #88d7ff"></div> Vacant Blue Collar</div> <div><div style="width: 16px;height:16px; background-color:#f8f298; display: inline-block; border-radius: 15px; border: 2px solid #5e5e5e"></div> Vacant Gray Collar</div> <div><div style="width: 16px;height:16px;display: inline-block;"><span class="icon-employee-approvals" style="font-family: SAP-icons;font-size:1rem;">&#xe0be;</span></div> Total Position</div> <div><div style="width: 16px;height:16px;display: inline-block;"><span class="icon-employee-approvals" style="font-family: SAP-icons;font-size:1rem;">&#xe07b;</span></div> Filled Position</div> <div><div style="width: 16px;height:16px;display: inline-block;"><span class="icon-employee-approvals" style="font-family: SAP-icons;font-size:1rem;">&#xe0b4;</span></div>Vacant Position</div> </div>',
        });

        this.setModel(legendModel, "legendModel");

        this.filterCBModel = new JSONModel({
          selected: ["IFBy", "IFMy", "IFGy", "IFBosp"],
          items: [
            {
              key: "IFBy",
              text: this.getResourceBundle().getText("whiteColar"),
              group: this.getResourceBundle().getText("colar"),
            },
            {
              key: "IFMy",
              text: this.getResourceBundle().getText("blueColar"),
              group: this.getResourceBundle().getText("colar"),
            },
            {
              key: "IFGy",
              text: this.getResourceBundle().getText("grayColar"),
              group: this.getResourceBundle().getText("colar"),
            },
            {
              key: "IFStaj",
              text: this.getResourceBundle().getText("trainee"),
              group: this.getResourceBundle().getText("position"),
            },
            {
              key: "IFMt",
              text: "Management Trainee",
              group: this.getResourceBundle().getText("position"),
            },
            {
              key: "IFMerch",
              text: "Merchandiser",
              group: this.getResourceBundle().getText("position"),
            },
            // {
            //   "key": "IFAd1",
            //   "text": this.getResourceBundle().getText("fixedterm"),
            //   "group": this.getResourceBundle().getText("position")
            // },
            // {
            //   "key": "IFAd2",
            //   "text": this.getResourceBundle().getText("outsource"),
            //   "group": this.getResourceBundle().getText("position")
            // },
            {
              key: "IFBsure",
              text: this.getResourceBundle().getText("fixedterm"),
              group: this.getResourceBundle().getText("position"),
            },
            {
              key: "IFDkay",
              text: this.getResourceBundle().getText("outsource"),
              group: this.getResourceBundle().getText("position"),
            },
            {
              key: "IFBosp",
              text: this.getResourceBundle().getText("vacantpoisiton"),
              group: this.getResourceBundle().getText("position"),
            },
            {
              key: "IF24Cancel",
              text: this.getResourceBundle().getText("cancel2024"),
              group: this.getResourceBundle().getText("position"),
            },
            {
              key: "IF25Cancel",
              text: this.getResourceBundle().getText("cancel2025"),
              group: this.getResourceBundle().getText("position"),
            },
            {
              key: "IFOnHold",
              text: this.getResourceBundle().getText("onHold"),
              group: this.getResourceBundle().getText("position"),
            },
          ],
        });

        this.setModel(this.filterCBModel, "filterCBModel");

        var thiz = this;

        //OrgChart.state.clear("HayatOrgChartMainState");
        localStorage.removeItem("HayatOrgChartMainState");

        $(window).resize(function () {
          if (thiz.chart) setTimeout(thiz.chart.setLayout(OrgChart.tree), 1000);
        });

        //oninitsonu
      },

      _setFullScreen: function () {
        setTimeout(() => this._toggleFull(), 1000);
      },

      // ////////////////////detaildetailcontroller///////////////////start
      //?
      onListItemPress: function (oEvent) {
        var item = this.getModel().getProperty(
          oEvent.getSource().getBindingContextPath()
        );
        // this.bus.publish("DetailDetail", "refreshDetailPage",item);
        this.bus.publish("DetailDetailVariant", "refreshDetailPage", item);
        this.byId("detailDetailVariant").close();

        if (!item.VarName === undefined && !item.VarName === "undefined") {
          var ODataTxt = { isVisible: false };
          var oModelTxt = new JSONModel(ODataTxt);
          this.getView().setModel(oModelTxt, "myTxtModel");
        }

        sap.ui.getCore().byId(this.createId("text1")).setText(item.Varname);
      },

      _onAddVariant: function (oEvent) {
        var variantDialogModel = new JSONModel({
          Hide: "",
          Type: "CR",
          Variant: "",
          Varname: "",
        });

        this.setModel(variantDialogModel, "variantDialogModel");

        this.openVarintDialog();
      },

      openVarintDialog: function (oEvent) {
        if (!this.variantDialog) {
          this.variantDialog = sap.ui.xmlfragment(
            "variantDialog",
            "hayat.hcm.orgchart.md.view.fragments.VariantDialog",
            this
          );
          this.getView().addDependent(this.variantDialog);
        } else {
        }
        this.variantDialog.open();
      },

      _handleVariantSavePress: function (oEvent) {
        var _d = this.getModel("variantDialogModel").getData();

        this.getModel().callFunction("/addVariant", {
          method: "POST",
          urlParameters: {
            Hide: _d.Hide,
            Type: _d.Type,
            Variant: _d.Variant,
            Varname: _d.Varname,
          },
          success: $.proxy(function (oData, oResponse) {
            var txt = "İşlem başarılı!";
            if (oData.addVariant) {
              if (oData.addVariant.Message !== "") {
                txt = oData.addVariant.Message;
              }
              if (oData.addVariant.Type === "E") {
                $.toast({
                  heading: "Hata",
                  text: txt,
                  showHideTransition: "slide",
                  position: "bottom-center",
                  icon: "error",
                });
              } else {
                $.toast({
                  heading: "Bilgi",
                  text: txt,
                  showHideTransition: "slide",
                  position: "bottom-center",
                  icon: "success",
                });
              }
              this.variantDialog.close();
            } else {
              $.toast({
                heading: "Hata",
                text: "Bir hata oluştu, lütfen daha sonra tekrar deneyin!",
                showHideTransition: "slide",
                position: "bottom-center",
                icon: "error",
              });
              this.variantDialog.close();
            }

            this.byId("variantList").getBinding("items").filter();

            //this.bus.publish("DetailDetail", "refreshDetailPage",{"Variant":oData.addVariant.MessageV4});  ???
            this.bus.publish("DetailDetailVariant", "refreshDetailPage", {
              Variant: oData.addVariant.MessageV4,
            });
            this.bus.publish("Detail", "refreshDetailPage", {
              Variant: oData.addVariant.MessageV4,
            });
          }, this),
        });
        this.variantDialog.close();
      },

      _handleVariantCancelPress: function (oEvent) {
        var variantDialogModel = new JSONModel({
          Hide: "",
          Type: "",
          Variant: "",
          Varname: "",
        });

        this.setModel(variantDialogModel, "variantDialogModel");

        this.variantDialog.close();
      },

      handleDetailPress: function (oEvent) {
        this.changeDialogTitle();
        var _item = this.getModel().getProperty(
          oEvent.getSource().getBindingContextPath()
        );
        var variantDialogModel = new JSONModel({
          Hide: _item.Hide,
          Type: "CH",
          Variant: _item.Variant,
          Varname: _item.Varname,
        });
        this.setModel(variantDialogModel, "variantDialogModel");
        this.openVarintDialog();
      },

      // this._oDialog = sap.ui.xmlfragment("hayat.hcm.orgchart.md.view.fragments.VariantDialog", this); bununla yakalıyoruz.
      // var oDialog = sap.ui.core.Fragment.byId("newCardText");
      changeDialogTitle: function () {
        //??????
      },

      ////////////////////detaildetailcontroller///////////////////end

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */

      /**
       * Event handler when the share by E-Mail button has been clicked
       * @public
       */
      onSendEmailPress: function () {
        var oViewModel = this.getModel("detailView");

        URLHelper.triggerEmail(
          null,
          oViewModel.getProperty("/shareSendEmailSubject"),
          oViewModel.getProperty("/shareSendEmailMessage")
        );
      },

      /* =========================================================== */
      /* begin: internal methods                                     */
      /* =========================================================== */

      /**
       * Binds the view to the object path and expands the aggregated line items.
       * @function
       * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
       * @private
       */

      _onObjectMatched: function (oEvent) {
        var oViewModel = this.getModel("detailView");
        var sObjectId = oEvent.getParameter("arguments").objectId;
        // this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
        // this.getModel().metadataLoaded().then( function() {
        // 	var sObjectPath = this.getModel().createKey("tListSet", {
        // 		Objid :  sObjectId
        // 	});
        // 	this._bindView("/" + sObjectPath);
        // }.bind(this));
        this.byId("detailPage").setShowFooter(false); // başlangıcta footer poz. şemasında gelmemesini sağlar
        if (oEvent.getParameter("name") === null) {
          //??
          //this.byId("graphTheme").setSelectedKey("ana");
          this.byId("graphTheme").setEnabled(false);
          this.byId("graphType").setSelectedKey("3");

          this._type = "3";
        } else {
          this.byId("graphTheme").setSelectedKey("olivia");
          this.byId("graphTheme").setEnabled(true);
          this.byId("graphType").setSelectedKey("2");

          this._type = "2";

          oViewModel.setProperty("/title", "");
        }

        this._date = "";
        this._root = "";
        this.expandedNodes = [];
        this._setGraph();

        this.byId("chartLang").setSelectedKey(this._langu);
      },

      /**
       * Binds the view to the object path. Makes sure that detail view displays
       * a busy indicator while data for the corresponding element binding is loaded.
       * @function
       * @param {string} sObjectPath path to the object to be bound to the view.
       * @private
       */
      _bindView: function (sObjectPath) {
        // Set busy indicator during view binding
        var oViewModel = this.getModel("detailView");

        // If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
        oViewModel.setProperty("/busy", false);

        // this.getView().bindElement({
        // 	path : sObjectPath,
        // 	events: {
        // 		change : this._onBindingChange.bind(this),
        // 		dataRequested : function () {
        // 			oViewModel.setProperty("/busy", true);
        // 		},
        // 		dataReceived: function () {
        // 			oViewModel.setProperty("/busy", false);
        // 		}
        // 	}
        // });
      },

      _onBindingChange: function () {
        // var oView = this.getView(),
        // 	oElementBinding = oView.getElementBinding();
        // // No data for the binding
        // if (!oElementBinding.getBoundContext()) {
        // 	this.getRouter().getTargets().display("detailObjectNotFound");
        // 	// if object could not be found, the selection in the master list
        // 	// does not make sense anymore.
        // 	this.getOwnerComponent().oListSelector.clearMasterListSelection();
        // 	return;
        // }
        // var sPath = oElementBinding.getPath(),
        // 	oResourceBundle = this.getResourceBundle(),
        // 	oObject = oView.getModel().getObject(sPath),
        // 	sObjectId = oObject.Objid,
        // 	sObjectName = oObject.Pt,
        // 	oViewModel = this.getModel("detailView");
        // this.getOwnerComponent().oListSelector.selectAListItem(sPath);
        // oViewModel.setProperty("/shareSendEmailSubject",
        // 	oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
        // oViewModel.setProperty("/shareSendEmailMessage",
        // 	oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
      },

      _onMetadataLoaded: function () {
        // Store original busy indicator delay for the detail view
        var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
          oViewModel = this.getModel("detailView");

        // Make sure busy indicator is displayed immediately when
        // detail view is displayed for the first time
        oViewModel.setProperty("/delay", 0);

        // Binding the view will set it to not busy - so the view is always busy if it is not bound
        oViewModel.setProperty("/busy", true);
        // Restore original busy indicator delay for the detail view
        oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
      },

      /**
       * Set the full screen mode to false and navigate to master page
       */
      onCloseDetailPress: function () {
        this.getModel("appView").setProperty(
          "/actionButtonsInfo/midColumn/fullScreen",
          false
        );
        // No item should be selected on master after detail page is closed
        this.getOwnerComponent().oListSelector.clearMasterListSelection();
        this.getRouter().navTo("master");
      },

      _toggleFull: function () {
        this.fullScreen();
        this.getModel("appView").setProperty("/layout", "OneColumn");
        this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
      },

      fullScreen: function (oEvent) {
        if (oEvent === undefined) {
          var bFullScreen = this.getModel("appView").getProperty(
            "/actionButtonsInfo/midColumn/fullScreen"
          );
          this.getModel("appView").setProperty(
            "/actionButtonsInfo/midColumn/fullScreen",
            !bFullScreen
          );
          this.getModel("appView").setProperty(
            "/previousLayout",
            this.getModel("appView").getProperty("/layout")
          );
          this.getModel("appView").setProperty(
            "/layout",
            "MidColumnFullScreen"
          );
        } else if (oEvent.getSource().getPressed()) {
          var bFullScreen = this.getModel("appView").getProperty(
            "/actionButtonsInfo/midColumn/fullScreen"
          );
          this.getModel("appView").setProperty(
            "/actionButtonsInfo/midColumn/fullScreen",
            !bFullScreen
          );
          this.getModel("appView").setProperty(
            "/layout",
            this.getModel("appView").getProperty("/previousLayout")
          );
        } else if (!oEvent.getSource().getPressed()) {
          var bFullScreen = this.getModel("appView").getProperty(
            "/actionButtonsInfo/midColumn/fullScreen"
          );
          this.getModel("appView").setProperty(
            "/actionButtonsInfo/midColumn/fullScreen",
            !bFullScreen
          );
          this.getModel("appView").setProperty(
            "/previousLayout",
            this.getModel("appView").getProperty("/layout")
          );
          this.getModel("appView").setProperty(
            "/layout",
            "MidColumnFullScreen"
          );
        }

        if (this.chart) setTimeout(this.chart.setLayout(OrgChart.tree), 2000); //???

        this.isSidePanelOpen = true;
      },
      /**
       * Toggle between full and non full screen mode.
       */
      // toggleFullScreen: function () {
      //   var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
      //   this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
      //   if (!bFullScreen) {
      //     // store current layout and go full screen
      //     this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
      //     this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
      //   } else {
      //     // reset to previous layout
      //     this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
      //   }
      // },

      /***
       * Custom Methods
       *
       *
       *
       */

      _setGraph: function (IVariant) {
        var oViewModel = this.getModel("detailView");
        var oResourceBundle = this.getResourceBundle();
        var oDataModel = this.getOwnerComponent().getModel();
        oDataModel.setSizeLimit(1000);

        var _theme = "olivia";
        var _drag = false;

        if (this._type === "12") {
          this._type = "2";
          _theme = "coolbf";
        } else if (this._type === "3") {
          _theme = "ana";
          _drag = true;
        } else {
          _theme = "olivia";
          if (
            this.byId("graphTheme") &&
            this.byId("graphTheme").getSelectedKey()
          ) {
            _theme = this.byId("graphTheme").getSelectedKey();
          }
        }

        var sObjectPath = "cListSet";
        // var _filter = [new Filter("IType", FilterOperator.EQ, this._type)];//new Filter("IObjid", FilterOperator.EQ, this._root),

        var _d = new Date(null);
        if (this._date !== "") {
          _d = this._date;
        }

        // if (this._date !== "") {

        //   // _filter.push(new Filter("IDatum", FilterOperator.EQ, this._date));

        // }

        //this._refresh = 'X';
        // if (this._refresh === 'X') {
        //   _filter.push(new Filter("IRefresh", FilterOperator.EQ, 'X'));
        // }

        // if (IVariant && IVariant !== "") {
        //   _filter.push(new Filter("IVariant", FilterOperator.EQ, IVariant));
        // }

        // _filter.push(new Filter("IFBy", FilterOperator.EQ, this.IFBy));
        // _filter.push(new Filter("IFGy", FilterOperator.EQ, this.IFGy));
        // _filter.push(new Filter("IFMy", FilterOperator.EQ, this.IFMy));

        // _filter.push(new Filter("IFMt", FilterOperator.EQ, this.IFMt));
        // _filter.push(new Filter("IFMerch", FilterOperator.EQ, this.IFMerch));
        // _filter.push(new Filter("IFStaj", FilterOperator.EQ, this.IFStaj));

        // // _filter.push(new Filter("IFAd1", FilterOperator.EQ, this.IFAd1));
        // // _filter.push(new Filter("IFAd2", FilterOperator.EQ, this.IFAd2));

        // _filter.push(new Filter("IFBsure", FilterOperator.EQ, this.IFBsure));
        // _filter.push(new Filter("IFDkay", FilterOperator.EQ, this.IFDkay));

        // _filter.push(new Filter("IFBosp", FilterOperator.EQ, this.IFBosp));

        var _d = {
          IFAd1: "",
          IFAd2: "",
          IFBosp: this.IFBosp,
          IFBsure: this.IFBsure,
          IFBy: this.IFBy,
          IFDkay: this.IFDkay,
          IFGy: this.IFGy,
          IFMerch: this.IFMerch,
          IF24Cancel: this.IF24Cancel,
          IF25Cancel: this.IF25Cancel,
          IFOnHold: this.IFOnHold,
          IFMt: this.IFMt,
          IFMy: this.IFMy,
          IFStaj: this.IFStaj,
          IType: this._type,
          IVariant: IVariant && IVariant !== "" ? IVariant : "",
          IDatum: _d,
        };

        var _treeModel = new JSONModel();
        //this.byId("Tree").setModel(_treeModel);

        this._level = this.byId("graphLevel").getSelectedKey();
        var thiz = this;
        oViewModel.setProperty("/busy", true);
        // this.getOwnerComponent().getModel().read("/" + sObjectPath, {
        //   filters: _filter,
        //   urlParameters: { "$select": "E,Ex,F,FBy,FMy,Hlevel,id,Mplans,O,Ph,Phx,pid,P,Pt,PEn,Short,S,SEn,Tfplans,TfplansBy,TfplansMy,Tvplans,TvplansBy,TvplansMy,Txplans,V,VBy,VMy,X,Y,Zz" },

        this.getOwnerComponent()
          .getModel()
          .callFunction("/getC", {
            urlParameters: _d,
            success: $.proxy(function (oData, oResponse) {
              if (oResponse.headers["sap-message"]) {
                var _sm = JSON.parse(oResponse.headers["sap-message"]);

                if (_sm.code === "ZMSG1/001") {
                  this.byId("graphDate").setBusy(true);

                  $.toast({
                    heading: oResourceBundle.getText("warning"),
                    text: oResourceBundle.getText("dateDateWarning"),
                    //"Seçili tarih için veri arka planda hazırlanıyor. Veri hazır olduğunda yüklenecek. Bu işlem bir kaç dakika sürebilir. Siz uygulamayı kullanmaya devam edebilirsiniz",
                    showHideTransition: "slide",
                    position: "bottom-center",
                    icon: "warning",
                    hideAfter: 10000,
                    bgColor: "#fd962f",
                  });
                  oViewModel.setProperty("/busy", false);

                  //date Control
                  this.dateControl();

                  return;
                }
              }

              if (oData.results.length > 0) {
                var _m = new JSONModel(oData);
                var nodes = oData.results;

                var start = window.performance.now();
                nodes = nodes.sort((p1, p2) =>
                  p1.H < p2.H ? 1 : p1.H > p2.H ? -1 : 0
                );

                var end = window.performance.now();
                var time = end - start;
                console.log("Sort time: " + time);

                for (var y = 0; y < nodes.length; y++) {
                  nodes[y].F = parseInt(nodes[y].F);
                  nodes[y].V = parseInt(nodes[y].V);
                  nodes[y].X = parseInt(nodes[y].X);

                  // nodes[y].FMy = parseInt(nodes[y].FMy);
                  // nodes[y].VMy = parseInt(nodes[y].VMy);
                  // nodes[y].FBy = parseInt(nodes[y].FBy);
                  // nodes[y].VBy = parseInt(nodes[y].VBy);

                  // nodes[y].TfplansMy = 0;
                  // nodes[y].TvplansMy = 0;
                  // nodes[y].TfplansBy = 0;
                  // nodes[y].TvplansBy = 0;

                  nodes[y].Tvplans = 0;
                  nodes[y].Txplans = 0;
                  nodes[y].Tfplans = 0;

                  nodes[y].Tplans = 0;

                  nodes[y].Ph =
                    "/sap/opu/odata/sap/HCM_EMPLOYEE_LOOKUP_SRV/EmployeeInfoSet('" +
                    nodes[y].Pe +
                    "')/$value";

                  if (document.baseURI.indexOf("mobil.hayat.com.tr") !== -1) {
                    nodes[y].Phx =
                      "http://192.168.2.154:8000/sap/opu/odata/sap/ZHR_PROJ_026_SRV/EmployeeInfoSet('" +
                      nodes[y].Pe +
                      "')/$value?saml2=disabled";
                  } else {
                    nodes[y].Phx =
                      "http://192.168.2.194:8000/sap/opu/odata/sap/ZHR_PROJ_026_SRV/EmployeeInfoSet('" +
                      nodes[y].Pe +
                      "')/$value?saml2=disabled";
                  }
                }

                var end = window.performance.now();
                var time = end - start;
                console.log("Integer time: " + time);

                for (var i = 0; i < nodes.length; i++) {
                  nodes[i]["tags"] = [];

                  if (this._type === "2") {
                    if (nodes[i].id === "50359177") {
                      //debugger;
                    }

                    if (nodes[i].O === "O" || nodes[i].O === "S") {
                      for (var x = 0; x < nodes.length; x++) {
                        if (
                          nodes[x].O === "O" &&
                          nodes[x].id === nodes[i].pid
                        ) {
                          if (nodes[x].id === "50229813") {
                            //debugger;
                          }

                          if (typeof nodes[x].Tvplans === "undefined") {
                            nodes[x].Tvplans = 0;
                          }
                          if (typeof nodes[x].Txplans === "undefined") {
                            nodes[x].Txplans = 0;
                          }
                          if (typeof nodes[x].Tfplans === "undefined") {
                            nodes[x].Tfplans = 0;
                          }

                          nodes[x].Tvplans =
                            parseInt(nodes[x].Tvplans) + parseInt(nodes[i].V);
                          nodes[x].Txplans =
                            parseInt(nodes[x].Txplans) + parseInt(nodes[i].X);
                          nodes[x].Tfplans =
                            parseInt(nodes[x].Tfplans) + parseInt(nodes[i].F);

                          nodes[x].F = parseInt(nodes[x].Tfplans);
                          nodes[x].V = parseInt(nodes[x].Tvplans);
                          nodes[x].X = parseInt(nodes[x].Txplans);

                          break;
                        }
                      }
                    }

                    if (nodes[i].O === "O") {
                      nodes[i].F = parseInt(nodes[i].Tfplans);
                      nodes[i].V = parseInt(nodes[i].Tvplans);
                      nodes[i].X = parseInt(nodes[i].Txplans);
                    } else {
                    }
                  } else {
                    nodes[i].F = parseInt(nodes[i].F);
                    nodes[i].V = parseInt(nodes[i].V);
                    nodes[i].X = parseInt(nodes[i].X);
                  }
                  // nodes[i].F = parseInt(nodes[i].F);
                  // nodes[i].V = parseInt(nodes[i].V);
                  // nodes[i].Tfpalns = parseInt(nodes[i].Tfplans);
                  // nodes[i].Tvplans = parseInt(nodes[i].Tvplans);
                  nodes[i].Tplans = parseInt(nodes[i].F) + parseInt(nodes[i].V);
                  nodes[i].XTplans = nodes[i].Tplans - parseInt(nodes[i].X);
                  if (nodes[i].S.indexOf("Asistan") !== -1) {
                    nodes[i]["tags"].push("assistant");
                  }

                  if (nodes[i].Y !== "") {
                    nodes[i]["tags"].push(nodes[i].Y);
                  } else {
                    //nodes[i]['tags'].push('BOS');
                  }

                  if (nodes[i].Y === "MY" && nodes[i].E !== "") {
                    //debugger;
                  }

                  if (nodes[i].E === "") {
                    nodes[i]["tags"].push("BOS");
                  }

                  if (nodes[i].Ex === "X") {
                    nodes[i]["tags"].push("Ex");
                  }
                  if (nodes[i].Zz === "2") {
                    nodes[i]["tags"].push("Butce");
                  }

                  if (nodes[i].M === "X") {
                    nodes[i]["tags"].push("Hidden");
                  }

                  nodes[i]["tags"].push(nodes[i].O);
                }

                var end = window.performance.now();
                var time = end - start;
                console.log("Process time: " + time);

                var start = window.performance.now();
                const nodesD = nodes.filter(function (node) {
                  return node.M !== "X";
                });

                var end = window.performance.now();
                var time = end - start;
                console.log("Manage Remove time: " + time);

                this.orgChartTemplates(OrgChart);

                this.exportflag = false;
                this.focusMode = false;
                this.scaleMode = true;
                var thiz = this;
                var initialized = false;
                this.legendHTML = "";
                this.legend = "";

                var chart = (this.chart = new OrgChart(
                  document.getElementById("orgchart"),
                  {
                    
                    scaleInitial: OrgChart.match.boundary,
                    layout: OrgChart.mixed,
                    lazyLoading: true,
                    enableSearch: false,
                    //exportUrl: '/sap/bc/zhr_rs_001',
                    serverUrl: '/sap/bc/zhr_rs_001',
                    enableDragDrop: _drag,
                    miniMap: true,
                    template: _theme,
                    nodeMouseClick: OrgChart.action.none,

                    // exportUrl: '/sap/bc/zhr_rs_001',
                    // enableDragDrop: _drag,
                    // miniMap: false,
                    // layout: OrgChart.mixed,
                    // lazyLoading: true,
                    // scaleInitial: 0.5, //OrgChart.match.boundary, // 0.5,
                    // template: _theme,
                    // nodeMouseClick: OrgChart.action.none,
                    //mouseScrool: OrgChart.action.ctrlZoom,
                    state: {
                      name: "HayatOrgChartMainState",
                      readFromLocalStorage: true,
                      writeToLocalStorage: true,
                    },
                    menu: {
                      pdf: {
                        text: "Export PDF",
                        onClick: function () {
                          thiz.exportflag = true;
                          chart.exportToPDF();
                        },
                      },
                      png: {
                        text: "Export PNG",
                        onClick: function () {
                          thiz.exportflag = true;
                          chart.exportToPNG();
                        },
                      },
                      pp_preview: {
                        text: "PowerPoint",
                        onClick: function () {
                          //thiz.byId("detailPage").setShowFooter(true);

                          thiz.showhideFooter(true,"po");

                          //thiz.exportflag = true;
                          chart.powerPointPreviewUI.show({});
                        },
                      },

                      // export_visio: {
                      //   text: "Export Visio",
                      //   icon: OrgChart.icon.visio(24, 24, "#7A7A7A"),
                      //   onClick: function () {
                      //     thiz.exportflag = true;
                      //     chart.exportToVisio({
                      //       expandChildren: true,
                      //       min: false,
                      //       // openInNewTab: true
                      //     });
                      //   },
                      // },
                      "focus-mode": {
                        icon: function () {
                          var checked = thiz.focusMode == true ? "checked" : "";
                          return (
                            '<input id="focus-mode" class="check-box" onclick="sap.ui.getCore().byId(\'' +
                            thiz.getView().getId() +
                            '\').getController().fmodeclick()" type="checkbox" ' +
                            checked +
                            ">"
                          );
                        },
                        text: '<label for="focus-mode">Odakla</label>',
                        onClick: function () {
                          return false;
                        },
                      },
                      "scale-mode": {
                        icon: function () {
                          var checked = thiz.scaleMode == true ? "checked" : "";
                          return (
                            '<input id="focus-mode" class="check-box" onclick="sap.ui.getCore().byId(\'' +
                            thiz.getView().getId() +
                            '\').getController().scalemodeclick()" type="checkbox" ' +
                            checked +
                            ">"
                          );
                        },
                        text: '<label for="scale-mode">Sığdır</label>',
                        onClick: function () {
                          return false;
                        },
                      },
                    },
                    nodeMenu: this.getNodeMenu(),
                    editForm: this.getEditForm(),
                    tags: {
                      Hidden: {
                        template: "hiddenTemplate",
                      },
                      // S: {
                      //   template: "customAna"
                      // }
                    },
                    toolbar: {
                      layout: true,
                      zoom: true,
                      fit: true,
                      expandAll: false,
                    },
                    nodeBinding: {
                      img_0: "Ph",
                      field_0: this._langu === "EN" ? "SEn" : "S",
                      field_1: "E",

                      field_2: this._langu === "EN" ? "PEn" : "Pt",
                      point_1: "Tplans",
                      point_2: "F",
                      point_3: "XTplans",

                      point_4: "Tplans",
                      point_5: "Tfplans",
                      point_6: "Tvplans",
                      point_7: "TvplansMy",
                    },
                    collapse: {
                      level: 2,
                      allChildren: true,
                    },
                    nodes: nodesD,
                  }
                ));

                oViewModel.setProperty("/busy", false);

                if (!initialized) {
                  var legend = (this.legend = document.createElement("div"));
                  legend.id = "legend-content";
                  legend.style.position = "absolute";
                  legend.style.top = "20px";
                  legend.style.left = "20px";
                  legend.style.color = "#757575";
                  legend.innerHTML =
                    this.getModel("legendModel").getData()[
                      this._langu.toUpperCase()
                    ]; //document.querySelector('#legend-content').innerHTML;;
                  //chart.element.appendChild(legend);
                  this.legendHTML = legend.outerHTML;
                  initialized = true;
                }

                chart.on(
                  "expcollclick",
                  $.proxy(function (sender, collapse, id, ids) {
                    if (!collapse) {
                      var node = sender.getNode(id);
                      if (node.parent) {
                        sender.expand(
                          id,
                          ids,
                          $.proxy(function () {
                            if (this._level > 1) {
                              var _ids = [];
                              for (var i1 = 0; i1 < ids.length; i1++) {
                                _ids = _ids.concat(
                                  sender.getNode(ids[i1]).childrenIds
                                );
                              }

                              sender.expand(
                                ids[0],
                                _ids,
                                $.proxy(function () {
                                  if (this._level > 2) {
                                    var _ids = [];
                                    for (var i1 = 0; i1 < ids.length; i1++) {
                                      _ids = _ids.concat(
                                        sender.getNode(ids[i1]).childrenIds
                                      );
                                    }
                                    sender.expand(
                                      ids[1],
                                      _ids,
                                      $.proxy(function () {
                                        var ids = [];
                                        for (
                                          var i = 0;
                                          i < node.parent.childrenIds.length;
                                          i++
                                        ) {
                                          var firstLevelChildId =
                                            node.parent.childrenIds[i];
                                          if (firstLevelChildId != node.id) {
                                            ids.push(firstLevelChildId);
                                          }
                                        }

                                        // sender.collapse(id, ids, function () {
                                        // 	sender.center(id);
                                        // });
                                      }, this)
                                    );
                                  } //end of if 2
                                }, this)
                              );
                            } //end of if 1
                          }, this)
                        );
                        if (this.focusMode) {
                          var node = sender.getNode(id);
                          var centerId = id;
                          var rippleId = id;
                          sender.center(centerId, {
                            parentState: OrgChart.COLLAPSE_PARENT_NEIGHBORS,
                            childrenState: OrgChart.COLLAPSE_SUB_CHILDRENS,
                            rippleId: rippleId,
                            vertical: false,
                            horizontal: true,
                          });
                        }
                        return false;
                      }
                    } else {
                      if (this.focusMode) {
                        var node = sender.getNode(id);
                        var centerId = id;
                        var rippleId = id;
                        if (collapse) {
                          var node = sender.getNode(id);
                          if (node.parent == null) return true;
                          centerId = node.pid;
                        }
                        sender.center(centerId, {
                          parentState: OrgChart.COLLAPSE_PARENT_NEIGHBORS,
                          childrenState: OrgChart.COLLAPSE_SUB_CHILDRENS,
                          rippleId: rippleId,
                          vertical: false,
                          horizontal: true,
                        });
                        return false;
                      } else {
                        return true;
                      }
                    }
                  }, this)
                );

                this.array = [];
                var movingNode = {};

                chart.on("redraw", function (sender, args) {
                  if (
                    thiz.scaleMode &&
                    (sender.manager.action == OrgChart.action.expand ||
                      sender.manager.action == OrgChart.action.collapse)
                  ) {
                    sender.fit();
                  }

                  if (sender.getScale() < 0.3) {
                    //thiz.chart.config.template = "deborah";
                    //thiz.chart.draw();
                  }

                  if (
                    thiz.isSidePanelOpen &&
                    sender.manager.action == OrgChart.action.update
                  ) {
                    thiz.isSidePanelOpen = false;
                    sender.draw();
                  }
                });

                chart.on("drag", function (sender, draggedNodeId) {
                  thiz.blur();
                  var node = chart.get(draggedNodeId);
                  var draggedNodePid = node.pid;
                  movingNode = { draggedNodeId, draggedNodePid };
                });

                chart.on(
                  "drop",
                  function (sender, draggedNodeId, droppedNodeId) {
                    var _drgType = chart.getNode(draggedNodeId).tags[1];
                    var _drpType = chart.getNode(droppedNodeId).tags[1];

                    if (_drgType === "P" && _drpType !== "S") {
                      console.log(_drgType + "->" + _drpType);
                      return false;
                    }

                    if (_drgType === "S" && _drpType !== "O") {
                      console.log(_drgType + "->" + _drpType);
                      return false;
                    }

                    if (_drgType === "O" && _drpType !== "O") {
                      console.log(_drgType + "->" + _drpType);
                      return false;
                    }

                    movingNode["droppedNodeId"] = droppedNodeId;
                    movingNode["O"] = _drgType;
                    thiz.array.push(movingNode);
                    console.log(thiz.array);
                  }
                );

                chart.editUI.on(
                  "show",
                  function (sender, nodeId, args1, args2) {
                    return true;
                  }
                );

                chart.onExportStart((args) => {

                      // args.styles +=
                      //   '<link type="text/css" href="https://sapui5.hana.ondemand.com/resources/sap/ui/core/themes/base/SAP-icons.css" rel="stylesheet">';
                      // args.styles +=
                      //   '<link href="http://localhost/exportservice/style.css" rel="stylesheet">';
                      // args.styles += '<link href="https://sofort.com.tr/style.css" rel="stylesheet">';

                    //Buradan taşı
                      const htmlString = `
<style id="customPoStyle">
html,
body {
  font-family: Helvetica;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

#tree {
  width: 100%;
  height: 100%;
}

.t {
  border: 2px solid #D9D9D9;
  border-radius: 20px;
}

.t-img {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid #BED600;
}

.t-name {
  padding: 10px 10px 10px 30px;
}


.t-val {
  padding: 10px 30px 10px 10px;
}

[data-field-name] [lbl] {
  display: none;
}

.edit-tags {
  display: none;
}

/*partial*/
.node.MY rect.zana {
  fill: #88d7ff !important;
}

/*
.node.BY rect {
    
}
*/

.node.GY rect {
  fill: #d4d4d4 !important;
}



.node.Expat rect.outer {
  stroke: #e8ac29;
}

.node.Expat foreignObject.exp {
  visibility: visible !important;
}

.node.Butce rect.outer {
  stroke: #e82929;
}

/*Ula Line Coloring*/
.node.MY.S line.zulaLine {
  stroke: #88d7ff !important;
}

.node.S line.zulaLine {
  stroke: #F57C00;
}

.node.O line.zulaLine {
  stroke: #039BE5;
}

.node.P line.zulaLine {
  stroke: #FFCA28;
}




/*Ula Line Coloring*/


/*Ula-Olivia Boş Poz*/
.node.BOS image.zolivia {
  display: none;
}

.node.BOS clipPath.zolivia {
  display: none;
}

.node.BOS image.zula {
  display: none;
}

.node.BOS clipPath.zula {
  display: none;
}

/*Ula-Olivia Boş Poz*/

/*partial*/
.node.S rect.zana {
  fill: #F57C00;
}

.node.O rect.zana {
  fill: #039BE5;
}

.node.P rect.zana {
  fill: #FFCA28;
}

.node.S rect.cool {
  fill: #ffffff !important;
}

.node.O rect.cool {
  fill: #ffffff !important;
}

.node.P rect.cool {
  fill: #ffffff !important;
}

.node.MY rect.cool.outer {
  fill: #88d7ff !important;
}

.node.GY rect.cool.outer {
  fill: #d4d4d4 !important;
}

.laptop::before {
  font-family: SAP-icons;
  content: "\\e027";
}


.node.BY rect.customAna {
  fill: #ffffff !important;
}

.node.S rect.customAna {
  fill: #ffffff !important;
}

.node.O rect.customAna {
  fill: #ffffff !important;
}

.node.P rect.customAna {
  fill: #ffffff !important;
}

.node.MY rect.customAna.outer {
  fill: #88d7ff !important;
}

.node.GY rect.customAna.outer {
  fill: #d4d4d4 !important;
}

.node.BOS rect.cool.outer {
  fill: #f8f298 !important;
}

.node.MY.BOS rect.cool.outer {
  stroke: #88d7ff !important;
}

.node.GY.BOS rect.cool.outer {
  stroke: #5e5e5e !important;
}
</style>
`;
                  args.styles += htmlString;
                  thiz.exportData = args.options.pages;
                  if (
                    document.activeElement &&
                    document.activeElement.hasAttribute(
                      "data-boc-export-export"
                    )
                  ) {

                    sap.ui.core.BusyIndicator.show(0);
                    var dialog = new Dialog({
                      type: DialogType.Message,
                      title: "Onay",
                      content: new Text({
                        text: this.getResourceBundle().getText("printConfirm"),
                      }),
                      beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Evet",
                        press: function () {
                          dialog.close();
                          sap.ui.core.BusyIndicator.hide();
                          thiz._onAddPrintOut();
                        },
                      }),
                      endButton: new Button({
                        text: "Hayır",
                        press: function () {
                          dialog.close();
                          sap.ui.core.BusyIndicator.hide();
                        },
                      }),
                      afterClose: function () {
                        dialog.destroy();
                      },
                    });
                    dialog.open();
                  }else{
                      thiz.legendHTML = thiz.legend.outerHTML;
                      args.content += thiz.legendHTML;
                      args.styles +=
                        '<link type="text/css" href="https://sapui5.hana.ondemand.com/resources/sap/ui/core/themes/base/SAP-icons.css" rel="stylesheet">';
                      args.styles +=
                        '<link href="http://localhost:88/exportservice/style.css" rel="stylesheet">';
                      }
                });

                // chart.onExportEnd((sender, args) => {
                //   console.log("Ends:")
                //   console.log(args);

                //   if (thiz.exportflag) {
                //     sender.config.nodeBinding.img_0 = "Ph";
                //     thiz.exportflag = false;
                //   }

                //   });

                // chart.on('exportstart', function (sender, args) {
                //   thiz.legendHTML = thiz.legend.outerHTML;
                //   args.content += thiz.legendHTML;
                //   args.styles += '<link type="text/css" href="https://sapui5.hana.ondemand.com/resources/sap/ui/core/themes/base/SAP-icons.css" rel="stylesheet">';
                //   args.styles += '<link href="http://localhost/exportservice/style.css" rel="stylesheet">';

                // });

                chart.on("exportend", function (sender, args) {
                  if (thiz.exportflag) {
                    sender.config.nodeBinding.img_0 = "Ph";
                    thiz.exportflag = false;
                  }
                  setTimeout(chart.draw(), 3000);
                });

                chart.on("prerender", function (sender, args) {
                  if (thiz.exportflag) {
                    sender.config.nodeBinding.img_0 = "Phx";
                  }
                });

                chart.on(
                  "searchclick",
                  $.proxy(function (sender, nodeId) {
                    if (this.focusMode) {
                      sender.center(nodeId, {
                        parentState: OrgChart.COLLAPSE_PARENT_NEIGHBORS,
                        childrenState: OrgChart.COLLAPSE_SUB_CHILDRENS,
                      });
                      return false;
                    }
                    return true;
                  }, this)
                );

                oViewModel.setProperty("/busy", false);
              } else {
                oViewModel.setProperty("/busy", false);
              }
            }, this),
          });
      },

      fmodeclick: function () {
        this.focusMode = !this.focusMode;
      },

      scalemodeclick: function () {
        this.scaleMode = !this.scaleMode;

        if (this.scaleMode) {
          this.chart.fit();
        }
      },

      blur: function () {
        // visiblenodes = this.chart.visibleNodeIds;
        // if (visiblenodes.length < 1){
        // 	return;
        // }
        // var node = chart.getNode(selectedId);
        // var skipBlur = [node.id];
        // var skipBlurLink = [];
        // while (node.parent) {
        // 	skipBlur.push(node.parent.id);
        // 	skipBlurLink.push('[' + node.parent.id + '][' + node.id + ']')
        // 	node = node.parent;
        // }
        // var nodeElements = document.querySelectorAll('[node-id]');
        // for (var i = 0; i < nodeElements.length; i++) {
        // 	var id = nodeElements[i].getAttribute('node-id');
        // 	if (skipBlur.indexOf(id) == -1)
        // 		nodeElements[i].setAttribute('filter', 'url(#f1)');
        // }
        // var expcollElements = document.querySelectorAll('[control-expcoll-id]');
        // for (var i = 0; i < expcollElements.length; i++) {
        // 	var id = expcollElements[i].getAttribute('control-expcoll-id');
        // 	if (skipBlur.indexOf(id) == -1)
        // 		expcollElements[i].setAttribute('filter', 'url(#f1)');
        // }
        // var linksElements = document.querySelectorAll('[link-id]');
        // for (var i = 0; i < linksElements.length; i++) {
        // 	var id = linksElements[i].getAttribute('link-id');
        // 	if (skipBlurLink.indexOf(id) == -1)
        // 		linksElements[i].setAttribute('filter', 'url(#f1)');
        // }
      },

      onLang: function (oEvent) {
        var _l = (this._langu = oEvent.getParameter("selectedItem").getKey());
        if (_l === "EN") {
          this.chart.config.nodeBinding.field_0 = "SEn";
          this.chart.config.nodeBinding.field_2 = "PEn";
        } else {
          this.chart.config.nodeBinding.field_0 = "S";
          this.chart.config.nodeBinding.field_2 = "Pt";
        }

        if (this.chart.element.lastChild.children[0].id === "legend-header") {
          this.chart.element.removeChild(this.chart.element.lastChild);
        }
        var legend = document.createElement("div");
        legend.style.position = "absolute";
        legend.style.top = "10px";
        legend.style.left = "10px";
        legend.style.color = "#757575";
        legend.innerHTML =
          this.getModel("legendModel").getData()[this._langu.toUpperCase()];
        this.chart.element.appendChild(legend);
        this.legendHTML = legend.outerHTML;

        this.chart.draw();

        this.bus.publish("Detail", "refreshMasterPage", {
          root: this._root,
          date: this._date,
          langu: this._langu,
        });
      },

      onTheme: function (oEvent) {
        this.chart.config.template = oEvent
          .getParameter("selectedItem")
          .getKey();
        if (this.chart.element.lastChild.children[0].id === "legend-header") {
          this.chart.element.removeChild(this.chart.element.lastChild);
        }
        if (this.chart.config.template === "cool") {
          var legend = document.createElement("div");
          legend.style.position = "absolute";
          legend.style.top = "10px";
          legend.style.left = "10px";
          legend.style.color = "#757575";
          legend.innerHTML =
            this.getModel("legendModel").getData()[this._langu.toUpperCase()];
          this.chart.element.appendChild(legend);
          this.legendHTML = legend.outerHTML;
        } else {
        }

        this.chart.draw();
      },

      _focusNode: function (sChannel, sEvent, oData) {
        var key = oData.Objid;
        //this.chart.find(key);

        this.chart.center(
          key,
          {
            parentState: OrgChart.COLLAPSE_PARENT_NEIGHBORS,
            childrenState: OrgChart.COLLAPSE_SUB_CHILDRENS,
            rippleId: 1,
            vertical: true,
            horizontal: false,
          },
          $.proxy(function () {
            this.chart.ripple(key);
          }, this)
        );
      },

      _onVariantSelect: function (sChannel, sEvent, oData) {
        var oViewModel = this.getModel("detailView");
        this._variant = oData.Variant;

        oViewModel.setProperty("/title", oData.Varname);

        if (this._type !== "3") {
          this.byId("graphTheme").setEnabled(false);
          // this.byId("detailPage").setShowFooter(true);
          this.showhideFooter(true,"sim");
          this._type = "3";
        }

        this._setGraph(this._variant);
      },

      onLevel: function (oEvent) {
        this._level = oEvent.getParameter("selectedItem").getKey();
        // this.chart.config.collapse.level = parseInt(oEvent.getParameter("selectedItem").getKey());
        // this.chart.draw();
      },

      onType: function (oEvent) {
        this._type = oEvent.getParameter("selectedItem").getKey();
        if (this._type === "12") {
          this.byId("graphTheme").setEnabled(false);
          this.byId("detailPage").setShowFooter(false);
          //this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
        } else if (this._type === "3") {
          this.byId("graphTheme").setEnabled(false);
          // this.byId("detailPage").setShowFooter(true);
          this.showhideFooter(true,"sim");
          //this._showDetail();
        } else {
          // this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
          this.byId("graphTheme").setEnabled(true);
          this.byId("detailPage").setShowFooter(false);
        }
        this._setGraph();
        // this.chart.config.collapse.level = parseInt(oEvent.getParameter("selectedItem").getKey());
        // this.chart.draw();
      },

      onDate: function (oEvent) {
        this._date = oEvent.getSource().getDateValue();
        this._date.setHours(6);
        this._setGraph();

        this.bus.publish("Detail", "refreshMasterPage", {
          root: this._root,
          date: this._date,
        });
      },

      onRoot: function (oEvent) {
        this._root = oEvent.getParameter("selectedItem").getKey();
        this._setGraph();
        var _o = new Object();
        _o["root"] = this._root;
        _o["date"] = this._date;
        this.bus.publish("Detail", "refreshMasterPage", _o);
      },

      onYakaFilterChange: function (oEvent) {
        this.yakaFilterChanged = true;
      },

      onYakaFilter: function (oEvent) {
        if (!this.yakaFilterChanged) {
          return;
        }

        this.yakaFilterChanged = false;

        var selectedItems = oEvent.getParameter("selectedItems");

        this.IFStaj = "";
        this.IFMerch = "";
        this.IFMt = "";
        this.IF24Cancel = "";
        this.IF25Cancel = "";
        this.IFOnHold = "";

        this.IFAd1 = "";
        this.IFAd2 = "";

        this.IFBsure = "";
        this.IFDkay = "";

        this.IFBy = "";
        this.IFMy = "";
        this.IFGy = "";

        this.IFBosp = "";

        for (var i = 0; i < selectedItems.length; i++) {
          this[selectedItems[i].getKey()] = "X";
        }

        this._setGraph();

        this.bus.publish("Detail", "refreshMasterPage", {
          root: this._root,
          date: this._date,
        });
      },

      // _getDialog : function () {
      // 	if (!this._oDialog) {
      // 		this._oDialog = sap.ui.xmlfragment("hayat.hcm.orgchart.md.view.fragments.DetailDetailVariant", this);
      // 		this.getView().addDependent(this._oDialog);
      // 	}
      // 	return this._oDialog;
      // },

      handlePoDetailPress: function (oEvent) {
        
        var _item = this.getModel().getProperty(
          oEvent.getSource().getBindingContextPath()
        );

        var poCreateDialogModel = new JSONModel({
          Hide: _item.Hide,
          Varid: _item.Varid,
          Vartxt: _item.Vartxt
        });

        this.setModel(poCreateDialogModel, "poCreateDialogModel");

        this.openPrintOutDialog();
      },


      _onAddPrintOut: function (oEvent) {
        var poCreateDialogModel = new JSONModel({
          Hide: "X",
          Varid: "",
          Vartxt: "",
        });

        this.setModel(poCreateDialogModel, "poCreateDialogModel");

        this.openPrintOutDialog();
      },

      openPrintOutDialog: function (oEvent) {
        if (!this.poCreateDialog) {
          this.poCreateDialog = sap.ui.xmlfragment(
            "poCreateDialog",
            "hayat.hcm.orgchart.md.view.fragments.PoCreateDialog",
            this
          );
          this.getView().addDependent(this.poCreateDialog);
        } else {
        }
        this.poCreateDialog.open();
      },

      _handlePoCancelPress: function (oEvent) {
        var poCreateDialogModel = new JSONModel({
          Hide: "X",
          Varid: "",
          Vartxt: "",
        });

        this.setModel(poCreateDialogModel, "poCreateDialogModel");

        this.poCreateDialog.close();
      },


      _handlePoSavePress: function (oEvent) {
        var _d = this.getModel("poCreateDialogModel").getData();

        if(_d.Varid === ""){
          this._submitPoSave();        
        }else{
          this._editPrintOut();
        }

      },

      _editPrintOut : function (oEvent) {
        
        this.getOwnerComponent().getModel().callFunction("/editPoHeader", {
          method: "POST",
          urlParameters: {
            Varid: this.getModel("poCreateDialogModel").getData().Varid,
            Vartxt: this.getModel("poCreateDialogModel").getData().Vartxt,
            Hide: Fragment.byId("poCreateDialog","PoHide").getState() ? "X" : "",
            History : ""
          },
          success: $.proxy(function (oData, response) {
            jQuery.sap.delayedCall(500, this, function () {
              sap.ui.core.BusyIndicator.hide();
            });
            $.toast({
              heading: "Bilgi",
              text: "İşlem başarılı!",
              showHideTransition: "slide",
              position: "bottom-center",
              icon: "success",
            });

            if(this.byId("poList")){
              this.byId("poList").getBinding("items").refresh();
            }

            this.poCreateDialog.close();
          }, this),
        });
      
      },
      

      _submitPoSave: function (oEvent) {
        var _d = this.getModel("poCreateDialogModel").getData();

        var po_header = new Object();

        po_header.Varid = "";
        po_header.Vartxt = _d.Vartxt;
        po_header.Hide = _d.Hide;
        po_header.po_itemSet = [];

        if (this.exportData && this.exportData.length > 0) {
          for (var i = 0; i < this.exportData.length; i++) {
            if (!this.exportData[i].hasOwnProperty("content")) {
              if (
                this.exportData[i].chartInstance &&
                this.exportData[i].chartInstance != null
              ) {
                let _id = this.exportData[i].chartInstance.roots[0].id;
                po_header.po_itemSet.push({
                  PageNumber: i + "",
                  NodeId: _id,
                  Childlevels: "1", //this.exportData[i].childLevels ? this.exportData[i].childLevels + ""  : "",
                  Expandchildren: this.exportData[i].expandChildren,
                  Parentlevels: this.exportData[i].parentLevels
                    ? this.exportData[i].parentLevels + ""
                    : "",
                });
              } else {
                continue;
              }
            }else if(this.exportData[i].content === ""){
                          po_header.po_itemSet.push({
                            PageNumber: i + ""
                          });
            }else {
              po_header.po_itemSet.push({
                PageNumber: i + "",
                NodeId: this.exportData[i].nodeId,
                Childlevels: this.exportData[i].childLevels
                  ? this.exportData[i].childLevels + ""
                  : "",
                Expandchildren: this.exportData[i].expandChildren,
                Parentlevels: this.exportData[i].parentLevels
                  ? this.exportData[i].parentLevels + ""
                  : "",
              });
            }
          }
        }

        this.getOwnerComponent()
          .getModel()
          .create("/po_headerSet", po_header, {
            success: $.proxy(function (oData, response) {
              jQuery.sap.delayedCall(500, this, function () {
                sap.ui.core.BusyIndicator.hide();
              });

              $.toast({
                heading: "Bilgi",
                text: "İşlem başarılı!",
                showHideTransition: "slide",
                position: "bottom-center",
                icon: "success",
              });
            }, this),
          });
      },

      onPoListItemPress: function (oEvent) {
        var item = this.getModel().getProperty(
          oEvent.getSource().getBindingContextPath()
        );

        this.getModel().read("/po_itemSet", {
          filters: [new Filter("Varid", FilterOperator.EQ, item.Varid)],
          success: $.proxy(function (oData, response) {
            if (oData.results && oData.results.length > 0) {
              var pages = [];
              for (var i = 0; i < oData.results.length; i++) {
                if (
                  oData.results[i].NodeId === "" ||
                  oData.results[i].NodeId === "00000000"
                ) {
                  pages.push({
                    content: "",
                  });
                  continue;
                }

                pages.push({
                  childLevels: parseInt(oData.results[i].Childlevels),
                  expandChildren: oData.results[i].Expandchildren,
                  nodeId: oData.results[i].NodeId,
                  parentLevels: parseInt(oData.results[i].Parentlevels),
                });
              }

              this.chart.powerPointPreviewUI.show({
                pages: pages,
              });

              if (this.byId("poListDialog")) this.byId("poListDialog").close();


            }
          }, this),
        });

  
      },

      openPrintOuts: function () {
        var oView = this.getView();

        // create dialog lazily
        if (!this.byId("poListDialog")) {
          // load asynchronous XML fragment
          Fragment.load({
            id: oView.getId(),
            name: "hayat.hcm.orgchart.md.view.fragments.PoList",
            controller: this,
          }).then(function (oDialog) {
            // connect dialog to the root view of this component (models, lifecycle)
            oView.addDependent(oDialog);
            oDialog.open();
          });
        } else {
          this.byId("poListDialog").open();
        }
        // this._getDialog().open();
      },

      closePoListDialog: function () {
        this.byId("poListDialog").close();
      },

      openVariant: function () {
        var oView = this.getView();

        // create dialog lazily
        if (!this.byId("detailDetailVariant")) {
          // load asynchronous XML fragment
          Fragment.load({
            id: oView.getId(),
            name: "hayat.hcm.orgchart.md.view.fragments.DetailDetailVariant",
            controller: this,
          }).then(function (oDialog) {
            // connect dialog to the root view of this component (models, lifecycle)
            oView.addDependent(oDialog);
            oDialog.open();
          });
        } else {
          this.byId("detailDetailVariant").open();
        }
        // this._getDialog().open();
      },

      closeVariant: function () {
        this.byId("detailDetailVariant").close();
      },

      // _showDetail: function (_route) {
      //   var bReplace = !Device.system.phone;
      //   // set the layout property of FCL control to show two columns
      //   this.getModel("appView").setProperty("/layout", "ThreeColumnsMidExpanded");
      //   this.getRouter().navTo("detailDetail", {
      //   }, bReplace);
      // },

      _onUndoVariant: function (oEvent) {
        var array = this.array;
        if (array.length > 0) {
          var undoNode = array.pop();
          console.log(undoNode);
          var id = undoNode.draggedNodeId;
          var pid = undoNode.draggedNodePid;
          this.chart.updateNode({ id, pid });
        }
      },

      _onSaveVariant: function (oEvent) {
        if (!this._variant || this._variant === "") {
          $.toast({
            heading: "Uyarı",
            text: "Lütfen önce varyant seçin!",
            showHideTransition: "slide",
            position: "bottom-center",
            icon: "warning",
          });
          return;
        }

        if (this.array.length < 1) {
          $.toast({
            heading: "Uyarı",
            text: "Değişiklik bulunamadı!",
            showHideTransition: "slide",
            position: "bottom-center",
            icon: "warning",
          });
          return;
        }

        if (!this.oVarianSaveDialog) {
          this.oVarianSaveDialog = new Dialog({
            type: DialogType.Message,
            title: "Kaydet",
            content: new Text({ text: "Kaydetmek istiyor musunuz?" }),
            beginButton: new Button({
              type: ButtonType.Emphasized,
              text: "Evet",
              press: function () {
                this._submitVariant();
                this.oVarianSaveDialog.close();
              }.bind(this),
            }),
            endButton: new Button({
              text: "Hayır",
              press: function () {
                this.oVarianSaveDialog.close();
              }.bind(this),
            }),
          });
        }

        this.oVarianSaveDialog.open();
      },

      _submitVariant: function () {
        var sim_dheader = new Object();

        sim_dheader.dummy = "";
        sim_dheader.sim_ditemsSet = [];

        for (var i = 0; i < this.array.length; i++) {
          sim_dheader.sim_ditemsSet.push({
            Variant: this._variant,
            Objid: this.array[i].draggedNodeId,
            Pobjid: this.array[i].droppedNodeId,
            Otype: this.array[i].O,
            Atype: "CH",
          });
        }

        sap.ui.core.BusyIndicator.show(200);
        this.getOwnerComponent()
          .getModel()
          .create("/sim_dheaderSet", sim_dheader, {
            success: $.proxy(function (oData, response) {
              jQuery.sap.delayedCall(500, this, function () {
                sap.ui.core.BusyIndicator.hide();
              });

              $.toast({
                heading: "Bilgi",
                text: "İşlem başarılı!",
                showHideTransition: "slide",
                position: "bottom-center",
                icon: "success",
              });
            }, this),
          });
      },

      orgChartTemplates: function (OrgChart) {
        /*
      Icons
      */
        OrgChart.icon.link = function (w, h, c) {
          return (
            '<svg width="' +
            w +
            '" height="' +
            h +
            '" viewBox="0 0 512.092 512.092"  >' +
            '<path fill="' +
            c +
            '" d="M312.453,199.601c-6.066-6.102-12.792-11.511-20.053-16.128c-19.232-12.315-41.59-18.859-64.427-18.859 c-31.697-0.059-62.106,12.535-84.48,34.987L34.949,308.23c-22.336,22.379-34.89,52.7-34.91,84.318 c-0.042,65.98,53.41,119.501,119.39,119.543c31.648,0.11,62.029-12.424,84.395-34.816l89.6-89.6 c1.628-1.614,2.537-3.816,2.524-6.108c-0.027-4.713-3.87-8.511-8.583-8.484h-3.413c-18.72,0.066-37.273-3.529-54.613-10.581 c-3.195-1.315-6.867-0.573-9.301,1.877l-64.427,64.512c-20.006,20.006-52.442,20.006-72.448,0 c-20.006-20.006-20.006-52.442,0-72.448l108.971-108.885c19.99-19.965,52.373-19.965,72.363,0 c13.472,12.679,34.486,12.679,47.957,0c5.796-5.801,9.31-13.495,9.899-21.675C322.976,216.108,319.371,206.535,312.453,199.601z" />' +
            '<path fill="' +
            c +
            '" d="M477.061,34.993c-46.657-46.657-122.303-46.657-168.96,0l-89.515,89.429c-2.458,2.47-3.167,6.185-1.792,9.387 c1.359,3.211,4.535,5.272,8.021,5.205h3.157c18.698-0.034,37.221,3.589,54.528,10.667c3.195,1.315,6.867,0.573,9.301-1.877 l64.256-64.171c20.006-20.006,52.442-20.006,72.448,0c20.006,20.006,20.006,52.442,0,72.448l-80.043,79.957l-0.683,0.768 l-27.989,27.819c-19.99,19.965-52.373,19.965-72.363,0c-13.472-12.679-34.486-12.679-47.957,0 c-5.833,5.845-9.35,13.606-9.899,21.845c-0.624,9.775,2.981,19.348,9.899,26.283c9.877,9.919,21.433,18.008,34.133,23.893 c1.792,0.853,3.584,1.536,5.376,2.304c1.792,0.768,3.669,1.365,5.461,2.048c1.792,0.683,3.669,1.28,5.461,1.792l5.035,1.365 c3.413,0.853,6.827,1.536,10.325,2.133c4.214,0.626,8.458,1.025,12.715,1.195h5.973h0.512l5.12-0.597 c1.877-0.085,3.84-0.512,6.059-0.512h2.901l5.888-0.853l2.731-0.512l4.949-1.024h0.939c20.961-5.265,40.101-16.118,55.381-31.403 l108.629-108.629C523.718,157.296,523.718,81.65,477.061,34.993z" />' +
            "</svg>"
          );
        };
        /*
      Icons
      */

        OrgChart.templates.hiddenTemplate = Object.assign(
          {},
          OrgChart.templates.ana
        );
        OrgChart.templates.hiddenTemplate.size = [0, 0];
        OrgChart.templates.hiddenTemplate.plus = "";
        OrgChart.templates.hiddenTemplate.minus = "";
        OrgChart.templates.hiddenTemplate.node = "";
        OrgChart.templates.hiddenTemplate.link = "";
        OrgChart.templates.hiddenTemplate.img = "";
        OrgChart.templates.hiddenTemplate.field_0 = "";
        OrgChart.templates.hiddenTemplate.field_1 = "";
        OrgChart.templates.hiddenTemplate.field_2 = "";
        OrgChart.templates.hiddenTemplate.node = "";
        OrgChart.templates.hiddenTemplate.nodeMenuButton = "";

        OrgChart.templates.customAna = Object.assign(
          {},
          OrgChart.templates.ana
        );
        OrgChart.templates.customAna.defs =
          '<filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="cool-shadow"><feOffset dx="0" dy="4" in="SourceAlpha" result="shadowOffsetOuter1" /><feGaussianBlur stdDeviation="10" in="shadowOffsetOuter1" result="shadowBlurOuter1" /><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1" /><feMerge><feMergeNode in="shadowMatrixOuter1" /><feMergeNode in="SourceGraphic" /></feMerge></filter>';
        OrgChart.templates.customAna.size = [410, 190];

        OrgChart.templates.customAna.node =
          '<rect class="customAna outer" x="0" y="0" height="190" width="410" fill="#039BE5" stroke-width="1" stroke="#aeaeae" rx="7" ry="7"></rect>';

        OrgChart.templates.customAna.field_1 =
          '<text  style="font-size: 14px;" width="230" fill="#F57C00" x="110" y="70" text-overflow="multiline">{val}</text>';
        OrgChart.templates.customAna.field_2 =
          '<text style="font-size: 12px;" width="230" fill="#afafaf" x="110" y="85">{val}</text>';

        OrgChart.templates.customAna.nodeMenuButton =
          '<g style="cursor:pointer;" transform="matrix(1,0,0,1,375,170)" data-ctrl-n-menu-id="{id}">' +
          '<rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22">' +
          "</rect>" +
          '<line x1="0" y1="0" x2="0" y2="10" stroke-width="2" stroke="rgb(255, 202, 40)" />' +
          '<line x1="7" y1="0" x2="7" y2="10" stroke-width="2" stroke="rgb(255, 202, 40)" />' +
          '<line x1="14" y1="0" x2="14" y2="10" stroke-width="2" stroke="rgb(255, 202, 40)" />' +
          "</g>";

        /**
         * Custom Template cool
         */
        OrgChart.templates.cool = Object.assign({}, OrgChart.templates.ana);
        OrgChart.templates.cool.defs =
          '<filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="cool-shadow"><feOffset dx="0" dy="4" in="SourceAlpha" result="shadowOffsetOuter1" /><feGaussianBlur stdDeviation="10" in="shadowOffsetOuter1" result="shadowBlurOuter1" /><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1" /><feMerge><feMergeNode in="shadowMatrixOuter1" /><feMergeNode in="SourceGraphic" /></feMerge></filter>';

        OrgChart.templates.cool.size = [410, 190];
        OrgChart.templates.cool.node =
          '<rect class="cool outer" filter="url(#cool-shadow)"  x="0" y="0" height="190" width="410" fill="#ffffff" stroke-width="2" stroke="#eeeeee" rx="10" ry="10"></rect>' +
          '<rect class="cool" fill="#ffffff" x="100" y="10" width="300" height="100" rx="10" ry="10" filter="url(#cool-shadow)"></rect>' +
          '<rect class="cool" stroke="#eeeeee" stroke-width="1" x="10" y="120" width="120" fill="#ffffff" rx="10" ry="10" height="60"></rect>' +
          '<rect class="cool" stroke="#eeeeee" stroke-width="1" x="145" y="120" width="120" fill="#ffffff" rx="10" ry="10" height="60"></rect>' +
          '<rect class="cool" stroke="#eeeeee" stroke-width="1" x="280" y="120" width="120" fill="#ffffff" rx="10" ry="10" height="60"></rect>' +
          // '<rect class="cool" stroke="#eeeeee" stroke-width="1" x="310" y="120" width="90" fill="#ffffff" rx="10" ry="10" height="60"></rect>' +
          '<foreignobject class="node" x="15" y="132" width="60" height="60"><span class="icon-employee-approvals" style="font-family: SAP-icons;font-size:2rem;">&#xe0be;</span></i></foreignobject>' +
          '<foreignobject class="node" x="150" y="132" width="60" height="60"><span class="icon-personnel-view" style="font-family: SAP-icons;;font-size:2rem;">&#xe07b;</span></i></foreignobject>' +
          '<foreignobject class="node" x="285" y="132" width="60" height="60"><span class="icon-personnel-view" style="font-family: SAP-icons;;font-size:2rem;">&#xe0b4;</span></i></foreignobject>';
        // +
        // '<foreignobject class="node" x="315" y="132" width="60" height="60"><span class="icon-personnel-view" style="font-family: SAP-icons;;font-size:2rem;">&#xe036;</span></i></foreignobject>';

        OrgChart.templates.cool.img =
          '<clipPath id="{randId}"><rect  fill="#ffffff" stroke="#039BE5" stroke-width="5" x="10" y="10" rx="10" ry="10" width="80" height="100"></rect></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="10"  width="80" height="100"></image><rect fill="none" stroke="#F57C00" stroke-width="2" x="10" y="10" rx="10" ry="10" width="80" height="100"></rect>';

        //OrgChart.templates.cool.field_0 = '<text  style="font-size: 16px;" width="230" fill="#afafaf" x="110" y="30" text-overflow="multiline">{val}</text>';

        OrgChart.templates.cool.field_0 =
          '<foreignobject x="110" y="10" width="280" height="40"><p style="font-size:14px;color:gray;word-break: break-word;line-height:14px;margin:4px 0 0 0">{val}</p></foreignobject>';

        OrgChart.templates.cool.field_1 =
          '<text  style="font-size: 14px;" width="230" fill="#F57C00" x="110" y="70" text-overflow="multiline">{val}</text>';
        OrgChart.templates.cool.field_2 =
          '<text style="font-size: 12px;" width="230" fill="#afafaf" x="110" y="85">{val}</text>';

        OrgChart.templates.cool.svg =
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background-color:#F2F2F2;display:block;" width="{w}" height="{h}" viewBox="{viewBox}">{content}</svg>';

        // OrgChart.templates.cool.nodeMenuButton = '<g style="cursor:pointer;" transform="matrix(1,0,0,1,375,165)" control-node-menu-id="{id}">' +
        //   '<rect x="-4" y="0" fill="#000000" fill-opacity="0" width="22" height="22"></rect>' +
        //   '<circle cx="0" cy="0" r="2" fill="#000000"></circle><circle cx="7" cy="0" r="2" fill="#000000"></circle><circle cx="14" cy="0" r="2" fill="#000000"></circle></g>';

        OrgChart.templates.cool.nodeMenuButton =
          '<g style="cursor:pointer;" transform="matrix(1,0,0,1,375,170)" data-ctrl-n-menu-id="{id}">' +
          '<rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22">' +
          "</rect>" +
          '<line x1="0" y1="0" x2="0" y2="10" stroke-width="2" stroke="rgb(255, 202, 40)" />' +
          '<line x1="7" y1="0" x2="7" y2="10" stroke-width="2" stroke="rgb(255, 202, 40)" />' +
          '<line x1="14" y1="0" x2="14" y2="10" stroke-width="2" stroke="rgb(255, 202, 40)" />' +
          "</g>";

        OrgChart.templates.cool.node +=
          '<foreignobject class="exp node" style="visibility: hidden;" x="370" y="15" width="40" height="40"><span class="icon-home-share" style="font-family: SAP-icons;font-size:1.5rem;">&#xe0e7;</span></i></foreignobject>';

        //Copy cool template before adding point4,5
        OrgChart.templates.coolbf = Object.assign({}, OrgChart.templates.cool);

        OrgChart.templates.cool.point_4 =
          '<text style="font-size: 20px;" fill="#F57C00" x="80" y="160" text-anchor="middle">{val}</text>';
        OrgChart.templates.cool.point_5 =
          '<text style="font-size: 20px;" fill="#F57C00" x="180" y="160" >{val}</text>';
        OrgChart.templates.cool.point_6 =
          '<text style="font-size: 20px;" fill="#F57C00" x="330" y="160" >{val}</text>';
        OrgChart.templates.cool.point_7 =
          '<text style="font-size: 20px;" fill="#F57C00" x="380" y="160" >{val}</text>';

        /**
         * Custom Template
         */

        /**
         * Custom Template Bütçe&Fiili
         */

        OrgChart.templates.coolbf.node =
          '<rect class="cool outer" filter="url(#cool-shadow)"  x="0" y="0" height="190" width="410" fill="#ffffff" stroke-width="1" stroke="#eeeeee" rx="10" ry="10"></rect>' +
          '<rect class="cool" fill="#ffffff" x="100" y="10" width="300" height="100" rx="10" ry="10" filter="url(#cool-shadow)"></rect>' +
          '<rect class="cool" stroke="#eeeeee" stroke-width="1" x="10" y="120" width="90" fill="#ffffff" rx="10" ry="10" height="60"></rect>' +
          '<rect class="cool" stroke="#eeeeee" stroke-width="1" x="110" y="120" width="90" fill="#ffffff" rx="10" ry="10" height="60"></rect>' +
          '<rect class="cool" stroke="#eeeeee" stroke-width="1" x="210" y="120" width="90" fill="#ffffff" rx="10" ry="10" height="60"></rect>' +
          '<foreignobject class="node" x="30" y="130" width="60" height="60"><span style="font-size:16px;color:#afafaf">RevBP</span></i></foreignobject>' +
          '<foreignobject class="node" x="140" y="130" width="60" height="60"><span style="font-size:16px;color:#afafaf">Fiili</span></i></foreignobject>' +
          '<foreignobject class="node" x="240" y="130" width="60" height="60"><span style="font-size:16px;color:#afafaf">BK</span></i></foreignobject>';

        OrgChart.templates.coolbf.point_1 =
          '<text style="font-size: 16px;" fill="#F57C00" x="30" y="165" >{val}</text>';
        OrgChart.templates.coolbf.point_2 =
          '<text style="font-size: 16px;" fill="#F57C00" x="140" y="165" >{val}</text>';
        OrgChart.templates.coolbf.point_3 =
          '<text style="font-size: 16px;" fill="#F57C00" x="240" y="165" >{val}</text>';

        /**
         * Custom Template
         */

        /**
         * Custom Olivia Ula Template
         */

        OrgChart.templates.olivia.defs = `<style>
                    #olivia_gradient {
                        --color-stop-1: #ffffff;
                        --color-stop-2: #eeeeee;
                        --opacity-stop: 1;
                    }
                    .olivia-f0 {
                        font-size: 8px;
                        fill: #757575;
                        font-weight : bold;
                        word-break: break-word;
                    }
                    .olivia-f1 {
                        font-size: 10px;
                        fill: #757575;
                        font-weight : bold;
                    }
                    .olivia-f2 {
                        font-size: 9px;
                        fill: #757575;
                        font-weight : bold;
                        word-break: break-word;
                    }
                    .boc-dark .olivia-f0, .boc-dark .olivia-f1 {
                        fill: #aeaeae;
                    }
                    .boc-dark #olivia_gradient {
                        --color-stop-1: #646464;
                        --color-stop-2: #363636;
                        --opacity-stop: 1;
                    }
                </style>
                <linearGradient id="olivia_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="var(--color-stop-1)" stop-opacity="var(--opacity-stop)" />
                    <stop offset="100%" stop-color="var(--color-stop-2)" stop-opacity="var(--opacity-stop)" />
                </linearGradient>`;

        OrgChart.templates.olivia.field_0 =
          '<foreignobject x="30" y="20" width="200" height="21"><p style="font-size:10px;color:gray;word-break: break-word;line-height:10px;margin:0 0 0 0;font-weight : bold;">{val}</p></foreignobject>';
        // `<text ${OrgChart.attr.width}="200" class="olivia-f0" x="30" y="30">{val}</text>`;
        OrgChart.templates.olivia.field_1 =
          '<foreignobject x="100" y="56" width="135" height="22"><p style="font-size:9px;color:gray;word-break: break-word;line-height:9px;margin:0 0 0 0;font-weight : bold;">{val}</p></foreignobject>';
        // `<text ${OrgChart.attr.width}="135" class="olivia-f1" x="100" y="56">{val}</text>`;
        OrgChart.templates.olivia.field_2 =
          '<foreignobject x="100" y="80" width="135" height="22"><p style="font-size:8px;color:gray;word-break: break-word;line-height:8px;margin:0 0 0 0;">{val}</p></foreignobject>';
        // `<text ${OrgChart.attr.width}="135" class="olivia-f2" x="100" y="78">{val}</text>`;

        OrgChart.templates.olivia.node = `<rect fill="url(#olivia_gradient)" x="0" y="0" height="{h}" width="{w}" stroke-width="1" stroke="#aeaeae" rx="7" ry="7"></rect>`;

        OrgChart.templates.olivia.img_0 = `<clipPath id="{randId}" class="zolivia"><circle cx="50" cy="70" r="30"></circle></clipPath>
        <image class="zolivia" preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="20" y="40" width="60" height="60"></image>`;

        //ULA

        OrgChart.templates.ula.node = `<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect>
      <line class="zulaLine" x1="0" y1="0" x2="250" y2="0" stroke-width="2" stroke="#039BE5"></line>`;

        OrgChart.templates.ula.field_0 =
          '<foreignobject x="80" y="20" width="145" height="30"><p style="font-size:10px;color:#039BE5;word-break: break-word;line-height:10px;margin:0 0 0 0;font-weight: bold;">{val}</p></foreignobject>';
        //`<text data-width="145" style="font-size: 12px;" fill="#039BE5" x="80" y="50">{val}</text>`;
        OrgChart.templates.ula.field_1 =
          '<foreignobject x="80" y="52" width="145" height="24"><p style="font-size:10px;color:#757575;word-break: break-word;line-height:10px;margin:0 0 0 0;font-weight: bold;">{val}</p></foreignobject>';
        // `<text data-width="145" data-text-overflow="multiline" style="font-size: 10px; font-weight: bold;" fill="#757575" x="80" y="68">{val}</text>`;
        OrgChart.templates.ula.field_2 = `<text data-width="145" data-text-overflow="multiline" style="font-size: 8px;font-weight: bold;" fill="#757575" x="80" y="82">{val}</text>`;

        OrgChart.templates.ula.img_0 = `<clipPath id="{randId}" class="zula"><circle cx="40" cy="60" r="30"></circle></clipPath>
          <image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="30" width="60" height="60" class="zula"></image>`;

        //ULA

        /**
         * Custom Olivia Ula Template
         */

        /**
         * Custom Ana Template
         */

        OrgChart.templates.ana.node =
          '<rect class="zana outer" x="0" y="0" height="{h}" width="{w}" fill="#039BE5" stroke-width="1" stroke="#aeaeae" rx="5" ry="5"></rect>';

        OrgChart.templates.ana.field_0 =
          '<text width="260" style="font-size: 14px;" fill="#ffffff" x="150" y="95" text-anchor="middle">{val}</text>';
        OrgChart.templates.ana.field_1 =
          '<text width="160" text-overflow="multiline" style="font-size: 14px;" fill="#ffffff" x="280" y="30" text-anchor="end">{val}</text>';
        OrgChart.templates.ana.field_2 =
          '<text width="160" text-overflow="multiline" style="font-size: 8px;" fill="#ffffff" x="280" y="62" text-anchor="end">{val}</text>';
        // OrgChart.templates.ana.field_3 =
        // 	'<text class="field_3" style="font-size: 14px;" fill="#ffffff" x="125" y="90" text-anchor="middle">{val}</text>';

        OrgChart.templates.ana.plus =
          '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>' +
          '<text text-anchor="middle" style="font-size: 18px;cursor:pointer;" fill="#757575" x="15" y="22">{collapsed-children-count}</text>';

        OrgChart.templates.ana.nodeMenuButton =
          '<g style="cursor:pointer;" transform="matrix(1,0,0,1,275,105)" data-ctrl-n-menu-id="{id}">' +
          '<rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22">' +
          "</rect>" +
          '<line x1="0" y1="0" x2="0" y2="10" stroke-width="2" stroke="rgb(255, 202, 40)" />' +
          '<line x1="7" y1="0" x2="7" y2="10" stroke-width="2" stroke="rgb(255, 202, 40)" />' +
          '<line x1="14" y1="0" x2="14" y2="10" stroke-width="2" stroke="rgb(255, 202, 40)" />' +
          "</g>";

        // '<g style="cursor:pointer;" transform="matrix(1,0,0,1,275,105)" control-node-menu-id="{id}">' +
        //   '<rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect>' +
        //   '<circle cx="0" cy="0" r="2" fill="#ffffff"></circle><circle cx="7" cy="0" r="2" fill="#ffffff"></circle><circle cx="14" cy="0" r="2" fill="#ffffff"></circle></g>';

        OrgChart.templates.ana.size = [300, 120];

        OrgChart.templates.ana.node +=
          '<foreignobject class="exp node" style="visibility: hidden;" x="100" y="10" width="40" height="40"><span class="icon-home-share" style="font-family: SAP-icons;font-size:1.5rem;">&#xe0e7;</span></i></foreignobject>';

        /**
         * Custom Ana Template
         */

        return OrgChart;
      },

      getNodeMenu: function () {
        var _menu = {
          details: { text: "Detay" },
          edit: { text: "Düzenle" },
          // add: {text:"Add"},
          // remove: {text:"Remove"},
          pdf: {
            text: "Export PDF (Sadece Görünenler)",
            icon: OrgChart.icon.pdf(24, 24, "#008000"),
            onClick: $.proxy(function (nodeId) {
              this.exportflag = true;
              var node = this.chart.get(nodeId);
              this.chart.exportPDF({
                filename: node.id + "_export.pdf",
                expandChildren: false,
                nodeId: nodeId,
              });
            }, this),
          },
          pdfExapnd: {
            icon: OrgChart.icon.pdf(24, 24, "#ff8216"),
            text: "Export PDF",
            onClick: $.proxy(function (nodeId) {
              this.exportflag = true;
              var node = this.chart.get(nodeId);
              this.chart.exportPDF({
                filename: node.id + "_export.pdf",
                expandChildren: true,
                nodeId: nodeId,
              });
            }, this),
          },
          png: {
            icon: OrgChart.icon.png(24, 24, "#008000"),
            text: "Export PNG  (Sadece Görünenler)",
            onClick: $.proxy(function (nodeId) {
              this.exportflag = true;
              var node = this.chart.get(nodeId);
              this.chart.exportPNG({
                filename: node.id + "_export.png",
                expandChildren: false,
                nodeId: nodeId,
              });
            }, this),
          },
          pngExapnd: {
            icon: OrgChart.icon.png(24, 24, "#ff8216"),
            text: "Export PNG",
            onClick: $.proxy(function (nodeId) {
              this.exportflag = true;
              var node = this.chart.get(nodeId);
              this.chart.exportPDF({
                filename: node.id + "_export.png",
                expandChildren: true,
                nodeId: nodeId,
              });
            }, this),
          },
          setAsRoot: {
            icon: OrgChart.icon.link(24, 24, "#ff8216"),
            text: "Kök Yapı Olarak Seç",
            onClick: $.proxy(function (nodeId) {
              this.exportflag = false;
              var node = this.chart.get(nodeId);

              this.chart.config.roots = [node.id];
              this.chart.draw();

              this.chart.expand(
                node.id,
                this.chart.getNode(nodeId).childrenIds,
                $.proxy(function () {
                  this.chart.fit();
                }, this)
              );

              //this.chart.center(node.id);

              //this.chart.changeRoots(node.id, [node.pid], false);
            }, this),
          },
        };

        if (this._type === "3") {
          delete _menu.details;
        } else {
          delete _menu.edit;
        }

        return _menu;
      },

      getEditForm: function () {
        var _elements = [
          { type: "textbox", label: "Kod", binding: "id" },
          {
            type: "select",
            options: [
              { value: "O", text: "Organizasyon Birimi" },
              { value: "S", text: "Pozisyon" },
              { value: "P", text: "Kişi" },
            ],
            label: "Tip",
            binding: "O",
          },
          {
            type: "textbox",
            label: "Metin",
            binding: "S",
            vlidators: { required: "Is required" },
          },
          { type: "textbox", label: "Pozisyon Kodu", binding: "P" },
          { type: "textbox", label: "Pozisyon Metni", binding: "Pt" },
        ];

        if (this._type === "3") {
          _elements = [
            { type: "textbox", label: "Kod", binding: "id" },
            {
              type: "select",
              options: [
                { value: "O", text: "Organizasyon Birimi" },
                { value: "S", text: "Pozisyon" },
                { value: "P", text: "Kişi" },
              ],
              label: "Tip",
              binding: "O",
            },
            {
              type: "textbox",
              label: "Metin",
              binding: "S",
              vlidators: { required: "Is required" },
            },
          ];
        } else {
        }

        var _form = {
          addMore: null,
          generateElementsFromFields: false,
          photoBinding: "Ph",
          elements: _elements,
          buttons: {
            edit: {
              icon: OrgChart.icon.edit(24, 24, "#fff"),
              text: "Düzenle",
              hideIfEditMode: false,
              hideIfDetailsMode: true,
            },
            share: null,
            pdf: null,
            remove: null,
          },
        };

        return _form;
      },

      dateControl: function (oEvent) {
        this.dateControlInt = setInterval(
          this.dateControlInterval.bind(this),
          30000
        );
      },
      dateControlInterval: function () {
        var oResourceBundle = this.getResourceBundle();
        var _d = new Date(null);
        if (this._date !== "") {
          _d = this._date;
        }

        var _data = {
          IDatum: _d,
        };

        this.getOwnerComponent()
          .getModel()
          .callFunction("/checkDateData", {
            urlParameters: _data,
            success: $.proxy(function (oData, oResponse) {
              if (oData.checkDateData && oData.checkDateData.Type === "S") {
                clearInterval(this.dateControlInt);

                this.byId("graphDate").setBusy(false);

                var dialog = new Dialog({
                  title: oResourceBundle.getText("dateDataTitle"), //'Tarih Verisi',
                  type: "Message",
                  content: new Text({
                    text: oResourceBundle.getText("dateDateResult", [
                      formatter.formatDate(this._date),
                    ]),
                    //formatter.formatDate(this._date) + ' için veriler hazır. "Görüntüle" tuşuna basarak görüntüleyebilir ya da "Kapat" tuşu ile daha sonra görüntülemek üzere pencereyi kapatabilirsiniz.'
                  }),
                  beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: oResourceBundle.getText("display"), //'Görüntüle',
                    press: function () {
                      this._setGraph();
                      dialog.close();
                    }.bind(this),
                  }),
                  endButton: new Button({
                    text: oResourceBundle.getText("close"), //'Kapat',
                    press: function () {
                      dialog.close();
                    }.bind(this),
                  }),
                  afterClose: function () {
                    dialog.destroy();
                  },
                });

                dialog.open();
              }
            }, this),
          });
      },

      onLegendHeader: function (oEvent) {
        $("#legend-content").fadeToggle();
      },
      
      showhideFooter: function (_action,_for) {
        if (_for === "sim") {
          this.byId("openPoButton").setVisible(!_action);
          this.byId("closeFooterButton").setVisible(!_action);
          this.byId("openVariantButton").setVisible(_action);
          this.byId("saveVariantButton").setVisible(_action);
        } else if(_for === "po") {
          this.byId("openPoButton").setVisible(_action);
          this.byId("closeFooterButton").setVisible(_action);
          this.byId("openVariantButton").setVisible(!_action);
          this.byId("saveVariantButton").setVisible(!_action);
          this.chart.config.template = 'ana';
        }

        this.byId("detailPage").setShowFooter(_action); 

      },

      onCloseFooter: function (oEvent) {
         this.byId("detailPage").setShowFooter(false); 
      }
      /***
       *
       *
       *
       * Custom Methods
       */
    });
  }
);
