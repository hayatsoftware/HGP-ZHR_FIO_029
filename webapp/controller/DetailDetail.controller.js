// sap.ui.define([
// 	"./BaseController",
// 	"sap/ui/model/json/JSONModel",
// 	"../model/formatter",
// 	"sap/m/library",
// 	"sap/ui/model/Filter",
// 	"sap/ui/model/Sorter",
// 	"sap/ui/model/FilterOperator",
// 	'sap/ui/core/util/Export',
// 	'sap/ui/core/util/ExportTypeCSV',
// 	'sap/ui/export/library',
// 	'sap/ui/export/Spreadsheet',
// ], function (BaseController, JSONModel, formatter, mobileLibrary,Filter,Sorter,FilterOperator,Export,ExportTypeCSV,exportLibrary,Spreadsheet) {
// 	"use strict";

// 	// shortcut for sap.m.URLHelper
// 	var URLHelper = mobileLibrary.URLHelper;
// 	var EdmType = exportLibrary.EdmType;
// 	return BaseController.extend("hayat.hcm.orgchart.md.controller.DetailDetail", {

// 		formatter: formatter,

// 		/* =========================================================== */
// 		/* lifecycle methods                                           */
// 		/* =========================================================== */

// 		onInit: function () {
// 			// Model used to manipulate control states. The chosen values make sure,
// 			// detail page is busy indication immediately so there is no break in
// 			// between the busy indication for loading the view's meta data
// 			var oViewModel = new JSONModel({
// 				busy: false,
// 				delay: 0
// 			});


// 			var variantDialogModel = new JSONModel({
// 				"Hide" : "X",
// 				"Type" : "",
// 				"Variant" : "",
// 				"Varname" : "Test"
// 			});

// 			this.setModel(variantDialogModel,"variantDialogModel");

// 			this.getRouter().getRoute("detailDetail").attachPatternMatched(this._onObjectMatched, this);
// 			this.bus = sap.ui.getCore().getEventBus();
// 		},

// 		/* =========================================================== */
// 		/* begin: internal methods                                     */
// 		/* =========================================================== */

// 		/**
// 		 * Binds the view to the object path and expands the aggregated line items.
// 		 * @function
// 		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
// 		 * @private
// 		 */
// 		_onObjectMatched: function (oEvent) {

// 			this.getModel("appView").setProperty("/layout", "ThreeColumnsMidExpanded");



// 		},

// 		onListItemPress : function(oEvent){
// 			var item = this.getModel().getProperty(oEvent.getSource().getBindingContextPath())
// 			this.bus.publish("DetailDetail", "refreshDetailPage",item);
// 		},

		
// 		/**
// 		 * Set the full screen mode to false and navigate to master page
// 		 */
// 		 onCloseDetailPress: function () {
// 			this.getModel("appView").setProperty("/actionButtonsInfo/endColumn/fullScreen", false);
// 			this.getRouter().navTo("object", {
// 				objectId: "1"
// 			});
// 		},

// 		/**
// 		 * Toggle between full and non full screen mode.
// 		 */
// 		toggleFullScreen: function () {
// 			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/endColumn/fullScreen");
// 			this.getModel("appView").setProperty("/actionButtonsInfo/endColumn/fullScreen", !bFullScreen);
// 			if (!bFullScreen) {
// 				// store current layout and go full screen
// 				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
// 				this.getModel("appView").setProperty("/layout", "EndColumnFullScreen");
// 			} else {
// 				// reset to previous layout
// 				this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
// 			}
// 		},

// 		/**
// 		 * Custom methods.
// 		 */


// 		 _onAddVariant: function (oEvent) {
// 			var variantDialogModel = new JSONModel({
// 				"Hide" : "",
// 				"Type" : "CR",
// 				"Variant" : "",
// 				"Varname" : ""
// 			});

// 			this.setModel(variantDialogModel,"variantDialogModel");

// 			this.openVarintDialog(); 
// 		},


// 		openVarintDialog : function(oEvent){
// 			if (!this.variantDialog) {
// 				this.variantDialog = sap.ui.xmlfragment("variantDialog", "hayat.hcm.orgchart.md.view.fragments.VariantDialog", this);
// 				this.getView().addDependent(this.variantDialog);
// 			}else{
// 			}
// 			this.variantDialog.open();
// 		},

// 		_handleVariantSavePress : function(oEvent){

// 			var _d = this.getModel("variantDialogModel").getData();

// 			this.getModel().callFunction("/addVariant", {
// 				method: "POST",
// 				urlParameters: {
// 					Hide : _d.Hide,
// 					Type : _d.Type,
// 					Variant : _d.Variant,
// 					Varname : _d.Varname
// 				},
// 				success: $.proxy(function (oData, oResponse) {
// 					var txt = "İşlem başarılı!";
// 					if (oData.addVariant) {
// 						if(oData.addVariant.Message !== ""){
// 							txt = oData.addVariant.Message;
// 						}
// 						if (oData.addVariant.Type === 'E') {
// 							$.toast({
// 								heading: 'Hata',
// 								text: txt,
// 								showHideTransition: 'slide',
// 								position: 'bottom-center',
// 								icon: 'error'
// 							});

// 						} else {
// 							$.toast({
// 								heading: 'Bilgi',
// 								text: txt,
// 								showHideTransition: 'slide',
// 								position: 'bottom-center',
// 								icon: 'success'
// 							});
// 						}
// 						this.variantDialog.close();
// 					} else {
// 						$.toast({
// 							heading: 'Hata',
// 							text: "Bir hata oluştu, lütfen daha sonra tekrar deneyin!",
// 							showHideTransition: 'slide',
// 							position: 'bottom-center',
// 							icon: 'error'
// 						});
// 						this.variantDialog.close();
// 					}
					
// 					this.byId("variantList").getBinding("items").filter();

					
// 					this.bus.publish("DetailDetail", "refreshDetailPage",{"Variant":oData.addVariant.MessageV4});
					
// 				}, this)

// 			});

// 		},

// 		_handleVariantCancelPress: function (oEvent) {

// 			var variantDialogModel = new JSONModel({
// 				"Hide" : "",
// 				"Type" : "",
// 				"Variant" : "",
// 				"Varname" : ""
// 			});

// 			this.setModel(variantDialogModel,"variantDialogModel");

// 			this.variantDialog.close();
// 		},

// 		handleDetailPress : function(oEvent){
// 			var _item = this.getModel().getProperty(oEvent.getSource().getBindingContextPath());
// 			var variantDialogModel = new JSONModel({
// 				"Hide" : _item.Hide,
// 				"Type" : "CH",
// 				"Variant" : _item.Variant,
// 				"Varname" : _item.Varname
// 			});

// 			this.setModel(variantDialogModel,"variantDialogModel");

// 			this.openVarintDialog();
// 		}

// 	});

// });
