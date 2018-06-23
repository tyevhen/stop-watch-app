import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class StorageHandlerService {

  constructor() {
  }

  // Get value from local storage by property name.
  getPropertyValue(property) {
    return JSON.parse(localStorage.getItem(property));
  }

  // Clears entire storage.
  clearStorage() {
    localStorage.clear();
  }

  // Saves data to local storage.
  savePropertyValue(property, value) {
    localStorage.setItem(property, JSON.stringify(value));
  }
}
