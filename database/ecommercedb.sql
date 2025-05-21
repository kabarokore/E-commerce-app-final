-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: ecommercedb
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address_type` enum('BILLING','BOTH','SHIPPING') NOT NULL,
  `city` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `is_default` bit(1) DEFAULT NULL,
  `postal_code` varchar(20) NOT NULL,
  `state` varchar(100) NOT NULL,
  `street_address` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`),
  CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'SHIPPING','Gasabo District, Kigali','Rwanda',_binary '','0000','Kigali','kg689st',1);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `quantity` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  KEY `FK1re40cjegsfvw58xrkdp6bac6` (`product_id`),
  CONSTRAINT `FK1re40cjegsfvw58xrkdp6bac6` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (110,'2025-05-19 22:37:53.671623',10.00,5,'2025-05-19 22:49:43.264463',1,207);
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('ABANDONED','ACTIVE','CONVERTED') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKb5o626f86h46m4s7ms6ginnop` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,'2025-05-16 11:21:37.582137','ACTIVE','2025-05-16 11:21:37.582167',1),(2,'2025-05-16 14:08:50.932794','ACTIVE','2025-05-16 14:08:50.932825',2);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `parent_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsaok720gsu4u2wrgbk10b5n8d` (`parent_id`),
  CONSTRAINT `FKsaok720gsu4u2wrgbk10b5n8d` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,NULL,NULL,'Specialty Coffee',NULL),(2,NULL,NULL,'Brewing Equipment',NULL),(3,NULL,NULL,'Accessories',NULL),(4,NULL,NULL,'Subscription',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` decimal(38,2) NOT NULL,
  `quantity` int NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,16.99,2,1,103),(2,59.99,1,1,8),(3,28.99,1,1,202),(4,14.99,1,1,201),(5,59.99,1,2,8),(6,16.99,1,2,103),(7,29.99,1,2,204),(8,14.99,1,2,201),(9,17.50,1,3,201),(10,36.00,1,3,202),(11,59.99,1,3,8),(12,39.99,1,4,102),(13,22.00,1,4,101),(14,12.00,1,4,207),(15,15.99,1,4,2),(16,29.99,1,5,3),(17,15.99,1,5,2),(18,64.99,1,5,6),(19,19.50,1,5,103),(20,15.00,1,5,206);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `billing_address` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `shipping_address` text NOT NULL,
  `status` enum('CANCELLED','DELIVERED','PENDING','PROCESSING','SHIPPED') NOT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'kg689st, Gasabo District, Kigali, Kigali 0000, Rwanda','2025-05-18 22:03:26.748077','Credit Card','kg689st, Gasabo District, Kigali, Kigali 0000, Rwanda','DELIVERED',137.95,'2025-05-19 15:53:29.813456',1),(2,'kg689st, Gasabo District, Kigali, Kigali 0000, Rwanda','2025-05-18 22:21:05.336780','Credit Card','kg689st, Gasabo District, Kigali, Kigali 0000, Rwanda','PENDING',121.96,'2025-05-18 22:21:05.336780',1),(3,'kg689st, Gasabo District, Kigali, Kigali 0000, Rwanda','2025-05-18 22:49:27.019160','Credit Card','kg689st, Gasabo District, Kigali, Kigali 0000, Rwanda','CANCELLED',113.49,'2025-05-18 23:07:25.593209',1),(4,'kg689st, Gasabo District, Kigali, Kigali 0000, Rwanda','2025-05-19 17:29:46.260353','Credit Card','kg689st, Gasabo District, Kigali, Kigali 0000, Rwanda','PENDING',89.98,'2025-05-19 17:29:46.260353',1),(5,'kg689st, Gasabo District, Kigali, Kigali 0000, Rwanda','2025-05-19 22:37:12.291070','Credit Card','kg689st, Gasabo District, Kigali, Kigali 0000, Rwanda','PENDING',145.47,'2025-05-19 22:37:12.291070',1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `display_order` int DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` bit(1) DEFAULT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqnq71xsohugpqwf3c9gxmsuy` (`product_id`),
  CONSTRAINT `FKqnq71xsohugpqwf3c9gxmsuy` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=208 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&auto=format&fit=crop',_binary '',1),(2,1,'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop',_binary '',2),(3,1,'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&auto=format&fit=crop',_binary '',3),(4,1,'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&auto=format&fit=crop',_binary '',4),(5,1,'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&auto=format&fit=crop',_binary '',5),(6,1,'https://images.unsplash.com/photo-1534687941688-651ccaafbff8?w=500&auto=format&fit=crop',_binary '',6),(7,1,'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&auto=format&fit=crop',_binary '',7),(8,1,'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&auto=format&fit=crop',_binary '',8),(101,1,'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=1374&auto=format&fit=crop',_binary '',101),(102,1,'https://images.unsplash.com/photo-1570286424717-86d8a0082d0c?q=80&w=1480&auto=format&fit=crop',_binary '',102),(103,1,'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=1470&auto=format&fit=crop',_binary '',103),(104,1,'https://images.unsplash.com/photo-1607681034540-2c46cc71896d?q=80&w=1374&auto=format&fit=crop',_binary '',104),(201,1,'https://images.unsplash.com/photo-1610889556528-9a770e32642f?q=80&w=1315&auto=format&fit=crop',_binary '',201),(202,1,'https://images.unsplash.com/photo-1708127368781-cd5f069a90a5?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlbmNoJTIwcHJlc3N8ZW58MHx8MHx8fDA%3D',_binary '',202),(203,1,'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1470&auto=format&fit=crop',_binary '',203),(204,1,'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1471&auto=format&fit=crop',_binary '',204),(205,1,'https://images.unsplash.com/photo-1670950444753-805b4fb5a00e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',_binary '',205),(206,1,'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1374&auto=format&fit=crop',_binary '',206),(207,1,'https://cdn.prod.website-files.com/620ec9913ceb488d14b2b183/6238e3f61fc5ccff51c261e1_coffee-picking.jpg',_binary '',207);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tags`
--

DROP TABLE IF EXISTS `product_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tags` (
  `product_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  PRIMARY KEY (`product_id`,`tag_id`),
  KEY `FKpur2885qb9ae6fiquu77tcv1o` (`tag_id`),
  CONSTRAINT `FK5rk6s19k3risy7q7wqdr41uss` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKpur2885qb9ae6fiquu77tcv1o` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tags`
--

LOCK TABLES `product_tags` WRITE;
/*!40000 ALTER TABLE `product_tags` DISABLE KEYS */;
INSERT INTO `product_tags` VALUES (1,1),(8,2),(3,3),(207,3);
/*!40000 ALTER TABLE `product_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `is_subscription` bit(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `sale_price` decimal(38,2) DEFAULT NULL,
  `stock_quantity` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=208 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,_binary '','2025-05-16 18:28:02.000000','Bright, fruity, and floral notes with a clean, tea-like body. Our Ethiopian Yirgacheffe is a perfect morning coffee.',_binary '\0','Ethiopian Yirgacheffe',16.99,19.99,100,'2025-05-16 18:28:02.000000',1),(2,_binary '','2025-05-16 18:28:02.000000','Sweet caramel and nutty notes with a medium body and smooth finish. A classic coffee loved by everyone.',_binary '\0','Colombian Supremo',15.99,NULL,98,'2025-05-16 18:28:02.000000',1),(3,_binary '','2025-05-16 18:28:02.000000','Complete kit includes ceramic dripper, glass server, measuring scoop, and filters for the perfect pour over coffee.',_binary '\0','Hario V60 Pour Over Kit',29.99,NULL,49,'2025-05-16 18:28:02.000000',2),(4,_binary '','2025-05-16 18:28:02.000000','The versatile and portable coffee maker that brews American, espresso, or cold brew style coffee in about a minute.',_binary '\0','Aeropress Coffee Maker',34.99,NULL,0,'2025-05-16 18:28:02.000000',2),(5,_binary '','2025-05-16 18:28:02.000000','Set of 4 handcrafted ceramic mugs in earthy tones, perfect for your morning coffee ritual. Dishwasher safe.',_binary '\0','Ceramic Coffee Mug Set (4 pcs)',32.99,39.99,80,'2025-05-16 18:28:02.000000',3),(6,_binary '','2025-05-16 18:28:02.000000','Conical burr grinder with 18 grind settings for perfectly ground coffee every time. Ideal for any brewing method.',_binary '\0','Electric Burr Coffee Grinder',49.99,64.99,59,'2025-05-16 18:28:02.000000',2),(7,_binary '','2025-05-16 18:28:02.000000','Rich, chocolate notes with a subtle spice and smooth finish. Medium roast from the highlands of Guatemala.',_binary '\0','Guatemala Antigua',18.99,NULL,100,'2025-05-16 18:28:02.000000',1),(8,_binary '','2025-05-16 18:28:02.000000','Complete gift set with two 8oz bags of premium coffee, a ceramic mug, and a stainless steel travel tumbler.',_binary '\0','Coffee Lover\'s Gift Set',59.99,NULL,27,'2025-05-16 18:28:02.000000',4),(101,_binary '','2025-05-16 19:14:59.000000','Light roast with floral and citrus notes.',_binary '\0','Ethiopian Yirgacheffe Light Roast',18.99,22.00,99,'2025-05-16 19:14:59.000000',1),(102,_binary '','2025-05-16 19:14:59.000000','Precision pour-over kettle for perfect brewing.',_binary '\0','Stainless Steel Pour-Over Kettle',32.50,39.99,49,'2025-05-16 19:14:59.000000',2),(103,_binary '','2025-05-16 19:14:59.000000','Medium roast with chocolate and berry notes.',_binary '\0','Burundi Medium Roast Coffee',16.99,19.50,96,'2025-05-16 19:14:59.000000',1),(104,_binary '','2025-05-16 19:14:59.000000','Vacuum brewer for clean, rich coffee.',_binary '\0','Vacuum Coffee Maker',45.99,59.99,30,'2025-05-16 19:14:59.000000',2),(201,_binary '','2025-05-16 19:14:59.000000','Single origin Colombian beans, smooth and balanced.',_binary '\0','Colombian Single Origin Coffee Beans',14.99,17.50,97,'2025-05-16 19:14:59.000000',1),(202,_binary '','2025-05-16 19:14:59.000000','Classic French press for full-bodied coffee.',_binary '\0','French Press Coffee Maker 34oz',28.99,36.00,38,'2025-05-16 19:14:59.000000',2),(203,_binary '','2025-05-16 19:14:59.000000','Set of 4 ceramic mugs, dishwasher safe.',_binary '\0','Ceramic Coffee Mug Set (Set of 4)',24.99,32.00,80,'2025-05-16 19:14:59.000000',3),(204,_binary '','2025-05-16 19:14:59.000000','Subscription box with curated coffees each month.',_binary '','Monthly Coffee Explorer Box',29.99,35.00,998,'2025-05-16 19:14:59.000000',4),(205,_binary '','2025-05-16 19:14:59.000000','Complete AeroPress kit for home or travel.',_binary '\0','AeroPress Coffee Maker Kit',31.99,39.99,60,'2025-05-16 19:14:59.000000',2),(206,_binary '','2025-05-16 19:14:59.000000','Handmade wooden scoop for coffee or tea.',_binary '\0','Handcrafted Wooden Coffee Scoop',12.99,15.00,119,'2025-05-16 19:14:59.000000',3),(207,_binary '','2025-05-19 13:01:47.904717','Test',_binary '\0','Test',10.00,12.00,4,'2025-05-19 13:01:47.904721',1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` text,
  `created_at` datetime(6) NOT NULL,
  `rating` int NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK1nv3auyahyyy79hvtrcqgtfo9` (`user_id`,`product_id`),
  KEY `FKpl51cejpw4gy5swfar8br9ngi` (`product_id`),
  CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKpl51cejpw4gy5swfar8br9ngi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'Amazing flavor and aroma!','2025-05-16 18:28:45.000000',5,1,1),(2,'Great for pour over.','2025-05-16 18:28:45.000000',4,3,2);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` enum('ROLE_ADMIN','ROLE_USER') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ROLE_USER'),(2,'ROLE_ADMIN');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_t48xdq560gs3gap9g7jg36kgc` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (3,'Equipment'),(2,'Gift'),(1,'Single Origin');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (2,1),(1,2);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `password` varchar(120) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2025-05-16 11:21:16.252947','ashimwegeoffrey@gmail.com','Ashimwe','Geoffrey','1234','0788641601','2025-05-16 11:21:16.252980','admin'),(2,'2025-05-16 14:08:42.153854','test@gmail.com','test','test','1234','0788641601','2025-05-16 14:08:42.153885','test');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `added_at` datetime(6) DEFAULT NULL,
  `product_id` bigint NOT NULL,
  `wishlist_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK1tt7y773rvi7jkh499ipw7r8w` (`wishlist_id`,`product_id`),
  KEY `FKqxj7lncd242b59fb78rqegyxj` (`product_id`),
  CONSTRAINT `FKkem9l8vd14pk3cc4elnpl0n00` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists` (`id`),
  CONSTRAINT `FKqxj7lncd242b59fb78rqegyxj` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
INSERT INTO `wishlist_items` VALUES (30,'2025-05-18 12:22:50.644293',201,1),(32,'2025-05-18 12:22:54.605298',202,1),(35,'2025-05-18 12:37:43.894043',204,1),(39,'2025-05-18 13:22:13.099872',103,1),(40,'2025-05-18 14:12:05.206514',8,1),(41,'2025-05-19 13:06:29.334348',102,1),(42,'2025-05-19 17:29:27.314343',1,1),(43,'2025-05-19 22:37:51.830689',207,1);
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_obh8c909a28dx3aqh4cbdhh25` (`user_id`),
  CONSTRAINT `FK330pyw2el06fn5g28ypyljt16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (1,'2025-05-16 15:57:46.741862','2025-05-19 22:37:51.834371',1);
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-20  1:15:29
