import { Component } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LocalDataService } from '../../services/local-data.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    constructor(private scanner: BarcodeScanner, private localDataService: LocalDataService) { }

    ionViewWillEnter() {

        console.log('ionViewWillEnter');

    }

    ionViewDidEnter() {

        console.log('ionViewDidEnter');

    }

    ionViewWillLeave() {

        console.log('ionViewWillLeave');

    }

    ionViewDidLeave() {

        console.log('ionViewDidLeave');

    }

    scan() {

        // scan abre la cámara y retorna una promesa que se resuelve cuando encuentra un código

        this.scanner.scan().then(barcodeData => {

            console.log('Barcode data', barcodeData);

            // Si en la app de escanear en el dispositivo una vez aparece la cámara, vamos hacia atrás se considera cancelled

            if (!barcodeData.cancelled) {

                this.localDataService.guardarRegistro(barcodeData.format, barcodeData.text);

            }

        }).catch(err => {

            console.log('Error', err);

            // this.localDataService.guardarRegistro('QRCode', 'http://awandor.com');
            this.localDataService.guardarRegistro('QRCode', 'geo:59.28092199580578,18.802224250231898');

        });

    }

}
