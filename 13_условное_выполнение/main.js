const os = require('os-utils');


function parseArgs() {
    return require('yargs')
        .usage('node $0 <cmd> [args]')
        .option('timeout', {
            alias: 't',
            describe: 'Проверять ресурсы системы раз в t секунд',
            type: 'number',
            default: 5
        })
        .option('cpu', {
            alias: 'c',
            describe: 'Нижняя граница загруженности процессора в %',
            type: 'number',
            default: 5
        })
        .option('mem', {
            alias: 'm',
            describe: 'Нижняя граница свободной памяти в байтах',
            type: 'number',
            default: 256
        })
        .argv;
}

function getMode(cpu, bottomBorderFreeCpu, mem, bottomBorderFreeMem) {
    return cpu < bottomBorderFreeCpu || mem < bottomBorderFreeMem
        ? 'нагруженном'
        : 'стандартном'
}

async function checkSystem(bottomBorderFreeCpu, bottomBorderFreeMem, timeoutInS) {
    let cpu = await new Promise((resolve, reject) => {
        os.cpuFree(resolve);
    });
    cpu = parseInt(cpu * 100, 10);
    let mem = os.freemem();
    mem = parseInt(mem, 10);
    const mode = getMode();
    console.log(`Состояние свободных ресурсов в ${new Date().toLocaleTimeString()}`);
    console.log(`cpu:           ${cpu}%`);
    console.log(`cpu_bottom:    ${bottomBorderFreeCpu}%`);
    console.log(`mem:           ${mem} in bytes`);
    console.log(`mem_bottom:    ${bottomBorderFreeMem} in bytes`);
    console.log(`Программа работает в ${mode} режиме`)
    console.log();

    setTimeout(() => checkSystem(bottomBorderFreeCpu, bottomBorderFreeMem, timeoutInS), timeoutInS * 10**3);
}

function main() {
    const argv = parseArgs();
    const timeoutInS = argv.timeout;
    const bottomBorderFreeCpu = argv.cpu;
    const bottomBorderFreeMem = argv.mem;
    checkSystem(bottomBorderFreeCpu, bottomBorderFreeMem, timeoutInS)
}

main();
