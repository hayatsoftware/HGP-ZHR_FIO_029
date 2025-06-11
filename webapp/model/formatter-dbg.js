sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		intParser : function(sValue){
			if (!sValue) {
				return 1;
			}	
			
			return parseInt(sValue);
		},
		 
		 
		currencyValue: function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},
		floatValue: function (sValue) {
			if (!sValue) {
				return 0;
			}

			return parseFloat(sValue);
		},
		indicatorState: function (sValue) {

			if (sValue >= 33 && sValue < 66) {
				return "Warning";
			} else if (sValue >= 66) {
				return "Success";
			}
			return "Error";
		},
		
		parentchildVis : function(sValue){
			if (sValue && sValue === '02') {
				return true;
			}else if (sValue && sValue === '01') {
				return false;
			}

			return false;
			
		},
		
		radialState: function (sValue) {

			if (sValue < 33) {
				return "Error";
			} else if (sValue >= 33 && sValue < 66) {
				return "Critical";
			} else if (sValue >= 66) {
				return "Good";
			}
			return "Neutral";
		},
		scoreState: function (sValue) {

			if (sValue === "E") {
				return "Error";
			} else if (sValue === "W") {
				return "Critical";
			} else if (sValue === "S") {
				return "Good";
			}else if (sValue === "N") {
				return "Neutral";
			}
			return "Neutral";
		},

		abapxtobool: function (sValue) {

			if (sValue && sValue === 'X') {

				return true;
			}

			return false;

		},	
		

		evaluateNumber: function (sValue,sVis) {

			if (sValue && sVis && sVis === 'X') {

				return sValue;
			}

			return "";

		},	
		evaluateIcon: function (sValue) {

			if (sValue && sValue === 'X') {

				return "";
			}

			return "sap-icon://hide";

		},	
		evaluateState: function (sValue) {

			if (sValue && sValue === 'X') {

				return "Success";
			}

			return "Warning";

		},	
		
		evaluateText: function (sValue) {

			if (sValue && sValue === 'X') {

				return "Tamamlandı";
			}else if(sValue && sValue === 'Y') {

				return "Geçici Değerlendirme Yapıldı";
			}

			return "";

		},	

		abapxtoboolKR: function (sObj,sAttr) {
			
			if(!sObj || sObj === null){
				return false;
			}
			
			var _o = sObj;
			
			if(sObj && sObj.Objec){
				_o = sObj.Objec;
			}
			
			var _bid = '03';
			var _bset = 'box03Set';
			
			if(this.boxXXSet && this.boxXXSet !== ''){
				_bset = this.boxXXSet;
			}
			if(this.boxId && this.boxId !== ''){
				_bid = this.boxId;
			}
			
			var _sPath = this.getOwnerComponent().getModel().createKey(_bset, {
					Boxid: _bid,
					Objec : _o
				});
			
			var _obj = this.getOwnerComponent().getModel().getProperty("/"+_sPath);
			
			if (_obj[sAttr] && _obj[sAttr] === 'X') {

				return true;
			}

			return false;

		},
		
		formatTime: function (sValue) {
			if (sValue) {

				return moment(sValue.ms).format("HH:mm");

			}
			return null;
		},

		cardStatusText: function (sValue) {
			if (sValue && sValue === 'X') {

				return "Onaylandı";

			}
			return "Onay Bekliyor";
		},
		cardStatusType: function (sValue) {
			if (sValue && sValue === 'X') {

				return "Accept";

			}
			return "Ghost";
		},

		cardStatusEnabled: function (sValue) {

			if (sValue && sValue === 'X') {

				return false;
			}

			return true;

		},

		cardStatusVisible: function (sValue) {

			if (sValue && sValue === 'Y') {

				return false;
			}

			return true;

		},

		numberUnitFloat: function (sValue) {
			if (!sValue) {
				return 0;
			}

			jQuery.sap.require("sap.ui.core.format.NumberFormat");
			try {
				sValue = sValue.replace(/([0-9]+(\.[1-9]+)?)(\.?0+$)/, "$1");
			} catch (e) {

			}
			var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 6,
				minFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});
			return numberFormat.format(sValue);
			//		return parseFloat(sValue, 10);
		},
		displayNumberUnitFloat: function (sValue) {
			if (!sValue) {
				return 0;
			}

			jQuery.sap.require("sap.ui.core.format.NumberFormat");
			try {
				sValue = sValue.replace(/(?:(\.\d*?[1-9]+)|\.)0*$/gm, "$1");
			} catch (e) {

			}
			var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 6,
				minFractionDigits: 1,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});
			return numberFormat.format(sValue);
			//		return parseFloat(sValue, 10);
		},
		formatPeriod: function (sValue) {

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "MMMM YYYY"
            });
            
			return dateFormat.format(sValue);

		},

		formatDate: function (sValue) {
			
			if(!sValue){
				return "";
			}

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd.MM.yyyy"
            });
            
			return dateFormat.format(sValue);

		},

		addButtonVis:function(sValue){
			if(sValue && sValue === 'KND'){
				return true;
			}
			
			return false;
		}

	};
});