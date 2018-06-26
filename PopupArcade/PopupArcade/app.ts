/// <reference path="@types/arcgis-js-api/index.d.ts" />

import Map = require("esri/Map");
import MapView = require("esri/views/MapView");


module Esriro.ViewModel
{/*Permite afisarea componentelor principale ale aplicatiei (Map/ViewMap) si adaugarea de surse de date (FeatureLayers)*/

    export interface IViewModel
    {
        wrap(): void;
    }
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

let view: view_model.IViewModel = new view_model.ViewModel(view_settings);
view.wrap();


