import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class StorageHandlerService {

  constructor() {
  }

  getPropertyValue(property) {
    return JSON.parse(localStorage.getItem(property));
  }

  clearStorage() {
    localStorage.clear();
  }

  savePropertyValue(property, value) {
    localStorage.setItem(property, JSON.stringify(value));
  }
}
