# Разделение секрета


## Принцип работы

Создаётся секрет, который можно прочитать, имея не менее k ключей из n существующих.<br/>
[Схема разделения секрета Шамира](https://ru.wikipedia.org/wiki/%D0%A1%D1%85%D0%B5%D0%BC%D0%B0_%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F_%D1%81%D0%B5%D0%BA%D1%80%D0%B5%D1%82%D0%B0_%D0%A8%D0%B0%D0%BC%D0%B8%D1%80%D0%B0)


## Запуск
```

Стандартный класс Number в node js может безопасно работать с числами < 2**52
Для корректной работы передавайте не слишком большие числа

node main.js
```
