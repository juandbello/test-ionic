import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { ION_MODULES } from 'src/app/core/imports/ion.imports';
import { CategoryService } from 'src/app/core/services/category.service';
import { TaskService } from 'src/app/core/services/task.service';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
   ION_MODULES,
  ],

})
export class TaskComponent  implements OnInit {
  @Input() task!: Task;

  editingTask = '';
  editTaskCategoryId = '';

  categories$ = this.categoryService.categories$;

  constructor(
    private readonly modalController: ModalController,
    private readonly tasksService: TaskService,
    private readonly categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.editingTask = this.task?.title;
    this.editTaskCategoryId = this.task?.categoryId || '';
  }

  close(): void {
    this.modalController.dismiss();
  }

  async save(): Promise<void> {
    if (!this.editingTask.trim()) return;

    await this.tasksService.updateTask(
      this.task?.id,
      this.editingTask,
      this.editTaskCategoryId || undefined
    );

    await this.modalController.dismiss(true);
  }
}
