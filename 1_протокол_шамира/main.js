function parseArgs() {
    return require('yargs')
        .usage('node $0 <cmd> [args]')
        .option('text', {
            alias: 't',
            describe: 'Текст, который нужно зашифровать',
            type: 'string',
            demand: true
        })
        .option('bob', {
            alias: 'b',
            describe: 'Ключ Боба в шифре сдвига',
            type: 'number',
            demand: true
        })
        .option('alice', {
            alias: 'a',
            describe: 'Ключ Алисы в шифре сдвига',
            type: 'number',
            demand: true
        })
        .argv;
}

function shiftEncode(amount, str) {
	if (amount < 0)
		return shiftEncode(amount + 26, str);
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
	return output;
}

function isLetter(symbol) {
    symbol = symbol.toLowerCase();

    return symbol >= 'a' && symbol <= 'z';
}

function main() {
    let { text, alice, bob } = parseArgs();
    if (isNaN(alice) || isNaN(bob)) {
        throw new Error('Ключ шифра сдвига должен быть целым числом');
    }
    text = shiftEncode(alice, text);
    console.log(`E(a, M)                    = ${text}`);
    text = shiftEncode(bob, text);
    console.log(`E(b, E(a, M))              = ${text}`);
    text = shiftEncode(-alice, text);
    console.log(`D(a, E(b, E(a, M)))        = ${text}`);
    text = shiftEncode(-bob, text);
    console.log(`D(b, D(a, E(b, E(a, M))))  = ${text}`);
}

main();
