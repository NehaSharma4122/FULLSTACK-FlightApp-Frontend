import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FlightResponse {
  id: string;
  airline_name: string;
  airline_logo: string;
  flightNumber: string;
  fromPlace: string;
  toPlace: string;
  departure: string;
  arrival: string;
  price: number;
  availableSeats: number;
  mealType: string;
}

@Injectable({ providedIn: 'root' })
export class FlightService {

  private baseUrl =
    'http://localhost:8091/microservice-flightservice/api/flight';

  constructor(private http: HttpClient) {}

  searchFlights(req: any):Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/search`, req);
  }


  addFlight(flightData: any): Observable<FlightResponse> {
    return this.http.post<FlightResponse>(`${this.baseUrl}/airline/inventory`, flightData);
  }

  getAllFlights(): Observable<FlightResponse[]> {
    return this.http.get<FlightResponse[]>(`${this.baseUrl}/airline/inventory/all`);
  }
}
