import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = environment.bookingApi;

  constructor(private http: HttpClient) {}

  bookFlight(flightId: string, bookingRequest: any) {
    return this.http.post(`${this.baseUrl}/booking/${flightId}`, bookingRequest);
  }

  getTicket(pnr: string) {
    return this.http.get(`${this.baseUrl}/ticket/${pnr}`);
  }

  getBookingHistory(email: string) {
    return this.http.get(`${this.baseUrl}/booking/history/${email}`);
  }

  cancelTicket(pnr: string) {
    return this.http.delete(`${this.baseUrl}/booking/cancel/${pnr}`, { responseType: 'text' });
  }
}
