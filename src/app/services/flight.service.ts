import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private apiKey = '5RpaHcWtEil5U7p33qUH5A4ScZN9JOTR';
  private apiSecret = 'BoRF3nhq0WAPqXki';
  private baseUrl = 'https://test.api.amadeus.com';
  constructor(private http: HttpClient) {}

  private getToken(): Observable<any> {
    const payload = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', this.apiKey)
      .set('client_secret', this.apiSecret);

    return this.http.post(`${this.baseUrl}/v1/security/oauth2/token`, payload);
  }

  searchFlights(from: string, to: string, date: string): Observable<any> {
    return this.getToken().pipe(
      switchMap((token: any) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
        const params = new HttpParams()
          .set('originLocationCode', from.toUpperCase()) // Needs IATA code e.g. DEL, BOM
          .set('destinationLocationCode', to.toUpperCase())
          .set('departureDate', date)
          .set('adults', '1')
          .set('max', '10');

        return this.http.get(`${this.baseUrl}/v2/shopping/flight-offers`, { headers, params });
      })
    );
  }
  searchCities(keyword: string): Observable<any> {
    return this.getToken().pipe(
      switchMap((token: any) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token.access_token}`);
        const params = new HttpParams()
          .set('subType', 'CITY,AIRPORT') // Search for both cities and airports
          .set('keyword', keyword)       // What the user is typing
          .set('page[limit]', '5');      // Limit to top 5 results

        return this.http.get(`${this.baseUrl}/v1/reference-data/locations`, { headers, params });
      })
    );
  }
}