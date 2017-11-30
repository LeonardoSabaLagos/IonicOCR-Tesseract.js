import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Platform, ActionSheetController, LoadingController } from 'ionic-angular';

import Tesseract from 'tesseract.js';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	@ViewChild('imageResult') private imageResult: ElementRef;
	@ViewChild('demoImg') private demoImg: ElementRef;

	public altotexto: string;

	image: string = '';
	_zone: any;
	_ocrIsLoaded: boolean = true;

	constructor(
		private camera: Camera,
		public navCtrl: NavController,
		public platform: Platform,
		public loadingCtrl: LoadingController,
		public actionsheetCtrl: ActionSheetController) {

		this._zone = new NgZone({ enableLongStackTrace: false });
	}

	openMenu() {
		if (this._ocrIsLoaded === true) {
			let actionSheet;
			if (!this.image) {
				actionSheet = this.actionsheetCtrl.create({
					title: 'Menu',
					cssClass: 'action-sheets-basic-page',
					buttons: [
						{
							text: 'Imagen DEMO',
							icon: !this.platform.is('ios') ? 'shuffle' : null,
							handler: () => {
								this.randomDemo()
							}
						},
						{
							text: 'Tomar Foto',
							icon: !this.platform.is('ios') ? 'camera' : null,
							handler: () => {
								this.takePicture()
							}
						},
						{
							text: 'Cancelar',
							role: 'cancel', // will always sort to be on the bottom
							icon: !this.platform.is('ios') ? 'close' : null,
							handler: () => {
								console.log('Cancel clicked');
							}
						}
					]
				});
			}
			else {
				actionSheet = this.actionsheetCtrl.create({
					title: 'Menu',
					cssClass: 'action-sheets-basic-page',
					buttons: [
						{
							text: 'Imagen DEMO',
							icon: !this.platform.is('ios') ? 'shuffle' : null,
							handler: () => {
								this.randomDemo()
							}
						},
						{
							text: 'Retomar Foto',
							icon: !this.platform.is('ios') ? 'camera' : null,
							handler: () => {
								this.takePicture()
							}
						},
						{
							text: 'Cancelar',
							role: 'cancel', // will always sort to be on the bottom
							icon: !this.platform.is('ios') ? 'close' : null,
							handler: () => {
								console.log('Cancel clicked');
							}
						}
					]
				});
			}
			actionSheet.present();
		}
		else {
			alert('OCR API is not loaded');
		}
	}

	takePicture() {
		let loader = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loader.present();

		console.log("Sali del loader");
		// Take a picture saving in device, as jpg and allows edit
		this.camera.getPicture({
			quality: 100,
			destinationType: this.camera.DestinationType.NATIVE_URI,
			encodingType: this.camera.EncodingType.JPEG,
			targetHeight: 1000,
			sourceType: 1,
			allowEdit: true,
			saveToPhotoAlbum: true,
			correctOrientation: true
		}).then((imageURI) => {
			loader.dismissAll();

			this.image = imageURI;
			this.analyze(this.image, true);
		}, (err) => {
			console.log(`ERROR -> ${JSON.stringify(err)}`);
		});
	}

	analyze(image, loadAPI) {
		Tesseract.recognize(image)
			.then((tesseractResult) => {
				this._zone.run(() => {
					//loader.dismissAll();
					if (loadAPI == true) {
						this._ocrIsLoaded = true;
					}
					console.log('Tesseract result: ');
					console.log(tesseractResult);
					/// Show a result if data isn't initializtion
					if (loadAPI == true) {
						this.altotexto = tesseractResult.text;
						console.log("lo que contiene this.altotexto: ", this.altotexto)
					}
				});
			});
		console.log("src img = ",this.image)
	}

	randomDemo() {
		this.image = "assets/imgs/demo.png";
		this.analyze(this.image, true);
	}

}