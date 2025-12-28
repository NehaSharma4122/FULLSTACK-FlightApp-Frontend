import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FlightService {

  private baseUrl =
    'http://localhost:8091/microservice-flightservice/api/flight';

  constructor(private http: HttpClient) {}

  // USER + ADMIN
  searchFlights(req: any) {
    return this.http.post(`${this.baseUrl}/search`, req);
  }

  // ADMIN ONLY
  getAllFlights() {
    return this.http.get(`${this.baseUrl}/airline/inventory/all`);
  }

  // ADMIN ONLY
  addFlight(flight: any) {
    return this.http.post(`${this.baseUrl}/airline/inventory`, flight);
  }
}
