import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Editor } from '../../../core/services/editor';
import { UploadStep } from '../components/upload-step/upload-step';
import { EditStep } from '../components/edit-step/edit-step';
import { PRESETS } from '../../../shared/config/presets.config';

@Component({
  selector: 'app-editor-container',
  imports: [UploadStep, EditStep],
  templateUrl: './editor-container.html',
  styleUrl: './editor-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorContainer {
  public readonly srv = inject(Editor);

  public onPresetApplied(presetId: string): void {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      this.srv.applyPreset(preset);
    }
  }
}
