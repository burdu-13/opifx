import { ChangeDetectionStrategy, Component, signal, output } from '@angular/core';
import { LibButton } from '../../../../shared/components/lib-button/lib-button';

@Component({
  selector: 'app-upload-step',
  imports: [LibButton],
  templateUrl: './upload-step.html',
  styleUrl: './upload-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadStep {
  public readonly filesSelected = output<File[]>();
  public readonly isDragging = signal<boolean>(false);

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.filesSelected.emit(Array.from(input.files));
    }
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.filesSelected.emit(Array.from(event.dataTransfer.files));
    }
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  public onDragLeave(): void {
    this.isDragging.set(false);
  }
}
