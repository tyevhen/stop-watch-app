import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class StorageHandlerService {

  constructor() {
  }

  public getPropertyValue(property) {
    if (localStorage.getItem(property) !== 'undefined') {
      return JSON.parse(localStorage.getItem(property));
    } else {
      return null;
    }
  }

  public clearStorage() {
    localStorage.clear();
  }

  public savePropertyValue(property, value){
    localStorage.setItem(property, JSON.stringify(value));
  }
}
