-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 27, 2019 lúc 05:19 AM
-- Phiên bản máy phục vụ: 10.4.6-MariaDB
-- Phiên bản PHP: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `price_table`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `gold_price`
--

CREATE TABLE `gold_price` (
  `id` int(11) NOT NULL,
  `title` char(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `value` double(50,4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `gold_price`
--

INSERT INTO `gold_price` (`id`, `title`, `value`) VALUES
(1, 'gold', 48.3769),
(2, 'silver', 0.5065);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `related_diffrence`
--

CREATE TABLE `related_diffrence` (
  `id_metal` int(255) NOT NULL,
  `value` double(50,4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `related_diffrence`
--

INSERT INTO `related_diffrence` (`id_metal`, `value`) VALUES
(1, -0.0610),
(2, 0.0000);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `gold_price`
--
ALTER TABLE `gold_price`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `related_diffrence`
--
ALTER TABLE `related_diffrence`
  ADD PRIMARY KEY (`id_metal`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `gold_price`
--
ALTER TABLE `gold_price`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `related_diffrence`
--
ALTER TABLE `related_diffrence`
  ADD CONSTRAINT `related_diffrence_ibfk_1` FOREIGN KEY (`id_metal`) REFERENCES `gold_price` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
