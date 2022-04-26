import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {GeoJSONTypes, Geovisto, IMap} from 'geovisto';
import { GeovistoTilesLayerTool } from 'geovisto-layer-tiles';
import { GeovistoThemesTool } from 'geovisto-themes';
import { GeovistoMarkerLayerTool } from 'geovisto-layer-marker';


@Component({
  selector: 'sensor-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {

  constructor() { }
  @Input()
  latitude: number = 49.19522;
  @Input()
  longitude: number = 16.60796;
  private map: IMap | undefined;

  ngOnChanges() {
    console.log(this.latitude, this.longitude);
  }

  ngOnInit(): void {
	  const json = {
		  "type": "FeatureCollection",
		  "features":
			  [
				  {
					  "type": "Feature",
					  "id": "CZ0100",
					  "properties": {
						  "name": "Praha-město"
					  },
					  "geometry":  {
						  "type": GeoJSONTypes.Point,
						  "coordinates":
							  [
								  [49.975317, 70],
								  [49.98, 16.9],
								  [49.99, 16.95],
								  [75, 40]
							  ]
					  }
				  }
			  ]
	  };

	  const geo = Geovisto.getGeoDataFactory().geojson("data", json);

	  this.map = Geovisto.createMap({
		  id: "geovisto",
		  globals: {
			  zoom: 15,
			  mapCenter: {
				  lat: this.latitude,
				  lng: this.longitude
			  },
			  mapStructure: {
				  maxZoom: 20,
				  maxBounds: [[this.latitude + 3, this.longitude + 3], [this.latitude - 3, this.longitude - 3]]
			  }
		  },
		  tools: Geovisto.createMapToolsManager([
		  	GeovistoTilesLayerTool.createTool({
				id: "geovisto-tool-layer-tiles",
				baseMap: {
					url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
					maxZoom: 20,
					maxNativeZoom: 20
				}
			}),
		  GeovistoThemesTool.createTool({
			  id: "geovisto-tool-themes",
			  manager: GeovistoThemesTool.createThemesManager([
				  GeovistoThemesTool.createThemeBasic(),
			  ])
			  }),
			  GeovistoMarkerLayerTool.createTool({
				  id: "geovisto-tool-layer-marker",
				  geoData:  Geovisto.getGeoDataManager([geo])
			  }),
		  ])
	  });
  }

  ngAfterViewInit(): void {
	if (this.map)
  		this.map.draw(Geovisto.getMapConfigManagerFactory().default({
			tools:
				[
					{
						"type": "geovisto-tool-layer-tiles",
						"id": "geovisto-tool-layer-tiles",
						"enabled": true
					},
					{
						"type": "geovisto-tool-themes",
						"id": "geovisto-tool-themes",
						"enabled": true,
						"theme": "basic"
					},
					{
						"type": "geovisto-tool-layer-connection",
						"id": "geovisto-tool-layer-connection",
						"enabled": true,
						"data": {
							"geoData": "data",
							"animateDirection": false
						}
					},
					{
						"type": "geovisto-tool-layer-marker",
						"id": "geovisto-tool-layer-marker",
						"enabled": true,
					}
				]
		}));
  }

}
