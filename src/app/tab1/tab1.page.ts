import { Component, OnInit } from '@angular/core';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { GeoServiceService } from './geo-service.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {

  loadingGeo = false;

  post = {
    message: '',
    coords: null as string | null,
    position: false,
    address: null as string | null
  }

  constructor(
    private geolocationService: GeoServiceService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.checkGeoPermission();
  }

  async checkGeoPermission() {
    const hasPermission = await Geolocation.checkPermissions();
  
    while (hasPermission.location !== 'granted') {
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== 'granted') {
        // Mostrar mensaje al usuario solicitando que otorgue permisos de ubicación
        await this.showAlert('Permisos de ubicación requeridos', 'Por favor, otorga permisos de ubicación para poder utilizar la aplicación');
      }
    }
  
    // Verificar si el GPS está encendido
    const isAvailable = await Geolocation.getCurrentPosition();
    if (!isAvailable) {
      // Mostrar mensaje al usuario solicitando que encienda el GPS
      await this.showAlert('GPS requerido', 'Por favor, enciende el GPS para poder utilizar la aplicación');
    }
  }
  
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async getGeolocation() {
    if (!this.post.position) {
      this.post.coords = null;
      return;
    }
  
    try {
      this.loadingGeo = true;
  
      const positionOptions: PositionOptions = {
        maximumAge: 0,
        timeout: 10000,
      };
  
      const position = await Geolocation.getCurrentPosition(positionOptions);
      this.loadingGeo = false;
  
      const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
      this.post.coords = coords;
  
      // Obtener la dirección de las coordenadas
      const address = await this.geolocationService.getAddressFromCoords(
        position.coords.latitude,
        position.coords.longitude
      );
      this.post.address = address;
  

      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsYWJvcmF0b3JUb2tlbiI6IjYwMDUyMWRkLTYzNDEtZDllOC0xNDgyLTU1YjM3OWMwZDc5NiIsInNlc3Npb25Ub2tlbiI6ImQyNjgyOWYxLTlhMjctYWJkYS0wM2VmLTE3NmUwOGZmMjAzYSIsImlhdCI6MTY4Nzc5MjMwNiwiZXhwIjoxNjg3OTY1MTA2fQ.-rlIbw9e62PLvfXrSP9DVbGny9oDKFgLTXfHqGs7ZBE'; 
      // Obtener ubicaciones cercanas desde tu backend
      const nearbyLocations = await this.geolocationService.getNearbyLocations(
        position.coords.latitude,
        position.coords.longitude,
        token
      );
      console.log(nearbyLocations); // Verificar los datos en la consola
  
    } catch (error) {
      console.log('Error getting location', error);
      this.loadingGeo = false;
    }
  }
}
