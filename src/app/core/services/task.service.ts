import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly STORAGE_KEY = 'tasks';

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadTasks();
  }

  private async loadTasks(): Promise<void> {
    const tasks = await this.storageService.get<Task[]>(this.STORAGE_KEY);

    if (tasks) {
      this.tasksSubject.next(tasks);
    }
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    await this.storageService.set(this.STORAGE_KEY, tasks);
    this.tasksSubject.next(tasks);
  }

  async addTask(title: string, categoryId?: string): Promise<void> {
    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      categoryId
    };

    await this.saveTasks([
      ...this.tasksSubject.value,
      newTask
    ]);
  }

  async toggleTask(id: string): Promise<void> {
    const updatedTasks = this.tasksSubject.value.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );

    await this.saveTasks(updatedTasks);
  }

  async deleteTask(id: string): Promise<void> {
    const updatedTasks = this.tasksSubject.value.filter(
      task => task.id !== id
    );

    await this.saveTasks(updatedTasks);
  }

  async updateTask(
    id: string,
    title: string,
    categoryId?: string
  ): Promise<void> {

    const updated = this.tasksSubject.value.map(task =>
      task.id === id
        ? {
          ...task,
          title,
          categoryId
        }
        : task
    );

    await this.saveTasks(updated);
  }
}
