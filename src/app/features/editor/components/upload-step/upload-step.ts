import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LibButton } from '../../../../shared/components/lib-button/lib-button';
import { Editor } from '../../../../core/services/editor/editor';

@Component({
  selector: 'app-upload-step',
  imports: [LibButton],
  templateUrl: './upload-step.html',
  styleUrl: './upload-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadStep {
  private readonly srv = inject(Editor);
  private readonly router = inject(Router);

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

    this.readFileAsDataURL(file).subscribe((base64) => {
      this.srv.setImage(base64);
      this.router.navigate(['/edit']);
    });
  }

  private readFileAsDataURL(file: File): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        observer.next(e.target?.result as string);
        observer.complete();
      };
      reader.onerror = (e) => observer.error(e);
      reader.readAsDataURL(file);
    });
  }
}
