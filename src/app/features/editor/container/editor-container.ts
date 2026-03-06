import { Component, inject } from '@angular/core';
import { Editor } from '../../../core/services/editor';
import { UploadStep } from "../components/upload-step/upload-step";

@Component({
  selector: 'app-editor-container',
  imports: [UploadStep],
  templateUrl: './editor-container.html',
  styleUrl: './editor-container.scss',
})
export class EditorContainer {
  public readonly srv = inject(Editor);
}
