import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Validate } from 'app/services/validate.service';
import { Api } from 'app/services/api.service';
import { Notifications } from 'app/services/notifications.service';
import { S3UploaderService } from 'ngx-s3-uploader';
import { toBase64String } from '@angular/compiler/src/output/source_map';

declare var ExifReader: any;

@Component({
  selector: 'app-uploadimage',
  templateUrl: './uploadimage.component.html',
  styleUrls: ['./uploadimage.component.scss']
})
export class UploadIamgeComponent implements OnInit, AfterViewInit {

  public forms: FormGroup[] = [];
  public tags = [];
  public tagInput = [];
  public categories = [];
  public modelReleases = [];

  images = [];
  imageMetaDatas = [];

  uploaded = false;

  constructor(
    public validate: Validate,
    public api: Api,
    public notify: Notifications,
    public formBuilder: FormBuilder,
    public router: Router,
    private s3UploaderService: S3UploaderService
  ) {

  }

  ngOnInit() {
    this.loadCategoryList();
    this.loadModelReleases();
  }

  ngAfterViewInit() {

  }

  uploadImages() {
    this.images = [
      { name: 'test.jpg', url: 'https://kb-imagebank.s3.eu-north-1.amazonaws.com/Dove-doves-31209127-1024-768_5Ks5f6yHKf5kH6pME172.jpg' },
      { name: 'test.jpg', url: 'https://kb-imagebank.s3.eu-north-1.amazonaws.com/Dove-doves-31209127-1024-768_5Ks5f6yHKf5kH6pME172.jpg' }
    ],
      this.uploaded = true;
    this.initializeUploadForms();
  }

  initializeUploadForms() {
    for (var i = 0; i < this.images.length; i++) {
      let form = this.formBuilder.group({
        imageurl: ['', Validators.required],
        lowimageurl: ['', Validators.required],
        title: ['', Validators.required],
        description: [''],
        categories: [null, Validators.required],
        modelReleases: [null],
        name: ['', Validators.required],
        photographer: [''],
        phone: [''],
        email: [''],
        sublocation: [''],
        city: [''],
        country: [''],
        lat: [''],
        long: [''],
        newTag: ['']
      });

      form.controls['imageurl'].setValue(this.images[i].url);
      form.controls['lowimageurl'].setValue(this.images[i].lowUrl);
      form.controls['name'].setValue(this.images[i].name);
      form.controls['title'].setValue(this.images[i].title);
      form.controls['description'].setValue(this.images[i].description);
      form.controls['photographer'].setValue(this.images[i].photographer);
      form.controls['phone'].setValue(this.images[i].phone);
      form.controls['email'].setValue(this.images[i].email);
      form.controls['sublocation'].setValue(this.images[i].sublocation);
      form.controls['city'].setValue(this.images[i].city);
      form.controls['country'].setValue(this.images[i].country);
      form.controls['lat'].setValue(this.images[i].lat);
      form.controls['long'].setValue(this.images[i].long);

      this.forms.push(form);
    }

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

  addTag(index) {
    var newTag = this.forms[index].value.newTag;
    if (newTag == '' || newTag == undefined) {
      this.notify.showNotification('Please enter tag name', 'top', 'center', 'warning');
      return;
    }

    this.tags[index].push(newTag);
    this.forms[index].controls['newTag'].setValue('');

  }

  removeTag(i, j) {
    this.tags[i].splice(j, 1);
  }

  changeFile(e) {


    var files = e.target.files;

    // this.getMetadata(files).then(res => {
    //   console.log(res);
    // })

    this.getMetadata(files).then(res => {
      this.imageMetaDatas = res;
      console.log(this.imageMetaDatas);

      this.upload(files);
    })


  }

  upload(files) {
    console.log('upload');
    this.images = [];
    var uploadCount = 0;

    this.notify.showLoading();

    var _this = this;

    for (let i = 0; i < files.length; i++) {

      this.images.push({});

      let reader = new FileReader();
      reader.onload = async function (e) {

        var newName = _this.generateUniquFilename(files[i].name);
        var fileForHighResolution = _this.dataURLtoFile(e.target['result'], newName);   /// get New File Object with new unique name

        var lowResWidthHeight = _this.getLowResImageWidthHeight(_this.imageMetaDatas[i].width, _this.imageMetaDatas[i].height);   /// get new width and height for low resolution
        var lowResImageData = await _this.getLowResImageData(e.target['result'], lowResWidthHeight.width, lowResWidthHeight.height);  ///   get file data for low resolution

        var fileForHighResolution = _this.dataURLtoFile(e.target['result'], newName);   /// get New File Object with new unique name
        var fileForLowResolution = _this.dataURLtoFile(lowResImageData, 'low_' + newName);

        console.log(fileForLowResolution);

        _this.s3UploaderService.upload(fileForHighResolution).subscribe(data => {
          var url = data.Location;

          _this.s3UploaderService.upload(fileForLowResolution).subscribe(lowData => {

            _this.images[i] = {
              url: url,
              lowUrl: lowData.Location,
              name: files[i].name,
              ..._this.imageMetaDatas[i]
            };       ///// add image to image list


            uploadCount++;
            if (uploadCount == files.length) {

              console.log(_this.images);

              _this.notify.showNotification('successfully uploaded', 'top', 'center', 'success');
              _this.notify.hideLoading();



              _this.initializeUploadForms();      //// initialize forms
              _this.uploaded = true;

            }
          }, error => {
            _this.notify.showNotification('uploadFailed', 'top', 'center', 'warning');
            _this.notify.hideLoading();

            _this.images = [];
            return;
          })


        }, error => {
          _this.notify.showNotification('uploadFailed', 'top', 'center', 'warning');
          _this.notify.hideLoading();

          _this.images = [];
          return;
        })
      }

      reader.readAsDataURL(files[i]);
    }
  }

  getLowResImageData(base64, width, height): Promise<any> {
    return new Promise((resolve, reject) => {
      //console.log(width, height);
      var canvas: any = document.createElement('CANVAS'),
        ctx: any = canvas.getContext('2d'),
        img: any = new Image;

      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        var dataURL: any = null;
        canvas.height = height;
        canvas.width = width;
        ctx.scale(width / img.width, height / img.height);
        ctx.drawImage(img, 0, 0);

        // set image quality
        dataURL = canvas.toDataURL('image/jpeg', 1.0);
        canvas = null;
        resolve(dataURL);
      };

      img.onerror = (err) => {
        console.log('getImageBase64String - error', err);
        reject(err);
      };
      img.src = base64;
    })
    // var canvas = document.createElement("canvas");
    // canvas.width = width;
    // canvas.height = height;
    // var context = canvas.getContext("2d");
    // var deferred = $.Deferred();
    // $("<img/>").attr("src", "data:image/gif;base64," + base64).load(function () {
    //   context.scale(width / this.width, height / this.height);
    //   context.drawImage(this, 0, 0);
    //   deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));
    // });
    // return deferred.promise();
  }

  getLowResImageWidthHeight(width, height) {
    var newWidth, newHeight, scale;
    if (width > height) {    ////// incase of landscape
      newWidth = 1000;
      scale = width / newWidth;
      newHeight = Math.ceil(height / scale);
    } else {       ////// incase of portrait
      newHeight = 1000;
      scale = height / newHeight;
      newWidth = Math.ceil(width / scale);
    }
    // var scale = Math.ceil(Math.sqrt(width * height / 78643))
    // var newWidth = Math.floor(width / scale);
    // var newHeight = Math.floor(height / scale);

    return { width: newWidth, height: newHeight };
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
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

  save() {
    var valid = true;
    var imageDatas = [];

    for (var i = 0; i < this.forms.length; i++) {
      if (!this.forms[i].valid) {
        valid = false;
        this.validate.validateAllFormFields(this.forms[i]);
      } else {
        imageDatas.push({
          ...this.forms[i].value,
          tags: this.tags[i]
        });
      }
    }

    if (valid) {
      this.createImages({ images: imageDatas });
    } else {
      return false;
    }
  }

  createImages(param) {

    this.notify.showLoading();

    this.api.createImage(param).subscribe((res: any) => {
      this.notify.hideLoading();
      if (res.success) {
        this.notify.showNotification('successfully created', 'top', 'center', 'success');

        this.router.navigate(['/upload-management/image-list']);
      } else {
        this.notify.showNotification('failed', 'top', 'center', 'success');
      }
    }, error => {
      this.notify.hideLoading();
      this.notify.showNotification('failed', 'top', 'center', 'success');
    })
  }

  getImageSize(base64String) {
    var img = new Image();

    img.onload = function () {
      // alert(img.width + ' ' + img.height);
    };

    img.src = base64String;
  }

  cancel() {
    this.router.navigate(['./upload-management/image-list']);
  }

  // getMetadata(files): Promise<any> {

  //   return new Promise((resolve, reject) => {
  //     let count = 0;
  //     var metaDatas = [];
  //     for (let i = 0; i < files.length; i++) {
  //       EXIF.getData(files[i], function () {

  //         var metaData = {
  //           photographer: '',
  //           phone: '',
  //           email: '',
  //           sublocation: '',
  //           city: '',
  //           country: '',
  //           lat: '',
  //           long: '',
  //         }

  //         var allMetaData = EXIF.getAllTags(this);

  //         console.log(allMetaData);

  //         if (allMetaData) {
  //           if (allMetaData.Artist) {               ///////   get photographer
  //             metaData.photographer = allMetaData.Artist;
  //           }


  //         }

  //         metaDatas.push(metaData);

  //         count++;
  //         if (count == files.length) {
  //           resolve(metaDatas);
  //         }
  //       });
  //     }
  //   })
  // }

  getMetadata(files): Promise<any> {

    return new Promise((resolve, reject) => {

      let count = 0;
      var metaDatas = [];

      this.tags = [];

      var __this = this;

      for (let i = 0; i < files.length; i++) {
        var metaData = {
          title: '',
          description: '',
          photographer: '',
          phone: '',
          email: '',
          sublocation: '',
          city: '',
          country: '',
          lat: '',
          long: '',
          height: 0,
          width: 0
        };

        this.tags.push(new Array());
        metaDatas.push(metaData);
      }


      for (let i = 0; i < files.length; i++) {

        var reader = new FileReader();
        reader.onload = function () {

          var buffer = this.result;
          const tags = ExifReader.load(buffer);


          console.log(tags);

          if (tags) {
            if (tags.title && tags.title.description) {               ///////   get title
              metaDatas[i].title = tags.title.description;
            }

            if (tags.description && tags.description.description) {               ///////   get description
              metaDatas[i].description = tags.description.description;
            }

            if (tags.Artist && tags.Artist.description) {               ///////   get photographer
              metaDatas[i].photographer = tags.Artist.description;
            }

            if (tags.City && tags.City.description) {   ////   get city
              metaDatas[i].city = tags.City.description;
            }

            if (tags['Sub-location'] && tags['Sub-location'].description) {   ////   get sublocation
              metaDatas[i].sublocation = tags['Sub-location'].description;
            }

            if (tags.Country && tags.Country.description) {   ////   get country
              metaDatas[i].country = tags.Country.description;
            }

            if (tags.CreatorContactInfo && tags.CreatorContactInfo.value) {    /////   get contact info
              var contactInfo = tags.CreatorContactInfo.value;



              if (contactInfo.CiTelWork && contactInfo.CiTelWork.description) {   ////   get phone
                metaDatas[i].phone = contactInfo.CiTelWork.description;
              }

              if (contactInfo.CiEmailWork && contactInfo.CiEmailWork.description) {   ////   get email
                metaDatas[i].email = contactInfo.CiEmailWork.description;
              }
            }

            if (tags.GPSLongitude && tags.GPSLongitude.description) {    //////   get GPS longitude
              metaDatas[i].long = tags.GPSLongitude.description;
            }

            if (tags.GPSLatitude && tags.GPSLatitude.description) {      //////    get GPS latitude
              metaDatas[i].lat = tags.GPSLatitude.description;
            }

            if (tags['Image Height'] && tags['Image Height'].value) {      //////    get GPS latitude
              metaDatas[i].height = tags['Image Height'].value;
            }

            if (tags['Image Width'] && tags['Image Width'].value) {      //////    get GPS latitude
              metaDatas[i].width = tags['Image Width'].value;
            }

          }


          ////   setup tag
          var imageTags = [];

          if (tags.subject && tags.subject.value) {
            tags.subject.value.forEach(item => {
              imageTags.push(item.description);
            })
          }

          __this.tags[i] = imageTags;
          ///  finish tag


          count++;

          if (count == files.length) {
            resolve(metaDatas);
          }
        }

        reader.readAsArrayBuffer(files[i]);
      }
    })
  }
}