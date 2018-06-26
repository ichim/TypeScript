define(["require", "exports", "esri/Map", "esri/views/MapView"], function (require, exports, Map, MapView) {
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
                };
                return ViewModel;
            }());
            ViewModel_1.ViewModel = ViewModel;
            var DataModel = /** @class */ (function () {
                function DataModel() {
                }
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
            zoom: 10,
            divId: "viewDiv"
        }
    };
    var view = new view_model.ViewModel(view_settings);
    view.wrap();
});
//# sourceMappingURL=app.js.map