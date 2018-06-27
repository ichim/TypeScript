/// <reference path="@types/arcgis-js-api/index.d.ts" />
define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"], function (require, exports, Map, MapView, FeatureLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_div_editare = "";
    var Esriro;
    (function (Esriro) {
        var ViewModel;
        (function (ViewModel_1) {
            var ViewModel = /** @class */ (function () {
                function ViewModel(settings) {
                    this.settings = settings;
                    this.map = undefined;
                    this.mapView = undefined;
                }
                ViewModel.prototype.wrap = function () {
                    var _this = this;
                    this.map = new Map({
                        basemap: this.settings.map.basemap
                    });
                    this.mapView = new MapView({
                        map: this.map,
                        container: this.settings.mapView.container,
                        center: this.settings.mapView.center,
                        zoom: this.settings.mapView.zoom
                    });
                    this.mapView.on("click", function (event) {
                        _this.mapView.hitTest(event).then(function (response) {
                            if (response.results.length > 0 && response.results[0].graphic) {
                                var feature = response.results[0].graphic;
                                _this.settings.helper.fields(function (fields) {
                                    console.log(fields);
                                    view_app.creteEditForm(fields, feature);
                                });
                                console.log(feature);
                            }
                        });
                    });
                };
                ViewModel.prototype.add = function (layer) {
                    this.map.add(layer);
                };
                ViewModel.prototype.creteEditForm = function (fields, feature) {
                    console.log('feature', feature['attributes']);
                    var id = "div_editare_" + Math.round(Math.random() * 1000).toString();
                    ;
                    var bara = document.createElement('div');
                    bara.style.height = "20px";
                    bara.style.backgroundColor = "#F4F6F6";
                    var div = document.createElement("div");
                    div.id = id;
                    div.style.height = "200px";
                    div.style.width = "260px";
                    div.style.backgroundColor = "white";
                    div.appendChild(bara);
                    var table = document.createElement("table");
                    div.style.overflowY = 'auto';
                    var attribute_helper = new helper.AttributeHelper(table, "200px");
                    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
                        var field = fields_1[_i];
                        var valoare = feature['attributes'][field.name];
                        console.log(valoare);
                        attribute_helper.add(field, valoare);
                    }
                    div.appendChild(table);
                    this.mapView.ui.remove(id_div_editare);
                    this.mapView.ui.add(div, "top-right");
                    id_div_editare = id;
                    console.log(table.style.width);
                    return id;
                };
                return ViewModel;
            }());
            ViewModel_1.ViewModel = ViewModel;
        })(ViewModel = Esriro.ViewModel || (Esriro.ViewModel = {}));
    })(Esriro || (Esriro = {}));
    (function (Esriro) {
        var Helper;
        (function (Helper_1) {
            var Helper = /** @class */ (function () {
                function Helper(feature_layer) {
                    this.feature_layer = feature_layer;
                }
                Helper.prototype.fields = function (callback) {
                    var _this = this;
                    this.feature_layer.load().then(function (layer) {
                        var fields = [];
                        fields = _this.feature_layer.fields;
                        callback(fields);
                    });
                };
                return Helper;
            }());
            Helper_1.Helper = Helper;
            var AttributeHelper = /** @class */ (function () {
                function AttributeHelper(table, width) {
                    this.table = table;
                    this.width = width;
                }
                AttributeHelper.prototype.add = function (field, attributeValue) {
                    var color = field.editable ? "black" : "gray";
                    var width = Number(this.width.replace(/[^\d\.\-]/g, '')) / 2;
                    var row = this.table.insertRow(0);
                    var header = row.insertCell(0);
                    header.style.width = width.toString() + "px";
                    header.innerHTML = field.alias;
                    header.style.color = color;
                    var cellValue = row.insertCell(1);
                    var value = document.createElement("input");
                    value.style.width = width.toString() + "px";
                    if (attributeValue !== null) {
                        value.value = attributeValue.toString();
                    }
                    cellValue.appendChild(value);
                    console.log("Adaugat", width);
                };
                return AttributeHelper;
            }());
            Helper_1.AttributeHelper = AttributeHelper;
        })(Helper = Esriro.Helper || (Esriro.Helper = {}));
    })(Esriro || (Esriro = {}));
    var view_model = Esriro.ViewModel;
    var helper = Esriro.Helper;
    var featureLayer = new FeatureLayer({
        url: "https://services6.arcgis.com/Uwg97gPMK3qqaMen/arcgis/rest/services/HSSEInicdents/FeatureServer/0",
        outFields: ["*"]
    });
    var view_model_settings = {
        map: { basemap: "streets" },
        mapView: {
            center: [26.52, 45.68],
            zoom: 8,
            container: "viewDiv"
        },
        helper: new helper.Helper(featureLayer)
    };
    var view_app = new view_model.ViewModel(view_model_settings);
    view_app.wrap();
    view_app.add(featureLayer);
});
//# sourceMappingURL=app.js.map