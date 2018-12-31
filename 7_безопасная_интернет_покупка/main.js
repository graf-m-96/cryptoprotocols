function parseArgs() {
    return require('yargs')
        .usage('node $0 <cmd> [args]')
        .option('product', {
            alias: 'p',
            describe: 'Имя товара',
            type: 'string',
            demand: true
        })
        .option('salt', {
            alias: 's',
            describe: 'Соль',
            type: 'string'
        })
        .argv;
}

function productToSha256({ product, salt='' }) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    
    hash.on('readable', () => {
        const data = hash.read();
        if (data) {
            console.log(data.toString('hex'));
        }
    });
    
    hash.write(product);
    hash.end();
}

function main() {
    const argv = parseArgs();
    console.log();
    console.log(`Продукт: ${argv.product}`);
    console.log(`Соль:    ${argv.salt || 'Отсуствует'}`);
    process.stdout.write("Зашифровано в sha256 в hex формате: ");
    productToSha256(argv);
}

main();
