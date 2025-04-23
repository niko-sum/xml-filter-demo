let xmlDoc = null;
let xslDoc = null;

const uploadBtn = document.getElementById('upload-btn');
const applyFilterBtn = document.getElementById('apply-filter-btn');
const xmlFileInput = document.getElementById('xml-file');
const xslFileInput = document.getElementById('xsl-file');
const departmentFilter = document.getElementById('department-filter');
const titleFilter = document.getElementById('title-filter');
const filterSection = document.getElementById('filter-section');
const resultSection = document.getElementById('result-section');
const resultContainer = document.getElementById('result-container');


uploadBtn.addEventListener('click', handleFileUpload);
applyFilterBtn.addEventListener('click', applyFilters);

// Function to process file uploads
function handleFileUpload() {
    const xmlFile = xmlFileInput.files[0];
    const xslFile = xslFileInput.files[0];
    
    if (!xmlFile || !xslFile) {
        alert('Please select both XML and XSL files.');
        return;
    }
    
    // Read the XML file
    const xmlReader = new FileReader(); //turns blob into string format/readable by DOM
    xmlReader.onload = function(e) {
        try {
            const parser = new DOMParser(); //turns string formatted file from FileReader into an XML doc object that's now usable by the DOM and JS
            xmlDoc = parser.parseFromString(e.target.result, 'application/xml'); //e = event object | e.target is what triggered the event (xmlReader in this case) | .result is built in property of FileReader. it is the content of the file loaded | application/xml tells DOMParser to treat it as XML
            
            // Read the XSL file
            const xslReader = new FileReader();
            xslReader.onload = function(e) {
                xslDoc = parser.parseFromString(e.target.result, 'application/xml'); 
                
                // Show filter section and result section after Load Files is clicked
                filterSection.classList.remove('hidden');
                resultSection.classList.remove('hidden');
                
                // Populate the filters with values from XML
                populateFilters();
                
                // Apply initial transformation and renders the XSL
                applyFilters();
            };
            
            xslReader.readAsText(xslFile); //.readAsText is a FileReader method. It says to take xslFile, read it as plain text, and run the .onload function
            
        } catch (err) {
            alert('Error processing files. Please check the file format.');
        }
    };
    
    xmlReader.readAsText(xmlFile);
}

// Function to populate filter dropdowns
function populateFilters() {
    // Clear existing options first
    departmentFilter.innerHTML = '<option value="all">All Departments</option>';
    titleFilter.innerHTML = '<option value="all">All Titles</option>';
    
    // Get all departments
    const departments = [];
    const deptElements = xmlDoc.getElementsByTagName('department'); //puts them in an array
    
    for (let i = 0; i < deptElements.length; i++) {
        const dept = deptElements[i].textContent;
        if (!departments.includes(dept)) {
            departments.push(dept); //pushes unique department names into the array
        }
    }
    
    // Add departments to the dropdown
    departments.sort();
    for (let i = 0; i < departments.length; i++) {
        const option = document.createElement('option');
        option.value = departments[i];
        option.textContent = departments[i];
        departmentFilter.appendChild(option);
    }
    
    // Get all titles
    const titles = [];
    const titleElements = xmlDoc.getElementsByTagName('title');
    
    for (let i = 0; i < titleElements.length; i++) {
        const title = titleElements[i].textContent;
        if (!titles.includes(title)) {
            titles.push(title);
        }
    }
    
    // Add titles to the dropdown
    titles.sort();
    for (let i = 0; i < titles.length; i++) {
        const option = document.createElement('option');
        option.value = titles[i];
        option.textContent = titles[i];
        titleFilter.appendChild(option);
    }
}

// Function to apply filters and transform XML
function applyFilters() {
    try {
        // Get selected values from the dropdown
        const department = departmentFilter.value;
        const title = titleFilter.value;
        
        // Create new instance of the XSL processor object 
        const processor = new XSLTProcessor();
        processor.importStylesheet(xslDoc); //loads XSL file to processor
        
        // Passes external values into XSL file
        processor.setParameter(null, 'department', department); //(null, $department variable that will then convert to the third argument which is the value in this case)
        processor.setParameter(null, 'title', title);
        
        // Transform XML
        const result = processor.transformToFragment(xmlDoc, document);//applies the actual transformation and converts XML into HTML based on the XSL stylesheet. (xmlDoc = xml file, document or 2nd argument refers to DOM)
        
        // Show result
        resultContainer.innerHTML = '';
        resultContainer.appendChild(result);
        
    } catch (err) {
        resultContainer.innerHTML = '<p>Error applying transformation.</p>';
    }
}