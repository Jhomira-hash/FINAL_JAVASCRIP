-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: etranssa_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buses` (
  `id_bus` bigint NOT NULL AUTO_INCREMENT,
  `capacidad` int DEFAULT NULL,
  `horario` varchar(255) DEFAULT NULL,
  `placa` varchar(15) NOT NULL,
  `id_estado` bigint DEFAULT NULL,
  `id_ruta` bigint DEFAULT NULL,
  PRIMARY KEY (`id_bus`),
  UNIQUE KEY `UKnsl8x193m9h7mhybhbe40sasj` (`placa`),
  KEY `FKmrn88e28r0n7sysr2j8r2wanp` (`id_estado`),
  KEY `FKg2gxeypn7kng58oxgta4urd2l` (`id_ruta`),
  CONSTRAINT `FKg2gxeypn7kng58oxgta4urd2l` FOREIGN KEY (`id_ruta`) REFERENCES `rutas` (`id_ruta`),
  CONSTRAINT `FKmrn88e28r0n7sysr2j8r2wanp` FOREIGN KEY (`id_estado`) REFERENCES `tipo_estado` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES (1,45,'06:00 - 18:00','ABC-321',NULL,NULL),(2,20,'08:00 - 14:00','ABC-123',1,1),(3,25,'09:00 - 17:00','XYZ-456',1,2),(4,20,'10:00 - 15:00','JKL-789',1,3),(5,20,'12:00 - 16:00','DEF-321',2,4),(6,25,'08:00 - 12:00','HIJ-654',1,1),(7,20,'10:00 - 15:00','OMP-987',4,2),(8,45,'06:00 - 18:00','ABC-322',NULL,NULL);
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-27  3:40:38
