import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Singleton service
})
export class DataService {
  // Get data from localStorage or fallback to an empty array
  getData<T>(key: string): T[] {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : [];
  }

  // Save data to localStorage
  saveData<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Add a new item to a list in localStorage
  addItem<T>(key: string, item: T): void {
    const data = this.getData<T>(key);
    data.push(item);
    this.saveData(key, data);
  }

  // Update an item in a list
  updateItem<T>(key: string, updatedItem: T, id: number | string): void {
    const data = this.getData<T>(key);
    const updatedData = data.map((item: any) =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    this.saveData(key, updatedData);
  }

  // Remove an item from a list
  removeItem<T>(key: string, id: number | string): void {
    const data = this.getData<T>(key);
    const filteredData = data.filter((item: any) => item.id !== id);
    this.saveData(key, filteredData);
  }

  // Clear all data for a key
  clearData(key: string): void {
    localStorage.removeItem(key);
  }
}
