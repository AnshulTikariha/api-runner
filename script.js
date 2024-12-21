document.getElementById("send").addEventListener("click", async () => {
    const url = document.getElementById("url").value;
    const method = document.getElementById("method").value;
    const headersInput = document.getElementById("headers").value;
    const bodyInput = document.getElementById("body").value;
    const iterations = parseInt(document.getElementById("iterations").value, 10);
    const interval = parseInt(document.getElementById("interval").value, 10);


      // Validation
      if (!url) {
        alert("Please provide a valid URL.");
        return;
    }

   
    
    let headers = {};
    try {
        if (headersInput) {
            try {
                headers = headersInput ? JSON.parse(headersInput) : {};
            } catch (error) {
                alert("Headers must be in valid JSON format.");
                return;
            }
        } else {
            alert("Headers are required. Please enter valid JSON headers.");
            return;
        }
    } catch (error) {
        document.getElementById("responseText").textContent = "Invalid headers JSON.";
        return;
    }

    let body;
    if (["POST", "PUT"].includes(method)) {
        try {
            body = bodyInput ? JSON.parse(bodyInput) : null;
        } catch (error) {
            document.getElementById("responseText").textContent = "Invalid body JSON.";
            return;
        }
    }

    document.getElementById("responseText").textContent = "Executing API requests...";

    for (let i = 0; i < iterations; i++) {
        setTimeout(async () => {
            try {
                const response = await fetch(url, {
                    method,
                    headers,
                    body: body ? JSON.stringify(body) : undefined,
                });

                const responseData = await response.json();

                // Log the API hit into local storage
                logApiHit(url, { status: response.status, data: responseData }, i + 1);

                document.getElementById("responseText").textContent += `
                    \nIteration ${i + 1}:
                    Status: ${response.status}
                    Status Text: ${response.statusText}
                    Response: ${JSON.stringify(responseData, null, 2)}
                `;
            } catch (error) {
                document.getElementById("responseText").textContent += `\nIteration ${i + 1}: Error: ${error.message}`;
            }
        }, i * interval); // Delay each request by 'interval' milliseconds
    }
});

document.getElementById("beautifyHeaders").addEventListener("click", () => {
    const headersInput = document.getElementById("headers").value.trim();

    // Clear previous error message
    document.getElementById("headersError").textContent = "";

    if (!headersInput) {
        document.getElementById("headersError").textContent = "Headers field is empty.";
        return;
    }

    try {
        // Parse and stringify JSON with indentation
        const beautifiedHeaders = JSON.stringify(JSON.parse(headersInput), null, 4);
        document.getElementById("headers").value = beautifiedHeaders;
    } catch (error) {
        document.getElementById("headersError").textContent = "Headers must be in valid JSON format.";
    }
});

document.getElementById("beautifyBody").addEventListener("click", () => {
    const bodyInput = document.getElementById("body").value.trim();

    // Clear previous error message
    document.getElementById("bodyError").textContent = "";

    if (!bodyInput) {
        document.getElementById("bodyError").textContent = "Body field is empty.";
        return;
    }

    try {
        // Parse and stringify JSON with indentation
        const beautifiedBody = JSON.stringify(JSON.parse(bodyInput), null, 4);
        document.getElementById("body").value = beautifiedBody;
    } catch (error) {
        document.getElementById("bodyError").textContent = "Body must be in valid JSON format.";
    }
});

function copyToClipboard(inputId) {
    const responseText = document.getElementById(inputId);
    
    //copy the text inside the text field
    navigator.clipboard.writeText(responseText.textContent);

    alert("Copied to clipboard!");
}


  // Function to log API hit history
  function logApiHit(apiUrl, response, iteration) {


    const isoDate = new Date().toISOString(); 
    const formattedDate = formatIsoToCustomFormat(isoDate);
    const logEntry = {
        apiUrl: apiUrl,
        timestamp: formattedDate,
        iteration: iteration,
        responseStatus: response.status,
        responseBody: response.data || 'No response data',
    };

    let apiHistory = JSON.parse(localStorage.getItem('apiHistory')) || [];
    apiHistory.push(logEntry);
    localStorage.setItem('apiHistory', JSON.stringify(apiHistory));
}



function formatIsoToCustomFormat(isoString) {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');   // Get day (02)
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Get month (01 to 12)
    const year = date.getFullYear();  // Get full year (2024)

    const hours = String(date.getHours()).padStart(2, '0'); // Get hours (00 to 23)
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes (00 to 59)
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Get seconds (00 to 59)

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}


