import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IProductType, ProductType } from 'app/shared/model/product-type.model';
import { ProductTypeService } from './product-type.service';

@Component({
  selector: 'jhi-product-type-update',
  templateUrl: './product-type-update.component.html'
})
export class ProductTypeUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.required]],
    active: []
  });

  constructor(protected productTypeService: ProductTypeService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ productType }) => {
      this.updateForm(productType);
    });
  }

  updateForm(productType: IProductType) {
    this.editForm.patchValue({
      id: productType.id,
      description: productType.description,
      active: productType.active
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const productType = this.createFromForm();
    if (productType.id !== undefined) {
      this.subscribeToSaveResponse(this.productTypeService.update(productType));
    } else {
      this.subscribeToSaveResponse(this.productTypeService.create(productType));
    }
  }

  private createFromForm(): IProductType {
    return {
      ...new ProductType(),
      id: this.editForm.get(['id']).value,
      description: this.editForm.get(['description']).value,
      active: this.editForm.get(['active']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductType>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
