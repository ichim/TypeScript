/// <reference path="@types/arcgis-js-api/index.d.ts" />
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
                        basemap: this.settings.map.basemap
                    });
                    this.mapView = new MapView({
                        map: this.map,
                        container: this.settings.mapView.container,
                        center: this.settings.mapView.center,
                        zoom: this.settings.mapView.zoom
                    });
                    this.settings.helper.fields(function (fields) {
                        console.log(fields);
                    });
                };
                ViewModel.prototype.add = function (layer) {
                    this.map.add(layer);
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
        })(Helper = Esriro.Helper || (Esriro.Helper = {}));
    })(Esriro || (Esriro = {}));
    var view_model = Esriro.ViewModel;
    var helper = Esriro.Helper;
    var featureLayer = new FeatureLayer({
        url: "https://services6.arcgis.com/Uwg97gPMK3qqaMen/arcgis/rest/services/HSSEInicdents/FeatureServer/0"
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