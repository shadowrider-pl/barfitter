import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IOrderedProductStatus, OrderedProductStatus } from 'app/shared/model/ordered-product-status.model';
import { OrderedProductStatusService } from './ordered-product-status.service';

@Component({
  selector: 'jhi-ordered-product-status-update',
  templateUrl: './ordered-product-status-update.component.html'
})
export class OrderedProductStatusUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.required]],
    active: []
  });

  constructor(
    protected orderedProductStatusService: OrderedProductStatusService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ orderedProductStatus }) => {
      this.updateForm(orderedProductStatus);
    });
  }

  updateForm(orderedProductStatus: IOrderedProductStatus) {
    this.editForm.patchValue({
      id: orderedProductStatus.id,
      description: orderedProductStatus.description,
      active: orderedProductStatus.active
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const orderedProductStatus = this.createFromForm();
    if (orderedProductStatus.id !== undefined) {
      this.subscribeToSaveResponse(this.orderedProductStatusService.update(orderedProductStatus));
    } else {
      this.subscribeToSaveResponse(this.orderedProductStatusService.create(orderedProductStatus));
    }
  }

  private createFromForm(): IOrderedProductStatus {
    return {
      ...new OrderedProductStatus(),
      id: this.editForm.get(['id']).value,
      description: this.editForm.get(['description']).value,
      active: this.editForm.get(['active']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderedProductStatus>>) {
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
