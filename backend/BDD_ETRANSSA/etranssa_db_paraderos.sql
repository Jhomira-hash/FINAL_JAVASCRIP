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
-- Table structure for table `paraderos`
--

DROP TABLE IF EXISTS `paraderos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paraderos` (
  `id_paradero` bigint NOT NULL AUTO_INCREMENT,
  `latitud` double DEFAULT NULL,
  `longitud` double DEFAULT NULL,
  `nombre_paradero` varchar(100) NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `id_ruta` bigint DEFAULT NULL,
  `id_tipo_entidad` bigint DEFAULT NULL,
  PRIMARY KEY (`id_paradero`),
  KEY `FK6nsrem6jmh4fgmfwe75a6kdbs` (`id_ruta`),
  KEY `FKif95whmvs29ibvyhr34b2urcu` (`id_tipo_entidad`),
  CONSTRAINT `FK6nsrem6jmh4fgmfwe75a6kdbs` FOREIGN KEY (`id_ruta`) REFERENCES `rutas` (`id_ruta`),
  CONSTRAINT `FKif95whmvs29ibvyhr34b2urcu` FOREIGN KEY (`id_tipo_entidad`) REFERENCES `tipo_entidad` (`id_tipo_entidad`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paraderos`
--

LOCK TABLES `paraderos` WRITE;
/*!40000 ALTER TABLE `paraderos` DISABLE KEYS */;
INSERT INTO `paraderos` VALUES (1,-14.0685,-75.7289,'Universidad Tecnológica del Perú','Calle Ayabaca',2,1),(2,-14.0751,-75.7302,'Centro Comercial Plaza del Sol','Av. San Martín',3,3),(3,-14.0852,-75.7403,'Hospital Regional de Ica','Av. Progreso, Ayabaca',4,2),(4,-14.09,-75.75,'Colegio Ntra. Sra. de las Mercedes','Av. Matías Manzanilla',1,1),(5,-14.08,-75.735,'Colegio San Luis Gonzaga','Av. Matías Manzanilla',1,1);
/*!40000 ALTER TABLE `paraderos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-27  3:40:39
