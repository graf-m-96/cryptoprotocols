function parseArgs() {
    return require('yargs')
        .usage('node $0 <cmd> [args]')
        .option('p', {
            describe: 'n = p * q, p, q - простые',
            type: 'string',
            demand: true
        })
        .option('q', {
            describe: 'n = p * q, p, q - простые',
            type: 'number',
            demand: true
        })
        .option('s', {
            describe: 'Взаимно-простое с n',
            type: 'number',
            demand: true
        })
        .option('k', {
            describe: 'Количество раундов',
            type: 'number',
            demand: true
        })
        .argv;
}

function getRandomInt(min, max) {
    // не включая max
    return Math.floor(Math.random() * (max - min)) + min;
}

function printSep() {
    console.log();
}

function main() {
    const { p, q, s, k } = parseArgs();
    const n = p * q;
    let v = s**2 % n;
    printSep();
    console.log(`n = ${n}`);
    console.log(`v = ${v}`);
    printSep();
    console.log('Раунды...');
    printSep();
    for (let i = 0; i < k; i++) {
        console.log(`Раунд${i + 1}`);
        const r = getRandomInt(1, n);
        console.log('r', r);
        const a = r**2 % n;
        console.log('a', a);
        const e = getRandomInt(0, 2);
        console.log('e', e);
        const y = (r * s ** e) % n;
        console.log('y', y);
        console.log('Проверка y^2 === a * v^e mod n');
        if (y**2 % n === a * v** e % n) {
            console.log(`Раунд ${i + 1} завершён успешно`);
            printSep()
        } else {
            console.log('А не владеет секретом s');
            return;
        }
    }
}

main();
