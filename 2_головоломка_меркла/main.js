function parseArgs() {
    return require('yargs')
        .usage('node $0 <cmd> [args]')
        .option('count', {
            alias: 'c',
            describe: 'Количество отправляемых сообщений',
            type: 'number',
            demand: true
        })
        .argv;
}

function generateMessages(count) {
    let messages = [];
    for(let i = 0; i < count; i++) {
        messages.push(shiftEncode(i, `secret${i},<key>`));
    }
    return messages;
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

function hack(c) {
    for (let i = 0; i < 26; i++) {
        let m = shiftEncode(i, c);
        if (m.includes('secret')) {
            return m;
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

function main() {
    const { count } = parseArgs();
    const messages = generateMessages(count);
    const randomIndex = getRandomInt(0, count);
    const selectedMessage = messages[randomIndex];
    console.log(`Алиса выбрала головоломку с номером ${randomIndex}`);
    console.time('bob');
    hack(selectedMessage);
    console.timeEnd('bob');
    console.time('eva');
    for (let i = 0 ; i < messages.length; i++) {
        hack(messages[i]);
        if (i === randomIndex) {
            break;
        }
    }
    console.timeEnd('eva');
}

main();
