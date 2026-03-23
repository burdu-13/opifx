import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { CropRect } from '../../interfaces/editor.interface';

@Component({
  selector: 'app-crop-overlay',
  imports: [],
  templateUrl: './crop-overlay.html',
  styleUrl: './crop-overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropOverlay {
  public readonly cropRect = input.required<CropRect>();
  public readonly aspectRatio = input.required<number | null>();
  public readonly imageAspect = input.required<number>();

  public readonly cropChange = output<CropRect>();

  private readonly overlayEl = viewChild<ElementRef<HTMLDivElement>>('overlayRef');

  private dragging = false;
  private resizing = false;
  private activeHandle = '';
  private startX = 0;
  private startY = 0;
  private startCrop: CropRect = { x: 0, y: 0, width: 0, height: 0 };

  public readonly handles = [
    { id: 'nw', cursor: 'nwse-resize' },
    { id: 'n', cursor: 'ns-resize' },
    { id: 'ne', cursor: 'nesw-resize' },
    { id: 'e', cursor: 'ew-resize' },
    { id: 'se', cursor: 'nwse-resize' },
    { id: 's', cursor: 'ns-resize' },
    { id: 'sw', cursor: 'nesw-resize' },
    { id: 'w', cursor: 'ew-resize' },
  ];

  public readonly boxStyle = computed(() => {
    const c = this.cropRect();
    return {
      left: `${c.x * 100}%`,
      top: `${c.y * 100}%`,
      width: `${c.width * 100}%`,
      height: `${c.height * 100}%`,
    };
  });

  public readonly maskClipPath = computed(() => {
    const c = this.cropRect();
    const top = c.y * 100;
    const right = (1 - (c.x + c.width)) * 100;
    const bottom = (1 - (c.y + c.height)) * 100;
    const left = c.x * 100;
    return `inset(${top}% ${right}% ${bottom}% ${left}%)`;
  });

  public getHandleClass(id: string): string {
    return `crop-handle handle-${id}`;
  }

  public onBoxPointerDown(e: PointerEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.dragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startCrop = { ...this.cropRect() };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  public onHandlePointerDown(e: PointerEvent, handleId: string): void {
    e.preventDefault();
    e.stopPropagation();
    this.resizing = true;
    this.activeHandle = handleId;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startCrop = { ...this.cropRect() };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  public onPointerMove(e: PointerEvent): void {
    if (!this.dragging && !this.resizing) return;

    const el = this.overlayEl()?.nativeElement;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dnx = (e.clientX - this.startX) / rect.width;
    const dny = (e.clientY - this.startY) / rect.height;

    if (this.dragging) {
      this.doDrag(dnx, dny);
    } else if (this.resizing) {
      this.doResize(dnx, dny);
    }
  }

  public onPointerUp(): void {
    this.dragging = false;
    this.resizing = false;
    this.activeHandle = '';
  }

  private doDrag(dnx: number, dny: number): void {
    const sc = this.startCrop;
    const x = Math.max(0, Math.min(sc.x + dnx, 1 - sc.width));
    const y = Math.max(0, Math.min(sc.y + dny, 1 - sc.height));
    this.cropChange.emit({ x, y, width: sc.width, height: sc.height });
  }

  private doResize(dnx: number, dny: number): void {
    const sc = this.startCrop;
    const h = this.activeHandle;
    const ratio = this.aspectRatio();
    const imgAspect = this.imageAspect();
    const minSize = 0.03;

    let x = sc.x;
    let y = sc.y;
    let w = sc.width;
    let hh = sc.height;

    if (h.includes('e')) {
      w = Math.max(minSize, Math.min(sc.width + dnx, 1 - sc.x));
    }
    if (h.includes('w')) {
      const newX = Math.max(0, Math.min(sc.x + dnx, sc.x + sc.width - minSize));
      w = sc.width + (sc.x - newX);
      x = newX;
    }
    if (h.includes('s')) {
      hh = Math.max(minSize, Math.min(sc.height + dny, 1 - sc.y));
    }
    if (h.includes('n')) {
      const newY = Math.max(0, Math.min(sc.y + dny, sc.y + sc.height - minSize));
      hh = sc.height + (sc.y - newY);
      y = newY;
    }

    if (ratio !== null && ratio > 0) {
      if (h.includes('n') || h.includes('s')) {
        const targetW = (hh * ratio) / imgAspect;
        w = Math.max(minSize, Math.min(targetW, 1));
        hh = (w * imgAspect) / ratio;
        const centerX = sc.x + sc.width / 2;
        x = Math.max(0, Math.min(centerX - w / 2, 1 - w));
      } else {
        const targetH = (w * imgAspect) / ratio;
        hh = Math.max(minSize, Math.min(targetH, 1));
        w = (hh * ratio) / imgAspect;
        const centerY = sc.y + sc.height / 2;
        y = Math.max(0, Math.min(centerY - hh / 2, 1 - hh));
      }

      if (h === 'nw') {
        x = sc.x + sc.width - w;
        y = sc.y + sc.height - hh;
      } else if (h === 'ne') {
        x = sc.x;
        y = sc.y + sc.height - hh;
      } else if (h === 'sw') {
        x = sc.x + sc.width - w;
        y = sc.y;
      } else if (h === 'se') {
        x = sc.x;
        y = sc.y;
      }
    }

    w = Math.max(minSize, Math.min(w, 1));
    hh = Math.max(minSize, Math.min(hh, 1));
    x = Math.max(0, Math.min(x, 1 - w));
    y = Math.max(0, Math.min(y, 1 - hh));

    this.cropChange.emit({ x, y, width: w, height: hh });
  }
}
