/// <reference path="@types/arcgis-js-api/index.d.ts" />
import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");

interface IDataModelInput
{
    operationalLayers: IOperationalLayersUrl;
}

interface IOperationalLayersUrl
{
    layers: string[];
}

interface IDataModelOutput
{
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
            for (let url of this.settings.operationalLayers.layers)
            {
                let feature_layer = new FeatureLayer({
                    url: url
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
let view_settings: view_model.IViewModelSettings = {
    mapSettings: {
        basemap:"streets"
    },
    mapViewSettings: {
        center: [25.256, 46.235],
        zoom: 10,
        divId:"viewDiv"
    }
}

let operational_layers: IDataModelInput = {
    operationalLayers: {
        layers: [
            "https://services6.arcgis.com/Uwg97gPMK3qqaMen/arcgis/rest/services/judete_romania/FeatureServer/0"
        ]
    }
}
let view: view_model.IViewModel = new view_model.ViewModel(view_settings);
view.wrap();
let data: view_model.IDataModel = new view_model.DataModel(operational_layers);
let data_model = data.wrap();

view.addDataModel(data_model);





