-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 08, 2026 at 03:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lab_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

DROP DATABASE IF EXISTS lab_management;
CREATE DATABASE lab_management;
USE lab_management;

CREATE TABLE `activity_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `activity` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `consumable`
--

CREATE TABLE `consumable` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `consumable_code` varchar(50) DEFAULT NULL,
  `consumable_name` varchar(150) NOT NULL,
  `unit` varchar(30) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `minimum_stock` int(11) DEFAULT 0,
  `latest_price` decimal(15,2) DEFAULT NULL,
  `storage_location` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `consumable_category`
--

CREATE TABLE `consumable_category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `goods_receipt`
--

CREATE TABLE `goods_receipt` (
  `id` int(11) NOT NULL,
  `procurement_item_id` int(11) NOT NULL,
  `received_quantity` int(11) NOT NULL,
  `received_date` date NOT NULL,
  `received_by` int(11) NOT NULL,
  `receipt_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `goods_receipt_id` int(11) DEFAULT NULL,
  `inventory_code` varchar(50) NOT NULL,
  `inventory_name` varchar(150) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `specification` text DEFAULT NULL,
  `purchase_price` decimal(15,2) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `condition_status` enum('BAIK','RUSAK_RINGAN','RUSAK_BERAT','DALAM_PERBAIKAN','DIHAPUS') DEFAULT 'BAIK',
  `inventory_status` enum('AKTIF','TIDAK_AKTIF','DIGANTI') DEFAULT 'AKTIF',
  `qr_code_path` text DEFAULT NULL,
  `image_path` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_category`
--

CREATE TABLE `inventory_category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_consumable`
--

CREATE TABLE `maintenance_consumable` (
  `id` int(11) NOT NULL,
  `maintenance_log_id` int(11) NOT NULL,
  `consumable_id` int(11) NOT NULL,
  `quantity_used` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_log`
--

CREATE TABLE `maintenance_log` (
  `id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `maintenance_by` int(11) NOT NULL,
  `maintenance_date` date NOT NULL,
  `maintenance_type` enum('PENCEGAHAN','PERBAIKAN') NOT NULL,
  `condition_before` enum('BAIK','RUSAK_RINGAN','RUSAK_BERAT') DEFAULT NULL,
  `condition_after` enum('BAIK','RUSAK_RINGAN','RUSAK_BERAT') DEFAULT NULL,
  `maintenance_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `procurement_draft`
--

CREATE TABLE `procurement_draft` (
  `id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `draft_title` varchar(150) NOT NULL,
  `procurement_year` year(4) NOT NULL,
  `draft_status` enum('DRAF','DIAJUKAN','SEDANG_DIREVIEW','TERKUNCI') DEFAULT 'DRAF',
  `notes` text DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `finalized_by` int(11) DEFAULT NULL,
  `finalized_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `procurement_draft`
--

INSERT INTO `procurement_draft` (`id`, `created_by`, `draft_title`, `procurement_year`, `draft_status`, `notes`, `submitted_at`, `finalized_by`, `finalized_at`, `created_at`, `updated_at`) VALUES
(1, 2, 'test test', '2026', 'DRAF', 'unuk nanan blabalb', NULL, NULL, NULL, '2026-06-07 13:43:28', '2026-06-07 15:38:45'),
(2, 2, 'kenutuhan lab 1', '2078', 'TERKUNCI', 'qwert', '2026-06-07 16:59:25', NULL, NULL, '2026-06-07 15:37:13', '2026-06-08 03:03:54');

-- --------------------------------------------------------

--
-- Table structure for table `procurement_item`
--

CREATE TABLE `procurement_item` (
  `id` int(11) NOT NULL,
  `draft_id` int(11) NOT NULL,
  `item_type` enum('INVENTARIS','BHP') NOT NULL,
  `inventory_category_id` int(11) DEFAULT NULL,
  `consumable_category_id` int(11) DEFAULT NULL,
  `item_name` varchar(150) NOT NULL,
  `quantity` int(11) NOT NULL,
  `estimated_price` decimal(15,2) NOT NULL,
  `purchase_link` text DEFAULT NULL,
  `approval_status` enum('MENUNGGU','DISETUJUI','DITOLAK') DEFAULT 'MENUNGGU',
  `approval_notes` text DEFAULT NULL,
  `replacement_inventory_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `procurement_item`
--

INSERT INTO `procurement_item` (`id`, `draft_id`, `item_type`, `inventory_category_id`, `consumable_category_id`, `item_name`, `quantity`, `estimated_price`, `purchase_link`, `approval_status`, `approval_notes`, `replacement_inventory_id`, `created_at`, `updated_at`) VALUES
(1, 2, 'INVENTARIS', NULL, NULL, ' kanso jbvoa', 15, 12098.00, 'qwe', 'DITOLAK', 'qwe', NULL, '2026-06-07 16:13:01', '2026-06-08 02:44:43'),
(2, 2, 'BHP', NULL, NULL, 'alkohol 1 liter', 1, 20000.00, 'qaterxcv', 'DISETUJUI', '-', NULL, '2026-06-07 16:49:48', '2026-06-08 02:59:14'),
(4, 2, 'INVENTARIS', NULL, NULL, 'qwert', 2345, 12345.00, 'xcvb', 'DISETUJUI', NULL, NULL, '2026-06-07 16:50:52', '2026-06-08 02:31:34'),
(5, 2, 'INVENTARIS', NULL, NULL, 'asd', 12, 8.00, 'xcvb', 'DISETUJUI', NULL, NULL, '2026-06-07 17:00:11', '2026-06-08 02:31:49');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `role_name`) VALUES
(1, 'ADMIN'),
(3, 'KAPRODI'),
(2, 'KEPALA_LAB'),
(4, 'STAFF_ADMIN'),
(5, 'STAFF_LAB');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` int(11) NOT NULL,
  `room_code` varchar(20) DEFAULT NULL,
  `room_name` varchar(100) NOT NULL,
  `room_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `room_code`, `room_name`, `room_description`, `created_at`, `updated_at`) VALUES
(3, 'a', 'a', 'a', '2026-06-08 13:14:45', '2026-06-08 13:14:45');

-- --------------------------------------------------------

--
-- Table structure for table `stock_movement`
--

CREATE TABLE `stock_movement` (
  `id` int(11) NOT NULL,
  `consumable_id` int(11) NOT NULL,
  `movement_type` enum('MASUK','KELUAR') NOT NULL,
  `quantity` int(11) NOT NULL,
  `reference_type` enum('PENERIMAAN_PENGADAAN','PENGGUNAAN_MAINTENANCE','PENYESUAIAN_MANUAL') NOT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `role_id`, `full_name`, `email`, `password`, `phone_number`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Administrator Sistem ', 'admin@lab.com', '$2b$10$Vkyu3HWflB0gFpsCPmNesewDnt2m3mk/ClIiHB8KzlS2/zaWTbYP.', '081234568', 1, '2026-06-07 09:35:49', '2026-06-08 13:13:26'),
(2, 2, 'Budi', 'budi@lab.com', '$2b$10$piyESTj06RMJ3.gHkvSsteV0Ef3EALWzHkGx.PWVQcRNAspnzWQsu', NULL, 1, '2026-06-07 12:57:44', '2026-06-07 12:57:44'),
(3, 3, 'udin', 'udin@lab.com', '$2b$10$waP3x9u9bP/tL04CUr9N7egHMwTDJWt.uTEfXXjeZnMdvVe/xr1si', NULL, 0, '2026-06-07 17:02:35', '2026-06-07 17:07:01'),
(4, 3, 'asep', 'asep@lab.com', '$2b$10$fipboXdCNTZeM2Y5QLQ1SOh80XpkzPgvijK/WkpkdN2MtFkLlorq.', NULL, 1, '2026-06-07 17:07:31', '2026-06-07 17:07:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_activity_user` (`user_id`);

--
-- Indexes for table `consumable`
--
ALTER TABLE `consumable`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `consumable_code` (`consumable_code`),
  ADD KEY `fk_consumable_category` (`category_id`);

--
-- Indexes for table `consumable_category`
--
ALTER TABLE `consumable_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `goods_receipt`
--
ALTER TABLE `goods_receipt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_receipt_item` (`procurement_item_id`),
  ADD KEY `fk_receipt_user` (`received_by`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inventory_code` (`inventory_code`),
  ADD KEY `fk_inventory_category` (`category_id`),
  ADD KEY `fk_inventory_room` (`room_id`),
  ADD KEY `fk_inventory_receipt` (`goods_receipt_id`);

--
-- Indexes for table `inventory_category`
--
ALTER TABLE `inventory_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `maintenance_consumable`
--
ALTER TABLE `maintenance_consumable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_maintenance_log` (`maintenance_log_id`),
  ADD KEY `fk_maintenance_consumable` (`consumable_id`);

--
-- Indexes for table `maintenance_log`
--
ALTER TABLE `maintenance_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_maintenance_inventory` (`inventory_id`),
  ADD KEY `fk_maintenance_user` (`maintenance_by`);

--
-- Indexes for table `procurement_draft`
--
ALTER TABLE `procurement_draft`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_procurement_creator` (`created_by`),
  ADD KEY `fk_procurement_finalizer` (`finalized_by`);

--
-- Indexes for table `procurement_item`
--
ALTER TABLE `procurement_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_procurement_draft` (`draft_id`),
  ADD KEY `fk_procurement_inventory_category` (`inventory_category_id`),
  ADD KEY `fk_procurement_consumable_category` (`consumable_category_id`),
  ADD KEY `fk_replacement_inventory` (`replacement_inventory_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `room_code` (`room_code`);

--
-- Indexes for table `stock_movement`
--
ALTER TABLE `stock_movement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_stock_consumable` (`consumable_id`),
  ADD KEY `fk_stock_user` (`created_by`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_user_role` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consumable`
--
ALTER TABLE `consumable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `consumable_category`
--
ALTER TABLE `consumable_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `goods_receipt`
--
ALTER TABLE `goods_receipt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_category`
--
ALTER TABLE `inventory_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `maintenance_consumable`
--
ALTER TABLE `maintenance_consumable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `maintenance_log`
--
ALTER TABLE `maintenance_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `procurement_draft`
--
ALTER TABLE `procurement_draft`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `procurement_item`
--
ALTER TABLE `procurement_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stock_movement`
--
ALTER TABLE `stock_movement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `consumable`
--
ALTER TABLE `consumable`
  ADD CONSTRAINT `fk_consumable_category` FOREIGN KEY (`category_id`) REFERENCES `consumable_category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `goods_receipt`
--
ALTER TABLE `goods_receipt`
  ADD CONSTRAINT `fk_receipt_item` FOREIGN KEY (`procurement_item_id`) REFERENCES `procurement_item` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_receipt_user` FOREIGN KEY (`received_by`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `fk_inventory_category` FOREIGN KEY (`category_id`) REFERENCES `inventory_category` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inventory_receipt` FOREIGN KEY (`goods_receipt_id`) REFERENCES `goods_receipt` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inventory_room` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `maintenance_consumable`
--
ALTER TABLE `maintenance_consumable`
  ADD CONSTRAINT `fk_maintenance_consumable` FOREIGN KEY (`consumable_id`) REFERENCES `consumable` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_maintenance_log` FOREIGN KEY (`maintenance_log_id`) REFERENCES `maintenance_log` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `maintenance_log`
--
ALTER TABLE `maintenance_log`
  ADD CONSTRAINT `fk_maintenance_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_maintenance_user` FOREIGN KEY (`maintenance_by`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `procurement_draft`
--
ALTER TABLE `procurement_draft`
  ADD CONSTRAINT `fk_procurement_creator` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_procurement_finalizer` FOREIGN KEY (`finalized_by`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `procurement_item`
--
ALTER TABLE `procurement_item`
  ADD CONSTRAINT `fk_procurement_consumable_category` FOREIGN KEY (`consumable_category_id`) REFERENCES `consumable_category` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_procurement_draft` FOREIGN KEY (`draft_id`) REFERENCES `procurement_draft` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_procurement_inventory_category` FOREIGN KEY (`inventory_category_id`) REFERENCES `inventory_category` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_replacement_inventory` FOREIGN KEY (`replacement_inventory_id`) REFERENCES `inventory` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `stock_movement`
--
ALTER TABLE `stock_movement`
  ADD CONSTRAINT `fk_stock_consumable` FOREIGN KEY (`consumable_id`) REFERENCES `consumable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_stock_user` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
