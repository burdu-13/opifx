import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-lib-slider',
  imports: [],
  templateUrl: './lib-slider.html',
  styleUrl: './lib-slider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibSlider {
  public readonly label = input.required<string>();
  public readonly value = input.required<number>();
  public readonly unit = input<string>('%');
  public readonly min = input<number>(0);
  public readonly max = input<number>(200);
  public readonly stepSize = input<number>(1);

  public readonly valueChange = output<number>();

  public readonly trackWidth = computed(() => {
    const val = this.value();
    const mn = this.min();
    const mx = this.max();
    const percentage = ((val - mn) / (mx - mn)) * 100;
    return Math.min(100, Math.max(0, percentage));
  });

  public onInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.valueChange.emit(Number(val));
  }
}
