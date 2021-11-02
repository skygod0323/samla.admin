import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Validate } from "app/services/validate.service";


@Component({
  selector: 'category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent implements OnInit {

  form: FormGroup;
  mode = '';

  constructor(
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public validate: Validate,

  ) {

  }

  ngOnInit() {
    this.mode = this.data.mode;
    console.log(this.data);

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
    });

    if (this.mode == 'edit') {
      this.form.controls['name'].setValue(this.data.category.name);
    }
  }

  apply() {
    if (this.form.valid) {
      this.dialogRef.close({ type: 'apply', data: this.form.value });
    } else {
      this.validate.validateAllFormFields(this.form);
    }

  }

  cancel() {
    this.dialogRef.close({ type: 'cancel' });
  }
}