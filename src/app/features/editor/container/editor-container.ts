import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Editor } from '../../../core/services/editor/editor';
import { UploadStep } from '../components/upload-step/upload-step';
import { EditStep } from '../components/edit-step/container/edit-step';
import { LibraryGrid } from "../components/library-grid/library-grid";

@Component({
  selector: 'app-editor-container',
  imports: [UploadStep, EditStep, LibraryGrid],
  templateUrl: './editor-container.html',
  styleUrl: './editor-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorContainer {
  public readonly srv = inject(Editor);
  private readonly router = inject(Router);

  public goToExport(): void {
    this.router.navigate(['/export']);
  }

  public goHome(): void {
    this.srv.resetAll();
    this.router.navigate(['/']);
  }
}
