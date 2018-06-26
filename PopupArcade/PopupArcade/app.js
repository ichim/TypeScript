define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"], function (require, exports, Map, MapView, FeatureLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                        basemap: this.settings.mapSettings.basemap
                    });
                    this.mapView = new MapView({
                        map: this.map,
                        center: this.settings.mapViewSettings.center,
                        zoom: this.settings.mapViewSettings.zoom,
                        container: this.settings.mapViewSettings.divId
                    });
                };
                ViewModel.prototype.addDataModel = function (data_model) {
                    for (var _i = 0, _a = data_model.operationalLayers.layers; _i < _a.length; _i++) {
                        var _feature_layer = _a[_i];
                        this.map.add(_feature_layer);
                    }
                };
                return ViewModel;
            }());
            ViewModel_1.ViewModel = ViewModel;
            var DataModel = /** @class */ (function () {
                function DataModel(settings) {
                    this.settings = settings;
                    this._operational_layers = [];
                }
                DataModel.prototype.wrap = function () {
                    for (var _i = 0, _a = this.settings.operationalLayers; _i < _a.length; _i++) {
                        var item = _a[_i];
                        var feature_layer = new FeatureLayer({
                            url: item.url,
                            outFields: item.outFields,
                            popupTemplate: item.popupTemplate
                        });
                        this._operational_layers.push(feature_layer);
                    }
                    var rezultat = {
                        operationalLayers: {
                            layers: this._operational_layers
                        }
                    };
                    return rezultat;
                };
                return DataModel;
            }());
            ViewModel_1.DataModel = DataModel;
        })(ViewModel = Esriro.ViewModel || (Esriro.ViewModel = {}));
    })(Esriro || (Esriro = {}));
    (function (Esriro) {
        var Tasks;
        (function (Tasks) {
            var Popup;
            (function (Popup) {
                var PopupModel = /** @class */ (function () {
                    function PopupModel(settings) {
                        this.settings = settings;
                        this.fields = undefined;
                        this.title = undefined;
                        this.content = [];
                    }
                    PopupModel.prototype.wrap = function () {
                        var rezultat = undefined;
                        this.fields = this.settings.layer.fields;
                        var index = 0;
                        for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
                            var field = _a[_i];
                            if (field.type === "string") {
                                if (index === 0) {
                                    this.title = "{" + field.name + "}";
                                }
                                else {
                                    this._content_string = this._content_string + "<br>" + field.name + ": " + "{" + field.name + "}";
                                }
                            }
                            else if (field.type === "integer" ||
                                field.type === "small-integer" ||
                                field.type === "double" ||
                                field.type === "single" ||
                                field.type === "long") {
                                this._content_string = this._content_string + "<br>" + field.name + ": " + "{" + field.name + "}";
                            }
                            index++;
                        }
                        rezultat.title = this.title;
                        rezultat.content = this._content_string;
                        return rezultat;
                    };
                    return PopupModel;
                }());
                Popup.PopupModel = PopupModel;
            })(Popup = Tasks.Popup || (Tasks.Popup = {}));
        })(Tasks = Esriro.Tasks || (Esriro.Tasks = {}));
    })(Esriro || (Esriro = {}));
    var view_model = Esriro.ViewModel;
    (function (Esriro) {
        var ControlPanel;
        (function (ControlPanel) {
            var Application = /** @class */ (function () {
                function Application(settings) {
                    this.settings = settings;
                }
                Application.prototype.wrap = function () {
                    /*Casting intre interfete IAppSettings si  IViewModelSettings*/
                    var view_settings = this.settings;
                    /*Casting intre interfetele IAppSettings si IDataModelInput */
                    var operational_layers = this.settings;
                    var view = new view_model.ViewModel(view_settings);
                    view.wrap();
                    var data = new view_model.DataModel(operational_layers);
                    var data_model = data.wrap();
                    view.addDataModel(data_model);
                };
                return Application;
            }());
            ControlPanel.Application = Application;
        })(ControlPanel = Esriro.ControlPanel || (Esriro.ControlPanel = {}));
    })(Esriro || (Esriro = {}));
    var application = Esriro.ControlPanel;
    var app_settings = {
        mapSettings: {
            basemap: "streets"
        },
        mapViewSettings: {
            center: [25.256, 46.235],
            zoom: 8,
            divId: "viewDiv"
        },
        operationalLayers: [
            {
                url: "https://services6.arcgis.com/Uwg97gPMK3qqaMen/ArcGIS/rest/services/judete/FeatureServer/0",
                outFields: ["judet", "abrev", "Shape_Area"],
                /*Aici puteti seta forma si formatul popup-ului*/
                popupTemplate: { title: "Judetul {judet}", content: [{ type: "text", text: "Abreviere judet: <br> {abrev}" }] }
            }
        ]
    };
    var app = new application.Application(app_settings);
    app.wrap();
});
//# sourceMappingURL=app.js.map