import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Category, Message } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private httpClient: HttpClient;
  constructor(private http: HttpClient, private handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  uploadImg(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'store-page');
    data.append('cloud_name', 'drkergesl');
    return this.httpClient.post<any>(
      'https://api.cloudinary.com/v1_1/drkergesl/image/upload',
      data
    );
  }

  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`api/categories/${id}`);
  }

  create(name: string, imageUrl?: string): Observable<Category> {
    const data = new FormData();

    if (imageUrl) {
      data.append('image', imageUrl);
    }

    data.append('name', name);

    return this.http.post<Category>('/api/categories', data);
  }

  update(id: string, name: string, imageUrl?: string): Observable<Category> {
    const data = new FormData();
    if (imageUrl) {
      console.log(imageUrl);
      data.append('image', imageUrl);
    }
    data.append('name', name);

    console.log(data);

    return this.http.patch<Category>(`/api/categories/${id}`, data);
  }

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/categories/${id}`);
  }
}
