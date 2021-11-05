//global variables
var r = document.querySelector(':root');
var userWiseCategoryData;
var userWiseCategoryDataProduct;
var userWiseSubCategoryDataProduct;
var userWiseProductDataProduct;
var UserAccountId;
var countAddrow = 1;
var paymentIdUser = "";
var footerIdUser = "";
var countAddImage = 1;

var imageArray = [];
var imageArrayValue = [];
var imageDataArray = [];
var imageDataArrayValue = [];
var updateMultipleImageFileArray = [];
var updateMultipleImageFileArrayValue = [];

//logout user
function Logout() {
	sessionStorage.clear();
	window.location.href = "VendorLoginPage.php";
}

// add category
function addCategory(AccountID) {
	addCategoryApi(AccountID);
	document.getElementById("bulkUploadDiv").style.display = "none";
	if (document.getElementById('CategoryImageDiv').style.display === "none") {
		document.getElementById("CategoryImageDiv").style.display = "block";
	} else {
		document.getElementById("bulkUploadDiv").style.display = "none";
	}
}

function bulkUpload() {
	document.getElementById("CategoryImageDiv").style.display = "none";
	if (document.getElementById('bulkUploadDiv').style.display === 'none') {
		document.getElementById("bulkUploadDiv").style.display = "block";
	} else {
		document.getElementById("CategoryImageDiv").style.display = "none";
	}

}

//add 5 row for footer details 
function addRow() {
	if (countAddrow > 5) {
		swal("You can only have 5 additional row!", {
			icon: "warning",
		});
		return;
	} else {
		$('#insta').append('<div class="col-md-6"><input type="text" class="form-control" id="EnterTitle' + countAddrow + '" placeholder="Enter Title" style="color: var(--theme1Colour); "></div> <div class="col-md-6"><div class="form-group"><input type="text" class="form-control" id="EnterData' + countAddrow + '" placeholder="Enter Data" style="color: var(--theme1Colour); "></div></div>');
		countAddrow = countAddrow + 1;
	}
}

//add multiple product image
function addProductImage() {
	if (countAddImage > 4) {
		swal("You can only have 5 product images!", {
			icon: "warning",
		});
		return;
	} else {
		$('#ProductImageDiv').append('<div class="col-3"><img src="images/saree1.png" id="ProductImageAddition' +countAddImage + '"  class="zoom" alt=""/> <div class="file btn btn-lg btn-primary" > Product Image <input type="file" accept="image/x-png,image/jpeg" name="file"  id="fileToUploadProduct" onchange="previewProductImage(this)"/> </div></div>');
		countAddImage = countAddImage + 1;
	}
}

//append data in footer details
function addRowForUpdate(titleCount, title, data) {
	countAddrow = titleCount + 1;
	$('#insta').append('<div class="col-md-6"><input type="text" class="form-control" value="' + title + '" id="EnterTitle' + titleCount + '" placeholder="Enter Title" style="color: var(--theme1Colour); "></div> <div class="col-md-6"><div class="form-group"><input type="text" class="form-control" id="EnterData' + titleCount + '" value="' + data + '" placeholder="Enter Data" style="color: var(--theme1Colour); "></div></div>');

}

// add company details
function companyDetails(AccountDetailsId) {

	document.getElementById("loader").style.display = "block";
   //get values 
	var status = document.getElementById("ComapanyDetailssubmit").value;
	var CompanyLogoSrc = document.getElementById("LogoImage").src;
	var fileInput = $("#fileToUpload")[0];
	var data = new FormData();
	var ComapanyDetailssubmit = document.getElementById("ComapanyDetailssubmit").value;
	var CompanyName = document.getElementById("CompanyName").value;
	var CompanyUrl = document.getElementById("CompanyUrl").value;

   // validate
	if (CompanyLogoSrc.length != 0 && ComapanyDetailssubmit == "Update" && fileInput.files.length == 0) {
		data.append('CompanyLogo', "no");
		data.append('CompanyLogoData', CompanyLogoSrc);
	} else if (fileInput.files.length == 0) {
		document.getElementById("loader").style.display = "none";
		swal("Please Select Logo!", {
			icon: "warning",
		});
		return;
		data.append('CompanyLogo', "no");
	} else if (fileInput.files.length != 0) {
		data.append('CompanyLogo', "yes");
		jQuery.each(jQuery('#fileToUpload')[0].files, function (i, file) {
			data.append('file-' + i, file);

		});
		var imgbytes = fileInput.files[0].size; // Size returned in bytes.
		var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
		var Extension = fileInput.value.substring(fileInput.value.lastIndexOf('.') + 1).toLowerCase()
		if (imgkbytes > 5000) {
			document.getElementById("loader").style.display = "none";
			swal("image should be less than 5MB!", {
				icon: "warning",
			});
			return;
		}
		if (Extension == "png" || Extension == "jfif" || Extension == "pjpeg" || Extension == "pjp" ||
			Extension == "jpeg" || Extension == "jpg") {

		} else {
			document.getElementById("loader").style.display = "none";
			swal("Input file is not a image!", {
				icon: "warning",
			});
			return;
		}
	}


	if (CompanyName.length == 0) {
		document.getElementById("loader").style.display = "none";
		swal("Company name is empty!", {
			icon: "warning",
		});
		return;
	}

	if (CompanyUrl.length == 0) {
		document.getElementById("loader").style.display = "none";
		swal("Company Webpage Url is empty!", {
			icon: "warning",
		});
		return;
	}

   // add data for api
	data.append('CompanyName', CompanyName);
	data.append('CompanyUrl', CompanyUrl);
	data.append('AccountDetailsId', AccountDetailsId);
	data.append('status', status);
	jQuery.ajax({
		url: 'CompanyDetailsApi.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
				if (status == "Add") {
               // added
					swal("Company Information is Added!", {
						icon: "success",
					});
					document.getElementById("ComapanyDetailssubmit").value = "Update";
				} else {
               // addition failed
					swal("Company Information is Updated!", {
						icon: "success",
					});
				}
			} else {}

		}
	});

}

function AddBanner(AccountID) {
   // diaply loader
	document.getElementById("loader").style.display = "block";
   // get and validate data
	var data = new FormData();
	var fileInput = $("#fileToUploadBanner")[0];
	if (fileInput.files.length == 0) {
		swal("Please Select Banner Image!", {
			icon: "error",
		});
		document.getElementById("loader").style.display = "none";
		return;
		data.append('BannerImage', "no");

	} else {
		data.append('BannerImage', "yes");
		jQuery.each(jQuery('#fileToUploadBanner')[0].files, function (i, file) {
			data.append('file-' + i, file);
		});

		var imgbytes = fileInput.files[0].size; // Size returned in bytes.
		var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
		if (imgkbytes > 5000) {
			alert("image should be less than 5MB")
			return;
		}
	}

	var BannerContent = $('#BannerContent').val();
	if (BannerContent == "") {
		swal("Please enter Banner content!", {
			icon: "error",
		});
		document.getElementById("loader").style.display = "none";
		return;

	}
	data.append('BannerContent', BannerContent);
   // api call
	jQuery.ajax({
		url: 'BannerDetailsApi.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			debugger
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // added
				document.getElementById("BannerContent").value = "";
				document.getElementById("BannerImage").src = "images/bg_image.png";
				document.getElementById("fileToUploadBanner").value = "";
				swal("Banner is Added Successfully!", {
					icon: "success",
				});
			} else {
            //addition failed
				swal("Banner Addition Failed!", {
					icon: "error",
				});
			}
         // reload banner details after addition
			LoadBannerAllData(AccountID);
		}
	});

}

// update banner
function UpdateBanner(AccountContentId, AccountBannerId, BannerImage, AccountID) {
   // display loader
	document.getElementById("loader").style.display = "block";
	// get and validate data
	var data = new FormData();
	var fileInput = $("#BannerImageFile" + AccountBannerId)[0];
	if (fileInput.files.length == 0) {
		data.append('BannerImage', "no");
		if (BannerImage.length == 0) {
			data.append('BannerImageData', "no");
		} else {
			data.append('BannerImageData', BannerImage);
		}

	} else {
		data.append('BannerImage', "yes");
		jQuery.each(jQuery('#BannerImageFile' + AccountBannerId)[0].files, function (i, file) {
			data.append('file-' + i, file);

		});
		var imgbytes = fileInput.files[0].size; // Size returned in bytes.
		var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
		if (imgkbytes > 5000) {
			alert("image should be less than 5MB")
			return;
		}
	}

	var BannerContent = $('#BannerContent' + AccountBannerId).val();
	if (BannerContent == "") {
		swal("Please enter Banner content!", {
			icon: "error",
		});
		document.getElementById("loader").style.display = "none";
		return;
	}
	data.append('AccountBannerId', AccountBannerId);;
	data.append('BannerContent', BannerContent);
	// api call
	jQuery.ajax({
		url: 'BannerDetailsUpdateApi.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			debugger
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // updated
				swal("Banner Information is Updated!", {
					icon: "success",
				});
			} else {
            // Updated Failed
				swal("Updated Failed!", {
					icon: "error",
				});
			}
         // reload banner after update
			LoadBannerAllData(AccountID);
		}
	});
}

// delete banner
function DeleteBanner(AccountBannerId, o, AccountID) {
	swal({
			title: "Are you sure?",
			text: "You want delete this Banner!",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
		.then((willDelete) => {
			if (willDelete) {
				document.getElementById("loader").style.display = "block";
            //api call
				$.ajax({
					url: "deleteBanner.php",
					type: "POST",
					data: 'AccountBannerId=' + AccountBannerId,
					success: function (data, status) {
						document.getElementById("loader").style.display = "none";
                  // deleted
						swal("Banner has been deleted!", {
							icon: "success",
						});
                  //load all banner after deletion
						LoadBannerAllData(AccountID);
						var p = o.parentNode.parentNode;
						p.parentNode.removeChild(p);
					},
					error: function () {
						alert("Problen in sending reply!")
					}
				});

			} else {}
		})

}

// add category api
function addCategoryApi(AccountID) {
   //diaply loader
	document.getElementById("loader").style.display = "block";
	// get and validate data
	var data = new FormData();
	var fileInput = $("#fileToUploadCategory")[0];
	if (fileInput.files.length == 0) {
		data.append('CategoryImage', "no");
	} else {
		data.append('CategoryImage', "yes");
		jQuery.each(jQuery('#fileToUploadCategory')[0].files, function (i, file) {
			data.append('file-' + i, file);
		});
		var imgbytes = fileInput.files[0].size; // Size returned in bytes.
		var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
		if (imgkbytes > 5000) {
			alert("image should be less than 5MB");
			return;
		}
	}
	var CategoryName = $('#CategoryName').val();
	if (CategoryName == "") {
		swal("Please enter Category name!", {
			icon: "error",
		});
		document.getElementById("loader").style.display = "none";
		return;
	}
	data.append('CategoryName', CategoryName);
	data.append('Status', "AddCategory");
   // api call
	jQuery.ajax({
		url: 'insertOrUpdateProduct.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // catgory added
				document.getElementById("CategoryName").value = "";
				document.getElementById("CategoryImageAddition").src = "images/saree1.png";
				document.getElementById("fileToUploadCategory").value = "";
				LoadCategoryAllData(AccountID);
				swal("Category is Added Successfully!", {
					icon: "success",
				});
			} else {
            // Category Addition Failed
				swal("Category Addition Failed!", {
					icon: "error",
				});
			}
		}
	});
}

// add sub-category
function addSubCategoryApi(AccountID) {
   // display loader
	document.getElementById("loader").style.display = "block";
	// get and validate data
	var data = new FormData();
	var fileInput = $("#fileToUploadSubCategory")[0];
	if (fileInput.files.length == 0) {
		data.append('SubCategoryImage', "no");
	} else {
		data.append('SubCategoryImage', "yes");
		jQuery.each(jQuery('#fileToUploadSubCategory')[0].files, function (i, file) {
			data.append('file-' + i, file);
		});
		var imgbytes = fileInput.files[0].size; // Size returned in bytes.
		var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
		if (imgkbytes > 5000) {
			alert("image should be less than 5MB");
			return;
		}
	}
	var SubCategoryName = $('#SubCategoryName').val();
	var categoryID = $('#SubCategoryPageCategoryName').val();
	var SelectedCategoryId = categoryID;

	if (SelectedCategoryId == "00") {
		swal("Please Select Category!", {
			icon: "error",
		});
		document.getElementById("loader").style.display = "none";
		return;
	}

	if (SubCategoryName == "") {
		swal("Please enter Sub-Category Name!", {
			icon: "error",
		});
		document.getElementById("loader").style.display = "none";
		return;
	}
	data.append('CategoryID', SelectedCategoryId);
	data.append('SubCategoryName', SubCategoryName);

	data.append('Status', "AddSubCatgory");
   // api call
	jQuery.ajax({
		url: 'insertOrUpdateProduct.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // added
				document.getElementById("SubCategoryName").value = "";
				document.getElementById("SubCategoryImageAddition").src = "images/saree1.png";
				AllCategoryDetails(AccountID);
				AllCategoryDetailsProduct(AccountID);
				swal("Sub-Category is Added Successfully!", {
					icon: "success",
				});
			} else {
            // addition failed
				swal("Sub-Category Addition Failed!", {
					icon: "error",
				});
			}

		}
	});
}

// update category
function UpadateCategory(UpadateCategoryId, CategoryImage, AccountID) {
	// diaplay lodaer
	document.getElementById("loader").style.display = "block";
   // get and validate data
	var data = new FormData();
	var fileInput = $("#CategoryImageFile" + UpadateCategoryId)[0];
	if (fileInput.files.length == 0) {
		data.append('CategoryImage', "no");
		if (CategoryImage !== undefined) {
			if (CategoryImage.length == 0) {
				data.append('CategoryImageData', "no");
			} else {
				data.append('CategoryImageData', CategoryImage);
			}
		} else {
			data.append('CategoryImageData', "no");
		}

	} else {
		data.append('CategoryImage', "yes");
		jQuery.each(jQuery('#CategoryImageFile' + UpadateCategoryId)[0].files, function (i, file) {
			data.append('file-' + i, file);
		});
		var imgbytes = fileInput.files[0].size; // Size returned in bytes.
		var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
		if (imgkbytes > 5000) {
			alert("image should be less than 5MB");
			return;
		}
	}
	var CategoryName = $('#CategoryName' + UpadateCategoryId).val();
	data.append('AccountCategoryId', UpadateCategoryId);
	data.append('CategoryName', CategoryName);
	data.append('Status', "UpdateCategory");
   // api call
	jQuery.ajax({
		url: 'insertOrUpdateProduct.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // updated
				AllCategoryDetails(AccountID);
				AllCategoryDetailsProduct(AccountID);
				swal("Category is Updated Successfully!", {
					icon: "success",
				});
			} else {
            // update failed
				swal("Category Updated Failed!", {
					icon: "error",
				});
			}
         // load all category after update
			LoadCategoryAllData(AccountID);
		}
	});

}

// check if sub- category exists for category
function CheckIfSubcategoryExists(AccountCategoryId, o, AccountID) {
   // display loader
	document.getElementById("loader").style.display = "block";
	//api call
	$.ajax({
		url: "SubCategoryDataByCategoryID.php",
		type: "POST",
		data: 'SubCategoryDataByCategoryID=' + AccountCategoryId,
		success: function (data, status) {
			debugger
			var jsonData = JSON.parse(data);
         // if exist then check if it is ok to delete
			if (jsonData.hasOwnProperty('requestData')) {
				swal({
						title: "Are you sure?",
						text: "Sub-category and products may exist for this category!",
						icon: "warning",
						buttons: true,
						dangerMode: true,
					})
					.then((willDelete) => {
						if (willDelete) {
                     // delete api
							$.ajax({
								url: "DeleteCategory.php",
								type: "POST",
								data: 'DeleteThisID=' + AccountCategoryId,
								success: function (data, status) {
									document.getElementById("loader").style.display = "none";
									var jsonData = JSON.parse(data);
									if (jsonData.responsecode == "200") {
                              // deleted
										var p = o.parentNode.parentNode;
										p.parentNode.removeChild(p);
                              // reload category, sub- category and product
										AllCategoryDetails(AccountID);
										AllCategoryDetailsProduct(AccountID);
										LoadCategoryAllData(AccountID);
										swal("Category has been deleted!", {
											icon: "success",
										});
									} else {
                              // deletion failed
										swal("Category deletion failed!", {
											icon: "success",
										});
									}
								},
								error: function () {
									document.getElementById("loader").style.display = "none";
									alert("Problen in sending reply!")
								}
							});

						} else {
							document.getElementById("loader").style.display = "none";
						}
					})
			} else {
            // delete 
				swal({
						title: "Are you sure?",
						text: "You Really want to delete this Category!",
						icon: "warning",
						buttons: true,
						dangerMode: true,
					})
					.then((willDelete) => {
						if (willDelete) {
							$.ajax({
								url: "DeleteCategory.php",
								type: "POST",
								data: 'DeleteThisID=' + AccountCategoryId,
								success: function (data, status) {
									document.getElementById("loader").style.display = "none";
									var jsonData = JSON.parse(data);
									if (jsonData.responsecode == "200") {
                              //deleted
										var p = o.parentNode.parentNode;
										p.parentNode.removeChild(p);
                              // reload category , sub- category and product
										AllCategoryDetails(AccountID);
										AllCategoryDetailsProduct(AccountID);
										LoadCategoryAllData(AccountID);
										swal("Category has been deleted!", {
											icon: "success",
										});
									} else {
                              // deletion failed
										swal("Category deletion failed!", {
											icon: "success",
										});
									}
								},
								error: function () {
									document.getElementById("loader").style.display = "none";
									alert("Problen in sending reply!")
								}
							});

						} else {
							document.getElementById("loader").style.display = "none";
						}
					})
			}

		},
		error: function () {
			document.getElementById("loader").style.display = "none";
			alert("Problen in sending reply!")
		}
	});
}

// check if product exist for sub- category
function CheckIfProductExist(AccountSubCategoryId, o, AccountID) {
	document.getElementById("loader").style.display = "block";
	debugger
	$.ajax({
		url: "getProductBySubCategoayId.php",
		type: "POST",
		data: 'AccountSubCategoryId=' + AccountSubCategoryId,
		success: function (data, status) {
			debugger
			var jsonData = JSON.parse(data);
			console.log(jsonData);

			if (jsonData.hasOwnProperty('requestData')) {
				swal({
						title: "Are you sure?",
						text: "products may exist for this Sub-category!",
						icon: "warning",
						buttons: true,
						dangerMode: true,
					})
					.then((willDelete) => {
						if (willDelete) {
							$.ajax({
								url: "DeleteCategory.php",
								type: "POST",
								data: 'DeleteThisID=' + AccountSubCategoryId,
								success: function (data, status) {
									document.getElementById("loader").style.display = "none";

									var jsonData = JSON.parse(data);
									if (jsonData.responsecode == "200") {
										var p = o.parentNode.parentNode;
										p.parentNode.removeChild(p);
                              // reload sub-category and product
										AllCategoryDetails(AccountID);
										AllCategoryDetailsProduct(AccountID);

										swal("Sub-Category has been deleted!", {
											icon: "success",
										});
									} else {
										swal("Sub-Category deletion failed!", {
											icon: "success",
										});
									}

								},
								error: function () {
									document.getElementById("loader").style.display = "none";
									alert("Problen in sending reply!")
								}
							});

						} else {
							document.getElementById("loader").style.display = "none";
						}
					})
			} else {
				swal({
						title: "Are you sure?",
						text: "You Really want to delete this Sub-Category!",
						icon: "warning",
						buttons: true,
						dangerMode: true,
					})
					.then((willDelete) => {
						if (willDelete) {
							$.ajax({
								url: "DeleteCategory.php",
								type: "POST",
								data: 'DeleteThisID=' + AccountSubCategoryId,
								success: function (data, status) {
									document.getElementById("loader").style.display = "none";
									var jsonData = JSON.parse(data);
									if (jsonData.responsecode == "200") {
										var p = o.parentNode.parentNode;
										p.parentNode.removeChild(p);
                              // reload sub-category and product
										AllCategoryDetails(AccountID);
										AllCategoryDetailsProduct(AccountID);
										swal("Sub-Category has been deleted!", {
											icon: "success",
										});
									} else {
										swal("Sub-Category deletion failed!", {
											icon: "success",
										});
									}
								},
								error: function () {
									document.getElementById("loader").style.display = "none";
									alert("Problen in sending reply!")
								}
							});

						} else {
							document.getElementById("loader").style.display = "none";
						}
					})
			}

		},
		error: function () {
			document.getElementById("loader").style.display = "none";
			alert("Problen in sending reply!")
		}
	});

}

// delete product 
function DeleteProduct(ProductId, o, AccountID) {
   // display loader
	document.getElementById("loader").style.display = "block";
	swal({
			title: "Are you sure?",
			text: "You want to Delete this Product!",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
		.then((willDelete) => {
			if (willDelete) {
				$.ajax({
					url: "DeleteCategory.php",
					type: "POST",
					data: 'DeleteThisID=' + ProductId,
					success: function (data, status) {

						document.getElementById("loader").style.display = "none";
						var jsonData = JSON.parse(data);
						if (jsonData.responsecode == "200") {
							debugger
							AllCategoryDetailsProduct(AccountID); // load product details in table
							var p = o.parentNode.parentNode;
							p.parentNode.removeChild(p);
							swal("Product has been deleted!", {
								icon: "success",
							});
						} else {
							swal("Product deletion failed!", {
								icon: "success",
							});
						}
					},
					error: function () {
						document.getElementById("loader").style.display = "none";
						alert("Problen in sending reply!")
					}
				});

			} else {
				document.getElementById("loader").style.display = "none";
			}
		})

}

function DeleteAttribute(AttributeID, o, mappingId) {
   // diaplay loader
	document.getElementById("loader").style.display = "block";
	swal({
			title: "Are you sure?",
			text: "You want to Delete this Attribute!",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
		.then((willDelete) => {
			if (willDelete) {
            // api call
				$.ajax({
					url: "deleteAttributeMaster.php",
					type: "POST",
					data: 'mappingId=' + mappingId,
					success: function (data, status) {
						document.getElementById("loader").style.display = "none";
						var jsonData = JSON.parse(data);
						if (jsonData.responsecode == "200") {
                     // deleted
							var p = o.parentNode.parentNode;
							p.parentNode.removeChild(p);
							swal("Attribute has been deleted!", {
								icon: "success",
							});

						} else {
                     //deletion failed
							swal("Attribute has not been deleted!", {
								icon: "error",
							});
						}
					},
					error: function () {
						document.getElementById("loader").style.display = "none";
						alert("Problen in sending reply!")
					}
				});
			} else {
				document.getElementById("loader").style.display = "none";

			}
		})

}

// preview for logo
function previewLogoImage(input) {
	var fileInput = $("#fileToUpload")[0];
	var imgbytes = fileInput.files[0].size; // Size returned in bytes.
	var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
	var Extension = fileInput.value.substring(fileInput.value.lastIndexOf('.') + 1).toLowerCase()

	if (Extension == "png" || Extension == "jfif" || Extension == "pjpeg" || Extension == "pjp" ||
		Extension == "jpeg" || Extension == "jpg") {
		if (imgkbytes > 5000) {
			swal("image should be less than 5MB!", {
				icon: "warning",
			});
			return;
		}

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#LogoImage').attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]); // convert to base64 string
		}

	} else {
		swal("Input file is not a image!", {
			icon: "warning",
		});
		return;
	}


}
// preview for Banner
function previewBannerImage(input) {
	var fileInput = $("#fileToUploadBanner")[0];
	var imgbytes = fileInput.files[0].size;
	var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
	var Extension = fileInput.value.substring(fileInput.value.lastIndexOf('.') + 1).toLowerCase();
	debugger

	if (Extension == "png" || Extension == "jfif" || Extension == "pjpeg" || Extension == "pjp" ||
		Extension == "jpeg" || Extension == "jpg") {

		if (imgkbytes > 5000) {
			swal("image should be less than 5MB!", {
				icon: "warning",
			});
			return;
		}

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#BannerImage').attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]); // convert to base64 string
		}

	} else {
		swal("Input file is not a image!", {
			icon: "warning",
		});
		return;
	}
}

// preview for Catrgory
function previewCategoryImage(input) {

	var fileInput = $("#fileToUploadCategory")[0];
	var imgbytes = fileInput.files[0].size;
	var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
	var Extension = fileInput.value.substring(fileInput.value.lastIndexOf('.') + 1).toLowerCase();
	debugger

	if (Extension == "png" || Extension == "jfif" || Extension == "pjpeg" || Extension == "pjp" ||
		Extension == "jpeg" || Extension == "jpg") {

		if (imgkbytes > 5000) {
			swal("image should be less than 5MB!", {
				icon: "warning",
			});
			return;
		}

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#CategoryImageAddition').attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]); // convert to base64 string
		}

	} else {
		swal("Input file is not a image!", {
			icon: "warning",
		});
		return;
	}
}

// preview for Sub-category
function previewSetSubCategoryImage(input) {

	var fileInput = $("#fileToUploadSubCategory")[0];
	var imgbytes = fileInput.files[0].size;
	var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
	var Extension = fileInput.value.substring(fileInput.value.lastIndexOf('.') + 1).toLowerCase();
	debugger

	if (Extension == "png" || Extension == "jfif" || Extension == "pjpeg" || Extension == "pjp" ||
		Extension == "jpeg" || Extension == "jpg") {

		if (imgkbytes > 5000) {
			swal("image should be less than 5MB!", {
				icon: "warning",
			});
			return;
		}

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#SubCategoryImageAddition').attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]); // convert to base64 string
		}

	} else {
		swal("Input file is not a image!", {
			icon: "warning",
		});
		return;
	}
}

// preview for Product
function previewProductImage(input,id) {

	var fileInput = $("#fileToUploadProduct"+ id)[0];
	var imgbytes = fileInput.files[0].size;
	var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
	var Extension = fileInput.value.substring(fileInput.value.lastIndexOf('.') + 1).toLowerCase();

	if (Extension == "png" || Extension == "jfif" || Extension == "pjpeg" || Extension == "pjp" ||
		Extension == "jpeg" || Extension == "jpg") {

		if (imgkbytes > 5000) {
			swal("image should be less than 5MB!", {
				icon: "warning",
			});
			return;
		}

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#ProductImageAddition'+ id).attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]); // convert to base64 string
		}

	} else {
		swal("Input file is not a image!", {
			icon: "warning",
		});
		return;
	}
}




// preview for UPDATE
function previewUpdateImage(input,id,tableId) {

	var fileInput = $("#fileToUpdateProduct"+ id)[0];
	var imgbytes = fileInput.files[0].size;
	var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
	var Extension = fileInput.value.substring(fileInput.value.lastIndexOf('.') + 1).toLowerCase();

	if (Extension == "png" || Extension == "jfif" || Extension == "pjpeg" || Extension == "pjp" ||
		Extension == "jpeg" || Extension == "jpg") {

		if (imgkbytes > 5000) {
			swal("image should be less than 5MB!", {
				icon: "warning",
			});
			return;
		}

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#ProductImageUpdate'+ id).attr('src', e.target.result);
				if (id == 1) {
					$('#ProductImageTable'+ tableId).attr('src', e.target.result);
			}


			
			}

			reader.readAsDataURL(input.files[0]); // convert to base64 string
		}

	} else {
		swal("Input file is not a image!", {
			icon: "warning",
		});
		return;
	}
}





// load sub category by category id
function LoadSubCategoryByCategoryId() {
	var SubCategoryDataByCategoryID = $('#productPageCategory1').val();
	$.ajax({
		url: "SubCategoryDataByCategoryID.php",
		type: "POST",
		data: 'SubCategoryDataByCategoryID=' + SubCategoryDataByCategoryID,
		success: function (data, status) {
			debugger
			var jsonData = JSON.parse(data);
			var html = ""
			for (i in jsonData.requestData) {
				var name = jsonData.requestData[i].name;
				var id = jsonData.requestData[i].productId;
				html += "<option id=" + id + " value=" + id + " >" + name + "</option>"
			}
			$('#productPageSubCategory1').html(html);
		},
		error: function () {
			alert("Problen in sending reply!")
		}
	});
}

// load sub category by category id in attribute table
function LoadSubCategoryByCategoryIdAttribute() {
	var SubCategoryDataByCategoryID = $('#productPageCategoryAttribute').val();
	$.ajax({
		url: "SubCategoryDataByCategoryID.php",
		type: "POST",
		data: 'SubCategoryDataByCategoryID=' + SubCategoryDataByCategoryID,
		success: function (data, status) {
			debugger
			var jsonData = JSON.parse(data);
			var html = ""
			html += "<option id='00' value='00' >Select Sub-Category</option>"
			for (i in jsonData.requestData) {
				var name = jsonData.requestData[i].name;
				var id = jsonData.requestData[i].productId;
				html += "<option id=" + id + " value=" + id + " >" + name + "</option>"
			}
			$('#productPageSubCategoryAttibute').html(html);
		},
		error: function () {
			alert("Problen in sending reply!")
		}
	});
}

// load sub category by category id in Seller table
function LoadSubCategoryByCategoryIdSeller() {
	var SubCategoryDataByCategoryID = $('#productPageCategorySeller').val();
	$.ajax({
		url: "SubCategoryDataByCategoryID.php",
		type: "POST",
		data: 'SubCategoryDataByCategoryID=' + SubCategoryDataByCategoryID,
		success: function (data, status) {
			debugger
			var jsonData = JSON.parse(data);
			var html = ""
			html += "<option id='00' value='00' >Select Sub-Category</option>"
			for (i in jsonData.requestData) {
				var name = jsonData.requestData[i].name;
				var id = jsonData.requestData[i].productId;
				html += "<option id=" + id + " value=" + id + " >" + name + "</option>"
			}
			$('#productPageSubCategorySeller').html(html);
		},
		error: function () {
			alert("Problen in sending reply!")
		}
	});
}

// load Product by sub-category id in attribute table
function LoadProductBySubCategoryIdAttribute() {
	var AccountSubCategoryId = $('#productPageSubCategoryAttibute').val();
	$.ajax({
		url: "getProductBySubCategoayId.php",
		type: "POST",
		data: 'AccountSubCategoryId=' + AccountSubCategoryId,
		success: function (data, status) {
			debugger
			var jsonData = JSON.parse(data);
         // no product to load
			if (jsonData.responseCode == "404") {
				swal("No products for this Sub-Category!", {
					icon: "warning",
				});
				return;
			}
			var html = ""
			html += "<option id='00' value='00' >Select Product</option>"
			for (i in jsonData.requestData) {
				var name = jsonData.requestData[i].name;
				var id = jsonData.requestData[i].productId;
				html += "<option id=" + id + " value=" + id + " >" + name + "</option>"
			}
			$('#mySelectAttribute').html(html);
		},
		error: function () {
			alert("Problen in sending reply!")
		}
	});
}

//load product by sub- category in seller table
function LoadProductBySubCategoryIdSeller() {
	var AccountSubCategoryId = $('#productPageSubCategorySeller').val();
   //api call
	$.ajax({
		url: "getProductBySubCategoayId.php",
		type: "POST",
		data: 'AccountSubCategoryId=' + AccountSubCategoryId,
		success: function (data, status) {
			debugger
			var jsonData = JSON.parse(data);
         // no prosuct to load
			if (jsonData.responseCode == "404") {
				swal("No products for this Sub-Category!", {
					icon: "warning",
				});
				return;
			}
			var html = ""
			html += "<option id='00' value='00' >Select Product</option>"
			for (i in jsonData.requestData) {
				var name = jsonData.requestData[i].name;
				var id = jsonData.requestData[i].productId;
				html += "<option id=" + id + " value=" + id + " >" + name + "</option>"
			}
         // load products
			$('#productPageSellerProduct').html(html);
		},
		error: function () {
			alert("Problen in sending reply!")
		}
	});
}

// load sub- category by category table
function LoadSubCategoryByCategoryIdTable(ProductID) {

	var SubCategoryDataByCategoryID = $('#ProductPageCategoryNameTablefinal' + ProductID).val();
	$.ajax({
		url: "SubCategoryDataByCategoryID.php",
		type: "POST",
		data: 'SubCategoryDataByCategoryID=' + SubCategoryDataByCategoryID,
		success: function (data, status) {
			var jsonData = JSON.parse(data);
			console.log(jsonData);
			var html = ""
			for (i in jsonData.requestData) {
				var name = jsonData.requestData[i].name;
				var id = jsonData.requestData[i].productId;
				html += "<option id=" + id + " value=" + id + " >" + name + "</option>"
			}
         // load sub- category
			$('#ProductPageSubCategoryNameTableFinal' + ProductID).html(html);
		},
		error: function () {
			alert("Problen in sending reply!")
		}
	});
}

// preview Banner Image
function previewBannerImageTable(input, bannerTableId) {

	var fileInput = $("#BannerImageFile" + bannerTableId)[0];
	var imgbytes = fileInput.files[0].size;
	var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
	var Extension = fileInput.value.substring(fileInput.value.lastIndexOf('.') + 1).toLowerCase();
	debugger

	if (Extension == "png" || Extension == "jfif" || Extension == "pjpeg" || Extension == "pjp" ||
		Extension == "jpeg" || Extension == "jpg") {

		if (imgkbytes > 5000) {
			swal("image should be less than 5MB!", {
				icon: "warning",
			});
			return;
		}

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#bannerImageTable' + bannerTableId).attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]); // convert to base64 string
		}

	} else {
		swal("Input file is not a image!", {
			icon: "warning",
		});
		return;
	}
}

//preview Catagory Image
function previewCatagoryImageTable(input, categoryTableId) {
	var fileInput = $("#CategoryImageFile" + categoryTableId)[0];
	var imgbytes = fileInput.files[0].size;
	var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
	var Extension = fileInput.value.substring(fileInput.value.lastIndexOf('.') + 1).toLowerCase();

	if (Extension == "png" || Extension == "jfif" || Extension == "pjpeg" || Extension == "pjp" ||
		Extension == "jpeg" || Extension == "jpg") {

		if (imgkbytes > 5000) {
			swal("image should be less than 5MB!", {
				icon: "warning",
			});
			return;
		}

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#CategoryImageTable' + categoryTableId).attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]); // convert to base64 string
		}

	} else {
		swal("Input file is not a image!", {
			icon: "warning",
		});
		return;
	}
}

// preview Sub-Catagory Image
function previewSubCatagoryImageTable(input, SubCategoryTableId) {

	var fileInput = $("#SubCategoryImageFile" + SubCategoryTableId)[0];
	var imgbytes = fileInput.files[0].size;
	var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
	var Extension = fileInput.value.substring(fileInput.value.lastIndexOf('.') + 1).toLowerCase();

	if (Extension == "png" || Extension == "jfif" || Extension == "pjpeg" || Extension == "pjp" ||
		Extension == "jpeg" || Extension == "jpg") {

		if (imgkbytes > 5000) {
			swal("image should be less than 5MB!", {
				icon: "warning",
			});
			return;
		}

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#SubCategoryImageTable' + SubCategoryTableId).attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]); // convert to base64 string
		}

	} else {
		swal("Input file is not a image!", {
			icon: "warning",
		});
		return;
	}
}

//preview Product Image
function previewProductImageTable(input, ProductTableId) {

	var fileInput = $("#ProductImageFile" + ProductTableId)[0];
	var imgbytes = fileInput.files[0].size;
	var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
	var Extension = fileInput.value.substring(fileInput.value.lastIndexOf('.') + 1).toLowerCase();
	debugger

	if (Extension == "png" || Extension == "jfif" || Extension == "pjpeg" || Extension == "pjp" ||
		Extension == "jpeg" || Extension == "jpg") {

		if (imgkbytes > 5000) {
			swal("image should be less than 5MB!", {
				icon: "warning",
			});
			return;
		}

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#ProductImageTable' + ProductTableId).attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]); // convert to base64 string
		}

	} else {
		swal("Input file is not a image!", {
			icon: "warning",
		});
		return;
	}
}

// add product 
function addProductApi(AccountID) {
   // diaplay loader
	document.getElementById("loader").style.display = "block";
   // get and validate data
	var data = new FormData();

   for (id = 1; id <= 5; id++) {

	var fileInput = $("#fileToUploadProduct"+ id)[0]; //cancate id
	//in for loop upto if condt
		
		if (fileInput.files.length == 0) {
			
		data.append('ProductImage'+ id, "no"); //cancate id in product image
	} else {
		
		data.append('ProductImage'+ id, "yes");  //cancate id in product image
		jQuery.each(jQuery('#fileToUploadProduct'+ id)[0].files, function (i, file) {
			data.append('file-' + id, file);
		});
		var imgbytes = fileInput.files[0].size; // Size returned in bytes.
		var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
		if (imgkbytes > 5000) {
			alert("image should be less than 5MB");
			document.getElementById("loader").style.display = "none";
			return;
		}
	}
	}
	debugger
	

	
	var ProductName = $('#ProductName').val();
	var ProductDiscription = $('#ProductDiscription').val();
	var productPrice = $('#ProductPrice').val();
	var gst = $('#ProductGSTIN').val();

   // transaction charges
	var TransactionCharges = $('#TransactionCharges').val(); 


	var BasePrice = document.getElementById("ProductBasePrice").innerHTML;
	var SelectedSubCategoryID = $('#productPageSubCategory1').val();
	if (ProductName == "" || ProductDiscription == "" || productPrice == "" || gst == "" || SelectedSubCategoryID == null) {
		swal("Please enter All Fields!", {
			icon: "error",
		});
		document.getElementById("loader").style.display = "none";
		return;
	}
	if (BasePrice == "") {
		swal("Please enter GSTIN and Product Price Properly!", {
			icon: "error",
		});
		document.getElementById("loader").style.display = "none";
		return;
	}

	data.append('SubCategoryID', SelectedSubCategoryID);
	data.append('ProductName', ProductName);
	data.append('productPrice', productPrice);
	data.append('gst', gst);
	data.append('BasePrice', BasePrice);
	data.append('ProductDiscription', ProductDiscription);
	data.append('Status', "AddProduct");
	data.append('TransactionCharges', TransactionCharges);

	// api call
	jQuery.ajax({
		url: 'insertOrUpdateProduct.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			debugger
			document.getElementById("loader").style.display = "none";
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // added
				document.getElementById("loader").style.display = "none";
				document.getElementById("ProductName").value = "";
				document.getElementById("ProductDiscription").value = "";
				document.getElementById("ProductPrice").value = "";
				document.getElementById("ProductGSTIN").value = "";
				document.getElementById("ProductBasePrice").innerHTML = "";
				$("select#productPageCategory1").prop('selectedIndex', 0);
				document.getElementById("productPageSubCategory1").innerHTML = "";
				document.getElementById("ProductImageAddition1").src = "images/saree1.png";
				document.getElementById("ProductImageAddition2").src = "images/saree1.png";
				document.getElementById("ProductImageAddition3").src = "images/saree1.png";
				document.getElementById("ProductImageAddition4").src = "images/saree1.png";
				document.getElementById("ProductImageAddition5").src = "images/saree1.png";
				AllCategoryDetailsProduct(AccountID); // load data in products table
				swal("Product is Added Successfully!", {
					icon: "success",
				});
			} else {
            // addition failed
				swal("Product Addition Failed!", {
					icon: "error",
				});
			}
		}
	});
}


//  update sub - category
function UpdateSubCategoryApi(UpadateSubCategoryId, SubCategoryImage, AccountID, mappingId) {
	debugger
	// diaplay loader
	document.getElementById("loader").style.display = "block";
   // get and validate data
	var data = new FormData();
	var youtubeimgsrc = document.getElementById("SubCategoryImageTable" + UpadateSubCategoryId).src;
	var fileInput = $("#SubCategoryImageFile" + UpadateSubCategoryId)[0];
	if (fileInput.files.length == 0) {
		data.append('SubCategoryImage', "no");
		if (SubCategoryImage !== undefined) {
			if (SubCategoryImage.length == 0) {
				data.append('SubCategoryImageData', "no");
			} else {
				data.append('SubCategoryImageData', SubCategoryImage);
			}
		} else {
			data.append('SubCategoryImageData', "no");
		}

	} else {
		data.append('SubCategoryImage', "yes");
		jQuery.each(jQuery("#SubCategoryImageFile" + UpadateSubCategoryId)[0].files, function (i, file) {
			data.append('file-' + i, file);
		});
		var imgbytes = fileInput.files[0].size; // Size returned in bytes.
		var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
		if (imgkbytes > 5000) {
			alert("image should be less than 5MB");
			document.getElementById("loader").style.display = "none";

			return;
		}
	}
	var SubCategoryName = $('#SubCategoryName' + UpadateSubCategoryId).val();
	if (SubCategoryName == "") {
		swal("Please enter Sub-Category Name!", {
			icon: "error",
		});
		document.getElementById("loader").style.display = "none";
		return;
	}
	debugger
	var SelectedCategoryId = $('#SubCategoryPageCategoryName' + UpadateSubCategoryId).val();
	//   var SelectedCategoryId = $('SubCategoryPageCategoryName559').val();

	data.append('CategoryID', SelectedCategoryId);
	data.append('SubCategoryName', SubCategoryName);
	data.append('productId', UpadateSubCategoryId);
	data.append('mappingId', mappingId);
	data.append('Status', "UpdateSubCategory");
   //api call
	jQuery.ajax({
		url: 'insertOrUpdateProduct.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {

			document.getElementById("loader").style.display = "none";
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // updated
				AllCategoryDetailsProduct(AccountID);
				AllCategoryDetails(AccountID);
				swal("Sub-Category is Updated Successfully!", {
					icon: "success",
				});
			} else {
            // update failed
				swal("sub-Category Updated Failed!", {
					icon: "error",
				});
			}

		}
	});
}











// update product
function UpdateProductApi(UpdateProductId, ProductImage, AccountID, updateSubCategoryId) {
	debugger
   // display loader
	document.getElementById("loader").style.display = "block";
   // get and validate data
	var data = new FormData();


	for (id = 1; id <= 5; id++) { //for loop
		
// var popupProductId = document.getElementById("#SubCategoryPageCategoryName");
if($("#fileToUpdateProduct"+ id).length){
// 	alert("Div1 exists");
// }else{
// 	alert("Div1 does not exists");
// }
    // if(popupProductId){
    	// alert("IMAGE VALIDATION USING ID");
    	debugger
    	// alert($("#ProductImageUpdate"+ id).attr('src'));
	var fileInput = $("#fileToUpdateProduct"+ id)[0];
	if (fileInput.files.length == 0) {
		data.append('ProductImage' + id, "no");
		if ($("#ProductImageUpdate"+ id).attr('src') == 0) {
			data.append('ProductImageData'+ id, "no"); //id added
		} else {
			data.append('ProductImageData'+ id, $("#ProductImageUpdate"+ id).attr('src'));    //id added
		}
	} else {
		data.append('ProductImage'+ id, "yes");
		// if (ProductImage.length == 0) {
			data.append('ProductImageData'+ id, "AddWhileUpdate");
			// data.append('ProductImageData'+ id, ProductImage); //id added
		// }
		
		jQuery.each(jQuery("#fileToUpdateProduct" + id)[0].files, function (i, file) {
			data.append('file-' + id, file);
		});
		var imgbytes = fileInput.files[0].size; // Size returned in bytes.
		var imgkbytes = Math.round(parseInt(imgbytes) / 1024).toFixed(2);
		if (imgkbytes > 5000) {
			alert("image should be less than 5MB");
			document.getElementById("loader").style.display = "none";
			return;
		}
	} 
}
else {
	// alert('image not found');
	// data.append('ProductImageData'+ id, $("#ProductImageUpdate"+ id).attr('src'));

}
	} //for loop end

	var ProductName = $('#ProductName' + UpdateProductId).val();
	var productDescription = $('#productDescription' + UpdateProductId).val();
	var productPrice = $('#ProductPrice' + UpdateProductId).val();
	var gst = $('#ProductGst' + UpdateProductId).val();

	// var TransactionCharges = $('#TransactionCharges' + UpdateProductId).val();
	
	var BasePrice = $('#ProductBasePrice' + UpdateProductId).text();
	var selctedSubCategoryID = $('#ProductPageSubCategoryNameTableFinal' + UpdateProductId).val();
	if (BasePrice == "") {
		swal("Please enter GSTIN and Product Price Properly!", {
			icon: "error",
		});
		document.getElementById("loader").style.display = "none";
		return;
	}
	if (ProductName == "" || productDescription == "" || productPrice == "" || gst == "" || selctedSubCategoryID == "") {
		swal("Please enter All Fields!", {
			icon: "error",
		});
		document.getElementById("loader").style.display = "none";
		return;
	}
	data.append('SubCategoryID', selctedSubCategoryID);
	data.append('ProductName', ProductName);
	data.append('productDescription', productDescription);
	data.append('productPrice', productPrice);
	data.append('gst', gst);
	data.append('BasePrice', BasePrice);
	data.append('productId', UpdateProductId);
	data.append('updateSubCategoryId', updateSubCategoryId);
	data.append('Status', "UpdateProduct");
	// data.append('TransactionCharges', TransactionCharges);

	debugger
   // api call
	jQuery.ajax({
		url: 'insertOrUpdateProduct.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			debugger
			document.getElementById("loader").style.display = "none";
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            //reload product
				AllCategoryDetailsProduct(AccountID);
            //updated
				swal("Product is Updated Successfully!", {
					icon: "success",
				});
			} else {
            //update failed
				swal("Product Updated Failed!", {
					icon: "error",
				});
			}
		}
	});
}








function LoginApi() {

   //display loader
	document.getElementById("loaderLogin").style.display = "block";

   //get value and validate
	var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	var data = new FormData();
	debugger
	var email = $('#LoginEmailID').val();
	var password = $('#LoginPassword').val();
	data.append('email', email);
	data.append('password', password);
	if (email == "") {
		document.getElementById("loaderLogin").style.display = "none";
		swal("Please check the user name!", {
			icon: "warning",
		});
		return;
	}
	if (email.match(mailformat)) {

	} else {
		document.getElementById("loaderLogin").style.display = "none";
		swal("Please enter valid email Id !", {
			icon: "warning",
		});
		return;
	}

	if (password == "") {
		document.getElementById("loaderLogin").style.display = "none";
		swal("Please check the password!", {
			icon: "warning",
		});
		return;
	}

   //api call
	jQuery.ajax({
		url: 'LoginApi.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loaderLogin").style.display = "none";
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
				UserAccountId = jsonData.AccountId;
				var statusOfExport = jsonData.statusOfExport;
            var userRole = jsonData.userRole;
				if (statusOfExport == "1") {
               //user has completed the process
					swal("Customization is complete, we wil get back to you shortly!", {
						icon: "warning",
					});
					return;
				}

            // add user details to local storage if checked
				if ($('#chk1').is(':checked')){
					// save username and password
					localStorage.userName = email;
					localStorage.password = password;
					localStorage.checkBoxValidation = $('#chk1').val();
				} else {
					localStorage.userName = '';
					localStorage.password = '';
					localStorage.checkBoxValidation = '';
				}
            if(userRole == "10"){
               window.location.href = "AdminPage.php";
            }else{
               window.location.href = "index.php";
            }
				
			} else {
            //wrong username or password
				swal("Please check the user name and password!", {
					icon: "warning",
				});

			}
		}
	});

}

// admin register user
function SuperAdminRegisterUser() {


   //get value and validate
	var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	var data = new FormData();
	debugger
   var ClientEmailID = $('#ClientEmailID').val();
	var ClienPhoneNumber = $('#ClienPhoneNumber').val();
	var ClientFirstName = $('#ClientFirstName').val();
	var ClientLastName = $('#ClientLastName').val();
	data.append('ClientFirstName', ClientFirstName);
	data.append('ClientLastName', ClientLastName);
   data.append('ClientEmailID', ClientEmailID);
	data.append('ClienPhoneNumber', ClienPhoneNumber);
	if (ClientLastName == "" || ClientLastName == "" || ClienPhoneNumber == "" || ClientEmailID == "") {
		swal("Please input  all fields!", {
			icon: "warning",
		});
		return;
	}
	if (ClientEmailID.match(mailformat)) {

	} else {
		swal("Please enter valid email Id !", {
			icon: "warning",
		});
		return;
	}


   //api call
	jQuery.ajax({
		url: 'AdminUserRegisteration.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
				UserAccountId = jsonData.AccountId;
				
			} else {
           

			}
		}
	});

}

// add attribute
function AddAttribute() {
   // diaplay loader
	document.getElementById("loader").style.display = "block";
   //  get and validate data
	var data = new FormData();
	debugger
	var attributeTag = $('#attributeTag').val();
	var attributeName = $('#attributeName').val();
	var attributeMasterCode = $('#attributeMasterCode').val();
	var attributeMeasuringUnit = $('#attributeMeasuringUnit').val();
	var attributeValue = $('#attributeValue').val();
	var productId = $('#mySelectAttribute').val();
	if (productId == null) {
		document.getElementById("loader").style.display = "none";
		swal("Please Select Category and Sub-Category!", {
			icon: "warning",
		});
		return;
	}
	if (productId == "00") {
		document.getElementById("loader").style.display = "none";
		swal("Please Select Product!", {
			icon: "warning",
		});
		return;
	}
	if (attributeTag == "" || attributeName == "" || attributeMasterCode == "" || attributeMeasuringUnit == "" || attributeValue == "") {
		document.getElementById("loader").style.display = "none";
		swal("Please input all fields!", {
			icon: "warning",
		});
		return;
	}
	data.append('attributeTag', attributeTag);
	data.append('attributeName', attributeName);
	data.append('attributeMasterCode', attributeMasterCode);
	data.append('attributeMeasuringUnit', attributeMeasuringUnit);
	data.append('attributeValue', attributeValue);
	data.append('productId', productId);
	data.append('Status', "AddAttributes");
   // api call
	jQuery.ajax({
		url: 'AttributeAllAPisWithStatus.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			debugger
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // added
				document.getElementById("attributeTag").value = "";
				document.getElementById("attributeName").value = "";
				document.getElementById("attributeMasterCode").value = "";
				document.getElementById("attributeMeasuringUnit").value = "";
				document.getElementById("attributeValue").value = "";
				LoadAttributes();
				swal("Attribute Addition Successfully!", {
					icon: "success",
				});
			} else {
            // additon failed
				swal(jsonData.responseDescription + " !", {
					icon: "error",
				});
			}
		}
	});

}

//  Map attribute with product
function MapAttribute(attributeDetailsId, attributeTag, attributeMasterCode, attributeMasterId) {
   // display loader
	document.getElementById("loader").style.display = "block";
	var data = new FormData();
	// get and validate data
	var attributeName = $('#attributeName' + attributeDetailsId).val();
	var attributeMeasuringUnit = $('#attributeUnit' + attributeDetailsId).val();
	var attributeValue = $('#attributeValue' + attributeDetailsId).val();
	if (attributeName == "" || attributeValue == "" || attributeMeasuringUnit == "") {
		document.getElementById("loader").style.display = "none";
		swal("Please input all fields!", {
			icon: "warning",
		});
		return;
	}
	var productId = $('#mySelectAttribute').val();
	data.append('attributeName', attributeName);
	data.append('attributeMeasuringUnit', attributeMeasuringUnit);
	data.append('attributeValue', attributeValue);
	data.append('productId', productId);
	data.append('attributeTag', attributeTag);
	data.append('attributeMasterCode', attributeMasterCode);
	data.append('attributeDetailsId', attributeDetailsId);
	data.append('attributeMasterId', attributeMasterId);
	data.append('Status', "MapAttributes");
   // api call
	jQuery.ajax({
		url: 'AttributeAllAPisWithStatus.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			debugger
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // reload attributes
				LoadAttributes();
            // mapped
				swal("Attribute Mapped Successfully!", {
					icon: "success",
				});
			} else {
            // mapping failed
				swal(jsonData.responseDescription + " !", {
					icon: "error",
				});
			}
		}
	});

}

//  Update Attributes
function UpadateAttribute(attributeMasterId, attributeDetailsId, productAttributeMappingId) {
   // diaplay loader
	document.getElementById("loader").style.display = "block";
	var data = new FormData();
	// get and validate data
	var attributeName = $('#attributeName' + attributeDetailsId).val();
	var attributeMeasuringUnit = $('#attributeUnit' + attributeDetailsId).val();
	var attributeValue = $('#attributeValue' + attributeDetailsId).val();
	var productId = $('#mySelectAttribute').val();
	var productAttributesDetailsId = attributeDetailsId;
	data.append('attributeDetailsId', attributeDetailsId);
	data.append('attributeName', attributeName);
	data.append('attributeMasterId', attributeMasterId);
	data.append('attributeMeasuringUnit', attributeMeasuringUnit);
	data.append('attributeValue', attributeValue);
	data.append('productAttributeMappingId', productAttributeMappingId);
	data.append('productAttributesDetailsId', productAttributesDetailsId);
	data.append('productId', productId);
	data.append('Status', "UpdateAttributes");
   // api call
	jQuery.ajax({
		url: 'AttributeAllAPisWithStatus.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			debugger
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // updated
				swal("Attribute Updated Successfully!", {
					icon: "success",
				});
			} else {
            // update failed
				swal(jsonData.responseDescription + " !", {
					icon: "error",
				});
			}

		}
	});

}

//  add or update footer
function AddOrUpdateFooter(status, AccountFooterId) {
   // display loader
	document.getElementById("loader").style.display = "block";
	var data = new FormData();
	// get and validate data

	var AgencyCode = $('#AgencyCode').val();
	var RecentCauses = $('#RecentCauses').val();
	var Help = $('#Help').val();
	var Gallery = $('#Gallery').val();
	var MeetOurPartners = $('#MeetOurPartners').val();
	var PhoneNumber = $('#PhoneNumber').val();
	var EmailId = $('#EmailId').val();
	var FBUrl = $('#FBUrl').val();
	var WhatsAppUrl = $('#WhatsAppUrl').val();
	var InstaUrl = $('#InstaUrl').val();

	var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	if (PhoneNumber == "" || EmailId == "") {
		document.getElementById("loader").style.display = "none";
		swal("Please input Phone Number And Email Id!", {
			icon: "warning",
		});
		return;
	}

	if (PhoneNumber.length > 10) {
		document.getElementById("loader").style.display = "none";
		swal("Please input 10 digit Phone Number !", {
			icon: "warning",
		});
		return;
	}
	if (WhatsAppUrl.length != 0) {
		if (WhatsAppUrl.length > 10 || WhatsAppUrl.length < 10) {
			document.getElementById("loader").style.display = "none";
			swal("Please input 10 digit WhatsApp Number !", {
				icon: "warning",
			});
			return;
		}
	}

	if (EmailId.match(mailformat)) {

	} else {
		document.getElementById("loader").style.display = "none";
		swal("Please input valid Email Id!", {
			icon: "warning",
		});
		return;
	}

	data.append('AgencyCode', AgencyCode);
	data.append('RecentCauses', RecentCauses);
	data.append('Help', Help);
	data.append('Gallery', Gallery);
	data.append('MeetOurPartners', MeetOurPartners);
	data.append('PhoneNumber', PhoneNumber);
	data.append('EmailId', EmailId);
	data.append('FBUrl', FBUrl);
	data.append('WhatsAppUrl', WhatsAppUrl);
	data.append('InstaUrl', InstaUrl);

	if (footerIdUser == "" || AccountFooterId != "") {
		data.append('AccountFooterId', AccountFooterId);
		data.append('status', status);
	} else {
		data.append('AccountFooterId', footerIdUser);
		data.append('status', "Update");
	}

	var fotterTitle1 = document.getElementById("EnterTitle1");
	var fotterTitle2 = document.getElementById("EnterTitle2");
	var fotterTitle3 = document.getElementById("EnterTitle3");
	var fotterTitle4 = document.getElementById("EnterTitle4");
	var fotterTitle5 = document.getElementById("EnterTitle5");

	var fotterData1 = document.getElementById("EnterData1");
	var fotterData2 = document.getElementById("EnterData2");
	var fotterData3 = document.getElementById("EnterData3");
	var fotterData4 = document.getElementById("EnterData4");
	var fotterData5 = document.getElementById("EnterData5");

	if (fotterTitle1) {
		var EnterTitle = document.getElementById("EnterTitle1").value;
		if (EnterTitle != "") {
			data.append('EnterTitle1', EnterTitle);
		} else {
			data.append('EnterTitle1', "");
		}

	} else {
		data.append('EnterTitle1', "");
	}

	if (fotterTitle2) {
		var EnterTitle = document.getElementById("EnterTitle2").value;
		if (EnterTitle != "") {
			data.append('EnterTitle2', EnterTitle);
		} else {
			data.append('EnterTitle2', "");
		}
	} else {
		data.append('EnterTitle2', "");
	}

	if (fotterTitle3) {
		var EnterTitle = document.getElementById("EnterTitle3").value;
		if (EnterTitle != "") {
			data.append('EnterTitle3', EnterTitle);
		} else {
			data.append('EnterTitle3', "");
		}
	} else {
		data.append('EnterTitle3', "");
	}

	if (fotterTitle4) {
		var EnterTitle = document.getElementById("EnterTitle4").value;
		if (EnterTitle != "") {
			data.append('EnterTitle4', EnterTitle);
		} else {
			data.append('EnterTitle4', "");
		}
	} else {
		data.append('EnterTitle4', "");
	}

	if (fotterTitle5) {
		var EnterTitle = document.getElementById("EnterTitle5").value;
		if (EnterTitle != "") {
			data.append('EnterTitle5', EnterTitle);
		} else {
			data.append('EnterTitle5', "");
		}
	} else {
		data.append('EnterTitle5', "");
	}


	if (fotterData1) {
		var EnterData = document.getElementById("EnterData1").value;
		if (EnterData != "") {
			data.append('EnterData1', EnterData);
		} else {
			data.append('EnterData1', "");
		}
	} else {
		data.append('EnterData1', "");
	}

	if (fotterData2 && EnterData2 != "") {
		var EnterData = document.getElementById("EnterData2").value;
		if (EnterData != "") {
			data.append('EnterData2', EnterData);
		} else {
			data.append('EnterData2', "");
		}
	} else {
		data.append('EnterData2', "");
	}

	if (fotterData3 && EnterData3 != "") {
		var EnterData = document.getElementById("EnterData3").value;
		if (EnterData != "") {
			data.append('EnterData3', EnterData);
		} else {
			data.append('EnterData3', "");
		}
	} else {
		data.append('EnterData3', "");
	}

	if (fotterData4 && EnterData4 != "") {
		var EnterData = document.getElementById("EnterData4").value;
		if (EnterData != "") {
			data.append('EnterData4', EnterData);
		} else {
			data.append('EnterData4', "");
		}
	} else {
		data.append('EnterData4', "");
	}

	if (fotterData5 && EnterData5 != "") {
		var EnterData = document.getElementById("EnterData5").value;
		if (EnterData != "") {
			data.append('EnterData5', EnterData);
		} else {
			data.append('EnterData5', "");
		}
	} else {
		data.append('EnterData5', "");
	}

   // api call
	jQuery.ajax({
		url: 'FooterDetailsApi.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
				if (status == "Add") {
               // added
					document.getElementById("updateFooter").innerHTML = "Update Footer"
					swal("Footer details Added Successfully!", {
						icon: "success",
					});
				} else {
               // updated
					swal("Footer details Updated Successfully!", {
						icon: "success",
					});
				}
			} else {
				if (status == "Add") {
               // addition failed
					swal("Footer details Added Failed!", {
						icon: "error",
					});
				} else {
               // update failed
					swal("Footer details Updation Failed!", {
						icon: "error",
					});
				}
			}

		}
	});

}

//  add or update payment
function AddOrUpdatePayment(status, paymentID) {
   // diaplay footer
	document.getElementById("loader").style.display = "block";
   // get and validate data
	var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	var panFormate = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
	var GstinFormate = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
	var accountNumberformate = /^([0-9]{11})|([0-9]{2}-[0-9]{3}-[0-9]{6})$/;
	var ifseFormate = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;
	var data = new FormData();
	debugger

	var PaymentName = $('#PaymentName').val();
	var PaymentAddress = $('#PaymentAddress').val();
	var PaymentPhoneNumber = $('#PaymentPhoneNumber').val();
	var PaymentEmailD = $('#PaymentEmailD').val();
	var PaymentPANNumber = $('#PaymentPANNumber').val();
	var PaymentGSTINNumber = $('#PaymentGSTINNumber').val();
	var PaymentAcccountNumber = $('#PaymentAcccountNumber').val();
	var PaymentBankName = $('#PaymentBankName').val();
	var PaymentIFSCCode = $('#PaymentIFSCCode').val();
	var PaymentBranchName = $('#PaymentBranchName').val();
	var PaymentBillingAddress = $('#PaymentBillingAddress').val();
	if (paymentIdUser == "" || paymentID != "") {
		data.append('PaymentID', paymentID);
		data.append('Status', status);
	} else {
		data.append('PaymentID', paymentIdUser);
		data.append('Status', "Update");
	}

	if (PaymentName == "" || PaymentAddress == "" || PaymentPhoneNumber == "" || PaymentEmailD == "" ||
		PaymentAcccountNumber == "" ||
		PaymentBankName == "" || PaymentIFSCCode == "" || PaymentBranchName == "" || PaymentBillingAddress == "") {
		document.getElementById("loader").style.display = "none";
		swal("Please enter all the fields!", {
			icon: "warning",
		});
		return;
	}
	if (PaymentPANNumber == "" && PaymentGSTINNumber == "") {
		document.getElementById("loader").style.display = "none";
		swal("Please enter Pan number or GSTIN!", {
			icon: "warning",
		});
		return;
	}
	if (PaymentPANNumber != "") {
		if (!panFormate.test(PaymentPANNumber)) {
			document.getElementById("loader").style.display = "none";
			swal("Please enter valid Pan Number !", {
				icon: "warning",
			});
			return;
		}
	}

	if (PaymentGSTINNumber != "") {
		if (!GstinFormate.test(PaymentGSTINNumber)) {
			document.getElementById("loader").style.display = "none";
			swal("Please enter valid GSTIN Number !", {
				icon: "warning",
			});
			return;
		}
	}
	if (PaymentPhoneNumber.length > 10 || PaymentPhoneNumber.length < 10) {
		document.getElementById("loader").style.display = "none";
		swal("Please enter 10 digit Phone Number !", {
			icon: "warning",
		});
		return;
	}

	if (PaymentEmailD.match(mailformat)) {

	} else {
		document.getElementById("loader").style.display = "none";
		swal("Please enter valid email Id !", {
			icon: "warning",
		});
		return;
	}


	if (!panFormate.test(PaymentPANNumber) && PaymentGSTINNumber == "") {
		document.getElementById("loader").style.display = "none";
		swal("Please enter valid Pan Number !", {
			icon: "warning",
		});
		return;
	}

	if (!GstinFormate.test(PaymentGSTINNumber) && PaymentPANNumber == "") {
		document.getElementById("loader").style.display = "none";
		swal("Please enter valid GSTIN Number !", {
			icon: "warning",
		});
		return;
	}

	if (!accountNumberformate.test(PaymentAcccountNumber)) {
		document.getElementById("loader").style.display = "none";
		swal("Please enter valid Account Number !", {
			icon: "warning",
		});
		return;
	}

	if (!ifseFormate.test(PaymentIFSCCode)) {
		document.getElementById("loader").style.display = "none";
		swal("Please enter valid IFSC code  !", {
			icon: "warning",
		});
		return;
	}

	data.append('PaymentName', PaymentName);
	data.append('PaymentAddress', PaymentAddress);
	data.append('PaymentPhoneNumber', PaymentPhoneNumber);
	data.append('PaymentEmailD', PaymentEmailD);
	data.append('PaymentPANNumber', PaymentPANNumber);
	data.append('PaymentGSTINNumber', PaymentGSTINNumber);
	data.append('PaymentAcccountNumber', PaymentAcccountNumber);
	data.append('PaymentBankName', PaymentBankName);
	data.append('PaymentIFSCCode', PaymentIFSCCode);
	data.append('PaymentBranchName', PaymentBranchName);
	data.append('PaymentBillingAddress', PaymentBillingAddress);

	if ($('#cashOnDelivery').is(':checked')) {
		data.append('CodeStatus', 'Yes');
	} else {
		data.append('CodeStatus', 'No');
	}
// api call
	jQuery.ajax({
		url: 'addPaymentDetails.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			debugger
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // load payment details
				UserpaymentDetails();
				if (paymentIdUser == "") {
					if (status == "Add") {
						document.getElementById("updatePaymetDetails").innerHTML = "Update Payment"
                  // added
						swal("Payment details Added Successfully!", {
							icon: "success",
						});
					} else {
                  // updated
						swal("Payment details Updated Successfully!", {
							icon: "success",
						});
					}
				} else {
               // updated
					swal("Payment details Updated Successfully!", {
						icon: "success",
					});
				}
			} else {
				if (paymentIdUser == "") {
					if (status == "Add") {
                  // added failed
						swal("Payment details Added Failed!", {
							icon: "error",
						});
					} else {
                  // updated failed
						swal("Payment details Updation Failed!", {
							icon: "error",
						});
					}
				} else {
                // updated failed
					swal("Payment details Updation Failed!", {
						icon: "error",
					});
				}
			}

		}
	});

}

// User footer details
function UserFooterDetails() {
   // diaply loader
	document.getElementById("loader").style.display = "block";
   // api call
	$.ajax({
		url: 'http://customization.ortusolis.in/ecom-API/accountFooter/footerReadone.php?AccountId=' + AccountID + '&levelId=1',
		type: "GET",
		dataType: "json",
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			debugger
			var jsonData = JSON.parse(data);
          // responce object
			footerIdUser = jsonData.requestData[0].AccountFooterId;
		},
		error: function (error) {
			console.log(`Error ${error}`);
		}
	});
}

// user payment details
function UserpaymentDetails() {
   // diaply loader
	document.getElementById("loader").style.display = "block";
   // api call
	jQuery.ajax({
		url: 'getPaymentDetailsByUserId.php',
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			debugger
			var jsonData = JSON.parse(data);
         // responce object
			paymentIdUser = jsonData.requestData[0].paymentId;
		}
	});
}

// load seller
function loadSeller() {
   // display loader
	document.getElementById("loader").style.display = "block";
   // api call
	jQuery.ajax({
		url: 'getAllsellers.php',
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			debugger
			var jsonData = JSON.parse(data);
			if (jsonData.requestData.length != 0) {
				var html = ""
				html += "<option id='00' value='00' >Select Seller</option>"
				for (i in jsonData.requestData) {
					var name = jsonData.requestData[i].sellerName;
					var id = jsonData.requestData[i].sellerId;
					html += "<option id=" + id + " value=" + id + " >" + name + "</option>"
				}
            // load seller
				$('#productPageSeller').html(html);
			}


		}
	});
}

// Map seller with product
function MapSellerAndProduct() {
   // display loader
	document.getElementById("loader").style.display = "block";
   // get and validate data
	var data = new FormData();
	var productPageSeller = $('#productPageSeller').val();
	var productPageSellerProduct = $('#productPageSellerProduct').val();

	if (productPageSeller == null) {
		document.getElementById("loader").style.display = "none";
		swal("Please Add Seller!", {
			icon: "warning",
		});
		return;
	}
	if (productPageSellerProduct == null) {
		document.getElementById("loader").style.display = "none";
		swal("Please Select Category and Sub-Category!", {
			icon: "warning",
		});
		return;
	}
	if (productPageSellerProduct == "00") {
		document.getElementById("loader").style.display = "none";
		swal("Please Select Product!", {
			icon: "warning",
		});
		return;
	}
	data.append('sellerId', productPageSeller);
	data.append('productId', productPageSellerProduct);
   // api call
	jQuery.ajax({
		url: 'mapSellerAndProduct.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
            // seller mapped
				swal("Seller Mapped Successfully!", {
					icon: "success",
				});
			} else {
            // mapped failed
				swal("Seller Mapping Failed!", {
					icon: "error",
				});
			}

		}
	});

}

//  load banner
function LoadBannerAllData(AccountID) {
	debugger
	var table = $('#BannerTable').DataTable();
	var rows = table
		.rows()
		.remove()
		.draw();

   // api call
	$.ajax({
		url: 'http://customization.ortusolis.in/ecom-API/accountBannerInfo/bannerReadOne.php?AccountId=' + AccountID,
		dataType: "json",
		success: function (data) {
			console.log(data);
			if (data.requestData.length != 0) {
				var BannerDetails = data.requestData;
				var count = 1;
				for (var i = 0; i < BannerDetails.length; i++) {
					var BannerImage = BannerDetails[i].BannerImage;
					var BannerContent = BannerDetails[i].BannerContent;
					var AccountBannerId = BannerDetails[i].AccountBannerId;
					var imageTD = "";
					imageTD += "<div class='profile-img' style='margin-top: 5%;width: 100%'>";
					imageTD += "<img src='" + BannerImage + "' id='bannerImageTable" + AccountBannerId + "'  class='zoom' alt=''/>";
					imageTD += "<div class='file btn btn-lg btn-primary'>";
					imageTD += "Banner  Image";
					imageTD += "<input type='file' id='BannerImageFile" + AccountBannerId + "' name='file' accept='image/x-png,image/jpeg' onchange='previewBannerImageTable(this," + AccountBannerId + ")'/>";
					imageTD += "</div>";
					imageTD += "</div>";
               //  load data
					$('#BannerTable').DataTable().row.add([
						count,
						imageTD,
						"<input type='text' maxlength='250' value='" + BannerContent + "' id='BannerContent" + AccountBannerId + "' style='border:none;font-family: inherit;color: black;' >",
						"<button class='btn' onclick='UpdateBanner(BannerContent" + AccountBannerId + "," + AccountBannerId + ",\"" + BannerImage + "\"," + AccountID + ")'  style='background: skyblue;font-weight: bold;color: white;'>Update</button><button class='btn'  onclick='DeleteBanner(" + AccountBannerId + ",this," + AccountID + ")' style=''><i class='fa fa-trash'></i></button>"
					]).draw(false);
					count++
				}
			}
		},
		error: function (error) {
			console.log(`Error ${error}`);
		}
	});


}

// load attribute
function LoadAttributes() {
	debugger
	document.getElementById("loader").style.display = "block";
	var ProductID = $('#mySelectAttribute').val();
	var table = $('#AttributeTable').DataTable();
	var rows = table
		.rows()
		.remove()
		.draw();
	var data = new FormData();
	data.append('ProductID', ProductID);
	jQuery.ajax({
		url: 'getAllAttributeForProductId.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			var jsonData = JSON.parse(data);
			if (jsonData.requestData.length != 0) {

				var AttributeDetails = jsonData.requestData[1].AttributesOfProducts;
				var AttributeDetailsMaster = jsonData.requestData[2].suggestionAttributesByUser;
				for (var i = 0; i < AttributeDetails.length; i++) {
					var attributeName = AttributeDetails[i].attributeName;
					var attributeValue = AttributeDetails[i].attributeValue;
					var attributeUnit = AttributeDetails[i].attribute_measuring_unit;
					var attributeMasterId = AttributeDetails[i].masterId;
					var productAttributesDetailsId = AttributeDetails[i].productAttributeDetailsId;
					var productAttributeMappingId = AttributeDetails[i].mappingId;
					var attributeTag = AttributeDetails[i].attributeTag;
					var productAttributeDetailsId = AttributeDetails[i].productAttributeDetailsId;
					// load data
					$('#AttributeTable').DataTable().row.add([
						"<input type='text' value='" + attributeName + "' id='attributeName" + productAttributesDetailsId + "' style='border:none;font-family: inherit;color: black;' >",
						"<input type='text' value='" + attributeValue + "' id='attributeValue" + productAttributesDetailsId + "' style='border:none;font-family: inherit;color: black;' >",
						"<input type='text' value='" + attributeUnit + "' id='attributeUnit" + productAttributesDetailsId + "' style='border:none;font-family: inherit;color: black;' >",
						attributeTag,
						"<button class='btn' onclick='UpadateAttribute(" + attributeMasterId + "," + productAttributesDetailsId + "," + productAttributeMappingId + ")'  style='background: skyblue;font-weight: bold;color: white;'>Update</button><button class='btn'  onclick='DeleteAttribute(" + attributeMasterId + ",this," + productAttributeMappingId + ")' style=''><i class='fa fa-trash'></i></button>"
					]).draw(false);
				}

				for (var i = 0; i < AttributeDetailsMaster.length; i++) {
					var productMappedTo = AttributeDetailsMaster[i].productMappedTo;
					if (productMappedTo == null) {
						var attributeName = AttributeDetailsMaster[i].attributeName;
						var attributeValue = "";
						var attributeUnit = AttributeDetailsMaster[i].attributeMeasuringUnit;
						var attributeMasterId = AttributeDetailsMaster[i].attributeMasterId;
						var productAttributesDetailsId = AttributeDetailsMaster[i].attributesDetailsId;
						var attributeTag = AttributeDetailsMaster[i].attributeTag;
						var attributeMasterCode = AttributeDetailsMaster[i].attributeMasterCode;
                  // load data
						$('#AttributeTable').DataTable().row.add([
							"<input type='text' value='" + attributeName + "' id='attributeName" + productAttributesDetailsId + "' style='border:none;font-family: inherit;color: black;' >",
							"<input type='text' value='" + attributeValue + "' id='attributeValue" + productAttributesDetailsId + "' style='border:none;font-family: inherit;color: black;' >",
							"<input type='text' value='" + attributeUnit + "' id='attributeUnit" + productAttributesDetailsId + "' style='border:none;font-family: inherit;color: black;' >",
							attributeTag,
							"<button class='btn' onclick='MapAttribute(" + productAttributesDetailsId + ",\"" + attributeTag + "\",\"" + attributeMasterCode + "\",\"" + attributeMasterId + "\")'  style='background: skyblue;font-weight: bold;color: white;'>Map</button>"
						]).draw(false);
					}
				}

			}
		},
		error: function (error) {
			document.getElementById("loader").style.display = "none";
			console.log(`Error ${error}`);
		}
	});

}

// load Category
function LoadCategoryAllData(userIdSeesion) {
	var table = $('#CategoryTable').DataTable();
	var rows = table
		.rows()
		.remove()
		.draw();
      // api call
	$.ajax({
		url: 'http://customization.ortusolis.in/ecom-API/products/userWiseProducts.php?userId=' + userIdSeesion + '&levelId=1',
		type: "GET",
		dataType: "json",
		success: function (data) {
			debugger
			console.log(data);
			if (data.requestData.length != 0) {
				var CategoryDetails = data.requestData;
				var count = 1;
				var html = ""
				html += "<option id='00' value='00' >Select Category</option>"
				for (var i = 0; i < CategoryDetails.length; i++) {
					var CategoryImage = CategoryDetails[i].image;
					var CategoryName = CategoryDetails[i].name;
					var AccountCategoryId = CategoryDetails[i].productId;

					html += "<option id=" + AccountCategoryId + " value=" + AccountCategoryId + " >" + CategoryName + "</option>"
					var id = i + 1;
					var imageTd = "";
					imageTd += "<div class='profile-img' style='margin-top: 5%;width: 100%'>";
					imageTd += "<img src='" + CategoryImage + "' id='CategoryImageTable" + AccountCategoryId + "' class='zoom' alt=''/>";
					imageTd += "<div class='file btn btn-lg btn-primary'>";
					imageTd += "Category  Image";
					imageTd += "<input type='file' id='CategoryImageFile" + AccountCategoryId + "' name='file' onchange='previewCatagoryImageTable(this," + AccountCategoryId + ")'/>";
					imageTd += "</div>";
					imageTd += "</div>";
               // load data
					$('#CategoryTable').DataTable().row.add([
						id,
						imageTd,
						"<input type='text' maxlength='100' value='" + CategoryName + "' id='CategoryName" + AccountCategoryId + "' style='border:none;font-family: inherit;color: black;' >",
						"<button class='btn' onclick='UpadateCategory(" + AccountCategoryId + ",\"" + CategoryImage + "\"," + userIdSeesion + ")'  style='background: skyblue;font-weight: bold;color: white;'>Update</button><button class='btn'  onclick='CheckIfSubcategoryExists(" + AccountCategoryId + ",this," + userIdSeesion + ")' style=''><i class='fa fa-trash'></i></button>"
					]).draw(false);
				}
            // load category
				$('#SubCategoryPageCategoryName').html(html);
				$('#productPageCategory1').html(html);
				$('#productPageCategoryAttribute').html(html);
				$('#productPageCategorySeller').html(html);

			}
		},
		error: function (error) {
			console.log(`Error ${error}`);
		}
	});
}

//  get all catrgory
function AllCategoryDetails(AccountID) {
	$.ajax({
		url: 'http://customization.ortusolis.in/ecom-API/products/userWiseProducts.php?userId=' + AccountID + '&levelId=1',
		type: "GET",
		dataType: "json",
		success: function (data) {
			if (data.requestData.length != 0) {
				userWiseCategoryData = data.requestData;
            // load sub- category
				LoadSubCategoryAllData(AccountID);
			}
		},
		error: function (error) {
			console.log(`Error ${error}`);
		}
	});
}

//  get all category by user
function AllCategoryDetailsProduct(AccountID) {
	$.ajax({
		url: 'http://customization.ortusolis.in/ecom-API/products/userWiseProducts.php?userId=' + AccountID + '&levelId=1',
		type: "GET",
		dataType: "json",
		success: function (data) {
			if (data.requestData.length != 0) {
				userWiseCategoryDataProduct = data.requestData;
            // load sub category
				AllSubCategoryDetailsProduct(AccountID);
			}
		},
		error: function (error) {
			console.log(`Error ${error}`);
		}
	});
}

// get all sub-category
function AllSubCategoryDetailsProduct(AccountID) {
	$.ajax({
		url: 'http://customization.ortusolis.in/ecom-API/products/userWiseProducts.php?userId=' + AccountID + '&levelId=2',
		type: "GET",
		dataType: "json",
		success: function (data) {
			if (data.requestData.length != 0) {
				userWiseSubCategoryDataProduct = data.requestData;
            // load products
				LoadProductAllData(AccountID);
			}
		},
		error: function (error) {
			console.log(`Error ${error}`);
		}
	});
}

//  load sub-category
function LoadSubCategoryAllData(AccountID) {
	var table = $('#SubCategoryTable').DataTable();
	var rows = table
		.rows()
		.remove()
		.draw();
	var data = new FormData();
	data.append('AccountID', AccountID);
	jQuery.ajax({
		url: 'getALLSubCategoryByUserId.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			debugger
			var jsonData = JSON.parse(data);
			if (jsonData.requestData.length != 0) {
				debugger
				var SubCategoryDetails = jsonData.requestData;
				var maxLoop = SubCategoryDetails.length;
				for (var i = 0; i < maxLoop; i++) {
					debugger
					var SubCategoryImage = SubCategoryDetails[i].subCategoryImage;
					var SubCategoryName = SubCategoryDetails[i].subCateoryName;
					var CategoryName = SubCategoryDetails[i].categoryName;
					var AccountSubCategoryId = SubCategoryDetails[i].subCategoryId;
					var categoryId = SubCategoryDetails[i].categoryId;
					var productCatgoryMappingId = SubCategoryDetails[i].productCategorytMappingId;
					var id = i + 1;
					var imageTD = "";
					imageTD += "<div class='profile-img' style='margin-top: 5%;width: 100%'>";
					imageTD += "<img src='" + SubCategoryImage + "' id='SubCategoryImageTable" + AccountSubCategoryId + "' class='zoom' alt=''/>";
					imageTD += "<div class='file btn btn-lg btn-primary'>";
					imageTD += "Sub-Category  Image";
					imageTD += "<input type='file' id='SubCategoryImageFile" + AccountSubCategoryId + "' name='file' onchange='previewSubCatagoryImageTable(this," + AccountSubCategoryId + ")'/>";
					imageTD += "</div>";
					imageTD += "</div>";
					var subcategoryTd = "";
					subcategoryTd += "<select id='SubCategoryPageCategoryName" + AccountSubCategoryId + "' >";

					for (var j = 0; j < userWiseCategoryData.length; j++) {
						var MainCategoryData = userWiseCategoryData[j].name;
						var MainCategoryid = userWiseCategoryData[j].productId; //$CategoryDataeDetails['productId'];
						if (MainCategoryData == CategoryName) {
							subcategoryTd += "<option value='" + MainCategoryid + "' id='" + MainCategoryid + "' Selected>" + MainCategoryData + "</option>"
						} else {
							subcategoryTd += "<option value='" + MainCategoryid + "' id='" + MainCategoryid + "'>" + MainCategoryData + "</option>"
						}
					}
					subcategoryTd += "</select>"
               // load data
					$('#SubCategoryTable').DataTable().row.add([
						id,
						imageTD,
						"<input type='text' maxlength='100' value='" + SubCategoryName + "' id='SubCategoryName" + AccountSubCategoryId + "' style='border:none;font-family: inherit;color: black;' >",
						subcategoryTd,
						"<button class='btn' onclick='UpdateSubCategoryApi(" + AccountSubCategoryId + ",\"" + SubCategoryImage + "\"," + AccountID + "," + productCatgoryMappingId + ")'  style='background: skyblue;font-weight: bold;color: white;'>Update</button><button class='btn'  onclick='CheckIfProductExist(" + AccountSubCategoryId + ",this," + AccountID + ")' style=''><i class='fa fa-trash'></i></button>"
					]).draw(false);
				}
			}

		},
		error: function (error) {
			console.log(`Error ${error}`);
		}
	});
}

//  load product
function LoadProductAllData(AccountID) {
	var table = $('#productTable').DataTable();
	var rows = table
		.rows()
		.remove()
		.draw();
	var htmlContentCategory = "";
	var data = new FormData();
	data.append('AccountID', AccountID);
   // api call
	jQuery.ajax({
		url: 'getALLProductByUserId.php',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {

			var jsonData = JSON.parse(data);
			debugger
			if (jsonData.requestData.length != 0) {
				var ProductDetails = jsonData.requestData;
				var count = 1;
				var maxLoop = ProductDetails.length;
				for (var i = 0; i < maxLoop; i++) {
					var ProductImage = ProductDetails[i].productImage;
					var ProductImage1 = '"'+ProductDetails[i].productImage1+'"';
					var ProductImage2 = '"'+ProductDetails[i].productImage2+'"';
					var ProductImage3 = '"'+ProductDetails[i].productImage3+'"';
					var ProductImage4 = '"'+ProductDetails[i].productImage4+'"';
					var ProductImage5 = '"'+ProductDetails[i].productImage5+'"';
					// alert(ProductImage1);

					var SubCategoryName = ProductDetails[i].subCateoryName;
					var CategoryName = ProductDetails[i].categoryName;
					var ProductName = ProductDetails[i].name;
					var productDescription = ProductDetails[i].productDescription;
					var productPrice = ProductDetails[i].productPrice;
					var productgst = ProductDetails[i].productgst;
					var productBasePrice = ProductDetails[i].productBasePrice;
					var AccountProductId = ProductDetails[i].productId;
					var updateSubCategoryId = ProductDetails[i].updateSubCategoryId;
					var id = i + 1;

					count++;
					var imageTD = "";
					imageTD += "<div class='profile-img' style='margin-top: 5%;width: 100%'>";
					imageTD += "<img src='" + ProductImage + "' id='ProductImageTable" + AccountProductId + "' class='zoom' alt=''/>";
					imageTD += "<div class='file btn btn-lg btn-primary' style='font-size: 5px;'>";
					imageTD += "Click Me";
					imageTD += "<input id='ProductImageFile" + AccountProductId + "' name='file' onclick='AddImage(" + AccountProductId + ","+ ProductImage1 +","+ ProductImage2 +","+ ProductImage3 +","+ ProductImage4 +","+ ProductImage5 +")' onchange='previewProductImageTable(this," + AccountProductId + ")'/>";
					// imageTD += "<input id='ProductImageFile" + AccountProductId + "' name='file' onclick='AddImage(" + AccountProductId + ","+ \"" ProductImage1 "\ "+","+ \"" ProductImage2 "\ "+","+ \"" ProductImage3 "\ "+","+ \"" ProductImage4 "\ "+","+ \"" ProductImage5 "\ "+")' onchange='previewProductImageTable(this," + AccountProductId + ")'/>";
					imageTD += "</div>";
					imageTD += "</div>";

					var categoryNameTd = "";
					categoryNameTd += "<select id='ProductPageCategoryNameTablefinal" + AccountProductId + "' onchange='LoadSubCategoryByCategoryIdTable(" + AccountProductId + ")' >";

					for (var j = 0; j < userWiseCategoryDataProduct.length; j++) {
						var MainCategoryData = userWiseCategoryDataProduct[j].name;
						var MainCategoryID = userWiseCategoryDataProduct[j].productId;
						if (MainCategoryData == CategoryName) {
							categoryNameTd += "<option Selected id=" + MainCategoryID + " value=" + MainCategoryID + ">" + MainCategoryData + "</option>"
						} else {
							categoryNameTd += "<option id=" + MainCategoryID + " value=" + MainCategoryID + ">" + MainCategoryData + "</option>"
						}
					}
					categoryNameTd += "</select>"

					var subCategoryTd = "";
					subCategoryTd += "<select id='ProductPageSubCategoryNameTableFinal" + AccountProductId + "' >";

					for (var j = 0; j < userWiseSubCategoryDataProduct.length; j++) {
						var MainSubCategoryData = userWiseSubCategoryDataProduct[j].name;
						var MainSubCategoryId = userWiseSubCategoryDataProduct[j].productId;
						if (MainSubCategoryData == SubCategoryName) {
							subCategoryTd += "<option Selected  id=" + MainSubCategoryId + " value=" + MainSubCategoryId + ">" + MainSubCategoryData + "</option>"
						} else {
							subCategoryTd += "<option  id=" + MainSubCategoryId + " value=" + MainSubCategoryId + ">" + MainSubCategoryData + "</option>"
						}
					}

					subCategoryTd += "</select>"
                  // load data
					$('#productTable').DataTable().row.add([
						id,
						imageTD,
						"<input type='text' maxlength='100' value='" + ProductName + "'id='ProductName" + AccountProductId + "' style='border:none;font-family: inherit;color: black;' >",
						"<input type='text' maxlength='1000' value='" + productDescription + "'id='productDescription" + AccountProductId + "' style='border:none;font-family: inherit;color: black;width: 200px;' >",
						categoryNameTd,
						subCategoryTd,
						"<input type='number' step='0.01'  min='0'  max='1000000000' value='" + productBasePrice + "' id='ProductPrice" + AccountProductId + "' onchange='SetBasePriceTable(" + AccountProductId + ")' style='border:none;font-family: inherit;color: black;width: 80px;' >",
						"<input type='number' step='0.01' min='0'  max='1000000000' value='" + productgst + "' id='ProductGst" + AccountProductId + "'  onchange='SetBasePriceTable(" + AccountProductId + ")' style='border:none;font-family: inherit;color: black;width: 80px;' >",
						"<p id='ProductBasePrice" + AccountProductId + "' >" + productPrice + "</p>",
						"<button class='btn' onclick='UpdateProductApi(" + AccountProductId + ",\"" + ProductImage + "\",\"" + AccountID + "\",\"" + updateSubCategoryId + "\")'  style='background: skyblue;font-weight: bold;color: white;'>Update</button><button class='btn'  onclick='DeleteProduct(" + AccountProductId + ",this," + AccountID + ")' style=''><i class='fa fa-trash'></i></button>"
					]).draw(false);
				}
			}
		},
		error: function (error) {
			console.log(`Error ${error}`);
		}
	});
}

function SetLimitBannerData(element, event) {
	debugger
	if (element.textContent.length > 250) {
		element.textContent = element.textContent.substr(0, 250);
	}

}

function SetLimitCategoryData(element, event) {
	debugger
	if (element.textContent.length > 100) {
		element.textContent = element.textContent.substr(0, 100);
	}

}

function SetLimitSubCategoryData(element, event) {
	debugger
	if (element.textContent.length > 100) {
		element.textContent = element.textContent.substr(0, 100);
	}

}

function SetLimitProductNameData(element, event) {
	debugger
	if (element.textContent.length > 100) {
		element.textContent = element.textContent.substr(0, 100);
	}

}

function SetLimitProductDescriptionData(element, event) {
	debugger
	if (element.textContent.length > 1000) {
		element.textContent = element.textContent.substr(0, 1000);
	}

}

function SetLimitProductPriceData(element, event) {
	debugger
	if (element.textContent.length > 45) {
		element.textContent = element.textContent.substr(0, 45);
	}

}

function SetLimitProductGSTData(element, event) {
	debugger
	if (element.textContent.length > 45) {
		element.textContent = element.textContent.substr(0, 45);
	}

}

function SetLimitProductBasePriceData(element, event) {
	debugger
	if (element.textContent.length > 45) {
		element.textContent = element.textContent.substr(0, 45);
	}

}

function SetBasePrice() {
	debugger
	var ProductPrice = parseFloat($('#ProductPrice').val());
	var gst = parseFloat($('#ProductGSTIN').val());
	var basePrice;

	if (!isNaN(ProductPrice)) {
		if (ProductPrice.toString().length > 10) {
			swal("Product Price can only have 10 digits!", {
				icon: "warning",
			});
			ProductPrice = parseFloat(ProductPrice.toFixed(2));
			ProductPrice = ProductPrice.toLocaleString('fullwide', {
				useGrouping: false
			})
			document.getElementById("ProductPrice").value = parseFloat(ProductPrice.substring(0, 10));
		} else {
			document.getElementById("ProductPrice").value = parseFloat(ProductPrice.toFixed(2));
		}

	}

	if (!isNaN(gst)) {
		if (gst.toString().length > 10) {
			swal("GSTIN Price can only have 10 digits!", {
				icon: "warning",
			});
			gst = parseFloat(gst.toFixed(2));
			gst = gst.toLocaleString('fullwide', {
				useGrouping: false
			})
			document.getElementById("ProductGSTIN").value = parseFloat(gst.substring(0, 10));
		} else {
			document.getElementById("ProductGSTIN").value = parseFloat(gst.toFixed(2));
		}

	}
	if (isNaN(ProductPrice) || isNaN(gst)) {
		// not a number
	} else {
		//number  
		var addedGstPrice = (ProductPrice * (gst / 100))
		basePrice = addedGstPrice + ProductPrice;
		document.getElementById("ProductBasePrice").innerHTML = parseFloat(basePrice.toFixed(2));
	}
}

function SetBasePriceTable(ProductID) {
	debugger
	var ProductPrice = parseFloat($('#ProductPrice' + ProductID).val());
	var gst = parseFloat($('#ProductGst' + ProductID).val());
	var basePrice;
	if (!isNaN(ProductPrice)) {
		if (ProductPrice.toString().length > 10) {
			swal("Product Price can only have 10 digits!", {
				icon: "warning",
			});
			ProductPrice = parseFloat(ProductPrice.toFixed(2));
			ProductPrice = ProductPrice.toLocaleString('fullwide', {
				useGrouping: false
			})
			$("#ProductPrice" + ProductID).text(parseFloat(ProductPrice.substring(0, 10)));
		} else if (ProductPrice.countDecimals() > 2) {
			swal("Number can only have 2 digits after decimal point!", {
				icon: "warning",
			});
			$("#ProductPrice" + ProductID).text(parseFloat(ProductPrice.toFixed(2)));
		}


	}
	if (!isNaN(gst)) {
		if (gst.toString().length > 10) {
			swal("GSTIN Price can only have 10 digits!", {
				icon: "warning",
			});
			gst = parseFloat(gst.toFixed(2));
			gst = gst.toLocaleString('fullwide', {
				useGrouping: false
			})
			$("#ProductGst" + ProductID).text(parseFloat(gst.substring(0, 10)));
		} else if (gst.countDecimals() > 2) {
			swal("Number can only have 2 digits after decimal point!", {
				icon: "warning",
			});
			$("#ProductGst" + ProductID).text(parseFloat(gst.toFixed(2)));
		}
	}

	if (isNaN(ProductPrice) || isNaN(gst)) {
		// not a number
	} else {
		//number  
		var addedGstPrice = (ProductPrice * (gst / 100))
		basePrice = addedGstPrice + ProductPrice;
		$("#ProductBasePrice" + ProductID).text(parseFloat(basePrice.toFixed(2)));
	}
}


// get number digits after decimal point
Number.prototype.countDecimals = function () {
	if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
	return this.toString().split(".")[1].length || 0;
}

//  add seller
function AddSeller() {

	document.getElementById("loader").style.display = "block";
	var myHtml = document.createElement("div");
	var str = "";
	str += " <form action='' method='post'>";
	str += " <div class='row px-3'><label class='mb-1'>";
	str += "<h6 class='mb-0 text-sm mr-5'>First Name</h6>";
	str += " </label> <input class='mb-4' type='text' name='firstName' id='SellerfirstName' style='margin-left: 20%;border:none'  placeholder='Enter a First Name' required> </div>";
	str += " <div class='row px-3'> <label class='mb-1'>";
	str += "<h6 class='mb-0 text-sm mr-5'>Last Name</h6>";
	str += " </label> <input class='mb-4' type='text' name='lastName' id='SellerlastName' style='margin-left: 20%;border:none'  placeholder='Enter a Last Name' required> </div>";
	str += " <div class='row px-3'> <label class='mb-1'>";
	str += "<h6 class='mb-0 text-sm mr-5'>Email Address</h6>";
	str += " </label> <input class='mb-4' type='email' name='email' id='Selleremail' style='margin-left: 14%;border:none'  placeholder='Enter a Email Address' required> </div>";
	str += " <div class='row px-3'> <label class='mb-1'>";
	str += "<h6 class='mb-0 text-sm mr-5'>Phone Number</h6>";
	str += " </label> <input class='mb-4' type='number' name='phoneNumber' id='SellerphoneNumber' style='margin-left: 12%;border:none'  placeholder='Enter a Phone Number' required> </div>";
	str += " <div class='row px-3'> <label class='mb-1'>";
	str += "<h6 class='mb-0 text-sm mr-5'>Address</h6>";
	str += " </label> <input class='mb-4' type='text' name='Address' id='SellerAddress' style='margin-left: 24%;border:none'  placeholder='Enter a Address' required> </div>";
	str += " <div class='row px-3'> <label class='mb-1'>";
	str += "<h6 class='mb-0 text-sm mr-5'>Pincode</h6>";
	str += " </label> <input class='mb-4' type='number' name='Pincode' id='SellerPincode' style='margin-left: 24%;border:none'  placeholder='Enter a Pincode' required> </div>";


	myHtml.innerHTML = str;

	swal({
		title: "Seller Registration",
		content: myHtml,
	}).then((value) => {
		if (value) {

			// get and validate data
			var data = new FormData();
			var SellerfirstName = $('#SellerfirstName').val();
			var SellerlastName = $('#SellerlastName').val();
			var Selleremail = $('#Selleremail').val();
			var SellerphoneNumber = $('#SellerphoneNumber').val();
			var SellerAddress = $('#SellerAddress').val();
			var SellerPincode = $('#SellerPincode').val();
			var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

			if (SellerfirstName == "" || SellerlastName == "" || Selleremail == "" || SellerphoneNumber == "" || SellerAddress == "" || SellerPincode == "") {
				document.getElementById("loader").style.display = "none";
				swal("Please input all fields!", {
					icon: "warning",
				});
				return;
			}
			if (Selleremail.match(mailformat)) {

			} else {
				document.getElementById("loader").style.display = "none";
				swal("Please input Proper email Id!", {
					icon: "warning",
				});
				return;
			}
			if (SellerphoneNumber.length > 10 || SellerphoneNumber.length < 10) {
				document.getElementById("loader").style.display = "none";
				swal("Please enter 10 digit Phone Number!", {
					icon: "warning",
				});
				return;
			}
			if (SellerPincode.length > 6 || SellerPincode.length < 6) {
				document.getElementById("loader").style.display = "none";
				swal("Please enter 6 digit Pin Code!", {
					icon: "warning",
				});
				return;
			}
			data.append('SellerfirstName', SellerfirstName);
			data.append('SellerlastName', SellerlastName);
			data.append('Selleremail', Selleremail);
			data.append('SellerphoneNumber', SellerphoneNumber);
			data.append('SellerAddress', SellerAddress);
			data.append('SellerPincode', SellerPincode);
         // api call
			jQuery.ajax({
				url: 'insertOrUpdateSeller.php',
				data: data,
				cache: false,
				contentType: false,
				processData: false,
				method: 'POST',
				type: 'POST', // For jQuery < 1.9
				success: function (data) {
					document.getElementById("loader").style.display = "none";

					var jsonData = JSON.parse(data);
					if (jsonData.responsecode == "200") {
                  // load seller
						loadSeller();
                  // added seller
						swal("Seller Added Successful!", {
							icon: "success",
						});

					} else {
                  // addition failed
						swal("Seller Addition Failed!!", {
							icon: "error",
						});
					}
				}
			});

		} else {
			document.getElementById("loader").style.display = "none";
		}
	});

}






//  add image
function AddImage(tableId,image1,image2,image3,image4,image5) {

	//document.getElementById("loader").style.display = "block";
	var myHtml = document.createElement("div");
	var img = "";
  img+=  "<form action='' method='post'>";
  img+=  "<div class='row' style= 'margin-right:-209px; margin-left:-38px';>  ";
  img+=   "<div class='col-3' style='padding-left: 0%;padding-right: 0%;'>";
  img+=     "<div class='profile-img' id='ProductImageDiv1' style='height: 80%;width: 100%;display: block;margin-left: 0%' > ";

  img+=       "<img src='"+image1+"' id='ProductImageUpdate1'  class='zoom' alt=''/> ";
  img+=       "<div class='file btn btn-lg btn-primary' > ";
  img+=         "Product Image 1 ";
  img+=         "<input type='file' accept='image/x-png,image/jpeg' name='file'  id='fileToUpdateProduct1' onchange='previewUpdateImage(this,1,"+tableId+")'/> ";
  img+=         "</div>";
  img+=     "</div>";  //ProductImageDiv1
  img+=   "</div>"; //col-3         
  img+=   "<div class='col-3' style='padding-left: 0%;padding-right: 0%;'> ";
  img+=     "<div class='profile-img' id='ProductImageDiv2' style='height: 80%;width: 100%;display: block;margin-left: 0%' >";
  img+=       " <img src='"+image2+"' id='ProductImageUpdate2'  class='zoom' alt=''/> ";
  img+=       "<div class='file btn btn-lg btn-primary' > ";
  img+=         "Product Image 2 ";
  img+=         "<input type='file' accept='image/x-png,image/jpeg' name='file'  id='fileToUpdateProduct2' onchange='previewUpdateImage(this,2,"+tableId+")'/> ";
  img+=       "</div>";
  img+=     "</div>";  //ProductImageDiv2
  img+=   "</div>"; //col-3
  img+=   "<div class='col-3' style='padding-left: 0%;padding-right: 0%;'> ";
  img+=     "<div class='profile-img' id='ProductImageDiv3' style='height: 80%;width: 100%;display: block;margin-left: 0%' > ";
  img+=       "<img src='"+image3+"' id='ProductImageUpdate3'  class='zoom' alt=''/> ";
  img+=       "<div class='file btn btn-lg btn-primary' > ";
  img+=         "Product Image 3 ";
  img+=         "<input type='file' accept='image/x-png,image/jpeg' name='file'  id='fileToUpdateProduct3' onchange='previewUpdateImage(this,3,"+tableId+")'/> ";
  img+=       "</div>";
  img+=     "</div>";  //ProductImageDiv3
  img+=   "</div>"; //col-3
  img+=  "</div>"; //rowEnd 

  img+=  "<div class='row' style= 'margin-right: -289px;margin-left: 46px;margin-top: 5%;';>    ";
  img+=   "<div class='col-3' style='padding-left: 0%;padding-right: 0%;'> ";
  img+=     "<div class='profile-img' id='ProductImageDiv4' style='height: 80%;width: 100%;display: block;margin-left: 0%' > ";
  img+=       "<img src='"+image4+"' id='ProductImageUpdate4'  class='zoom' alt=''/>";
  img+=       "<div class='file btn btn-lg btn-primary' > ";
  img+=         "Product Image 4 ";
  img+=         "<input type='file' accept='image/x-png,image/jpeg' name='file'  id='fileToUpdateProduct4' onchange='previewUpdateImage(this,4,"+tableId+")'/> ";
  img+=       "</div>";
  img+=     "</div>";  //ProductImageDiv4
  img+=   "</div>"; //col-3               
  img+=   "<div class='col-3' style='padding-left: 0%;padding-right: 0%;'> ";
  img+=     "<div class='profile-img' id='ProductImageDiv5' style='height: 80%;width: 100%;display: block;margin-left: 0%' > ";
  img+=       "<img src='"+image5+"' id='ProductImageUpdate5'  class='zoom' alt=''/>";
  img+=       "<div class='file btn btn-lg btn-primary' > ";
  img+=         "Product Image 5 ";
  img+=         "<input type='file' accept='image/x-png,image/jpeg' name='file'  id='fileToUpdateProduct5' onchange='previewUpdateImage(this,5,"+tableId+")'/> ";
  img+=       "</div>";
  img+=     "</div>";  //ProductImageDiv5
  img+=   "</div>"; //col-3
  img+=  "</div>"; 
	myHtml.innerHTML = img;

	swal({
		title: "Product Images",
		content: myHtml,


	}).then((value) => {

							});
}








// load styles 
function LoadStyle(status, ThemeId) {
	$.get('loadStyle.php', function (data) {
		debugger
		if (data != "400") {
			AddOrUpdateStyles(data, status, ThemeId);
		} else {
			alert("fail");
		}

	});

}

// add or update styles
function AddOrUpdateStyles(data, status, ThemeId) {
   // diaplay loader 
	document.getElementById("loader").style.display = "block";
   // get and validate Data
	var fontCheckedValue = $('.fontCheckbox:checked').val();
	var themeCheckedValue = $('.themeCheckbox:checked').val();

	var data1 = new FormData();
	data1.append('styleUrl', data);
	data1.append('fontTitle', fontCheckedValue + ',' + themeCheckedValue);
	data1.append('status', status);
	if (status == "Update") {
		data1.append('ThemeId', ThemeId);
	}
   // api call
	$.ajax({
		url: 'themeAddOrUpdate.php',
		data: data1,
		cache: false,
		contentType: false,
		processData: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function (data) {
			document.getElementById("loader").style.display = "none";
			var jsonData = JSON.parse(data);
			if (jsonData.responsecode == "200") {
				if (status == "Update") {
               // updated
					swal("Theme Updated Successful!", {
						icon: "success",
					});
				} else {
               // added
					swal("Theme Added Successful!", {
						icon: "success",
					});
				}
			} else {
				if (status == "Update") {
               // updated
					swal("Theme Updation Failed!!", {
						icon: "error",
					});
				} else {
               // added
					swal("Theme Addition Failed!!", {
						icon: "error",
					});

				}

			}
		},
		error: function (error) {
			console.log(`Error ${error}`);
		}
	});
}

// export final data
function finalexport() {
	// href="exportDbData.php"  

	var flag = "true";
// get and validate data
	var PhoneNumberFooter = $('#PhoneNumber').val();
	var EmailIdFooter = $('#EmailId').val();
	var CompanyName = $('#CompanyName').val();
	var CompanyUrl = $('#CompanyUrl').val();
	var PaymentPANNumber = $('#PaymentPANNumber').val();
	var PaymentGSTINNumber = $('#PaymentGSTINNumber').val();

	debugger
	//company data validation
	if (CompanyName.length == 0 || CompanyUrl.length == 0) {
		// flag="false";
		swal("Please Enter Company Name And Company Website Url", {
			icon: "warning",
		}).then((value) => {
			return;
		});

	} else {
		//Banner data validation
		var table = $('#BannerTable').DataTable();
		if (table.rows().count() > 0) {
			//Catrgory data validation
			var table = $('#CategoryTable').DataTable();
			if (table.rows().count() > 0) {
				//SubCategoryTable data validation
				var table = $('#SubCategoryTable').DataTable();

				if (table.rows().count() > 0) {
					//productTable data validation
					var table = $('#productTable').DataTable();
					if (table.rows().count() > 0) {
						//Footer data validation
						if (PhoneNumberFooter == "" || EmailIdFooter == "") {
							// flag="false";
							swal("Please Enter Footer Details", {
								icon: "warning",
							}).then((value) => {
								return;
							});
						} else {
							//payment data validation
							if (PaymentPANNumber == "" && PaymentGSTINNumber == "") {
								swal("Please Enter Payment Details", {
									icon: "warning",
								}).then((value) => {
									return;
								});
							} else {
								$.get('exportDbData.php', function (data) {

									window.location.href = "ThankYouPage.php";
									return false;
								});
							}
						}
					} else {
						flag = "false";
						swal("Please Enter productTable Details", {
							icon: "warning",
						}).then((value) => {
							return;
						});
					}
				} else {
					swal("Please Enter SubCategoryTable Details", {
						icon: "warning",
					}).then((value) => {
						return;
					});
				}
			} else {
				swal("Please Enter CategoryTable Details", {
					icon: "warning",
				}).then((value) => {
					return;
				});
			}
		} else {
			flag = "false";
			swal("Please Enter Banner Details", {
				icon: "warning",
			}).then((value) => {
				return;
			});
		}
	}
	return false;
}

// color changes
function BasicColour() {
	r.style.setProperty('--theme1Colour', 'grey');
}

function BlueColour() {
	r.style.setProperty('--theme1Colour', '#07D99F');
}

function PinkColour() {
	r.style.setProperty('--theme1Colour', 'pink');
}

function GreenColour() {
	r.style.setProperty('--theme1Colour', 'green');
}

function myFunction_set_font() {
	r.style.setProperty('--fontFamily', 'cursive');
}

function StandardFont() {
	r.style.setProperty('--fontFamily', 'Poppins');
}

function arilFont() {
	r.style.setProperty('--fontFamily', 'monospace');
}

// set title
function setTitle() {
	if ($("#ComapanyDetailssubmit").is(":visible")) {
		document.title = "Company Details";
	}

	if ($("#BannerDetailssubmit").is(":visible")) {
		document.title = "Banner Details";
	}

	if ($("#addCategory").is(":visible")) {
		document.title = "Category Details";
	}

	if ($("#addSubCategoryApi").is(":visible")) {
		document.title = "Sub-category Details";
	}

	if ($("#addProductApi").is(":visible")) {
		document.title = "Product Details";
	}

	if ($("#myTab").is(":visible")) {
		document.title = "Business Details";
	}
}


// wizerds

$(document).ready(function () {

	var current_fs, next_fs, previous_fs; //fieldsets
	var opacity;

	$(".next").click(function () {


		current_fs = $(this).parent();
		next_fs = $(this).parent().next();

		//Add Class Active
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

		//show the next fieldset
		next_fs.show();
		//hide the current fieldset with style
		current_fs.animate({
			opacity: 0
		}, {
			step: function (now) {
				// for making fielset appear animation
				opacity = 1 - now;

				current_fs.css({
					'display': 'none',
					'position': 'relative'
				});
				next_fs.css({
					'opacity': opacity
				});
			},
			duration: 600
		});

		// SET TITLE
		setTitle();
	});

	$(".previous").click(function () {


		current_fs = $(this).parent();
		previous_fs = $(this).parent().prev();

		//Remove class active
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

		//show the previous fieldset
		previous_fs.show();

		//hide the current fieldset with style
		current_fs.animate({
			opacity: 0
		}, {
			step: function (now) {
				// for making fielset appear animation
				opacity = 1 - now;

				current_fs.css({
					'display': 'none',
					'position': 'relative'
				});
				previous_fs.css({
					'opacity': opacity
				});
			},
			duration: 600
		});
		// SET TITLE
		setTitle();
	});

	$('.radio-group .radio').click(function () {
		$(this).parent().find('.radio').removeClass('selected');
		$(this).addClass('selected');
	});

	$(".submit").click(function () {
		return false;
	})

});