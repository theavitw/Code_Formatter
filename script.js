const codeArea = document.getElementById('codeArea');
const copyButton = document.getElementById('copyButton');
const lockButton = document.getElementById('lockButton');
const testButton = document.getElementById('testButton');
const saveAsButton = document.getElementById('saveAsButton');
const languageSelector = document.getElementById('languageSelector');
let isLocked = false;
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
const compilationResult = document.getElementById('compilationResult');


const editor = CodeMirror.fromTextArea(codeArea, {
    mode: 'javascript',
    theme: 'darcula',
    lineNumbers: true,
    autoCloseBrackets: true,
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
});

const languageOptions = [
    { name: 'JavaScript', mode: 'javascript' },
    { name: 'Python', mode: 'python' },
    { name: 'Java', mode: 'Java' },
];

languageOptions.forEach(option => {
    const langOption = document.createElement('option');
    langOption.value = option.mode;
    langOption.text = option.name;
    languageSelector.appendChild(langOption);
});

copyButton.addEventListener('click', () => {
    const code = editor.getValue();
    navigator.clipboard.writeText(code)
        .then(() => alert('Code copied to clipboard'))
        .catch(err => console.error('Copy failed', err));
});

lockButton.addEventListener('click', () => {
    isLocked = !isLocked;
    editor.setOption('readOnly', isLocked);
    lockButton.textContent = isLocked ? 'Unlock' : 'Lock';
});

testButton.addEventListener('click', () => {
    const code = editor.getValue();

    try {
        const result = eval(code);
        alert('Result: ' + result);
    } catch (error) {
        alert('Error: ' + error);
    }
});

saveAsButton.addEventListener('click', () => {
    const code = editor.getValue();
    const fileName = prompt('Enter the file name with extension (e.g., script.js):');

    if (fileName) {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }
});



languageSelector.addEventListener('change', () => {
    const selectedLanguage = languageSelector.value;
    editor.setOption('mode', selectedLanguage);
});


testButton.addEventListener('click', () => {
    const code = editor.getValue();
    const selectedLanguage = languageSelector.value;

    const languageCodes = {
        'JavaScript': 'nodejs',
        'Python': 'python3',
        'Java': 'javac'
    };

    const language = languageCodes[selectedLanguage];

    function executeCode(code, language) {
        const repl = new ReplitClient('api.repl.it', 80, language);
        repl.evaluateOnce(code, {
            stdout: response => response.json()
        }).then(function success(result) {

            compilationResult.innerText = result;
            popup.style.display = 'block';
        }).catch(function error(error) {

            compilationResult.innerText = error;
            popup.style.display = 'block';
        });

    }
    executeCode(code, language);
});




window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});
const defaultCode = {
    'javascript': `function example() {
    console.log('Hello, World!');
}
example()
`,
    'python': `def example():
    print('Hello, World!')
example()`,
    'Java': `public class Example {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
    }
}

`,
};

function setDefaultCode(language) {
    editor.setValue(defaultCode[language]);
}

languageSelector.addEventListener('change', () => {
    const selectedLanguage = languageSelector.value;
    editor.setOption('mode', selectedLanguage);
    setDefaultCode(selectedLanguage);
});

const initialLanguage = languageSelector.value;
setDefaultCode(initialLanguage);
editor.setOption('mode', initialLanguage);

document.addEventListener('DOMContentLoaded', 
    setTimeout(async function () {
        const loader = document.getElementById('loader');
    loader.style.display = 'none';
    },2000)
);

