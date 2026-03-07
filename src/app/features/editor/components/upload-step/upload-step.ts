import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-upload-step',
  imports: [],
  templateUrl: './upload-step.html',
  styleUrl: './upload-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadStep {
  public readonly imageSelected = output<string>();
  public readonly isDragging = signal<boolean>(false);

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.processFile(input.files[0]);
    }
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);

    if (event.dataTransfer?.files?.[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  public onDragLeave(): void {
    this.isDragging.set(false);
  }

  private processFile(file: File): void {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      this.imageSelected.emit(base64);
    };
    reader.readAsDataURL(file);
  }
}
