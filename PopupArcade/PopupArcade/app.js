/// <reference path="@types/arcgis-js-api/index.d.ts" />
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
                        basemap: "streets"
                    });
                    this.mapView = new MapView({
                        map: this.map,
                        center: [26.252, 46.452],
                        zoom: 10,
                        container: "viewDiv"
                    });
                };
                return ViewModel;
            }());
            ViewModel_1.ViewModel = ViewModel;
        })(ViewModel = Esriro.ViewModel || (Esriro.ViewModel = {}));
    })(Esriro || (Esriro = {}));
    var view_model = Esriro.ViewModel;
    var view = new view_model.ViewModel(null);
    view.wrap();
});
//# sourceMappingURL=app.js.map