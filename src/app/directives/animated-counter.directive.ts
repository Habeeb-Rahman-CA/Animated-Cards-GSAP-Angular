import { animate } from '@angular/animations';
import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Subject, takeUntil, timer } from 'rxjs';

const DEFAULT_ANIMATION_SPEED = 8;

@Directive({
  selector: '[appAnimatedCounter]',
  standalone: true,
})
export class AnimatedCounterDirective implements OnInit, OnDestroy {
  @Input('appAnimatedCounter') value!: number;
  @Input() delay = 0;
  @Input() speed = DEFAULT_ANIMATION_SPEED;

  staticText!: string;

  private destroyed$ = new Subject<void>();
  private startingValue = 0;
  private startingValueDecimal = 0;
  private safeValidate(value: any): boolean {
    return typeof value === 'number'
  }

  private animate(): void {
    if (this.value && this.safeValidate(this.value)) {
      const start = () =>{
        if (this.startingValue < this.value) {
          this.startingValue++
          this.renderer.setProperty(this.el.nativeElement, 'textContent', `${this.startingValue}${this.staticText ? this.staticText : ''}`)
          setTimeout(start, this.speed);
        } else if(this.hasDecimal) {
          if(this.startingValueDecimal < this.getDecimalValuePortion(1)){
            this.startingValueDecimal++
            this.renderer.setProperty(this.el.nativeElement, 'textContent', `${this.getDecimalValuePortion(0)},${this.startingValueDecimal}${this.staticText ? this.staticText : ''}`)
          }
        }
      }
      start()
    }
  }

  private get hasDecimal(): boolean {
    const decimalPortion = this.getDecimalValuePortion(1)
    if (decimalPortion !== undefined) {
      return true
    }
    return false
  }

  private getDecimalValuePortion(indexPosition: number): number{
    const decimal = this.value.toString().split('.')[indexPosition]
    return parseFloat(decimal)
  }

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {

    if (!!this.el.nativeElement.textContent) {
      this.staticText = this.el.nativeElement.textContent
    }

    if(this.delay > 0){
      this.renderer.setProperty(this.el.nativeElement, 'textContent', this.startingValue)
    }

    timer(this.delay || 0)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        complete: () => this.animate(),
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next()
    this.destroyed$.complete()
  }
}
