import { SearchService, Information } from './services/search.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public results: Information[] = [];
  public form: FormGroup;

  private unsubscribe$ = new Subject();

  constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.form
      .get('searchWord')
      ?.valueChanges.pipe(
        map((value) => value.trim()),
        distinctUntilChanged(),
        debounceTime(500),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => this.search());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      searchWord: '',
      replaceWord: '',
    });
  }

  get getValues(): FormValues {
    return {
      searchWord: this.form.get('searchWord')?.value?.trim().toLowerCase(),
      replaceWord: this.form.get('replaceWord')?.value,
    };
  }

  search(): void {
    this.searchService
      .search(this.form.get('searchWord')?.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.results = res;
      });
  }

  replaceOne(): void {
    for (let i = 0; i < this.results.length; i++) {
      if (
        this.results[i].snippet
          .toLowerCase()
          .includes(
            `<span class="searchmatch">${this.getValues.searchWord}</span>`
          )
      ) {
        this.results[i].snippet = this.results[i].snippet
          .toLowerCase()
          .replace(
            `<span class="searchmatch">${this.getValues.searchWord}</span>`,
            this.getValues.replaceWord
          );
        break;
      }
    }
  }

  replaceAll(): void {
    this.results = this.results.map((information) => {
      return {
        snippet: information.snippet
          .toLowerCase()
          .split(
            `<span class="searchmatch">${this.getValues.searchWord}</span>`
          )
          .join(this.getValues.replaceWord),
        title: information.title,
      };
    });
  }
}

interface FormValues {
  searchWord: string;
  replaceWord: string;
}
