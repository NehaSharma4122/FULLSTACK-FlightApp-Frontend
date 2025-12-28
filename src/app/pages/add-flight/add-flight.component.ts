import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css']
})
export class AddFlightComponent {

  flight: any = {
    airline_name: '',
    airline_logo: '',
    flightNumber: '',
    fromPlace: '',
    toPlace: '',
    departure: '',
    arrival: '',
    price: '',
    availableSeats: '',
    mealType: 'BOTH'
  };

  constructor(private flightService: FlightService) {}

  addFlight() {

    this.flightService.addFlight(this.flight)
      .subscribe({
        next: () => {
          alert('Flight Added Successfully');

          this.flight = {
            airline_name: '',
            airline_logo: '',
            flightNumber: '',
            fromPlace: '',
            toPlace: '',
            departure: '',
            arrival: '',
            price: '',
            availableSeats: '',
            mealType: 'BOTH'
          };
        },
        error: () => alert('Failed to add flight')
      });
  }
}
