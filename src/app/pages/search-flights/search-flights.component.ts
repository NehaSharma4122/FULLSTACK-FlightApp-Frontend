import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-flights',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './search-flights.component.html',
  styleUrl: './search-flights.component.css'
})
export class SearchFlightsComponent {
  searchData = {
    from: '',
    to: '',
    travelDate: '',
    returnDate: '',
    tripType: 'ONE_WAY'
  };
  flights: any[] = [];
  loading = false;

  errors: any = {
    from: '',
    to: '',
    date: '',
    returnDate: '',
    general: ''
  };


  constructor(private flightService: FlightService,   private router: Router) {}

  validateForm(): boolean {

    this.errors = { from: '', to: '', date: '', returnDate: '', general: '' };
    let valid = true;

    if (!this.searchData.from) {
      this.errors.from = 'Please enter origin';
      valid = false;
    }

    if (!this.searchData.to) {
      this.errors.to = 'Please enter destination';
      valid = false;
    }

    if (this.searchData.from === this.searchData.to) {
      this.errors.general = 'Origin & destination cannot be same';
      valid = false;
    }

    if (!this.searchData.travelDate) {
      this.errors.date = 'Select departure date';
      valid = false;
    }

    // ---- ROUND TRIP VALIDATION ----
    if (this.searchData.tripType === 'ROUND_TRIP') {

      if (!this.searchData.returnDate) {
        this.errors.returnDate = 'Select return date';
        valid = false;
      }

      if (this.searchData.returnDate < this.searchData.travelDate) {
        this.errors.returnDate = 'Return date cannot be before departure';
        valid = false;
      }
    }

    return valid;
  }
 onSearch() {

    if (!this.validateForm()) return;

    this.loading = true;

    const req = {
      fromPlace: this.searchData.from,
      toPlace: this.searchData.to,
      travelDate: this.searchData.travelDate,
      returnDate: this.searchData.tripType === 'ROUND_TRIP'
                  ? this.searchData.returnDate
                  : null,
      tripType: this.searchData.tripType
    };

    this.flightService.searchFlights(req)
      .subscribe({
        next: (res: any) => {
          this.flights = res;  // Flux -> array
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert("Error fetching flights");
        }
      });
  }

  goToBooking(f: any) {
    localStorage.setItem('selectedFlight', JSON.stringify({
      flightId: f.flightId,
      from: f.fromPlace,
      to: f.toPlace,
      date: f.travelDate,
      price: f.price
    }));

    this.router.navigate(['/booking']);
  }

}