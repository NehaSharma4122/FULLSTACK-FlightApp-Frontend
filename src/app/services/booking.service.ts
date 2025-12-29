import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = 'http://localhost:8091/microservice-bookingservice/api/flight';

  constructor(private http: HttpClient) {}

  bookFlight(flightId: string, bookingData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/booking/${flightId}`, bookingData);
  }

  getTicket(pnr: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/ticket/${pnr}`);
  }

  getBookingHistory(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/booking/history/${email}`);
  }

  cancelTicket(pnr: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/booking/cancel/${pnr}`, { responseType: 'text' as 'json' });
  }
}