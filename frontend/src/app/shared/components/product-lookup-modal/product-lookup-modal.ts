import { Component, OnDestroy, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  ProductLookupService,
  ProductLookupState
} from '../../services/product-lookup.service';



@Component({
  selector: 'app-product-lookup-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-lookup-modal.html',
  styleUrl: './product-lookup-modal.css'
})
export class ProductLookupModalComponent implements OnInit, OnDestroy {

  visible = false;
  producto: any = null;
  error = '';

  private subscription!: Subscription;

  constructor(
    private productLookup: ProductLookupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {



    this.subscription =
      this.productLookup.state$.subscribe(
        (state: ProductLookupState) => {



          this.visible = state.visible;
          this.producto = state.producto;
          this.error = state.error;



          this.cdr.detectChanges();
        }
      );
  }

  cerrar(): void {
    this.productLookup.cerrar();
  }

  ngOnDestroy(): void {

    this.subscription?.unsubscribe();

  }
}
