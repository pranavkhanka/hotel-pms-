const fs = require('fs');
const path = require('path');

const websitePath = path.join(__dirname, '../../website /index.html');
console.log("Path:", websitePath);

try {
    if (!fs.existsSync(websitePath)) {
        console.error("File not found!");
        process.exit(1);
    }

    const html = fs.readFileSync(websitePath, 'utf8');
    const elementId = "price-luxury";
    const regex = new RegExp(`(<div[^>]*id="${elementId}"[^>]*>)(.*?)(</div>)`, 's');

    if (regex.test(html)) {
        console.log("Regex matched!");
        const match = html.match(regex);
        console.log("Matching tag:", match[1]);
        console.log("Matching content:", match[2]);
        console.log("Matching close:", match[3]);
    } else {
        console.log("Regex failed to match.");
        const idx = html.indexOf(elementId);
        if (idx !== -1) {
            console.log("Found ID at index " + idx);
            console.log("Snippet:", html.substring(idx - 50, idx + 50));
        } else {
            console.log("ID not found in file string at all.");
        }
    }
} catch (e) {
    console.error(e);
}
