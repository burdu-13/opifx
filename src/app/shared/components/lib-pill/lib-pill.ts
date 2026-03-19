import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-lib-pill',
  imports: [],
  templateUrl: './lib-pill.html',
  styleUrl: './lib-pill.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibPill {
  public readonly active = input<boolean>(false);
  public readonly selected = output<void>();
}
