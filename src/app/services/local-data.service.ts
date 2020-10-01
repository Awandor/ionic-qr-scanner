import { Injectable } from '@angular/core';
import { RegistroQr } from '../models/registro.model';

import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
    providedIn: 'root'
})
export class LocalDataService {

    historial: RegistroQr[] = [];

    // tslint:disable-next-line: max-line-length
    constructor(private storage: Storage, private navCtrl: NavController, private iab: InAppBrowser, private file: File, private emailComposer: EmailComposer) {

        /* this.storage.get('historial').then(registros => {

            this.historial = registros || [];

        }); */

        this.cargarHistorial();

    }

    guardarRegistro(format: string, text: string) {

        const nuevoRegistro = new RegistroQr(format, text);

        // Añadimos al comienzo del arreglo
        this.historial.unshift(nuevoRegistro);

        // Guardamos en Storage
        this.storage.set('historial', this.historial);

        // Nos vamos a tab2 y si es geolocalización nos vamos a mapa y si es http nos vamos a la web

        this.abrirRegistro(nuevoRegistro);

    }

    async cargarHistorial() {

        this.historial = await this.storage.get('historial') || [];
    }

    abrirRegistro(registro: RegistroQr) {

        // Queremos navegar a tab2 se puede hacer por router de Angular o por Navcontroller de Ionic
        this.navCtrl.navigateForward('/tabs/tab2');

        // En general es mejor usar switch cuando tenemos varias opciones que no son booleanas

        switch (registro.type) {

            case 'http':
                // abrir el navegador por defecto
                this.iab.create(registro.text, '_system');
                break;

            case 'geo':
                // abrir el navegador por defecto
                this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
                break;
        }

    }

    enviarMail() {

        const arregloTemporal = [];

        const titulos = 'Tipo, Formato, Fecha creación, Texto\n';

        arregloTemporal.push(titulos);

        this.historial.forEach(registro => {

            const linea = `${registro.type}, ${registro.format}, ${registro.creationDate}, ${registro.text.replace(',', ' ')}\n`;

            arregloTemporal.push(linea);

        });

        console.log(arregloTemporal.join(''));

        this.crearArchivoFisico(arregloTemporal.join(''));

    }

    crearArchivoFisico(text: string) {

        // Para crear un archivo en el dispositivo usamos el plugin nativo File

        this.file.checkFile(this.file.dataDirectory, 'registros.csv')
            .then(existe => {

                console.log('¿Existe el archivo?', existe);

                return this.escribirEnArchivo(text);

            })
            .catch(err => {

                console.log('File does not exist');

                return this.file.createFile(this.file.dataDirectory, 'registros.csv', false)
                    .then(creado => {

                        this.escribirEnArchivo(text);

                    })
                    .catch(error => {

                        console.log('No se pudo crear el archivo', error);

                    });

            });

    }

    async escribirEnArchivo(text: string) {

        await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);

        console.log('Archivo creado');

        const archivo = `${this.file.dataDirectory}registros.csv`;

        const email = {
            to: 'dan.anders.haggblom@gmail.com',
            /* cc: 'erika@mustermann.de',
            bcc: ['john@doe.com', 'jane@doe.com'], */
            attachments: [
                /* 'file://img/logo.png',
                'res://icon.png',
                'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...', */
                archivo
            ],
            subject: 'Historial de lecturas de códigos QR',
            body: 'En documento adjunto tienes tu <strong>historial de lecturas de códigos QR</strong> en formato CSV.',
            isHtml: true,
            app: 'com.google.android.gm' // Especificamos que use la app de gmail para enviar, si no se especifica usa la app por defecto
        };

        // Send a text message using default options
        this.emailComposer.open(email); // Esto devuelve una promesa que si queremos podemos gestionar pero no hace falta
    }

}
