import { Component, OnInit } from '@angular/core';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { GeoServiceService } from './geo-service.service';

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
    private geolocationService: GeoServiceService
  ) {}

  async ngOnInit() {
    await this.checkGeoPermission();
  }

  async checkGeoPermission() {
    const hasPermission = await Geolocation.checkPermissions();

    if(hasPermission.location !== 'granted'){
      const permission = await Geolocation.requestPermissions();

      if (permission.location !== 'granted' ){
        console.log('Location permission not grantes');
      }
    }
  }

  async getGeolocation() {

    if ( !this.post.position ) {
      this.post.coords = null;
      return;
    }

    try {
      this.loadingGeo = true;

      const positionOptions: PositionOptions = {
        maximumAge: 0,
        timeout: 10000
      }

      const position = await Geolocation.getCurrentPosition(positionOptions);

      this.loadingGeo = false;

      const coords = `${position.coords.latitude}, ${position.coords.longitude}`;

      this.post.coords = coords;

      console.log(coords);

      // Obtener la direccion de las coordenadas

      const address = await this.geolocationService.getAddressFromCoords(position.coords.latitude, position.coords.longitude);
      this.post.address = address;
      console.log(address);

    } catch (error) {
      console.log('Error getting location', error);
      this.loadingGeo = false;
    }
  }



}
