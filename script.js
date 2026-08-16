/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let currentStudent = null;

console.log(`${students.length} students loaded successfully.`);


/* =====================================================
   FIND STUDENT
===================================================== */

function findStudent() {

    const input = document
        .getElementById("rollNumber")
        .value
        .trim();


    const errorMessage =
        document.getElementById("errorMessage");


    /* Empty input */

    if (input === "") {

        errorMessage.style.display = "block";

        errorMessage.innerText =
            "Please enter your Roll Number.";

        return;
    }


    /* Remove previous error */

    errorMessage.style.display = "none";


    /*
       Always compare as STRING.

       This is important because Roll Number
       may be stored as a number in JSON.
    */

    const student = students.find(function (item) {

        return String(item["Roll Number"]).trim() === input;

    });


    /* Student not found */

    if (!student) {

        errorMessage.style.display = "block";

        errorMessage.innerText =
            "No student record found for this Roll Number.";

        return;
    }


    /* Save current student */

    currentStudent = student;


    /* Populate certificate */

    populateCertificate(student);


    /* Hide search page */

    document.getElementById("searchPage").style.display =
        "none";


    /* Show certificate */

    document.getElementById("certificatePage").style.display =
        "flex";


    /* Show buttons */

    document.getElementById("actionButtons").style.display =
        "flex";


    /* Scroll to certificate */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   POPULATE CERTIFICATE
===================================================== */

function populateCertificate(student) {


    /*
       NAME
    */

    document.getElementById("studentName").innerText =
        cleanText(student["Name"]).toUpperCase();


    /*
       ROLL NUMBER
    */

    document.getElementById("studentRoll").innerText =
        cleanText(student["Roll Number"]);


    /*
       REGISTRATION NUMBER
    */

    document.getElementById("studentRegistration").innerText =
        cleanText(student["Registration Number"]);


    /*
       INTERNSHIP TOPIC
    */

    document.getElementById("internshipTopic").innerText =
        `"${cleanText(student["Internship Topic"]).toUpperCase()}"`;


    /*
       MAJOR SUBJECT
    */

    document.getElementById("majorSubject").innerText =
        cleanText(student["Major Subject"]).toUpperCase();

           // ==========================================
    // CERTIFICATE NUMBER
    // ==========================================

    const certificateNumber =
        "ATSA-2026-" +
        String(1000 + Number(student["S No."])).padStart(4, "0");

    document.getElementById("certificateNumber").textContent =
        certificateNumber;
}


/* =====================================================
   CLEAN TEXT
===================================================== */

function cleanText(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim();
}


/* =====================================================
   PRINT CERTIFICATE
===================================================== */

function printCertificate() {

    if (!currentStudent) {

        alert("Please verify a student first.");

        return;
    }

    window.print();
}


/* =====================================================
   DOWNLOAD PDF
===================================================== */

async function downloadPDF() {

    if (!currentStudent) {

        alert("Please verify a student first.");

        return;
    }


    const certificate =
        document.getElementById("certificate");


    const studentName =
        cleanText(currentStudent["Name"])
            .replace(/\s+/g, "_");


    const rollNumber =
        cleanText(currentStudent["Roll Number"]);


    /*
       Temporarily remove shadow for clean PDF
    */

    certificate.style.boxShadow = "none";


    try {

        const canvas = await html2canvas(
            certificate,
            {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",

                logging: false
            }
        );


        const imageData =
            canvas.toDataURL("image/jpeg", 0.95);


        const {
            jsPDF
        } = window.jspdf;


        /*
           A4 LANDSCAPE

           297 × 210 mm
        */

        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });


        const pageWidth = 297;
        const pageHeight = 210;


        pdf.addImage(
            imageData,
            "JPEG",
            0,
            0,
            pageWidth,
            pageHeight
        );


        /*
           File name
        */

        const fileName =
            `Certificate_${studentName}_${rollNumber}.pdf`;


        pdf.save(fileName);


    } catch (error) {

        console.error(error);

        alert(
            "Unable to generate PDF. Please try the Print option."
        );

    } finally {

        certificate.style.boxShadow =
            "0 15px 50px rgba(0, 0, 0, 0.2)";
    }
}


/* =====================================================
   GO BACK
===================================================== */

function goBack() {

    currentStudent = null;


    document.getElementById("certificatePage").style.display =
        "none";


    document.getElementById("actionButtons").style.display =
        "none";


    document.getElementById("searchPage").style.display =
        "flex";


    document.getElementById("rollNumber").value = "";


    document.getElementById("errorMessage").style.display =
        "none";


    document.getElementById("rollNumber").focus();
}


/* =====================================================
   ENTER KEY SUPPORT
===================================================== */

document
    .getElementById("rollNumber")
    .addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            findStudent();

        }

    });

