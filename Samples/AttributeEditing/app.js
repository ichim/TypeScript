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
                    this.map = new Map({
                        basemap: this.settings.map.basemap
                    });
                    this.mapView = new MapView({
                        map: this.map,
                        container: this.settings.mapView.container,
                        center: this.settings.mapView.center,
                        zoom: this.settings.mapView.zoom
                    });
                };
                ViewModel.prototype.add = function (layer) {
                    this.map.add(layer);
                };
                ViewModel.prototype.get = function (type) {
                    switch (type) {
                        case "map":
                            return this.map;
                            break;
                        case "mapView":
                            return this.mapView;
                            break;
                    }
                };
                return ViewModel;
            }());
            ViewModel_1.ViewModel = ViewModel;
        })(ViewModel = Esriro.ViewModel || (Esriro.ViewModel = {}));
    })(Esriro || (Esriro = {}));
    (function (Esriro) {
        var AttributesModel;
        (function (AttributesModel_1) {
            var AttributesModel = /** @class */ (function () {
                function AttributesModel(settings) {
                    this.settings = settings;
                    this.map = undefined;
                    this.mapView = undefined;
                }
                AttributesModel.prototype.creteEditForm = function (fields, feature) {
                    /*Creaza form-ul in care se vor afisa datele atribut si cu care se vor modifica*/
                    console.log("~cEF~", feature);
                    var id = "div_editare_" + Math.round(Math.random() * 1000).toString();
                    ;
                    var parinte = document.createElement("div");
                    parinte.style.height = "200px";
                    parinte.style.width = "320px";
                    parinte.id = id;
                    var bara1 = document.createElement('div');
                    bara1.style.height = "20px";
                    bara1.style.backgroundColor = "#73C8C7";
                    var labelOid = document.createElement("label");
                    labelOid.innerHTML = feature['layer']['objectIdField'] + ": " + feature['attributes'][feature['layer']['objectIdField']].toString();
                    bara1.appendChild(labelOid);
                    var bara2 = document.createElement('div');
                    bara2.style.height = "22px";
                    bara2.style.backgroundColor = "#73C8C7";
                    bara2.style.textAlign = 'right';
                    var applyButton = document.createElement("button");
                    applyButton.innerHTML = "OK";
                    bara2.appendChild(applyButton);
                    var div = document.createElement("div");
                    div.style.height = "200px";
                    div.style.width = "320px";
                    div.style.backgroundColor = "white";
                    parinte.appendChild(bara1);
                    parinte.appendChild(div);
                    parinte.appendChild(bara2);
                    var table = document.createElement("table");
                    div.style.overflowY = 'auto';
                    var attribute_helper = new helper.AttributeHelper(table, "280px");
                    var me = this;
                    applyButton.onclick = function () {
                        attribute_helper.change_attributes(attribute_helper.get('data_update'), feature);
                        me.mapView.ui.remove(id_div_editare);
                    };
                    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
                        var field = fields_1[_i];
                        var valoare = feature['attributes'][field.name];
                        attribute_helper.add(field, valoare);
                    }
                    div.appendChild(table);
                    this.mapView.ui.remove(id_div_editare);
                    this.mapView.ui.add(parinte, "top-right");
                    id_div_editare = id;
                    return id;
                };
                AttributesModel.prototype.wrap = function () {
                    var _this = this;
                    this.map = this.settings.map;
                    this.mapView = this.settings.mapView;
                    this.mapView.on("click", function (event) {
                        _this.mapView.hitTest(event).then(function (response) {
                            if (response.results.length > 0 && response.results[0].graphic) {
                                var feature = response.results[0].graphic;
                                _this.settings.helper.fields(function (fields) {
                                    _this.creteEditForm(fields, feature);
                                });
                            }
                            else {
                                _this.mapView.ui.remove(id_div_editare);
                            }
                        });
                    });
                };
                return AttributesModel;
            }());
            AttributesModel_1.AttributesModel = AttributesModel;
        })(AttributesModel = Esriro.AttributesModel || (Esriro.AttributesModel = {}));
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
                    this.update_features = [];
                    this.updated_features = [];
                }
                AttributeHelper.prototype.add = function (field, attributeValue) {
                    var color = field.editable ? "black" : "gray";
                    var width = Number(this.width.replace(/[^\d\.\-]/g, '')) / 2;
                    var row = this.table.insertRow(0);
                    var header = row.insertCell(0);
                    header.style.width = width.toString() + "px";
                    header.innerHTML = field.alias;
                    header.style.color = color;
                    header.style.fontSize = "14px";
                    var cellValue = row.insertCell(1);
                    var domain = field.domain;
                    var value = document.createElement("input");
                    value.id = field.name + Math.round(Math.random() * 1000).toString();
                    if (domain !== null && domain.type === "coded-value") {
                        var value_1 = document.createElement("select");
                    }
                    var valoare_curenta = {
                        field: field,
                        value: attributeValue,
                        retrned_id: value.id
                    };
                    this.update_features.push(valoare_curenta);
                    var _type_ = "number_text";
                    value.disabled = !field.editable;
                    if (value instanceof HTMLInputElement) {
                        if (field.type === "small-integer" ||
                            field.type === "integer" ||
                            field.type === "single" ||
                            field.type === "double" ||
                            field.type === "long") {
                            value.type = "number";
                            _type_ = "number_text";
                        }
                        else if (field.type === "string") {
                            value.type = "text";
                            _type_ = "number_text";
                        }
                        else if (field.type === "date") {
                            value.type = "date";
                            _type_ = "date";
                        }
                    }
                    value.style.width = width.toString() + "px";
                    cellValue.appendChild(value);
                    if (attributeValue !== null && _type_ === "number_text") {
                        value.value = attributeValue;
                    }
                    else if (attributeValue !== null && _type_ === "date") {
                        var data = new Date(attributeValue);
                        console.log('data', data);
                        value.value = "2008-08-08";
                    }
                };
                AttributeHelper.prototype.get = function (type) {
                    switch (type) {
                        case "data_update":
                            return this.update_features;
                            break;
                    }
                };
                AttributeHelper.prototype.change_attributes = function (data, feature) {
                    /*Modificarea atributelor*/
                    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                        var item = data_1[_i];
                        if (item.field.type !== "oid") {
                            var atribut = item.field.name;
                            var valoare = document.getElementById(item.retrned_id).value;
                            feature.attributes[atribut] = valoare;
                        }
                    }
                    var edits = {
                        updateFeatures: [feature]
                    };
                    featureLayer.applyEdits(edits).then(function (applyResults) {
                        console.log(applyResults);
                    });
                };
                return AttributeHelper;
            }());
            Helper_1.AttributeHelper = AttributeHelper;
        })(Helper = Esriro.Helper || (Esriro.Helper = {}));
    })(Esriro || (Esriro = {}));
    var view_model = Esriro.ViewModel;
    var helper = Esriro.Helper;
    var featureLayer = new FeatureLayer({
        /*url-ul featuelayer-ului pentru care doriti sa editati atributele*/
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Recreation/FeatureServer/0",
        /*Campurile disponibile pentru editare*/
        outFields: ["*"]
    });
    var view_model_settings = {
        /*basemap-ul hartii*/
        map: { basemap: "streets" },
        mapView: {
            /*pozitia in harta view-ului default*/
            center: [26.52, 45.68],
            /*nivelul de zoom*/
            zoom: 8,
            container: "viewDiv"
        },
        helper: new helper.Helper(featureLayer)
    };
    var view_app = new view_model.ViewModel(view_model_settings);
    view_app.wrap();
    view_app.add(featureLayer);
    var attribute_model = Esriro.AttributesModel;
    var attribute_app_settings = {
        map: view_app.get("map"),
        mapView: view_app.get("mapView"),
        helper: new helper.Helper(featureLayer)
    };
    var attribute_app = new attribute_model.AttributesModel(attribute_app_settings);
    attribute_app.wrap();
});
//# sourceMappingURL=app.js.map