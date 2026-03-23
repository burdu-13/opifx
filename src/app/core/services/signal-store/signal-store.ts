import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class SignalStore<T> {
  protected readonly stateSignal: WritableSignal<T>;

  public readonly state: Signal<T>;

  constructor(initialState: T) {
    this.stateSignal = signal<T>(initialState);
    this.state = this.stateSignal.asReadonly();
  }

  public select<K>(mapFn: (state: T) => K): Signal<K> {
    return computed(() => mapFn(this.stateSignal()));
  }

  public patch(update: Partial<T> | ((state: T) => Partial<T>)): void {
    this.stateSignal.update((state) => ({
      ...state,
      ...(typeof update === 'function' ? update(state) : update),
    }));
  }
}
