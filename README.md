[![Electron Logo](./logo-electron.jpg)](https://electron.atom.io/)

# mts-detalization-parser
Парсер PDF файлов детализации оператора сотовой связи МТС. На данный момент показывает только сумму по трафику. 

## Установка
Установщики для Windows, MacOS и Linux - [тут](https://github.com/artemv/mts-detalization-parser/releases/). 
 
## Лог файл

Лог файл пишется сюда:
* Linux: ~/.config/MtsDetalizationParser/main.log
* OS X: ~/Library/Logs/MtsDetalizationParser/main.log
* Windows: %USERPROFILE%\AppData\Roaming\MtsDetalizationParser\main.log
 
## Development

Install Node 13.4.0+ and Yarn 1.10.1+.

Clone this repository locally :

``` bash
git clone git@github.com:artemv/mts-detalization-parser.git
```

Install dependencies with yarn :

``` bash
yarn --frozen-lockfile
```

## Dev build

- **in a terminal window** -> `yarn start`  

Now you can use your Electron app in a local development environment.

## Other Commands

|Command|Description|
|--|--|
|`yarn start`| Start app in dev mode |
|`yarn react-build && yarn electron .`| Build the app and start it via electron
|`yarn react-build && yarn dist:linux`| Builds your application and creates an app consumable on linux system |
|`yarn react-build && yarn dist:windows`| On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems |
|`yarn react-build && yarn dist:mac`|  On a MAC OS, builds your application and generate a `.dmg` package file with the application

## License

MIT © [Artem Vasiliev](https://github.com/artemv)
