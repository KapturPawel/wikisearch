import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  constructor(private http: HttpClient) {}

  search(phrase: string): Observable<Information[]> {
    return this.http
      .get<SearchedObject>(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${phrase}&srlimit=10&origin=*`
      )
      .pipe(map((res) => res.query.search));
  }
}

export interface SearchedObject {
  query: {
    search: Information[],
  }
}

export interface Information {
  title: string;
  snippet: string;
}
