import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Editor } from '../../../core/services/editor/editor';

@Component({
  selector: 'app-editor-container',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './editor-container.html',
  styleUrl: './editor-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorContainer {
  public readonly srv = inject(Editor);
  private readonly router = inject(Router);

  public goHome(): void {
    this.srv.resetAll();
    this.router.navigate(['/']);
  }

  public goToBatch(): void {
    this.srv.resetAll();
    this.router.navigate(['/batch']);
  }
}
