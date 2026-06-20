import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonList,
  IonLabel,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButtons,
} from '@ionic/angular/standalone';
import { AlertController, ModalController } from '@ionic/angular';

import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonLabel,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButtons,
  ],
})
export class CategoryComponent {
  categories$: Observable<Category[]>;
  newCategoryName = '';
  categoryMap: Map<string, string> = new Map();

  constructor(
    private categoryService: CategoryService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.categories$ = this.categoryService.categories$;
    this.categories$.subscribe(categories => {
      this.categoryMap.clear();
      categories.forEach(cat => this.categoryMap.set(cat.id, cat.name));
    });
  }

  async addCategory(): Promise<void> {
    if (!this.newCategoryName.trim()) return;

    await this.categoryService.addCategory(this.newCategoryName);
    this.newCategoryName = '';
  }

  async editCategory(category: Category): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Editar categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de la categoría',
          value: category.name,
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.name.trim()) {
              await this.categoryService.updateCategory(category.id, data.name);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteCategory(id: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar categoría',
      message: '¿Estás seguro de que deseas eliminar esta categoría?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.categoryService.deleteCategory(id);
          },
        },
      ],
    });
    await alert.present();
  }

  dismiss(): void {
    this.modalController.dismiss();
  }
}
