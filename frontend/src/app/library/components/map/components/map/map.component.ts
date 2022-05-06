import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Geovisto, IMap} from 'geovisto';
import {GeovistoTilesLayerTool} from 'geovisto-layer-tiles';
import {GeovistoThemesTool} from 'geovisto-themes';
import * as L from "leaflet"
import {icon, Marker} from "leaflet"

/**
 * Simple map component showing a pin
 */
@Component({
  selector: 'sensor-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  constructor() { }
  @Input()
  latitude: number = 49.19522;
  @Input()
  longitude: number = 16.60796;
  private map: IMap | undefined;
  private marker?: Marker;

  ngOnChanges() {
    this.marker?.setLatLng({lat: this.latitude, lng: this.longitude});
  }

  ngOnInit(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    Marker.prototype.options.icon = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    this.map?.getState().getLeafletMap();
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

    if (this.map?.getState()?.getLeafletMap()) {
      this.marker = L.marker({lat: this.latitude, lng: this.longitude}).addTo(this.map.getState().getLeafletMap() as L.Map);
    }
  }

}
