const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');

const musicPath = process.cwd();

function readdirRecursiveSync(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    if (!list.length) {
        return results;
    }

    list.forEach(file => {
        const filePath = path.resolve(dir, file);

        try {
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(readdirRecursiveSync(filePath));
            } else {
                results.push(file);
            }
        } catch (error) {}
    });

    return results;
}

exports.start = function start() {
    console.log(`Ищем файлы в ${musicPath} ...`);
    const musicFiles = readdirRecursiveSync(musicPath);
    console.log(`Найдено ${musicFiles.length} шт.`);

    const targetDir = readlineSync.question('В какую директорию сохраняем файлы? [./shuffle]: ') || './shuffle';
    const normalizedTargetDir = path.isAbsolute(targetDir) ? targetDir : path.join(musicPath, targetDir);
    console.log(`Для сохранения выбрана директория "${normalizedTargetDir}"`);

    const needCount = Number(readlineSync.question('Сколько файлов отобрать? [100]: ')) || 100;

    const shuffled = musicFiles.sort(() => 0.5 - Math.random()).slice(0, needCount);

    if (!fs.existsSync(normalizedTargetDir)) {
        fs.mkdirSync(normalizedTargetDir);
    }

    console.log('Понеслось копирование...');
    shuffled.forEach((name, index) => {
        const fullName = path.resolve(musicPath, name);
        const targetFullName = path.resolve(normalizedTargetDir, `${index} ${name}`);
        fs.copyFileSync(fullName, targetFullName);
    });
    console.log('Готово!');
};