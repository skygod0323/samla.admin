import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Validate } from "app/services/validate.service";
import { Notifications } from "app/services/notifications.service";
import { S3UploaderService } from "ngx-s3-uploader";

declare var $: any;
@Component({
  selector: 'modelrelease-modal',
  templateUrl: './modelrelease-modal.component.html',
  styleUrls: ['./modelrelease-modal.component.scss']
})
export class ModelReleaseModalComponent implements OnInit {

  form: FormGroup

  constructor(
    public dialogRef: MatDialogRef<ModelReleaseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public validate: Validate,
    public notify: Notifications,
    public s3UploaderService: S3UploaderService
  ) {

  }



  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      url: ['', Validators.required]
    });
  }

  apply() {
    if (this.form.valid) {
      this.dialogRef.close({ type: 'apply', data: this.form.value });
    } else {
      this.notify.showNotification('Please upload model release first', 'top', 'center', 'warning');
    }
  }

  cancel() {
    this.dialogRef.close({ type: 'cancel' });
  }


  trigerFileInput() {
    $('#fileInput').trigger('click');
  }

  changeFile(e) {
    var files = e.target.files;
    if (files.length == 0) return;

    var file = files[0];
    this.notify.showLoading();
    var _this = this;

    let reader = new FileReader();
    reader.onload = function (e) {

      var file1 = _this.dataURLtoFile(e.target['result'], _this.generateUniquFilename(file.name));   /// get New File Object with new unique name

      _this.s3UploaderService.upload(file1).subscribe(data => {

        _this.form.controls['name'].setValue(file.name);
        _this.form.controls['url'].setValue(data.Location);



        _this.notify.hideLoading();

      }, error => {
        _this.notify.showNotification('uploadFailed', 'top', 'center', 'warning');
        _this.notify.hideLoading();

        return;
      })
    }

    reader.readAsDataURL(file);
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  generateUniquFilename(originalName: string) {

    var index = originalName.lastIndexOf('.');

    var text = originalName.substr(0, index) + "_";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    text = text + '.' + originalName.substr(index + 1, originalName.length - index - 1);
    return text;
  }


}