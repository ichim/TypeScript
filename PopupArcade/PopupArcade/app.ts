/// <reference path="@types/arcgis-js-api/index.d.ts" />
/*Module Esri*/
import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Field = require("esri/layers/support/Field");
import PopupTemplate = require("esri/PopupTemplate");



interface IDataModelInput
{/*date de intrare*/
    operationalLayers: IOperationalLayerSettings[];
}
interface IOperationalLayerSettings
{
    url: string;
    outFields: string[];
    popupTemplate: IPopupTemplate
}

interface IPopupTemplate
{
    title: string;
    content: IContent[];
}

interface IContent
{
    type: string;
    text: string;
}

interface IOperationalLayersUrl
{
    layers: string[];
}

interface IDataModelOutput
{/*date Model Date*/
    operationalLayers: IOperationalLayersFeatureLayer;
}

interface IOperationalLayersFeatureLayer
{
    layers: FeatureLayer[];
}

module Esriro.ViewModel
{/*Permite afisarea componentelor principale ale aplicatiei (Map/ViewMap) si adaugarea de surse de date (FeatureLayers)*/
    export interface IViewModel
    {wrap(): void;addDataModel(data_model: IDataModelOutput):void;}
    export interface IViewModelSettings
    {
        mapSettings: IMapSettings;
        mapViewSettings: IMapViewSettings;
    }
    export interface IMapSettings {
        basemap: string;
    }
    export interface IMapViewSettings
    {
        center: number[];
        zoom: number;
        divId: string;
    }
    export class ViewModel implements IViewModel
    {/*Permite configurarea Map si MapView*/
        map = undefined;
        mapView = undefined;
        constructor(public settings: IViewModelSettings)
        {}
        wrap(): void {
            this.map = new Map({
                basemap:this.settings.mapSettings.basemap
            });
            this.mapView = new MapView({
                map: this.map,
                center: this.settings.mapViewSettings.center,
                zoom: this.settings.mapViewSettings.zoom,
                container:this.settings.mapViewSettings.divId
            });
        }
        addDataModel(data_model: IDataModelOutput):void
        {/*adauga continut (layere operationale)*/
            for (let _feature_layer of data_model.operationalLayers.layers)
            {
                this.map.add(_feature_layer);
            }
        }
    }
    export interface IDataModel { wrap(): IDataModelOutput; }
    export class DataModel implements IDataModel
    {/*acesta clasa permite crearea continutului hartii/layere operationale*/
        _operational_layers: FeatureLayer[]= [];
        constructor(public settings: IDataModelInput)
        {}
        wrap(): IDataModelOutput
        {
            for (let item of this.settings.operationalLayers)
            {
                let feature_layer = new FeatureLayer({
                    url: item.url,
                    outFields: item.outFields,
                    popupTemplate:item.popupTemplate
                });
                this._operational_layers.push(feature_layer);
            }
            let rezultat: IDataModelOutput = {
                operationalLayers: {
                    layers: this._operational_layers
                }
            }
            return rezultat;
        }
    }
}



import view_model = Esriro.ViewModel;
module Esriro.Tasks.Popup
{
    export class PopupModel
    {/*Continutul popup-ului este creat tinand seama de structura fc*/
        title = "";
        content = "";
        constructor(public settings: IDataModelOutput)
        { }
        wrap(callback): void
        {
            let promises = [];
            let rezultat: IDataModelOutput = this.settings;
            for (let layer of this.settings.operationalLayers.layers)
            {
                let promise = layer.load();
                promises.push(promise);
            }

            Promise.all(promises).then((layers) => {
                let layer:FeatureLayer = undefined;
                for (layer of layers)
                {
                    let index = 0;
                    for (let camp of layer.outFields)
                    {
                        for (let field of layer.fields)
                        {
                            if (field.type !== "oid" && camp === field.name)
                            {
                                if (index === 0 && field.type === "string")
                                {
                                    this.title = field.name + " " + "{" + field.name + "}"
                                }
                                else {
                                    this.content = this.content + "<br>" + field.name + ": " + "{" + field.name + "}"
                                }
                                layer.popupTemplate = new PopupTemplate({ title: this.title, content: this.content });
                            }
                        }
                        index++;
                    }
                }
                callback(rezultat);
            });
        }
    }
}
import popup = Esriro.Tasks.Popup;

module Esriro.ControlPanel
{/*bussiness-ul logic al aplicatiei*/
    export interface IAppSettings extends view_model.IViewModelSettings, IDataModelInput
    {
    }
    export interface IControlPanel
    {
        wrap(): void;
    }
    export class Application implements IControlPanel
    {
        constructor(public settings: IAppSettings)
        { }
        wrap(): void
        {
            /*Casting intre interfete IAppSettings si  IViewModelSettings*/
            let view_settings: view_model.IViewModelSettings = <view_model.IViewModelSettings>this.settings;
            /*Casting intre interfetele IAppSettings si IDataModelInput */
            let operational_layers: IDataModelInput = <IDataModelInput>this.settings;
            let view: view_model.IViewModel = new view_model.ViewModel(view_settings);
            view.wrap();
            let data: view_model.IDataModel = new view_model.DataModel(operational_layers);
            let data_model = data.wrap();
            /*modul pentru crearea continutului popup-ului*/
            let popup_model: popup.PopupModel = new popup.PopupModel(data_model);
            popup_model.wrap((rezultat_data_model) => { 
                /*Layerele operationale sunt adaugate la map*/
                view.addDataModel(rezultat_data_model);
            });
           
        }
    }
}

let app_settings: application.IAppSettings = {
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
                url: "",
            outFields: ["judet", "abrev", "Shape_Area"],
            popupTemplate: { title: "}", content: []}
            }
        ]
}

import application = Esriro.ControlPanel;
let app: application.IControlPanel = new application.Application(app_settings);
app.wrap();








