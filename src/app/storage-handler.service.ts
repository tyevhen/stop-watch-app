import { Injectable, HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StorageHandlerService {

  constructor() {
  }

  public getPropertyValue(property) {
    return JSON.parse(localStorage.getItem(property));
  }

  public clearStorage(): void {
    localStorage.clear();
  }

  public savePropertyValue(property, value): void {
    localStorage.setItem(property, JSON.stringify(value));
  }
}
