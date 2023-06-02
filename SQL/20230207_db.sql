-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2023 at 04:51 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `itp-website`
--

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `banner_id` int(11) NOT NULL,
  `post_date` date NOT NULL,
  `topic` text NOT NULL,
  `filename` text NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `active` enum('Yes','No') NOT NULL DEFAULT 'Yes',
  `created_at` datetime DEFAULT current_timestamp(),
  `arr` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`banner_id`, `post_date`, `topic`, `filename`, `status`, `active`, `created_at`, `arr`) VALUES
(5, '2023-06-03', 'werew2333', 'eedda1f5fb673_EjrpiCNU0AAL5Cw.jpg', 'Active', 'No', '2023-06-02 18:56:18', 0),
(6, '2023-06-02', 'qwewq', '34b76954a525c_EmVZYerVgAEVhQj.jpg', 'Active', 'No', '2023-06-02 18:56:26', 1),
(7, '2023-06-02', 'wrwrewrwrew', '8e6bf28defea2_EmVZYerVgAEVhQj - Copy.jpg', 'Active', 'Yes', '2023-06-02 19:25:43', 2),
(8, '2023-06-02', 'test', '06d60a6030337_bg.PNG', 'Active', 'Yes', '2023-06-02 20:55:14', 0),
(9, '2023-06-02', 'aaaa', '371ba2e8ed8ad_CT_7Z-6VAAAySbS.jpg', 'Active', 'Yes', '2023-06-02 20:59:57', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `fullname` text NOT NULL,
  `email` text NOT NULL,
  `level` enum('Administrator','User') NOT NULL DEFAULT 'User',
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `fullname`, `email`, `level`, `status`, `created_at`) VALUES
(1, 'admin', '$2b$12$bkgPnr8sf8J1YQy/BcwxEuQ1eeETvVsu7gxS4GvDZpYPmFhuXIwKO', 'Administrator', 'admin@xxx.co.th', 'Administrator', 'Active', '2023-05-31 08:02:01'),
(2, 'alastrol', '$2b$12$I6tjoVq0bPOJq0Z4g4/m5.zYD1cxDzVEXfLqSM./AYYNaq0B2WLWq', 'Suphavit Bunnag', 'suphavit.b@xxx.co.th', 'User', 'Active', '2023-05-31 08:02:39'),
(3, 'admin2', '$2b$12$OinV49GdwS1ieqJ/uhNNDekI6PvF64fUGLvQEhYpDrigbBVUNVuuu', 'Suphavit Bunnag', 'suphavit.b@xxx.co.th', 'Administrator', 'Active', '2023-06-02 10:15:53'),
(6, 'test', '$2b$12$U6P/lYzV0e7ujmooDIUcjOAR6Yg4m9EUwd1Romnyz/ydL37oa10La', 'New', 'sss@xxx.co.th', 'User', 'Inactive', '2023-06-02 11:17:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`banner_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `banner_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
