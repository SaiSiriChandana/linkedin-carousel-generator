
let slides = [{
    text: "Content goes here...",
    name: "Your Name",
    profilePic: "",
    textColor: "#ffffff",
    bgColor: "#000000",
    font: "Arial",
    bgImage: ""
}];
let currentSlide = 0;

const textInput = document.getElementById('textInput');
const nameInput = document.getElementById('nameInput');
const profilePicInput = document.getElementById('profilePicInput');
const textColorInput = document.getElementById('textColor');
const bgColorInput = document.getElementById('bgColor');
const fontSelect = document.getElementById('fontSelect');
const slideText = document.getElementById('slideText');
const profileName = document.getElementById('profileName');
const profilePic = document.getElementById('profilePic');
const slidePreview = document.getElementById('slidePreview');
const bgImageInput = document.getElementById('bgImageInput');

function renderSlide(index) {
    const slide = slides[index];
    slideText.textContent = slide.text;
    profileName.textContent = slide.name;
    profilePic.src = slide.profilePic;
    slideText.style.color = slide.textColor;
    slidePreview.style.backgroundColor = slide.bgColor;
    slideText.style.fontFamily = slide.font;
    textInput.value = slide.text;
    nameInput.value = slide.name;
    textColorInput.value = slide.textColor;
    bgColorInput.value = slide.bgColor;
    fontSelect.value = slide.font;
    if (slide.bgImage) {
        slidePreview.style.backgroundImage = `url(${slide.bgImage})`;
        slidePreview.style.backgroundSize = "cover";
    } else {
        slidePreview.style.backgroundImage = "";
    }
}

function saveCurrentSlide() {
    const slide = slides[currentSlide];
    slide.text = textInput.value;
    slide.name = nameInput.value;
    slide.textColor = textColorInput.value;
    slide.bgColor = bgColorInput.value;
    slide.font = fontSelect.value;
}

textInput.addEventListener('input', () => { slideText.textContent = textInput.value; saveCurrentSlide(); });
nameInput.addEventListener('input', () => { profileName.textContent = nameInput.value; saveCurrentSlide(); });
profilePicInput.addEventListener('change', event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
        profilePic.src = e.target.result;
        slides[currentSlide].profilePic = e.target.result;
    };
    if (file) reader.readAsDataURL(file);
});
textColorInput.addEventListener('input', () => { slideText.style.color = textColorInput.value; saveCurrentSlide(); });
bgColorInput.addEventListener('input', () => { slidePreview.style.backgroundColor = bgColorInput.value; saveCurrentSlide(); });
fontSelect.addEventListener('change', () => { slideText.style.fontFamily = fontSelect.value; saveCurrentSlide(); });
bgImageInput.addEventListener('change', event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
        slidePreview.style.backgroundImage = `url(${e.target.result})`;
        slidePreview.style.backgroundSize = "cover";
        slides[currentSlide].bgImage = e.target.result;
    };
    if (file) reader.readAsDataURL(file);
});

document.getElementById('nextSlide').addEventListener('click', () => {
    saveCurrentSlide();
    if (currentSlide < slides.length - 1) {
        currentSlide++;
    } else {
        slides.push({...slides[0]}); // duplicate current slide
        currentSlide = slides.length - 1;
    }
    renderSlide(currentSlide);
});

document.getElementById('prevSlide').addEventListener('click', () => {
    if (currentSlide > 0) {
        saveCurrentSlide();
        currentSlide--;
        renderSlide(currentSlide);
    }
});

renderSlide(currentSlide);

document.getElementById('exportPDF').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [1080, 1080]
    });

    for (let i = 0; i < slides.length; i++) {
        currentSlide = i;
        renderSlide(currentSlide);
        await new Promise(resolve => setTimeout(resolve, 200)); // Wait for DOM to update

        const canvas = await html2canvas(document.getElementById('slidePreview'));
        const imgData = canvas.toDataURL("image/png");
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, 1080, 1080);
    }

    pdf.save("linkedin_carousel.pdf");
});

