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
                            outFields: item.outFields
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
    var view_model = Esriro.ViewModel;
    var view_settings = {
        mapSettings: {
            basemap: "streets"
        },
        mapViewSettings: {
            center: [25.256, 46.235],
            zoom: 8,
            divId: "viewDiv"
        }
    };
    var operational_layers = {
        operationalLayers: [
            {
                url: "https://services6.arcgis.com/Uwg97gPMK3qqaMen/ArcGIS/rest/services/judete/FeatureServer/0",
                outFields: ["*"]
            }
        ]
    };
    var view = new view_model.ViewModel(view_settings);
    view.wrap();
    var data = new view_model.DataModel(operational_layers);
    var data_model = data.wrap();
    view.addDataModel(data_model);
});
//# sourceMappingURL=app.js.map