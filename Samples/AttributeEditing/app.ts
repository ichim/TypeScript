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
        creteEditForm(fields: Field[], feature:object): string;
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

            this.mapView.on("click", (event) => {
                this.mapView.hitTest(event).then((response) => {
                    if (response.results.length > 0 && response.results[0].graphic)
                    {
                        var feature = response.results[0].graphic;
                        this.settings.helper.fields((fields) => {
                            console.log(fields);
                            view_app.creteEditForm(fields, feature);
                        });
                        console.log(feature);
                    }
                });
            });

          
        }
        add(layer: FeatureLayer)
        {
            this.map.add(layer);
        }
        creteEditForm(fields:Field[], feature:object): string
        {
            let id = "";

            let bara = document.createElement('div');
            bara.style.height = "20px";
            bara.style.backgroundColor = "#F4F6F6";

            let div = document.createElement("div");
            div.style.height = "200px";
            div.style.width = "260px";
            div.style.backgroundColor = "white";
            div.appendChild(bara);
            
            let table = document.createElement("table");
            div.style.overflowY = 'auto';
            let attribute_helper = new helper.AttributeHelper(table, "200px");

            for (let field of fields)
            {
                attribute_helper.add(field, "Valoare");
            }

            
            //let row = table.insertRow(0);
            //let cell1 = row.insertCell(0);
            //cell1.style.width = "100px";

            //let cell2 = row.insertCell(1);
            //cell2.style.width = "100px";
            //let input2 = document.createElement("input");
            //input2.style.width = "100px";

            //cell1.innerHTML = "Camp";
            //cell2.appendChild(input2);
           div.appendChild(table);




            this.mapView.ui.add(div, "top-right");
            console.log(table.style.width);
          

            return id;
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
    export class AttributeHelper
    {
        constructor(public table:HTMLTableElement, public width:string)
        { }
        add(field: Field, attributeValue: number | string): void {
            let color: string = field.editable?"black":"gray";
         

            let width:number = Number( this.width.replace(/[^\d\.\-]/g, ''))/2;
            let row = this.table.insertRow(0);
            let header = row.insertCell(0);
            header.style.width = width.toString() + "px";
            header.innerHTML = field.alias;
            header.style.color = color;
            let cellValue = row.insertCell(1);
            let value = document.createElement("input");
            value.style.width = width.toString() + "px";
            value.value = attributeValue.toString();
            cellValue.appendChild(value);

            console.log("Adaugat", width);
        }





    }
}




import view_model = Esriro.ViewModel;
import helper = Esriro.Helper;
let featureLayer = new FeatureLayer({
    url: "https://services6.arcgis.com/Uwg97gPMK3qqaMen/arcgis/rest/services/HSSEInicdents/FeatureServer/0",
    outFields:["*"]
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

