import { Component, OnInit } from '@angular/core';
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

  flights: any[] = [];

  constructor(
    private auth: AuthService,
    private flightService: FlightService
  ) {}

  get admin() {
    return this.auth.currentUser();
  }

  ngOnInit() {
    this.loadFlights();
  }

  loadFlights() {
    this.flightService.getAllFlights().subscribe(res => {
      this.flights = res as any[];
    });
  }
}
