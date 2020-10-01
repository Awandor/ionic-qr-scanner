# QR SCANNER

Genereada con > `ionic start qr-scanner tabs`

Creamos directorio pages y reubicamos los tabs ahí

## Ciclo de vida en Ionic

Aparte de los hooks del ciclo de vida de Angular, Ionic ofrece otros 4

1. `ionViewWillEnter`: Fired when the component routing to is about to animate into view.
2. `ionViewDidEnter`: Fired when the component routing to has finished animating.
3. `ionViewWillLeave`: Fired when the component routing from is about to animate.
4. `ionViewDidLeave`: Fired when the component routing to has finished animating.

Los probamos en tab1

## Barcode scanner

Vamos a la documentación de Ionic > Native > Barcode Scanner

> `ionic cordova plugin add phonegap-plugin-barcodescanner`

Y para trabajar con él desde Typescript

> `npm install @ionic-native/barcode-scanner`

También hay un QR scanner pero sólo escanea códigos QR, el Barcode Scanner escanea códigos de barra y QR

Abrimos página de Generador QR-code: `https://www.qrcode.es/es/generador-qr-code/`

Aquí podemos generar códigos QR para hacer pruebas con la app


## Importamos el plugin

Todos los plugins de componentes nativos se importan igual en `app.module`

`import {Camera} from '@ionic-native/camera/ngx';`

Esta misma línea la copiamos en el tab1

Nos fijamos en la documentación y creamos el método scan


## Correr la app en un Android real

Conectar el móvil por USB al ordenador. En el móvil tengo que haber activado que soy un desarrollador. 
Entrar en Opciones para desarrolladores > Depuración por USB > ON

Ahora abrir CMD en la carpeta del proyecto > `ionic cordova run --list`

En GIT Bash no funciona

Tomar nota de `Available android devices`, por ejemplo: Xiaomi Mi A1 (API 28) 5e346adb0504
Anotar 5e346adb0504

> `ionic cordova run android --target=5e346adb0504`

> `ionic cordova run android --target=5e346adb0504 -l` para tener live reload!

Esperar a que se cree la carpeta WWW y se pueble de archivos

Esperar a que salga el mensaje: `Run Successful` y termine, es posible que haya que estar viendo la aplicación en el móvil
para que termine.

Es mejor tener Android Studio cerrado pues puede haber problemas con la versión del gradle

Para inspeccionar la app abrir una página en blanco del navegador y abrimos el depurador
Tres puntitos > More Tools > Remote devices

En la parte de la aplicación > Inspect

Ya podemos ver por Consola los mensajes de la app


## Modelo para manejar la información de QR

Creamos una carpeta `models` en `app` y creamos dentro un archivo `registro.model.ts`

Un modelo es una sencilla clase que tiene las propiedades y métodos que necesitamos para trabajar un registro de un escaneo.

Al escanear recibimos una respuesta con format y text


## Servicio para almacenar escaneos

> `ionic g s services/local-data`

Creamos el método `guardarRegistro` que almacena los datos en un arreglo de tipo `RegistroQr`

Ahora inyectamos el servicio en `tab1`

Para almacenar datos en el Storage vamos a la documentación

> `ionic cordova plugin add cordova-sqlite-storage`

> `npm install --save @ionic/storage`

Lo importamos en `app.module` `import { IonicStorageModule } from '@ionic/storage';`

`IonicStorageModule.forRoot()` Se importa con .forRoot()

Y ahora lo importamos en `local-data.service` `import { Storage } from '@ionic/storage';`

Creamos los métodos de guardar y cargar datos del Storage

Creamos método para abrir un registro, dependiendo de que tipo es se abrirá el navegador por defecto y se irá a la url
para ello usamos el plugin nativo `In App Browser`

> `ionic cordova plugin add cordova-plugin-inappbrowser`

> `npm install @ionic-native/in-app-browser`

Importamos en app.module y en local-data.service

## Crear API key en Mapbox

`www.mapbox.com` Nos registramos para crear cuenta y acceder a la API Key

pk.eyJ1IjoiYXdhbmRvciIsImEiOiJja2ZwcXd3cmYwN3h0MzVycGFvbmNwNzV1In0._A55aLztLaXI8s5sDqe69w

## Crear página de mapa

> ionic g page pages/mapa

Tenemos que modificar las rutas pues queremos que mapa esté dentro de tabs/mapa

Cuando se clica sobre un registro tipo geo en tab2 nos vamos a mapa que recibe las coordenadas

Vamos a la documentación de Mapbox > Dashboard > Install Maps SDK para Web JS > CDN

Copiamos y pegamos el estilo y la librería js en index y vamos a next

Copiamos la inizialización del mapa en mapa, usaremos el ciclo de vida de Angular ngAfterViewInit

En la documentación vamos a next y llegamos a los tipos de mapas, escogemos 3D buildings


## Enviar Email

El método lo construimos en `local-data.service` y llamamos a ese método desde `tab2`

Creamos una variable con los datos del Historial en formato CSV con saltos de línea

Para poder crear un archivo en el dispositivo usamos el plugin nativo File que nos permite leer y escribir archivos

> `ionic cordova plugin add cordova-plugin-file`

> `npm install @ionic-native/file`

Importamos en app.module y en local-data.service

Creamos método para escribir archivo con el contenido CSV

Para enviar el archivo como email con adjunto usamos el plugin nativo Email Composer

> `ionic cordova plugin add cordova-plugin-email-composer`

> `npm install @ionic-native/email-composer`

Importamos en app.module y en local-data.service

Implementamos el código según la documentación

## Splash screen y App Icon

La imagen para la App Icon debe de ser mínimo 1024 x 1024

La imagen para el Splash debe se ser mínimo 3000 x 3000

Información útil > `https://blog.ionicframework.com/automating-icons-and-splash-screens/`

Las imágenes van en resources > icon.png y splash.png

Una vez las tenemos > `ionic cordova resources`

Hay que tener instalado de forma global con permiso de administrador > `npm i -g cordova-res`

Si solo queremos generar los icons > `ionic cordova resources --icon`

Si solo queremos generar los splash > `ionic cordova resources --splash`

Esto crea versiones de las imágenes para Android e Ios

Para animaciones tenemos ejemplos en `https://loading.io/`

Se puede controlar el comportamiento del splash en `config.xml`

Editamos y añadimos algunas preferencias

<preference name="FadeSplashScreenDuration" value="300" />
<preference name="SplashScreenDelay" value="10000" />
<preference name="AutoHideSplashScreen" value="false" />
<preference name="showSplashScreen" value="true" />
<preference name="fadeSplashScreen" value="true" />

Ponemos la duración del spash a 10 segundos, pero ionic la cerrará en cuanto esté lista la app, para ello verificar en `app.component.ts`
que `initializeApp()` tiene `this.splashScreen.hide()`

Ahora importamos en `app.component.ts` `timer` y lo implementamos.

En `app.component.html` añadimos un div con nuestra animación y en `app.component.scss` controlamos la animación por css

Consultar la documentación de Cordova para entender lo que hacen los diferentes parámetros del splash
`https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/index.html`


## GIT
Añadimos los cambios a GIT> `git add .`
Commit > `git commit -m "Primer commit"`

Si en este punto borro accidentalmente algo puedo recuperarlo con > `git checkout -- .`

Que nos recontruye los archivos tal y como estaban en el último commit.

Enlazamos el repositorio local con un repositorio externo en GitHub donde tenemos cuenta y hemos creado un repositorio
`git remote add origin https://github.com/Awandor/ionic-qr-scanner.git`

Situarnos en la rama master > `git branch -M master`

Subir todos los cambios a la rama master remota > `git push -u origin master`

Para reconstruir en local el código de GitHub nos bajamos el código y ejecutamos `npm install` que instala todas las dependencias