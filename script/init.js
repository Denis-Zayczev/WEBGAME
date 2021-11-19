// Тут подключение движка, далее объект pjs будет глобальным
var level = 1;
	
	var pjs = new PointJS('2D', 400, 400, {
	background :'url(img/background1.jpg) no-repeat center',
	backgroundSize : 'cover'
	});
	

// Включаем полностраничный режим
pjs.system.initFullPage();

var presets=pjs.presets;
// Объявляем ссылки на быстрый доступ к внутренностям движка
var log = pjs.system.log; // логирование событий
var game = pjs.game; // объект управления игровыми состояниями и объектами
var point = pjs.vector.point; // конструктор точек
var camera = pjs.camera; // доступ к камере
var brush = pjs.brush; // доступ к методам простого рисования
var OOP = pjs.OOP; // доступ к дополнительным обработчиком объектов
var math = pjs.math; // модуль игровой математики
var tiles=pjs.tiles;
// инициализируем мышь и клавиатуру
var key = pjs.keyControl.initKeyControl();
var mouse = pjs.mouseControl.initMouseControl();

// тут объявим глобальные переменные счета и рекорда
var score = 0;
var record = 0;
var hp=5;
var WH = pjs.game.getWH();
var W=WH.w;
var H=WH.h;
var myLevel = false;
var a=0;

var changeBack=function(name){ //функция смены фона
pjs.system.setStyle({
background: 'url(img/'+name+'.jpg) center no-repeat',
backgroundSize:'cover'
});
};