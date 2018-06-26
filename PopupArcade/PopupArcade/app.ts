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
                basemap:"streets"
            });
            this.mapView = new MapView({
                map: this.map,
                center: [26.252, 46.452],
                zoom: 10,
                container:"viewDiv"
            });

        }

    }
}

import view_model = Esriro.ViewModel;
let view: view_model.IViewModel = new view_model.ViewModel(null);
view.wrap();


