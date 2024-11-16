import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AnimatedCounterDirective } from '../../directives/animated-counter.directive';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, AnimatedCounterDirective],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
@Input() data: any

}
