const fs = require('fs');
const path = require('path');

const buttonsPath = path.join(__dirname, 'src/data/buttons.json');
const htmlPath = path.join(__dirname, 'reference/index.html');

const buttons = JSON.parse(fs.readFileSync(buttonsPath, 'utf8'));
let html = fs.readFileSync(htmlPath, 'utf8');

const classify = (height) => {
    if (height < 24) return 'mini';
    if (height < 32) return 'sm';
    if (height <= 40) return 'reg';
    return 'lg';
};

const getDisplaySize = (s) => {
    if (s === 'sm') return 'Small';
    if (s === 'reg') return 'Regular';
    if (s === 'lg') return 'Large';
    if (s === 'mini') return 'Mini';
    return s;
};

// Original variant mapping from the HTML seems to be:
// pink/blue/purple -> primary
// neutrals/none -> outline/ghost
// Let's try to infer variant from the existing text if possible, or just use a simple map.
const getVariant = (color, currentLabel) => {
    if (currentLabel.includes('primary')) return 'primary';
    if (currentLabel.includes('outline')) return 'outline';
    if (currentLabel.includes('ghost')) return 'ghost';

    // Fallbacks
    if (color && (color.includes('pink') || color.includes('blue') || color.includes('purple'))) return 'primary';
    return 'outline';
};

const stats = {};

// 1. Process all buttons to update labels and collect stats
buttons.forEach((btn, index) => {
    const size = classify(btn.height);
    const displaySize = getDisplaySize(size);

    // Find the block for this button
    // The structure is roughly:
    // Button index+1 ... Color: ... New (Shadcn): variant - size
    // We need to find the specific "New (Shadcn):" for THIS button.

    // Strategy: Search for "Button [ID] " and then the next "New (Shadcn):"
    const buttonIdPattern = new RegExp(`Button ${index + 1} <span`, 'g');
    const labelPattern = /New \(Shadcn\):<\/span> (.*?)<\/div>/;

    // This is hard with just string replace if we want to be perfect.
    // Let's use a more granular approach.
});

// Actually, the HTML is very consistent. Let's use regex to update all button blocks.
// Pattern matches the whole metadata block for a button.
let buttonCount = 0;
html = html.replace(/<div><span class="font-bold">New \(Shadcn\):<\/span> (.*?) - (.*?)<\/div>/g, (match, variant, size) => {
    const btn = buttons[buttonCount];
    if (!btn) return match;

    const newSize = classify(btn.height);
    const displaySize = getDisplaySize(newSize);

    // Update stats
    const key = `${variant} - ${displaySize}`;
    stats[key] = (stats[key] || 0) + 1;

    buttonCount++;
    return `<div><span class="font-bold">New (Shadcn):</span> ${variant} - ${displaySize}</div>`;
});

// 2. Update the labels in the comparison cols
// <span class="comparison-label">New (variant - currentSize)</span>
buttonCount = 0;
html = html.replace(/<span class="comparison-label">New \((.*?) - (.*?)\)<\/span>/g, (match, variant, size) => {
    const btn = buttons[buttonCount];
    if (!btn) return match;
    const newSize = classify(btn.height);
    const displaySize = getDisplaySize(newSize);
    buttonCount++;
    return `<span class="comparison-label">New (${variant} - ${displaySize})</span>`;
});

// 3. Update the button classes
// <button class="shadcn-btn shadcn-btn-(.*?) shadcn-btn-(.*?)">
buttonCount = 0;
html = html.replace(/<button class="shadcn-btn shadcn-btn-(.*?) shadcn-btn-(.*?)">/g, (match, variant, size) => {
    const btn = buttons[buttonCount];
    if (!btn) return match;
    const newSize = classify(btn.height);
    buttonCount++;
    // Map reg to standard (md) or just reg? Let's use reg if we have CSS for it.
    // The existing CSS probably has sm and lg.
    return `<button class="shadcn-btn shadcn-btn-${variant} shadcn-btn-${newSize}">`;
});

// 4. Update Stats Dashboard counters
// <div class="text-3xl font-bold text-green-600">5</div> (New Variants count)
const variantCount = Object.keys(stats).length;
html = html.replace(/(<div class="text-sm text-gray-500 uppercase tracking-wider font-semibold">New Variants<\/div>\s*<div class="text-3xl font-bold text-green-600">)(\d+)(<\/div>)/, `$1${variantCount}$3`);

// 5. Update Distribution Table
let tableRows = '';
Object.entries(stats).sort((a, b) => b[1] - a[1]).forEach(([variant, count]) => {
    tableRows += `
            <tr class="border-b border-gray-100">
                <td class="p-2 capitalize">${variant}</td>
                <td class="p-2 font-mono">${count}</td>
            </tr>
           `;
});

html = html.replace(/<tbody>[\s\S]*?<\/tbody>/, `<tbody>${tableRows}</tbody>`);

// 6. Add CSS for reg and mini if not present?
// Sm is usually 32px, Lg 40px?
// Let's add styles to the header if needed.
const extraStyles = `
<style>
  .shadcn-btn-reg { height: 36px; padding: 0 16px; font-size: 14px; }
  .shadcn-btn-mini { height: 20px; padding: 0 8px; font-size: 12px; }
  .shadcn-btn-sm { height: 28px; padding: 0 12px; font-size: 14px; }
  .shadcn-btn-lg { height: 44px; padding: 0 24px; font-size: 16px; }
</style>
`;
html = html.replace('</head>', `${extraStyles}</head>`);

fs.writeFileSync(htmlPath, html);
console.log('Successfully updated reference/index.html with new sizing logic.');
console.log('Distribution:', stats);
