import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-admin-flights',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-flights.component.html',
  styleUrls: ['./admin-flights.component.css']
})
export class AdminFlightsComponent implements OnInit {
  flights = signal<any[]>([]); 
  loading = signal<boolean>(false);

  constructor(private flightService: FlightService) {}

  ngOnInit() {
    this.loadFlights();
  }

  loadFlights() {
    this.loading.set(true);
    console.log("Fetching full inventory...");
    
    this.flightService.getAllFlights().subscribe({
      next: (res) => {
        console.log("Data received for Table:", res);
        this.flights.set(res);
        this.loading.set(false); // This stops the spinner
      },
      error: (err) => {
        console.error("API Error:", err);
        this.loading.set(false);
        alert('Backend connection failed.');
      }
    });
  }
}