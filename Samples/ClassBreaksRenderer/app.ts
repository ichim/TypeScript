/// <reference path="@types/arcgis-js-api/index.d.ts" />
/*Laurentiu Ichim*/
import Map = require("esri/Map");
import MapView = require("esri/views/MapView");


module Esriro.ViewModel
{
    export interface IViewModel
    {
        wrap(): void;
    }
    export interface IViewModelSettings
    {
        map: IMapSettings;
        mapView: IMapViewSettings;
    }
    export interface IMapSettings
    {

    }
    export interface IMapViewSettings
    {

    }
    export class  ViewModel implements IViewModel
    {
        map: Map = undefined;
        mapView: MapView = undefined;
        wrap(): void {

        }
    }
}

import view_model = Esriro.ViewModel;
let view_app: view_model.IViewModel = new view_model.ViewModel();
view_app.wrap();