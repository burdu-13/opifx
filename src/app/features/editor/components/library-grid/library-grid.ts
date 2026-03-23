import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ImageState } from '../../../../shared/interfaces/editor.interface';
import { LibButton } from "../../../../shared/components/lib-button/lib-button";

@Component({
  selector: 'app-library-grid',
  imports: [LibButton],
  templateUrl: './library-grid.html',
  styleUrl: './library-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryGrid {
  public readonly images = input.required<ImageState[]>();
  public readonly select = output<string>();
  public readonly process = output<void>();
}
