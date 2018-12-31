const gcd = require('gcd');


function getRandomInt(min, max) {
    // не включая max
    return Math.floor(Math.random() * (max - min)) + min;
}

function getPrimes(start, stop) {
    if (start >= stop) {
        return [];
    }
    const primes = [2];
    for (let i = 3; i < stop + 1; i += 2) {
        let isPrime = true;
        for (let j = 0; j < primes.length; j++) {
            if (i % primes[j] === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(i);
        }
        while (primes.length && primes[0] < start) {
            primes.shift();
        }
    }

    return primes;
}

function areRelativelyPrime(a, b) {
    const min = Math.min(a, b);
    for (let i = 2; i < min + 1; i++) {
        if (a % i === b % i && a % i === 0) {

            return false;
        }
    }

    return true;
}

function bustValues(n_min, n_max, start, stop) {
    let primes = getPrimes(start, stop);
    let p;
    let q;
    while (primes.length) {
        let index = getRandomInt(0, primes.length);
        p = primes[index];
        primes = primes.filter(el => el !== p);
        const qCanditates = [];
        for (let i = 0; i < primes.length; i++) {
            if (p * primes[i] >= n_min && p * primes[i] <= n_max) {
                qCanditates.push(primes[i]);
            }
        }
        if (qCanditates.length) {
            index = getRandomInt(0, qCanditates.length);
            q = primes[index];
        }
    }
    stop = (p - 1) * (q - 1);
    let e;
    for (let i = 3; i < stop; i += 2) {
        if (areRelativelyPrime(i, stop)) {
            e = i;
            break;
        }
    }
    if (e === undefined) {
        return false;
    }
    let d;
    for (let i = 3; i < stop; i += 2) {
        if (i * e % stop === 1) {
            d = i;
            break;
        }
    }
    if (d === undefined) {
        return false;
    }

    return [ p, q, e, d ];
}

function makeKeyPair(length) {
    if (length < 4) {
        throw new Error('Длина ключа должна быть >= 4');
    }
    let n_min = 1 << (length - 1);
    let n_max = (1 << length) - 1;
    let start = 1 << (Math.floor(length / 2) - 1);
    let stop = 1 << (Math.floor(length / 2) + 1);

    let p, q, e, d;
    while (true) {
        let answer = bustValues(n_min, n_max, start, stop);
        if (answer) {
            [ p, q, e, d ] = answer;
            break;
        }
    }

    return [ new PublicKey(p * q, e), new PrivateKey(p * q, d) ];
}

function inverse(value, modulus) {
    let [ x, last_x ] = [0, 1];
    let [ a, b ] = [ modulus, value ];
    let q;
    while (b !== 0) {
        [ a, q, b ] = [ b, Math.floor(a / b), a % b ];
        [ x, last_x ] = [ last_x - q * x, x ];
    }
    let result = Math.floor((1 - last_x * modulus) / value);
    if (result < 0) {
        result += modulus;
    }

    return result;
}

class PublicKey {
    constructor(n, e) {
        this.n = n;
        this.e = e;
    }

    encrypt(x) {
        return x ** this.e % this.n;
    }

    blind(m) {
        let factor = parseInt(Math.random() * (this.n - 1));
        while (gcd(factor, this.n) !== 1) {
            factor = parseInt(Math.random() * (this.n - 1));
        }

        return [ (m * factor ** this.e) % this.n, factor ];
    }

    unblind(b, factor) {
        return (b * inverse(factor ** this.e, this.n)) % this.n;
    }
}

class PrivateKey {
    constructor(n, d) {
        this.n = n;
        this.d = d;
    }

    sign(x) {
        return this.decrypt(x);
    }

    decrypt(x) {
        return x ** this.d % this.n;
    }
}

function parseArgs() {
    return require('yargs')
        .usage('node $0 <cmd> [args]')
        .option('all', {
            alias: 'a',
            describe: 'Всего документов',
            type: 'number',
            default: 5
        })
        .option('need', {
            alias: 'n',
            describe: 'Количество документов, необходимых для слепой подписи',
            type: 'number',
            default: 4
        })
        .argv;
}

function printSep() {
    console.log();
}

function main() {
    const { all, need } = parseArgs();
    const [ bankPub, bankSec ] = makeKeyPair(8);
    const [ bobPub, bobSec ] = makeKeyPair(8);
    printSep();
    console.log('Ключи...');
    printSep();
    console.log('Банка:');
    console.log('Публичный');
    console.log(bankPub);
    console.log('Приватный');
    console.log(bankSec);
    printSep();
    console.log('Боба');
    console.log('Публичный');
    console.log(bobPub);
    console.log('Приватный');
    console.log(bobSec);
    printSep();
    console.log('Боб готовит n документов');
    const documents = [];
    for (let i = 0; i < all; i++) {
        documents.push(bobPub.blind(need));
    }
    for (let i = 0; i < all -1; i++) {
        const [ message, factor ] = documents[i];
        if (bobPub.unblind(message, factor) === need) {
            console.log(`${i + 1} Документ прошёл проверку`);
        } else {
            console.log(`${i + 1} Документ сфабрикован`);
            process.exit(0);
        }
    }
    console.log('Банк подписывает в слепую');
    console.log(`Подпись - ${bankSec.sign(documents[documents.length - 1][0])}`)
}

main();
