import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enter-domain',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './enter-domain.component.html',
  styleUrls: ['./enter-domain.component.sass']
})
export class EnterDomainComponent {
  domain: string = '';

  constructor(private router: Router) { }

  onSubmit() {
    if (this.domain) {
      this.router.navigate(['/assets-scan', this.domain]);
    }
  }
}
