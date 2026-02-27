const fs = require('fs');
const filepath = 'src/app/prenatal/page.tsx';
let content = fs.readFileSync(filepath, 'utf-8');

const marker = '            {/* Modal de Acompanhamento Clínico */}';
const idx = content.indexOf(marker);

if (idx !== -1) {
    const endContent = '        </div>\n    );\n}\n';
    content = content.substring(0, idx) + endContent;
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log('Successfully trimmed old modal code from page.tsx');
} else {
    console.log('Marker not found');
}
