const stub = () => {};
stub.name = 'Функция-заглушка';


class SeaBattle {
    constructor(map, key, encode) {
        this.selfMap = map;
        this.selfKey = key;
        this.encode = encode;
        this.gameIsOver = false;
    }

    encodeMap() {
        console.log('Шифруем собственную карту');
        console.log(`Шифр = ${this.encode.name}`);
        console.log(`Ключ = ${this.selfKey}`);
        printSep();

        return this.encode(this.selfMap, this.selfKey);
    }

    exchangeEncryptedCards() {
        console.log('Процесс обмена зашифрованными картами...');
        this.sendEncodedSelfMap();
        this.getEncodedOtherMap();
        printSep();
    }

    sendEncodedSelfMap() {
        this.encodeMap();
        console.log('Отправляем свою зашифрованную карту');
    }

    getEncodedOtherMap() {
        console.log('Получаем зашифрованную карту соперника');
    }

    checkHonesty() {
        console.log('Проверка на честность...');
        this.sendSelfKey();
        this.getRivalKey();
    }

    sendSelfKey() {
        console.log('Отправляем свой ключ')
    }

    getRivalKey() {
        console.log('Принимаем ключ соперника');
        console.log('Расшифровываем карту соперника');
    }

    startGame() {
        console.log('Играем по правилам морского боя');
        printSep();
    }
}

function printSep() {
    console.log();
}

function main() {
    const seaBattle = new SeaBattle('some my map', 'some my key', stub);
    printSep();
    seaBattle.exchangeEncryptedCards();
    seaBattle.startGame();
    seaBattle.checkHonesty();
}


main();
