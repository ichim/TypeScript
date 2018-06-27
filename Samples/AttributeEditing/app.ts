/// <reference path="@types/arcgis-js-api/index.d.ts" />

import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Field = require("esri/layers/support/Field");

module Esriro.ViewModel
{
    export interface IViewModel
    {
        wrap(): void;
        add(layer: FeatureLayer): void;
    }
    export interface IViewModelSettings
    {
        map: IMapSettings;
        mapView: IMapViewSettings;
        helper: helper.Helper;
    }
    export interface IMapSettings
    {
        basemap: string;
    }
    export interface IMapViewSettings
    {
        center: number[];
        zoom: number;
        container: string;
    }
    export class ViewModel implements IViewModel
    {
        map:Map = undefined;
        mapView:MapView = undefined;
        constructor(public settings: IViewModelSettings)
        { }
        wrap(): void {
            this.map = new Map({
                basemap:this.settings.map.basemap
            });
            this.mapView = new MapView({
                map: this.map,
                container: this.settings.mapView.container,
                center: this.settings.mapView.center,
                zoom:this.settings.mapView.zoom
            });

            this.settings.helper.fields((fields) => {
                console.log(fields);
            });
        }
        add(layer: FeatureLayer)
        {
            this.map.add(layer);
        }
    }
}

module Esriro.Helper
{
    export class Helper
    {
        constructor(public feature_layer: FeatureLayer)
        {      }
         fields(callback):void
         {
             this.feature_layer.load().then((layer) => { 
             let fields: Field[] = [];
                 fields = this.feature_layer.fields;

                 callback(fields);
             });
        }
    }
}




import view_model = Esriro.ViewModel;
import helper = Esriro.Helper;
let featureLayer = new FeatureLayer({
    url:"https://services6.arcgis.com/Uwg97gPMK3qqaMen/arcgis/rest/services/HSSEInicdents/FeatureServer/0"
})



let view_model_settings: view_model.IViewModelSettings = {
    map: { basemap: "streets" },
    mapView: {
        center: [26.52, 45.68],
        zoom: 8,
        container:"viewDiv"
    },
    helper: new helper.Helper(featureLayer)

};

let view_app: view_model.IViewModel = new view_model.ViewModel(view_model_settings);
view_app.wrap();
view_app.add(featureLayer);
