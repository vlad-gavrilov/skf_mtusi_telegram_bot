DROP TABLE IF EXISTS `Departments`;
CREATE TABLE `Departments` (
  `department_id` tinyint(50) unsigned NOT NULL AUTO_INCREMENT,
  `department_title` varchar(60) NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `Departments` WRITE;
INSERT INTO `Departments` VALUES
(1,'инфокоммуникационных технологий и систем связи'),
(2,'информатики и вычислительной техники'),
(3,'общенаучной подготовки'),
(4,'научно-исследовательской работы и инновационного развития');
UNLOCK TABLES;


DROP TABLE IF EXISTS `Groups`;
CREATE TABLE `Groups` (
  `group_id` tinyint(3) unsigned NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `Groups` WRITE;
INSERT INTO `Groups` VALUES
(0,'ДВ-11'),
(1,'ДВ-21'),
(2,'ДИ-11'),
(3,'ДИ-12'),
(4,'ДИ-21'),
(5,'ДИ-22'),
(6,'ДП-31'),
(7,'ДП-41'),
(8,'ДЗ-31'),
(9,'ДС-31'),
(10,'ДЗ-41');
UNLOCK TABLES;


DROP TABLE IF EXISTS `LoggedMessages`;
CREATE TABLE `LoggedMessages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` bigint(20) unsigned NOT NULL,
  `type` varchar(20) DEFAULT NULL,
  `last_name` varchar(1500) DEFAULT NULL,
  `first_name` varchar(1500) DEFAULT NULL,
  `username` varchar(1500) DEFAULT NULL,
  `timestamp` bigint(15) unsigned NOT NULL,
  `text` text DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `Positions`;
CREATE TABLE `Positions` (
  `position_id` tinyint(50) unsigned NOT NULL AUTO_INCREMENT,
  `position_title` varchar(60) NOT NULL,
  PRIMARY KEY (`position_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `Positions` WRITE;
INSERT INTO `Positions` VALUES
(1,'ассистент'),
(2,'преподаватель'),
(3,'старший преподаватель'),
(4,'доцент'),
(5,'профессор'),
(6,'заведующий кафедрой'),
(7,'заместитель декана факультета'),
(8,'декан факультета'),
(9,'заместитель директора'),
(10,'директор'),
(11,'начальник ОНИР');
UNLOCK TABLES;


DROP TABLE IF EXISTS `Teachers`;
CREATE TABLE `Teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_on_website` int(11) unsigned DEFAULT NULL,
  `photo_on_website` varchar(60) DEFAULT '',
  `last_name` varchar(60) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `patronymic` varchar(60) DEFAULT NULL,
  `position` tinyint(50) unsigned NOT NULL DEFAULT 1,
  `department` tinyint(50) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `Teachers_ibfk_1` (`position`),
  KEY `Teachers_ibfk_2` (`department`),
  CONSTRAINT `Teachers_ibfk_1` FOREIGN KEY (`position`) REFERENCES `Positions` (`position_id`) ON DELETE CASCADE,
  CONSTRAINT `Teachers_ibfk_2` FOREIGN KEY (`department`) REFERENCES `Departments` (`department_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Teachers` WRITE;
INSERT INTO `Teachers` VALUES (1,983,'manin','Манин','Александр','Анатольевич',10,1),(2,935,'zhukovski','Жуковский','Александр','Георгиевич',5,1),(3,985,'Ners','Нерсесянц','Альфред','Аванесович',5,1),(4,3984,'Pankov','Панков','Геннадий','Климович',3,1),(5,987,'Reshetnikova','Решетникова','Ирина','Витальевна',4,1),(6,991,'Sosnovskiy','Сосновский','Иван','Александрович',8,1),(7,993,'Yuhnov_','Юхнов','Василий','Иванович',6,1),(8,981,'ershov','Ершов','Валерий','Васильевич',4,1),(9,933,'Engiboryan','Енгибарян','Ирина','Алешаевна',4,1),(10,979,'Boldyrychin','Болдырихин','Николай','Вячеславович',4,1),(11,929,'borisov','Борисов','Борис','Петрович',4,1),(12,1009,'koneva','Конева','Светлана','Ивановна',3,2),(13,3988,'pogorelov','Погорелов','Вадим','Алексеевич',4,2),(14,1015,'Lobzenko_2','Лобзенко','Павел','Владимирович',4,2),(15,1034,'sokolov','Соколов','Сергей','Викторович',6,2),(16,1038,'chik','Чикалов','Андрей','Николаевич',4,2),(17,1036,'Shvidchenko','Швидченко','Светлана','Александровна',4,2),(18,772,'Tkachuk','Ткачук','Евгений','Остапович',3,2),(19,766,'Konkin','Конкин','Борис','Борисович',6,3),(20,1011,'korshun','Коршун','Анна','Михайловна',7,3),(21,3710,'Zhukovskii','Жуковский','Денис','Александрович',4,3),(22,748,'Bineev','Бинеев','Энвер','Абдулхакович',5,3),(23,750,'borodin','Бородин','Алексей','Викторович',4,3),(24,752,'Gaevskaya','Гаевская','Любовь','Александровна',3,3),(25,836,'golovina_01','Головина','Ирина','Витальевна',4,3),(26,756,'dok','Докучаев','Сергей','Аркадьевич',3,3),(27,760,'efimov','Ефимов','Сергей','Викторович',4,3),(28,764,'kold','Колдынская','Лариса','Михайловна',3,3),(29,768,'konstan','Константинова','Яна','Борисовна',4,3),(30,770,'Kosteckaya','Костецкая','Галина','Сергеевна',4,3),(31,778,'svetl','Светличная','Наталия','Олеговна',4,3),(32,865,'ustim','Устименко','Дмитрий','Леонидович',4,3),(33,3836,'Golovskoi','Головской','Василий','Андреевич',4,4),(34,989,'Rybalko','Рыбалко','Игорь','Петрович',11,4),(35,3835,'Mozol','Мозоль','Александр','Анатольевич',3,4);
UNLOCK TABLES;


DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` bigint(20) unsigned NOT NULL,
  `last_name` varchar(1500) DEFAULT NULL,
  `first_name` varchar(1500) DEFAULT NULL,
  `username` varchar(1500) DEFAULT NULL,
  `registration_date` bigint(20) unsigned NOT NULL,
  `group_of_user` tinyint(3) unsigned DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `Users_ibfk_1` (`group_of_user`),
  CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`group_of_user`) REFERENCES `Groups` (`group_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;