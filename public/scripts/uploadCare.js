UPLOADCARE_LOCALE = "en";
UPLOADCARE_TABS = "file url facebook instagram";
UPLOADCARE_PUBLIC_KEY = "19dea70da981e1d2cf70";


uploadcare.openDialog(null, {
  crop: "200x200 minimum",
  imagesOnly: true
}).done(function(file) {
  file.promise().done(function(fileInfo){
    console.log(fileInfo.cdnUrl);
  });
});
