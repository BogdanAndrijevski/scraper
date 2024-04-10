document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("scrape").addEventListener("click", async () => {
        try {
            const response = await fetch('/scrape');
            if (response.ok) {
                alert("Scraping initiated!");
                const data = await response.json(); // Extract JSON data from the response
                
                const total = document.getElementById("total");
                total.textContent = data.total; // Set the total number of links
                
                const linksContainer = document.getElementById("links-container");
                linksContainer.innerHTML = ""; // Clear existing links
    
                data.links.forEach((link, index) => {
                    const anchor = document.createElement("a");
                    anchor.href = link.href; // Set the href to the link's URL
                    anchor.textContent = `${index + 1}. ${link.textContent}`; // Adding index before the link name
                    anchor.target = "_blank"; // Open links in a new tab/window
                    const br1 = document.createElement("br");
                    // const br2 = document.createElement("br");
                    linksContainer.appendChild(anchor);
                    linksContainer.appendChild(br1);
                    // linksContainer.appendChild(document.createTextNode(link.href)); // Display the URL
                    // linksContainer.appendChild(br2);
                });
                

                
            } else {
                throw new Error("Failed to initiate scraping.");
            }
        } catch (error) {
            console.error("Error occurred:", error);
            alert("An error occurred. Please check the console for details.");
        }
    });
});
