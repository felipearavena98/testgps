import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GeoServiceService {

  constructor(
    private http: HttpClient
  ) { }

  async getAddressFromCoords(lat: number, lng: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const response: any = await this.http.get(url).toPromise();

    if(response && response.display_name){
      return response.display_name
    } else {
      throw new Error('Unable to retrieve address from coordinates');
    }
  }

  async getNearbyLocations(lat: number, lon: number, token: string) {
    const url = `http://localhost:3000/api/v1/gps-location/location?lat=${lat}&lon=${lon}`;
    const headers = { 'Authorization': 'Bearer ' + token };
    return this.http.get(url, { headers }).toPromise();
  }
}
