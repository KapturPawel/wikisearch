import { SearchService, Information } from './services/search.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, throttle, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public results: Information[] = [];
  public form: FormGroup;

  constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.form
      .get('searchWord')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => this.search());
  }

  initForm() {
    this.form = this.formBuilder.group({
      searchWord: '',
      replaceWord: '',
    });
  }

  search() {
    this.searchService
      .search(this.form.get('searchWord')?.value)
      .subscribe((res) => {
        this.results = res;
      });
  }
}
