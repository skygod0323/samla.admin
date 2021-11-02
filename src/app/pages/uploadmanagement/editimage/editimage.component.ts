import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Validate } from 'app/services/validate.service';
import { Api } from 'app/services/api.service';
import { Notifications } from 'app/services/notifications.service';
import { S3UploaderService } from 'ngx-s3-uploader';

@Component({
  selector: 'app-edit-image',
  templateUrl: './editimage.component.html',
  styleUrls: ['./editimage.component.scss']
})
export class EditIamgeComponent implements OnInit, AfterViewInit {

  public form: FormGroup;
  public tags = [];
  public tagInput = '';
  public categories = [];
  public modelReleases = [];

  public sub: any;
  public imageId;

  uploaded = false;

  constructor(
    public validate: Validate,
    public api: Api,
    public notify: Notifications,
    public formBuilder: FormBuilder,
    public router: Router,
    public activateRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      imageurl: ['', Validators.required],
      lowimageurl: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      categories: [null, Validators.required],
      modelReleases: [null],
      name: ['', Validators.required],
      photographer: [''],
      phone: [''],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      sublocation: [''],
      city: [''],
      country: [''],
      lat: [''],
      long: [''],
      newTag: ['']
    });

    this.loadCategoryList();
    this.loadModelReleases();

    this.sub = this.activateRoute.params.subscribe(params => {
      if (params.imageId) {
        this.imageId = params.imageId;
        console.log(this.imageId);

        this.loadImageData();
      } else {
        console.log('all');
      }
    });
  }

  ngAfterViewInit() {

  }

  initializeForm(data) {
    this.form.controls['title'].setValue(data.title);
    this.form.controls['description'].setValue(data.description);
    this.form.controls['name'].setValue(data.name);
    this.form.controls['imageurl'].setValue(data.imageurl);
    this.form.controls['lowimageurl'].setValue(data.lowimageurl);
    this.form.controls['photographer'].setValue(data.photographer);
    this.form.controls['phone'].setValue(data.phone);
    this.form.controls['email'].setValue(data.email);
    this.form.controls['sublocation'].setValue(data.sublocation);
    this.form.controls['long'].setValue(data.long);
    this.form.controls['lat'].setValue(data.lat);
    this.form.controls['country'].setValue(data.country);
    this.form.controls['city'].setValue(data.city);

    var categories = data.categories.map(category => category.id);
    var modelReleases = data.modelreleases.map(modelrelease => modelrelease.id);

    this.form.controls['categories'].setValue(categories);
    this.form.controls['modelReleases'].setValue(modelReleases);

    this.tags = data.tags;
  }

  cancel() {
    this.router.navigate(['/upload-management/image-list']);
  }

  loadCategoryList() {
    this.api.getCategoryList().subscribe(res => {
      if (res.success) {
        this.categories = res.data;
        if (this.categories.length == 0) {
          this.notify.showNotification('Please create at least one category to upload images', 'top', 'center', 'warning');
        }
      } else {

      }
    }, err => {
    });
  }

  loadModelReleases() {
    this.api.getModelReleaseList().subscribe(res => {
      if (res.success) {
        this.modelReleases = res.data;
      } else {

      }
    }, err => {
    });
  }

  loadImageData() {
    console.log('load')

    this.notify.showLoading();
    this.api.getImage(this.imageId).subscribe(res => {

      this.notify.hideLoading();

      if (res.success) {

        if (res.data) {
          if (res.data) {

            this.initializeForm(res.data);
          } else {
            this.notify.showNotification("Can't find Image Data", 'top', 'center', 'warning');
          }
        }

      } else {
        this.notify.showNotification(res.error, 'top', 'center', 'warning');
      }
    }, err => {
      this.notify.hideLoading();
      this.notify.showNotification('Error', 'top', 'center', 'danger');
    });
  }

  addTag() {
    var newTag = this.form.value.newTag;
    if (newTag == '' || newTag == undefined) {
      this.notify.showNotification('Please enter tag name', 'top', 'center', 'warning');
      return;
    }

    this.tags.push(newTag);
    this.form.controls['newTag'].setValue('');

  }

  removeTag(j) {
    this.tags.splice(j, 1);
  }

  save() {
    if (this.form.valid) {
      this.updateImage();
    } else {
      this.validate.validateAllFormFields(this.form);
    }
  }

  updateImage() {
    this.notify.showLoading();

    var param = {
      id: this.imageId,
      ...this.form.value,
      tags: this.tags
    }

    this.api.updateImage(param).subscribe((res: any) => {
      this.notify.hideLoading();
      if (res.success) {
        this.notify.showNotification('successfully updated', 'top', 'center', 'success');

        this.router.navigate(['/upload-management/image-list']);
      } else {
        this.notify.showNotification('failed', 'top', 'center', 'success');
      }
    }, error => {
      this.notify.showNotification('failed', 'top', 'center', 'success');
    })
  }


}