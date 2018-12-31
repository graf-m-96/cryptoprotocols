function parseArgs() {
    return require('yargs')
        .usage('node $0 <cmd> [args]')
        .option('analyst', {
            alias: 'a',
            describe: 'Индекс криптоаналитика, который хочет заплатить',
            choices: [1, 2, 3]
        })
        .argv;
}

function getRandomInt(min, max) {
    // не включая max
    return Math.floor(Math.random() * (max - min)) + min;
}

function printChoices(choices) {
    console.log('Выпавшие монетки:');
    for (let i = 0; i < choices.length; i++) {
        console.log(`${i + 1})${choices[i]}`);
    }
}

function printCompare(isEvenSums) {
    isEvenSums.forEach((isSame, i) => {
        console.log(`${i + 1} аналитик: монеты ${isSame ? '' : 'не '}совпали`);
    });
}

function printSep() {
    console.log();
}

function main() {
    const argv = parseArgs();
    const choices = [];
    for (let i = 0; i< 3; i++) {
        choices.push(getRandomInt(0, 2));
    }
    printSep();
    printChoices(choices);
    printSep();
    const isEvenSums = [
        choices[2] === choices[0],
        choices[0] === choices[1],
        choices[1] === choices[2]
    ];
    if ('analyst' in argv) {
        isEvenSums[argv.analyst - 1] = !isEvenSums[argv.analyst - 1];
    }
    printCompare(isEvenSums);
    printSep();
    let result = isEvenSums.reduce((acc, el) => el ? acc + 1 : acc, 0);
    console.log('Вывод: платит ' + (result % 2 === 0 ? 'какой-то криптоаналитик' : 'АНБ'));
}

main();
