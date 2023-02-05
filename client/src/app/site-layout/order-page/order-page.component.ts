import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../../shared/interfaces";
import {OrderingService} from "../../shared/services/ordering.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef
  modal: MaterialInstance
  isRoot: boolean
  pending = false
  oSub: Subscription

  constructor(private router: Router,
              public order: OrderService,
              private orderingService: OrderingService) { }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order'
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  ngOnDestroy(): void {
    this.modal.destroy()
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  //METHODS

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition)
  }

  open() {
    this.modal.open()
  }

  cancel() {
    this.modal.close()
  }

  submit() {
    this.pending = true
    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id
        return item
      })
    }
    this.oSub = this.orderingService.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`Order No.${newOrder.order} added`)
        this.order.clear()
      },
      error => {MaterialService.toast(error.error.message)},
      () => {
        this.modal.close()
        this.pending = false
      }
    )
  }



}
