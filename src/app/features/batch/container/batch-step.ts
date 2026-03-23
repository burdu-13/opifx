import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { Editor } from '../../../core/services/editor/editor';
import { LibButton } from '../../../shared/components/lib-button/lib-button';

@Component({
  selector: 'app-batch-step',
  imports: [LibButton],
  templateUrl: './batch-step.html',
  styleUrl: './batch-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchStepContainer {
  public readonly editorSrv = inject(Editor);
  private readonly router = inject(Router);

  public readonly isDragging = signal<boolean>(false);

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.processFiles(Array.from(input.files));
    }
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files?.length) {
      this.processFiles(Array.from(event.dataTransfer.files));
    }
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  public onDragLeave(): void {
    this.isDragging.set(false);
  }

  private processFiles(files: File[]): void {
    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (!validFiles.length) return;

    const iterators = validFiles.map((file) => this.readFileAsDataURL(file));

    forkJoin(iterators).subscribe((parsedImages) => {
      if (parsedImages.length > 0) {
        this.editorSrv.addImages(parsedImages);
        this.editorSrv.setActiveImage(null);
      }
    });
  }

  private readFileAsDataURL(file: File): Observable<{ id: string; name: string; url: string }> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        observer.next({
          id: crypto.randomUUID(),
          name: file.name,
          url: e.target?.result as string,
        });
        observer.complete();
      };
      reader.onerror = (err) => observer.error(err);
      reader.readAsDataURL(file);
    });
  }

  public openEditor(id: string): void {
    this.editorSrv.setActiveImage(id);
    this.router.navigate(['/edit']);
  }

  public goToExport(): void {
    if (this.editorSrv.imagesList().length > 0) {
      this.router.navigate(['/export']);
    }
  }
}
