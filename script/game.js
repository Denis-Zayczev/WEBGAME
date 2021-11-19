game.newLoopFromConstructor('game', function () {
    var level = 1;


    var map = LEVELS[level - 1];


    // стартовая позиция (переменная)
    var plStartPosition = false;

    var walls = []; // массив стен (блоки, по которым возможно передвигаться)
    var cells = []; // монетки (колечки, которые можно собирать)
    var waters = []; // тут будет вода (блоки полупрозрачных объектов синего цвета), меняющая поведение объекта
    var enemies = [];//враги
    var doors = [];//выход

    var player_idle = tiles.newImage("img/player1.png").getAnimation(0, 0, 355, 421, 2);

    var player_jump = tiles.newImage("img/player_jump.png").getAnimation(0, 0, 355, 421, 1);

    var player_death = tiles.newImage("img/player_death2.png").getAnimation(0, 0, 350, 421, 7);

    var player = game.newAnimationObject({
        animation: player_idle,
        w: 50,
        h: 45,
        angle: 0,
        visible: true,
        delay: 10,
        position: point(0, 0)
    });

    var restartGame = function () {
        player.setPositionC(plStartPosition);
        camera.setPositionC(plStartPosition);
    };
    var background = ['background1', 'background2', 'background3', 'background4'];//задние фоны
    var block=['img/snow.png','img/lava.png', 'img/forest.png', 'img/snow.png'];

    var nextLevel = function () {

        if (level >= LEVELS.length)
            level = 0;

        level++;
        map = LEVELS[level - 1];
        changeBack(background[level - 1]); //вызываем функцию по смене фона(она в init.js)
    };

    var ripPlayer = function () {
        if (hp == 1) {
            alert("Game Over!");
            level = 0;
            nextLevel();
            game.setLoop('menu');
        }
        hp--; //вычитаем жизни
        rePlay();
        restartGame();
    }
    var rePlay = function () {
        flag = true;
        player.setDelay(4);
        player.setAnimation(player_death);

    };

    this.entry = function () {
        flag = false;
        a = 0;
        score = 0;
        hp = 5;
        OOP.clearArr(walls);
        OOP.clearArr(cells);
        OOP.clearArr(waters);
        OOP.clearArr(enemies);
        OOP.clearArr(doors);

        // OOP.forArr - проходит быстро по массиву
        OOP.forArr(map.source, function (string, Y) { // идем по массиву строк (Y - порядковый номер строки сверху вниз)
            OOP.forArr(string, function (symbol, X) { // идем уже по самой строке (X - порядковый номер символа в строке)
                if (!symbol || symbol == ' ') return; // если пробел или ошибка считывания - выходим из итерации

                // теперь проверяем символы
                if (symbol == 'P') { // позиционируем персонажа
                    // Займемся игроком
                    plStartPosition = point(map.width * X, map.height * Y); // если формула не ясна, напишите в комменты
                } else if (symbol == 'W') { // вода
                    waters.push(game.newRectObject({ // создаем объект
                        w: map.width, h: map.height, // ширина высота
                        x: map.width * X, y: map.height * Y, // позиция
                        fillColor: '#084379', // цвет
                        alpha: 0.5 // прозрачность
                    }));
                } else if (symbol == '|') { //монетки
                    cells.push(game.newAnimationObject({
                        animation: tiles.newImage("img/coins.png").getAnimation(0, 0, 267, 300, 6),
                        w: 50,
                        h: 60,
                        delay: 6,
                        visible: true,
                        w: map.width / 2, h: map.height,
                        x: map.width * X + 6, y: map.height * Y,
                        userData: {
                            active: true // флаг активности, пока не коснулся игрок - оно активно
                        }

                    }));
                }

                else if (symbol == '0') { // блок стены
                    walls.push(game.newImageObject({
                        w: map.width, h: map.height,
                        x: map.width * X, y: map.height * Y,
                        file: block[level-1]
                    }));
                } else if (symbol == '1') { // блок стены срезанный
                    walls.push(game.newImageObject({
                        w: map.width, h: map.height,
                        x: map.width * X, y: map.height * Y,
                        file: 'img/snow_start.png'
                    }));
                } else if (symbol == '2') { // блок стены вертикальный
                    walls.push(game.newImageObject({
                        w: map.width, h: map.height,
                        x: map.width * X, y: map.height * Y,
                        file: 'img/snow_vertical.png'
                    }));
                }
                else if (symbol == '3') { // блок стены срезанный сконца
                    walls.push(game.newImageObject({
                        w: map.width, h: map.height,
                        x: map.width * X, y: map.height * Y,
                        file: 'img/snow_end.png'
                    }));
                } else if (symbol == 's') { //сосулька вверх
                    enemies.push(game.newImageObject({
                        w: map.width / 2,
                        h: map.height / 2.01,
                        x: map.width * X + 10,
                        y: map.height * Y + map.height / 2.01,
                        file: 'img/sosulka_up.png'
                    }));
                } else if (symbol == '*') { //враг
                    enemies.push(game.newAnimationObject({
                        animation: tiles.newImage("img/enemy.png").getAnimation(0, 0, 413.5, 421, 2),
                        w: 50,
                        h: 60,
                        delay: 10,
                        w: map.width, h: map.height,
                        x: map.width * X, y: map.height * Y,
                        userData: {
                            mp: point(map.width * X, map.height * Y)
                        }
                    }));
                } else if (symbol == 'x') {
                    doors.push(game.newImageObject({
                        w: map.width, h: map.height * 2,
                        x: map.width * X, y: map.height * Y - map.height,
                        file: 'img/doors.png',
                        userData: {
                            bonus: false
                        }
                    }));
                }
            });
        });


        // При создании игрока мы смотрим
        // была ли задана позиция, и, если была
        // используем её, иначе устанавливаем в начало координат
        player.gr = 0.5; // скорость падения
        player.speed = point(0, 0); // скорости по осям


        if (plStartPosition) {
            player.setPositionC(plStartPosition);
        }


    };

    // а вот и тот самый обработчик на событие обновления
    this.update = function () {

        game.clear(); // очищаем прошлый кадр
        player.draw();


        player.speed.y += player.gr; // используем гравитацию
        if (flag == true) {
            a++;
        }

        if (player.speed.y == 0.5 || a == 40) {
            flag = false;
            a = 0;
            player.setDelay(10);
            player.setAnimation(player_idle);
        }


        // управление с клавиатуры, думаю, ничего сложного

        if (key.isDown('RIGHT')) {
            player.setFlip(0, 0);
            player.speed.x = 3;
        }
        else if (key.isDown('LEFT')) {
            player.setFlip(1, 0);
            player.speed.x = -3;
        }
        else
            player.speed.x = 0;
        if (key.isDown('G')) {
            nextLevel();
            game.setLoop('game');
        }
        if (key.isDown('ESC'))
            game.setLoop('menu');


        // теперь вызываем функцию отрисовки массива стен
        OOP.drawArr(walls, function (wall) {
            if (wall.isInCameraStatic()) { // если объект в пределах камеры (его видно)
                // wall.drawStaticBox();
                if (wall.isStaticIntersect(player)) { // если объект столкнулся с игроком

                    // теперь нам надо определить условия столкновения (подробное объяснение в видео ниже)

                    // проверяем ось Y

                    if (player.x + player.w > wall.x + wall.w / 4 && player.x < wall.x + wall.w - wall.w / 4) {
                        if (player.speed.y > 0 && player.y + player.h < wall.y + wall.h / 2) { // если объект НАД стеной
                            if (key.isDown('UP')) // если при соприкосновении с полом нажать кнопку "вверх"
                            {

                                player.setAnimation(player_jump);
                                player.speed.y = -11; // установим скорость движения вверх


                            }

                            else { // иначе просто "гасим" скорость падения прыжками

                                player.y = wall.y - player.h;
                                player.speed.y *= -0.3;
                                if (player.speed.y > -0.3) {
                                    player.speed.y = 0; // и в итоге просто обнуляем

                                }
                            }
                        } else if (player.speed.y < 0 && player.y > wall.y + wall.h / 2) { // если пбъект ПОД стеной
                            player.setAnimation(player_idle);
                            player.y = wall.y + wall.h; // позиционируем (избегаем проваливания)
                            player.speed.y *= -0.1; // начинаем падать


                        }
                    }

                    // и тут то же самое, только уже для оси X

                    if (player.y + player.h > wall.y + wall.h / 4 && player.y < wall.y + wall.h - wall.h / 4) {

                        if (player.speed.x > 0 && player.x + player.w < wall.x + wall.w / 2) { // если стена справа
                            player.x = wall.x - player.w; // избегаем проваливания
                            player.speed.x = 0; // убираем скорость движения
                        }

                        if (player.speed.x < 0 && player.x > wall.x + wall.w / 2) { // если стена слева
                            player.x = wall.w + wall.x; // избегаем проваливания
                            player.speed.x = 0; // убираем скорость движения
                        }
                    }


                }
            }
        });

        OOP.drawArr(doors, function (door) {
            if (door.isStaticIntersect(player)) {
                if (score >= cells.length / 2) {
                    nextLevel();
                    game.setLoop('game');
                }
                else {
                    alert("Вы не собрали и половины монет!");
                    restartGame();
                }
            }
        });

        // теперь рисуем и обрабатываем монетки
        OOP.drawArr(cells, function (cell) {
            if (cell.active) { // если монетка активно
                if (cell.isStaticIntersect(player)) { // проверяем столкновение
                    cell.active = false; // снимаем активность
                    cell.visible = false;
                    score++; // увеличиваем счет
                }
            }
        });

        // зададим еще переменную флаг, определяющую находится ли
        // объект в воде

        var onWater = false;


        // Рисуем и обрабатываем воду
        OOP.drawArr(waters, function (water) {
            // Если наш игрок уже находится в воде, ничего не делаем
            if (onWater) return;
            // Тут нам надо определить стролкновение
            // и направить скорость вверх (выталкивание)
            // Надо хорошенько все продумать

            // Нам требуется учесть, что выталкивающая сила начинает
            // работать только тогда, когда шар опустится в воду
            // примерно на половину от его высоты
            if (water.isStaticIntersect(player) && player.y + player.h / 2 > water.y) {
                player.speed.y -= 0.9; // определим оптимальную скорость
                onWater = true;
            }
        });

        OOP.drawArr(enemies, function (enemy) {

            if (enemy.mp) {
                enemy.motion(enemy.mp, pjs.vector.size(map.width * 2.5, 0), 2);
            }

            if (enemy.isStaticIntersect(player)) { //если задел врага
                ripPlayer();
            }
        });

        if (player.speed.y > map.height / 1.7) {   //ессли упал за карту
            ripPlayer();
        }
        // тут само движение объектов

        if (player.speed.y) {
            player.y += player.speed.y;

        }

        if (player.speed.x) {
            player.x += player.speed.x;
        }


        // рисуем счет

        brush.drawTextS({ // команда рисования
            text: 'Монетки: ' + score + '/' + cells.length, // выводим саму надпись
            size: 30, // размер шрифта
            color: 'yellow', // цвет текста
            strokeColor: '#002C5D', // цвет обводки текста
            strokeWidth: 1, // ширина обводки
            x: 10, y: 10, // позиция
            style: 'bold' // жирный шрифт
        });
        //рисуем жизни
        brush.drawTextS({ // команда рисования
            text: 'Жизни: ' + hp, // выводим саму надпись
            size: 30, // размер шрифта
            color: 'red', // цвет текста
            strokeColor: '#002C5D', // цвет обводки текста
            strokeWidth: 1, // ширина обводки
            x: 10, y: 40, // позиция
            style: 'bold' // жирный шрифт
        });

        brush.drawTextS({
            text: 'Уровень: ' + level,
            size: 30,
            color: '#FFFFFF',
            strokeColor: '#002C5D',
            strokeWidth: 1,
            x: screen.width / 2, y: 10,
            style: 'bold'
        });

        //game.setCameraPosition(player.getPosition(1));
        camera.follow(player, 20); // следим камерой за объектом игрока
    };
});