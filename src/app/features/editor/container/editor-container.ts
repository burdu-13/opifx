import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { Editor } from '../../../core/services/editor/editor';

@Component({
  selector: 'app-editor-container',
  imports: [RouterOutlet],
  templateUrl: './editor-container.html',
  styleUrl: './editor-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorContainer {
  public readonly srv = inject(Editor);
  private readonly router = inject(Router);

  public goHome(): void {
    this.srv.reset();
    this.router.navigate(['/']);
  }
}
