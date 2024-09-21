const imageInput = document.getElementById('img-input');

imageInput.addEventListener('change', event => {
    const image = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', () => {
        // Save the image data URL to localStorage
        localStorage.setItem('image' + image.name, reader.result);
        const newImage = document.getElementById('img-from-local-storage');
        newImage.src = localStorage.getItem('image' + image.name)
    });

    reader.readAsDataURL(image);
    //alert(newImage.src)
});
