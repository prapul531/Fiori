sap.ui.define(function() {
	"use strict";

	var Formatter = {

		status :  function (sStatus) {
				if (sStatus === "Available") {
					return "Success";
				} else if (sStatus === "Out of Stock") {
					return "Warning";
				}
					else if (sStatus === "Unavailable") {
					return "Warning";
				
				} else if (sStatus === "Discontinued"){
					return "Error";
				} else {
					return "None";
				}
		}
	};

	return Formatter;

});