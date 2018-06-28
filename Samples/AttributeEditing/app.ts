﻿/// <reference path="@types/arcgis-js-api/index.d.ts" />

import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Field = require("esri/layers/support/Field");
import Domain = require("esri/layers/support/Domain");

let id_div_editare: string = "";


interface IField
{
    field: Field;
    value: number | string | Date;
    retrned_id: string;
}

module Esriro.ViewModel
{
    export interface IViewModel
    {
        wrap(): void;
        add(layer: FeatureLayer): void;
        get(type: string): any;
        //creteEditForm(fields: Field[], feature:object): string;
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
        }
        add(layer: FeatureLayer)
        {
            this.map.add(layer);
        }
        get(type: string): any
        {
            switch (type)
            {
                case "map":
                    return this.map;
                    break;
                case "mapView":
                    return this.mapView;
                    break;
            }
        }
    }
}

module Esriro.AttributesModel
{
    export interface IAttributesModelSettings
    {
        map: Map;
        mapView: MapView;
        helper: helper.Helper;
    }
    export class AttributesModel
    {
        map: Map = undefined;
        mapView: MapView = undefined;
        constructor(public settings: IAttributesModelSettings) {  }
        creteEditForm(fields: Field[], feature: object): string {
            /*Creaza form-ul in care se vor afisa datele atribut si cu care se vor modifica*/
            let id = "div_editare_" + Math.round(Math.random() * 1000).toString();;
            let parinte = document.createElement("div");
            parinte.style.height = "200px";
            parinte.style.width = "260px";
            parinte.id = id;
            let bara1 = document.createElement('div');
            bara1.style.height = "20px";
            bara1.style.backgroundColor = "#73C8C7";
            let labelOid = document.createElement("label");
            labelOid.innerHTML = feature['layer']['objectIdField'] + ": " + feature['attributes'][feature['layer']['objectIdField']].toString();
            bara1.appendChild(labelOid);
            let bara2 = document.createElement('div');
            bara2.style.height = "22px";
            bara2.style.backgroundColor = "#73C8C7";
            bara2.style.textAlign = 'right';

            let applyButton = document.createElement("button");
            applyButton.innerHTML = "OK";
            bara2.appendChild(applyButton);

            let div = document.createElement("div");
            div.style.height = "200px";
            div.style.width = "260px";
            div.style.backgroundColor = "white";
            parinte.appendChild(bara1);
            parinte.appendChild(div);
            parinte.appendChild(bara2);
            let table = document.createElement("table");
            div.style.overflowY = 'auto';
            let attribute_helper = new helper.AttributeHelper(table, "200px");
            applyButton.onclick = function () {
                attribute_helper.change_attributes(attribute_helper.get('data_update'));
            }
            for (let field of fields) {
                let valoare: any = feature['attributes'][field.name];
                attribute_helper.add(field, valoare);
            }
            div.appendChild(table);
            this.mapView.ui.remove(id_div_editare);
            this.mapView.ui.add(parinte, "top-right");
            id_div_editare = id;
            return id;
        }
        wrap(): void
        {
            this.map = this.settings.map; this.mapView = this.settings.mapView;
            this.mapView.on("click", (event) => {
                this.mapView.hitTest(event).then((response) => {
                    if (response.results.length > 0 && response.results[0].graphic) {
                        var feature = response.results[0].graphic;
                        this.settings.helper.fields((fields) => {
                            this.creteEditForm(fields, feature);
                        });
                    }
                });
            });
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
        update_features: IField[] = [];
        updated_features: IField[] = [];
        constructor(public table:HTMLTableElement, public width:string)
        { }
        add(field: Field, attributeValue: number | string | Date): void {
            let color: string = field.editable?"black":"gray";
            let width:number = Number( this.width.replace(/[^\d\.\-]/g, ''))/2;
            let row = this.table.insertRow(0);
            let header = row.insertCell(0);
            header.style.width = width.toString() + "px";
            header.innerHTML = field.alias;
            header.style.color = color;
            let cellValue = row.insertCell(1);

            let domain = field.domain;
            let value:HTMLInputElement = document.createElement("input");
            console.log(value instanceof HTMLInputElement );
            if (domain !== null && domain.type ==="coded-value"  )
            {
                console.log(field.name);
                let value:HTMLSelectElement = document.createElement("select");
                value.id = field.name + Math.round(Math.random() * 1000).toString();
                
                
            } 

            let valoare_curenta: IField = {
                field: field,
                value: attributeValue,
                retrned_id: value.id
            }
            this.update_features.push(valoare_curenta);

            if (value instanceof HTMLInputElement)
            {
                if (field.type === "small-integer" ||
                    field.type === "integer" ||
                    field.type === "single" ||
                    field.type === "double" ||
                    field.type === "long") {
                    value.type = "number"
                    if (attributeValue !== null) {
                        value.value = <string>attributeValue;
                    }
                } else if (field.type === "string") {
                    value.type = "text";
                    if (attributeValue !== null) {
                        value.value = <string>attributeValue;
                    }
                } else if (field.type === "date") {
                    value.type = "date";
                    if (attributeValue !== null) {

                        value.value = new Date(<number>attributeValue).toDateString();
                    }
                }
            } 
 
            value.style.width = width.toString() + "px";
            cellValue.appendChild(value);
        }
        get(type: string): IField[]
        {
            switch (type)
            {
                case "data_update":
                    return this.update_features;
                    break;
            }
        }
        change_attributes(data: IField[]): void {
            /*Modificarea atributelor*/
            for (let item of data)
            {
                console.log(item.field.name, (document.getElementById(item.retrned_id) as HTMLInputElement).value );
            }
        }
    }
    
}

import view_model = Esriro.ViewModel;
import helper = Esriro.Helper;
let featureLayer = new FeatureLayer({
    url: "",
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
import attribute_model = Esriro.AttributesModel;
let attribute_app_settings: attribute_model.IAttributesModelSettings = {
    map: view_app.get("map"),
    mapView: view_app.get("mapView"),
    helper: new helper.Helper(featureLayer)
}
let attribute_app: attribute_model.AttributesModel = new attribute_model.AttributesModel(attribute_app_settings);
attribute_app.wrap();



