import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-lib-button',
  imports: [],
  templateUrl: './lib-button.html',
  styleUrl: './lib-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibButton {
  public readonly variant = input<'primary' | 'secondary' | 'ghost'>('primary');
  public readonly type = input<'button' | 'submit'>('button');
  public readonly disabled = input<boolean>(false);
  public readonly loading = input<boolean>(false);
  public readonly clicked = output<MouseEvent>();
}
