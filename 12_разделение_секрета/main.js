function parseArgs() {
    return require('yargs')
        .usage('node $0 <cmd> [args]')
        .option('n', {
            describe: 'Всего секретов',
            type: 'number',
            demand: true
        })
        .option('k', {
            describe: 'Количество секретов, необходимых для восстановления главного',
            type: 'number',
            demand: true
        })
        .option('p', {
            describe: 'Размер поля',
            type: 'number',
            default: 101
        })
        .argv;
}

function randomInt(min, max) {
    // не включая max
    return Math.floor(Math.random() * (max - min)) + min;
}


class Polynomial {
    constructor(n, k, p = 101) {
        this.n = n;
        this.k = k;
        this.p = p;
        this.polynomial = [];
        this.shares = [];
    }

    createSecret() {
        for (let i = 0; i < this.k; i++) {
            this.polynomial.push(randomInt(0, this.p));
        }
        this.secret = this.polynomial[0];
        for (let i = 1; i < this.n + 1; i++) {
            this.shares.push([i, this.calculatePolynomal(i)]);
        }
    }

    calculatePolynomal(x) {
        let result = 0;
        for (let i = this.polynomial.length - 1; i >= 0; i--) {
            const c = this.polynomial[i];
            result = (result * x + c) % this.p;
        }

        return result;
    }

    interpolate_pi(numbers) {
        return numbers.reduce((acc, number) => acc * number, 1)
    }

    divideMod(number, divider, module) {
        return number * this.extendedEuclidean(divider, module);
    }

    extendedEuclidean(a, b) {
        let [ old_x, x ] = [0, 1];
        let [ old_y, y ] = [1, 0];
        while (b !== 0) {
            let q = Math.floor(a / b);
            [a, b] = [b, ((a % b) + b) % b];
            [ old_x, x ] = [x - q * old_x, old_x];
            [ old_y, y ] = [y - q * old_y, old_y];
        }

        return x;
    }

    calculateSecret(k) {
        function subtract(x, values) {
            return values.reduce((acc, value) => {
                acc.push(x - value);
                return acc;
            }, [])
        }

        if (this.n < 2) {
            throw new Error('Для вычисления секрета нужно не меньше 2ух точек на кривой');
        }
        let x = 0;
        const x_s = [];
        const y_s = [];
        for (let i = 0; i < k; i++) {
            x_s.push(this.shares[i][0]);
            y_s.push(this.shares[i][1]);
        }
        const numbers = [];
        const dividers = [];
        for (let i = 0; i < k; i++) {
            const others = x_s.slice();
            const current = others.splice(i, 1)[0];
            numbers.push(this.interpolate_pi(subtract(x, others)));
            dividers.push(this.interpolate_pi(subtract(current, others)));
        }

        let divider = this.interpolate_pi(dividers);
        let number = 0;
        for (let i = 0; i < k; i++) {
            number += this.divideMod(numbers[i] * divider * y_s[i] % this.p, dividers[i], this.p);
        }

        return ((this.divideMod(number, divider, this.p) % this.p) + this.p) % this.p;
    }
}

function printSep() {
    console.log();
}

function main() {
    const { n, k, p } = parseArgs();
    const polynomial = new Polynomial(n, k, p);
    polynomial.createSecret();
    printSep();
    console.log(`n = ${polynomial.n}, k = ${polynomial.k}`);
    console.log(`Секрет m = ${polynomial.secret}`);
    printSep();
    console.log(`Разделяемые секреты Ki:`);
    polynomial.shares.forEach(([index, share]) => {
        console.log(`K${index} = ${share}`);
    });
    printSep();
    console.log('Восстановление секрета m с помощью l Ki:');
    for (let i = 2; i < polynomial.n + 1; i++) {
        const calculatedSecret = polynomial.calculateSecret(i);
        console.log(`K${i}: ${calculatedSecret}`);
    }
}

main();
