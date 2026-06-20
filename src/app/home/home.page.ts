import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

import { Task } from '../core/models/task.model';
import { TaskService } from '../core/services/task.service';
import { CategoryService } from '../core/services/category.service';
import { CategoryComponent } from '../components/category/category.component';
import { ION_MODULES } from '../core/imports/ion.imports';
import { TaskComponent } from '../components/task/task.component';
import { RemoteConfigService } from '../core/services/remote-config';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ION_MODULES,
  ]
})
export class HomePage {


  showCategories = false;
  tasks$: Observable<Task[]>;
  taskTitle = '';
  selectedCategoryForTask = '';

  // Reactive filter state
  private readonly searchSubject = new BehaviorSubject<string>('');
  private readonly categorySubject = new BehaviorSubject<string>('');
  searchText = '';
  selectedCategory = '';

  categories$ = this.categoryService.categories$;
  categoryMap: Map<string, string> = new Map();

  // Colapsar el formulario de nueva tarea al agregar una tarea
  isAddTaskOpen = true;

  constructor(
    private readonly tasksService: TaskService,
    private readonly categoryService: CategoryService,
    private readonly modalController: ModalController,
    private readonly remoteConfigService: RemoteConfigService
  ) {
    // ------ Cargar iconos ------
    addIcons(icons);
    this.tasks$ = this.tasksService.tasks$;
    this.categories$.subscribe(categories => {
      this.categoryMap.clear();
      categories.forEach(cat => this.categoryMap.set(cat.id, cat.name));
    });
  }

  // ------ Configuración remota  firebase------
  async ngOnInit(): Promise<void> {
    this.showCategories = this.remoteConfigService.enableCategories;
  }

  // ------ Filtros reactivos ------

  onSearchInput(value: string): void {
    this.searchText = value;
    this.searchSubject.next(value);
  }

  onCategoryFilterChange(value: string): void {
    this.selectedCategory = value;
    this.categorySubject.next(value);
  }

  filteredTasks$ = combineLatest([
    this.tasksService.tasks$,
    this.searchSubject,
    this.categorySubject
  ]).pipe(
    map(([tasks, search, category]) =>
      tasks.filter(task => {
        const matchName =
          task.title.toLowerCase()
            .includes(search.toLowerCase());

        const matchCategory =
          !category ||
          task.categoryId === category;

        return matchName && matchCategory;
      })
    )
  );

  // ------ Tareas CRUD ------

  async addTask(): Promise<void> {
    if (!this.taskTitle.trim()) return;

    await this.tasksService.addTask(
      this.taskTitle,
      this.selectedCategoryForTask || undefined
    );
    this.taskTitle = '';
    this.selectedCategoryForTask = '';
  }

  async toggleTask(id: string): Promise<void> {
    await this.tasksService.toggleTask(id);
  }

  async deleteTask(id: string): Promise<void> {
    await this.tasksService.deleteTask(id);
  }

  trackById(index: number, task: Task): string {
    return task.id;
  }

  getCategoryName(categoryId?: string): string {
    return categoryId ? (this.categoryMap.get(categoryId) || '') : '';
  }

  // ------ Category modal  ------

  async openCategoryModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: CategoryComponent,
      breakpoints: [0, 0.6, 0.85],
      initialBreakpoint: 0.6,
    });
    await modal.present();
  }

  // ------ Editar tarea ------

  async editTask(task: Task): Promise<void> {
    const modal = await this.modalController.create({
      component: TaskComponent,
      componentProps: {
        task
      },
      breakpoints: [0, 0.6, 0.85],
      initialBreakpoint: 0.6,
    });
    await modal.present();
  }


}
