-- CreateTable
CREATE TABLE `Menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `temperature` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `totalOrders` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `menu_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `temperature` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `totalOrders` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderHistory` ADD CONSTRAINT `OrderHistory_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
