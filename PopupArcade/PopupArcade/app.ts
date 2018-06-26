/// <reference path="@types/arcgis-js-api/index.d.ts" />

import Map = require("esri/Map");
import MapView = require("esri/views/MapView");


module Esriro.ViewModel
{
    export interface IViewModel
    {

    }

    export interface IViewModelSettings
    {
        mapSettings: IMapSettings;
        mapViewSettings: IMapViewSettings;
    }

    export interface IMapSettings
    {
        basemap: string;
    }

    export interface IMapViewSettings
    {
        center: number[];
        zoom: number;
        divId: string;
    }

    export class ViewModel implements IViewModel
    {
        constructor(public settings: IViewModelSettings)
        {

        }
    }
}

