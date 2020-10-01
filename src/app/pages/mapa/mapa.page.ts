import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any;

@Component({
    selector: 'app-mapa',
    templateUrl: './mapa.page.html',
    styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

    lat: number;
    lng: number;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {

        let geo: any = this.route.snapshot.paramMap.get('geo');

        geo = geo.substring(4);

        geo = geo.split(','); // Convierto geo en un arreglo

        this.lat = Number(geo[0]); // Los pasamos a números

        this.lng = Number(geo[1]);

        console.log(this.lat, this.lng);
    }

    ngAfterViewInit() {

        // mapboxgl viene de la librería Mapbox pero aquí no lo reconoce, vamos a declararla antes del componente

        mapboxgl.accessToken = 'pk.eyJ1IjoiYXdhbmRvciIsImEiOiJja2ZwcXd3cmYwN3h0MzVycGFvbmNwNzV1In0._A55aLztLaXI8s5sDqe69w';

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v10',
            center: [this.lng, this.lat], // Alrevés de lo que suele ser
            zoom: 15.5,
            pitch: 45,
            bearing: -17.6,
            antialias: true
        });

        const marker = new mapboxgl.Marker()
            .setLngLat([this.lng, this.lat])
            .addTo(map);

        // The 'building' layer in the mapbox-streets vector source contains building-height data from OpenStreetMap.
        map.on('load', () => {

            // Si no usamos función flecha perdemos la referencia de this

            // Marker

            // Usamos este método de Mapbox para ajustar el tamaño del mapa a la pantalla
            map.resize();

            // Insert the layer beneath any symbol layer.
            const layers = map.getStyle().layers;

            let labelLayerId: any;

            for (const value of layers) {

                if (value.type === 'symbol' && value.layout['text-field']) {
                    labelLayerId = value.id;
                    break;
                }

            }

            /* for (let i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                    labelLayerId = layers[i].id;
                    break;
                }
            } */

            map.addLayer(
                {
                    id: '3d-buildings',
                    source: 'composite',
                    'source-layer': 'building',
                    filter: ['==', 'extrude', 'true'],
                    type: 'fill-extrusion',
                    minzoom: 15,
                    paint: {
                        'fill-extrusion-color': '#aaa',

                        // use an 'interpolate' expression to add a smooth transition effect to the
                        // buildings as the user zooms in
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.6
                    }
                },
                labelLayerId
            );
        });

    }

}
