
// selecting all query elements

const blogTitleField = document.querySelector(".title");
const articleField = document.querySelector(".article");

//banner
const bannerImage = document.querySelector("#banner-upload");
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector(".publish-btn");
const uploadInput = document.querySelector("#image-upload");

bannerImage.addEventListener("change", () => {
  uploadImage(bannerImage, "banner");
});
// to upload input
uploadInput.addEventListener("change", () => {
  uploadImage(uploadInput, "image");
});

// access "file" from uploadfile.files
const uploadImage = (uploadFile, uploadType) => {
  const [file] = uploadFile.files;
  if (file && file.type.includes("image")) {
    const formdata = new FormData();
    formdata.append("image", file);

    // post request to '/upload' route using fetch method
    fetch("/upload", {
      method: "post",
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        if (uploadType == "image") {
          addImage(data, file.name);
        } else {
          // setting banner background image after getting image url
          bannerPath = `${location.origin}/${data}`;
          banner.style.backgroundImage = `url("${bannerPath}")`;
        }
      });
  } else {
    alert("upload Image only");
  }
};

// selection start will give cursor position so we can add image text to it.

const addImage = (imagepath, alt) => {
  let curPos = articleField.selectionStart;
  let textToInsert = `\r![${alt}](${imagepath})\r`;
  // slice() is used tp slice it's value to insert the image exactly at the cursor point
  articleField.value =
    articleField.value.slice(0, curPos) +
    textToInsert +
    articleField.value.slice(curPos);
};

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
publishBtn.addEventListener("click", () => {
  if (articleField.value.length && blogTitleField.value.length) {
    // generating id
    let letters = "abcdefghijklmnopqrstuvwxyz";
    let blogTitle = blogTitleField.value.split(" ").join("-");
    let id = "";
    for (let i = 0; i < 4; i++) {
      id += letters[Math.floor(Math.random() * letters.length)];
    }

    // setting up docName
    let docName = `${blogTitle}-${id}`;
    let date = new Date(); // for published at info
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    //access firstore with db variable;
     db.collection("blogs")
      .doc(docName)
      .set({
        title: blogTitleField.value,

        article: articleField.value,
        bannerImage: bannerPath,
        publishedAt: `${date.getDate()} ${
          months[date.getMonth()]
        } ${date.getFullYear()}`,
      })
      .then(() => {
        location.href = `/${docName}`;
      })
      .catch((err) => {
        console.error(err);
      });
  }
});
