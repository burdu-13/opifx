import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LibButton } from '../../shared/components/lib-button/lib-button';
import { ImageStore } from '../../store/image.store';
import { HERO_CONTENT } from './config/layout.config';

@Component({
  selector: 'app-app-layout',
  imports: [LibButton, RouterOutlet],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayout {
  protected readonly store = inject(ImageStore);
  private readonly router = inject(Router);

  public readonly hasImages = computed(() => this.store.imagesList().length > 0);
  public readonly isDragging = signal(false);
  public readonly content = HERO_CONTENT;

  public handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.processFiles(Array.from(input.files));
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files) this.processFiles(Array.from(event.dataTransfer.files));
  }

  private processFiles(files: File[]): void {
    const images = files
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
      }));

    if (images.length > 0) {
      this.store.addImages(images);
      this.router.navigate([images.length > 1 ? '/batch' : '/edit']);
    }
  }

  public onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(true);
  }
  public onDragLeave(): void {
    this.isDragging.set(false);
  }
}
