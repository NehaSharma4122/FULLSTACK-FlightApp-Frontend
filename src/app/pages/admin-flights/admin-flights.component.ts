import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-admin-flights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-flights.component.html',
  styleUrls: ['./admin-flights.component.css']
})
export class AdminFlightsComponent implements OnInit {

  flights: any[] = [];
  loading = false;

  constructor(private flightService: FlightService) {}

  ngOnInit() {
    this.loadFlights();
  }

  loadFlights() {
    this.loading = true;

    this.flightService.getAllFlights()
      .subscribe({
        next: (res: any) => {
          this.flights = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Failed to load flights');
        }
      });
  }
}
