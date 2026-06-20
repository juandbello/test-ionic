import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly STORAGE_KEY = 'categories';

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadCategories();
  }

  private async loadCategories(): Promise<void> {
    const categories = await this.storageService.get<Category[]>(this.STORAGE_KEY);

    this.categoriesSubject.next(categories ?? []);
  }

  private async save(categories: Category[]): Promise<void> {
    await this.storageService.set(this.STORAGE_KEY, categories);
    this.categoriesSubject.next(categories);
  }

  async addCategory(name: string): Promise<void> {
    const newCategory: Category = {
      id: uuidv4(),
      name
    };

    await this.save([
      ...this.categoriesSubject.value,
      newCategory
    ]);
  }

  async updateCategory(id: string, name: string): Promise<void> {
    const updated = this.categoriesSubject.value.map(category =>
      category.id === id
        ? { ...category, name }
        : category
    );

    await this.save(updated);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.save(
      this.categoriesSubject.value.filter(category => category.id !== id)
    );
  }
}
