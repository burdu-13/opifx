import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Editor } from '../../../core/services/editor';
import { UploadStep } from '../components/upload-step/upload-step';
import { EditStep } from '../components/edit-step/edit-step';

@Component({
  selector: 'app-editor-container',
  imports: [UploadStep, EditStep],
  templateUrl: './editor-container.html',
  styleUrl: './editor-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorContainer {
  public readonly srv = inject(Editor);
}
