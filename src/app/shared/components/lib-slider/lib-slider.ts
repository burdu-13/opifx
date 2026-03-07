import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-lib-slider',
  imports: [],
  templateUrl: './lib-slider.html',
  styleUrl: './lib-slider.scss',
})
export class LibSlider {
  public readonly label = input.required<string>();
  public readonly value = input.required<number>();
  public readonly unit = input<string>('%');
  public readonly min = input<number>(0);
  public readonly max = input<number>(200);
  public readonly stepSize = input<number>(1);

  public readonly valueChange = output<number>();

  public onInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.valueChange.emit(Number(val));
  }
}
