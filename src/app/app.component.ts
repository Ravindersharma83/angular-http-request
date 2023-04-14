import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product } from './model/products';
import { ProductService } from './Service/products.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  title = 'AngularHttpRequest';
  allProducts:Product[] = [];
  isFetching : boolean = false;
  editMode : boolean = false;
  currentProductId:string;
  errorMessage:string = null;
  errorSub:Subscription;

  // use viewchild decorator to access all the form fields for displaying data on edit btn clicked
  @ViewChild('productsForm') form: NgForm;

  constructor(private productService: ProductService){

  }

  ngOnInit(){
    this.fetchProducts();
    // fetching error data from subject observable
    this.errorSub = this.productService.error.subscribe((message)=>{
      this.errorMessage = message;
    });
  }

  onProductFetch(){
    this.fetchProducts();
  }

  onProductCreate(products:{pName:string, desc:string, price:string}){
    if(!this.editMode){
      this.productService.createProduct(products);
    }else{
      this.productService.updateProduct(this.currentProductId,products);
    }
  }

  fetchProducts(){
    this.isFetching = true;
    this.productService.fetchProduct().subscribe((products)=>{
      // console.log('products------',products);
      this.allProducts = products;
      this.isFetching = false;
    },(err)=>{
      this.errorMessage = err.message;
    });
  }

  onDeleteProduct(id:string){
    this.productService.deleteProduct(id);
  }

  onDeleteAllProduct(){
    this.productService.deleteAllProducts();
  }

  onEditClicked(id:string){
    // Get the product based on the Id.
    this.currentProductId = id;
    let currentProduct = this.allProducts.find((p)=>{return p.id === id});
    console.log(currentProduct);

    // populate the form with the product details when edit btn clicked
    this.form.setValue({
      pName:currentProduct.pName,
      desc:currentProduct.desc,
      price:currentProduct.price,
    });


    // change the button value to update product
    this.editMode = true;
  }

  ngOnDestroy(): void {
      this.errorSub.unsubscribe();
  }
}


