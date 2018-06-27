define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/PopupTemplate", "esri/renderers/smartMapping/statistics/summaryStatistics"], function (require, exports, Map, MapView, FeatureLayer, PopupTemplate, SummaryStatistics) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Esriro;
    (function (Esriro) {
        var ViewModel;
        (function (ViewModel_1) {
            class ViewModel {
                constructor(settings) {
                    this.settings = settings;
                    this.map = undefined;
                    this.mapView = undefined;
                }
                wrap() {
                    this.map = new Map({
                        basemap: this.settings.mapSettings.basemap
                    });
                    this.mapView = new MapView({
                        map: this.map,
                        center: this.settings.mapViewSettings.center,
                        zoom: this.settings.mapViewSettings.zoom,
                        container: this.settings.mapViewSettings.divId
                    });
                }
                addDataModel(data_model) {
                    for (let _feature_layer of data_model.operationalLayers.layers) {
                        this.map.add(_feature_layer);
                    }
                }
            }
            ViewModel_1.ViewModel = ViewModel;
            class DataModel {
                constructor(settings) {
                    this.settings = settings;
                    this._operational_layers = [];
                }
                wrap() {
                    for (let item of this.settings.operationalLayers) {
                        let feature_layer = new FeatureLayer({
                            url: item.url,
                            outFields: item.outFields,
                            popupTemplate: item.popupTemplate
                        });
                        feature_layer.field_proc = item.field_proc;
                        this._operational_layers.push(feature_layer);
                    }
                    let rezultat = {
                        operationalLayers: {
                            layers: this._operational_layers
                        }
                    };
                    return rezultat;
                }
            }
            ViewModel_1.DataModel = DataModel;
        })(ViewModel = Esriro.ViewModel || (Esriro.ViewModel = {}));
    })(Esriro || (Esriro = {}));
    var view_model = Esriro.ViewModel;
    (function (Esriro) {
        var Tasks;
        (function (Tasks) {
            var Popup;
            (function (Popup) {
                class PopupModel {
                    constructor(settings) {
                        this.settings = settings;
                        this.title = "";
                        this.content = "";
                    }
                    wrap(callback) {
                        let promises = [];
                        let rezultat = this.settings;
                        for (let layer of this.settings.operationalLayers.layers) {
                            let promise = layer.load();
                            promises.push(promise);
                        }
                        Promise.all(promises).then((layers) => {
                            let layer = undefined;
                            for (layer of layers) {
                                let _layer = layer;
                                console.log("_layer.suma_field_proc", _layer.suma_field_proc);
                                let index = 0;
                                for (let camp of layer.outFields) {
                                    for (let field of layer.fields) {
                                        if (field.type !== "oid" && camp === field.name) {
                                            if (index === 0 && field.type === "string") {
                                                this.title = field.name + " " + "{" + field.name + "}";
                                            }
                                            else {
                                                this.content = this.content + "<br>" + field.name + ": " + "{" + field.name + "}";
                                            }
                                        }
                                        index++;
                                    }
                                }
                                this.content = this.content + "<br>{expression/procent} % din suprafata tarii";
                                layer.popupTemplate = new PopupTemplate({
                                    title: this.title,
                                    content: this.content,
                                    expressionInfos: [{ name: 'procent', expression: "Round(($feature.Shape_Area/" + _layer.suma_field_proc.toString() + ") * 100, 1)" }]
                                });
                            }
                            callback(rezultat);
                        });
                    }
                    suma(callback) {
                        /*Aceasta functie calculeaza cat reprezinta suprafata fiecarui judet raportat la suprafata intregii tari
                        Pentru calcule s-a folosit ArcGIS Arcade*/
                        let layer = undefined;
                        let promises = [];
                        for (layer of this.settings.operationalLayers.layers) {
                            let feature_layer = layer;
                            promises.push(SummaryStatistics({
                                layer: layer,
                                field: feature_layer.field_proc
                            }));
                        }
                        Promise.all(promises).then((rezultate) => {
                            let index = 0;
                            for (let rezultat of rezultate) {
                                console.log("rezultat", rezultat);
                                let _layer_ = this.settings.operationalLayers.layers[index];
                                _layer_.suma_field_proc = rezultat.sum;
                                index++;
                            }
                            callback(this.settings);
                        });
                    }
                }
                Popup.PopupModel = PopupModel;
            })(Popup = Tasks.Popup || (Tasks.Popup = {}));
        })(Tasks = Esriro.Tasks || (Esriro.Tasks = {}));
    })(Esriro || (Esriro = {}));
    var popup = Esriro.Tasks.Popup;
    (function (Esriro) {
        var ControlPanel;
        (function (ControlPanel) {
            class Application {
                constructor(settings) {
                    this.settings = settings;
                }
                wrap() {
                    /*Casting intre interfete IAppSettings si  IViewModelSettings*/
                    let view_settings = this.settings;
                    /*Casting intre interfetele IAppSettings si IDataModelInput */
                    let operational_layers = this.settings;
                    let view = new view_model.ViewModel(view_settings);
                    view.wrap();
                    let data = new view_model.DataModel(operational_layers);
                    let data_model = data.wrap();
                    /*modul pentru crearea continutului popup-ului*/
                    let popup_model = new popup.PopupModel(data_model);
                    popup_model.suma((statistical_data_model) => {
                        popup_model = new popup.PopupModel(statistical_data_model);
                        popup_model.wrap((rezultat_data_model) => {
                            /*Layerele operationale sunt adaugate la map*/
                            console.log("rezultat_data_model", rezultat_data_model);
                            view.addDataModel(rezultat_data_model);
                        });
                    });
                }
            }
            ControlPanel.Application = Application;
        })(ControlPanel = Esriro.ControlPanel || (Esriro.ControlPanel = {}));
    })(Esriro || (Esriro = {}));
    let app_settings = {
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
                field_proc: "Shape_Area",
                suma_field_proc: 0,
                popupTemplate: { title: "}", content: [] }
            }
        ]
    };
    var application = Esriro.ControlPanel;
    let app = new application.Application(app_settings);
    app.wrap();
});
//# sourceMappingURL=app.js.map