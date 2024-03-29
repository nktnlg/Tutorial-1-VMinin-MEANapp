import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../../shared/services/positions.service";
import {Position} from "../../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../../shared/classes/material.service";
import {UntypedFormGroup, UntypedFormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef
  positions: Position[] = []
  loading = false
  positionId = null
  modal: MaterialInstance
  form: UntypedFormGroup

  constructor(private positionsService: PositionsService) { }

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, Validators.required),
      cost: new UntypedFormControl(1, [Validators.required, Validators.min(1)])
    })

    this.loading = true
    this.positionsService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions
      this.loading = false
    })
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  //METHODS

  onSubmit() {
    this.form.disable()
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }
    const completed = () => {
      this.modal.close()
      this.form.reset({name: '', cost: 1})
      this.form.enable()
    }
    if (this.positionId) {
      newPosition._id = this.positionId
      this.positionsService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position
          MaterialService.toast('Position updated')
        },
        error => {
          this.form.enable()
          MaterialService.toast('Something wrong')
        },
        () => {
          completed()
        }
        )
    }
    else {
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Position created')
          this.positions.push(position)
        },
        error => {
          this.form.enable()
          MaterialService.toast('Something wrong')
        },
        () => {
          completed()
        }
      )
    }
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation()
    const decision = window.confirm(`Delete "${position.name}"?`)

    if (decision) {
      this.positionsService.delete(position).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  onCancel() {
    this.modal.close()
  }

  onAddPosition() {
    this.positionId = null
    this.form.reset({
      name: null,
      cost: 1
    })
    this.modal.open()
    MaterialService.updateTextFields()
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextFields()
  }


}
