import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, map } from "rxjs";
import { Product } from "../model/products";

@Injectable({providedIn:"root"})

export class ProductService{

  error = new Subject<string>();
  constructor(private http:HttpClient){}
  // create product in database
  createProduct(products:{pName:string, desc:string, price:string}){
    console.log(products);
    this.http.post<{name:string}>('https://angularbyprocademy-df885-default-rtdb.firebaseio.com/products.json',products)
    .subscribe((res)=>{
      console.log(res);
    },(err)=>{
      this.error.next(err.message);
    }
    );
  }

  //fetch products from database
  fetchProduct(){
    return this.http.get<{[key:string] : Product}>('https://angularbyprocademy-df885-default-rtdb.firebaseio.com/products.json')
    .pipe(map((res)=>{
      const products = [];
      for(const key in res){
        if(res.hasOwnProperty(key)){
          products.push({...res[key], id:key})
        }
      }
      return products;
    }))
  }

  // delete a product from database
  deleteProduct(id:string){
    this.http.delete('https://angularbyprocademy-df885-default-rtdb.firebaseio.com/products/'+id+'.json')
    .subscribe();
  }

  // delete all products from database
  deleteAllProducts(){
    this.http.delete('https://angularbyprocademy-df885-default-rtdb.firebaseio.com/products.json')
    .subscribe();
  }

  // update a product from database
  updateProduct(id:string, value:Product){
    this.http.put('https://angularbyprocademy-df885-default-rtdb.firebaseio.com/products/'+id+'.json',value)
    .subscribe();
  }
}
