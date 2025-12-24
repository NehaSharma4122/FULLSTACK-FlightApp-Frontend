import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-search-flights',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './search-flights.component.html',
  styleUrl: './search-flights.component.css'
})
export class SearchFlightsComponent {
  searchData = { from: '', fromName: '', to: '', toName: '', date: '' };
  fromSuggestions: any[] = [];
  toSuggestions: any[] = [];
  flights: any[]=[];
  loading=false;
  errors = {
    from: '',
    to: '',
    date: '',
    general: ''
  };

  constructor(private flightService: FlightService) {}

  validateForm(): boolean {
    // reset errors
    this.errors = { from: '', to: '', date: '', general: '' };

    let valid = true;

    if (!this.searchData.from) {
      this.errors.from = 'Please select a departure city';
      valid = false;
    }

    if (!this.searchData.to) {
      this.errors.to = 'Please select a destination city';
      valid = false;
    }
    if (this.searchData.from && this.searchData.to &&
        this.searchData.from === this.searchData.to) {
      this.errors.general = 'Departure and destination cannot be the same';
      valid = false;
    }

    if (!this.searchData.date) {
      this.errors.date = 'Please select a travel date';
      valid = false;
    } else {
      const today = new Date();
      today.setHours(0,0,0,0);

      const selectedDate = new Date(this.searchData.date);
      if (selectedDate < today) {
        this.errors.date = 'Travel date cannot be in the past';
        valid = false;
      }
    }
    return valid;
  }
  onSearch() {
    if (!this.validateForm()) return;
    this.loading = true;
    this.flightService.searchFlights(this.searchData.from, this.searchData.to, this.searchData.date)
      .subscribe({
        next: (res: any) => {
          this.flights = res.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert("Error fetching flights. Please try again");
        }
      });
  }
  onCitySearch(event: any, type: 'from' | 'to') {
    const query = event.target.value;
    if (query.length > 0) { 
      this.flightService.searchCities(query).subscribe(res => {
        if (type === 'from') this.fromSuggestions = res.data;
        else this.toSuggestions = res.data;
      });
    }
    else{
      this.fromSuggestions=[]
      this.toSuggestions=[]
    }
  }

  selectCity(city: any, type: 'from' | 'to') {
    if (type === 'from') {
      this.searchData.from = city.iataCode;
      this.searchData.fromName = `${city.name} (${city.iataCode})`;
      this.fromSuggestions = []; 
    } else {
      this.searchData.to = city.iataCode;
      this.searchData.toName = `${city.name} (${city.iataCode})`;
      this.toSuggestions = []; 
    }
  }

  bookFlight(flight: any) {
    const existing = JSON.parse(localStorage.getItem('myBookings') || '[]');
    existing.push({
      id: flight.id,
      from: this.searchData.from,
      to: this.searchData.to,
      date: this.searchData.date,
      price: flight.price.total
    });
    localStorage.setItem('myBookings', JSON.stringify(existing));
    alert("Flight Booked Successfully!");
  }
}