import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef

  form: UntypedFormGroup
  image: File
  imagePreview: any
  isNew = true
  category: Category

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) {
  }

  ngOnInit(): void {


    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, Validators.required)
    })

    this.form.disable()

    this.route.params
      .pipe( //when we get params we want to use another async stream vvv

        //switchMap cancels previous subscription after changes
        switchMap(
          (params: Params) => {
            if (params['id']) {
              //If id in params, we fetch Category observable (by id)
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            }
            //If not, we return Null observable

            return of(null)
          }
        )

      )
      .subscribe(
        (category: Category) => {
          //If we received a Category observable, we can get its name, and patch the form with it
          if (category) {
            this.category = category
            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            MaterialService.updateTextFields()
          }
          // dont forget to enable form
          this.form.enable()
        },
        error =>
          // if we receive an error, we pass it's message to the toast
          MaterialService.toast(error.error.message)
      )

  }


  //METHODS

  deleteCategory() {
    const decision = window.confirm(`Do you want to delete ${this.category.name} category?`)

    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit() {
    this.form.disable()
    let obs$

    if (this.isNew) {
      //create
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      //update
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Changes saved')
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}
