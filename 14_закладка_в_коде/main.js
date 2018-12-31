const crypto = require('crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is 24 bytes (192 bits).
const key = crypto.scryptSync(password, 'salt', 24);
const iv = Buffer.alloc(16, 0);
const cipher = crypto.createCipheriv(algorithm, key, iv);


function parseArgs() {
    return require('yargs')
        .usage('node $0 <cmd> [args]')
        .option('marker', {
            alias: 'm',
            describe: 'Альтернативное шифрование',
            type: 'boolean'
        })
        .option('text', {
            alias: 't',
            describe: 'Текст, который нужно зашифровать',
            demand: true
        })
        .argv;
}

function printSep() {
    console.log();
}

function aesEncode(text) {
    let encrypted = '';
    cipher.on('readable', () => {
      const data = cipher.read();
      if (data)
        encrypted += data.toString('hex');
    });
    cipher.on('end', () => {
      console.log(encrypted);
    });
    cipher.write(text);
    cipher.end();
}

function shiftEncode(str, amount) {
	if (amount < 0)
		return shiftEncode(str, amount + 26);
	let output = '';
	for (let i = 0; i < str.length; i ++) {
		let c = str[i];
		if (isLetter(c)) {
			let code = str.charCodeAt(i);
			// Uppercase letters
			if ((code >= 65) && (code <= 90))
				c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
			// Lowercase letters
			else if ((code >= 97) && (code <= 122))
				c = String.fromCharCode(((code - 97 + amount) % 26) + 97);

		}
		output += c;
	}
	console.log(output);
}

function isLetter(symbol) {
    symbol = symbol.toLowerCase();

    return symbol >= 'a' && symbol <= 'z';
}

function main() {
    const argv = parseArgs();
    if (argv.marker) {
        printSep();
        console.log('Альтернативное шифрование, т.к передан флаг');
        console.log(`Алгоритм = ${algorithm}`);
        console.log(`Ключ в hex формате = ${key.toString('hex')}`);
        process.stdout.write('Зашифрованное сообщение в hex = ');
        aesEncode(argv.text);
    } else {
        const keyCaesar = 12;
        printSep();
        console.log('Стандартное шифрование');
        console.log('Алгоритм = шифр сдвига');
        console.log(`Ключ = ${keyCaesar}`);
        process.stdout.write('Зашифрованное сообщение = ');
        shiftEncode(argv.text, keyCaesar);
    }
}

main();
