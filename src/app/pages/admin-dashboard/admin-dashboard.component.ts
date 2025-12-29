import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  allFlightsCount = signal(0);
  flights = signal<any[]>([]);

  constructor(
    private auth: AuthService,
    private flightService: FlightService
  ) {}

  get admin() {
    return this.auth.currentUser();
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
      this.flightService.getAllFlights().subscribe(res => {
      this.allFlightsCount.set(res.length);
      this.flights.set(res.slice(-3).reverse()); 
    });
  }
}
