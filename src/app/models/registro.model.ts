// exportamos la clase para poder usarla fuera de este archivo

export class RegistroQr {

    public format: string;
    public text: string;
    public type: string;
    public icon: string;
    public creationDate: Date;

    constructor(format: string, text: string) {

        this.format = format;
        this.text = text;
        this.creationDate = new Date();
        this.determinarTipo();
    }

    private determinarTipo() {

        const inicioTexto = this.text.substr(0, 4);

        console.log('tipo', inicioTexto);

        switch (inicioTexto) {

            case 'http':
                this.type = 'http';
                this.icon = 'globe';
                break;

            case 'geo:':
                this.type = 'geo';
                this.icon = 'pin';
                break;

            default:
                this.type = 'unknown';
                this.icon = 'create';
                break;
        }
    }
}
