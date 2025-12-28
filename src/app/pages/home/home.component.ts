import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../services/flight.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchData = {
    from: '',
    to: '',
    travelDate: '',
    returnDate: '',
    tripType: 'ONE_WAY'
  };
  flights: any[] = [];

  constructor(private flightService: FlightService) {}

  // onSearch() {

  //   const req = {
  //     fromPlace: this.searchData.from,
  //     toPlace: this.searchData.to,
  //     travelDate: this.searchData.travelDate,
  //     returnDate: this.searchData.tripType === 'ROUND_TRIP'
  //                 ? this.searchData.returnDate
  //                 : null,
  //     tripType: this.searchData.tripType
  //   };

  //   this.flightService.searchFlights(req)
  //     .subscribe((data: any[]) => {
  //       this.flights = data;
  //     });
  // }
}