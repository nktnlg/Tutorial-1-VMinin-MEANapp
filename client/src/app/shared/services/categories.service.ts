import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Category, Message} from "../interfaces";
import {Observable} from "rxjs";

@Injectable(
  {
    providedIn: 'root'
  }
)

export class CategoriesService {
  constructor(private http: HttpClient) {}

  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories')
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`api/categories/${id}`)
  }

  create(name: string, image?: File): Observable<Category> {

    const fd = new FormData()

    if (image) {
      fd.append('image', image, image.name)
    }

    fd.append('name', name)

    return this.http.post<Category>('/api/categories',  fd)
  }

  update(id: string, name: string, image?: File): Observable<Category> {

    const fd = new FormData()

    if (image) {
      fd.append('image', image, image.name)
    }

    fd.append('name', name)

    return this.http.patch<Category>(`/api/categories/${id}`,  fd)
  }

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/categories/${id}`)
  }
}
