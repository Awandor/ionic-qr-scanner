import { Component } from '@angular/core';
import { LocalDataService } from '../../services/local-data.service';
import { RegistroQr } from '../../models/registro.model';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

    // localDataService tiene que ser public para usarse en el html

    constructor(public localDataService: LocalDataService) { }

    enviarCorreo() {

        console.log('Enviando correo');

        this.localDataService.enviarMail();

    }

    abrirRegistro(registro: RegistroQr) {

        console.log('Registro', registro);

        this.localDataService.abrirRegistro(registro);

    }

}
