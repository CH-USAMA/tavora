CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`expiresAt` integer,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`adminId` text NOT NULL,
	`action` text NOT NULL,
	`entity` text,
	`entityId` text,
	`details` text,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`adminId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`image` text,
	`sortOrder` integer DEFAULT 0,
	`isVisible` integer DEFAULT true,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `collections` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`image` text,
	`sortOrder` integer DEFAULT 0,
	`isVisible` integer DEFAULT true,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collections_slug_unique` ON `collections` (`slug`);--> statement-breakpoint
CREATE TABLE `homepage_sections` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`title` text,
	`subtitle` text,
	`config` text,
	`sortOrder` integer DEFAULT 0,
	`isVisible` integer DEFAULT true,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`url` text NOT NULL,
	`alt` text,
	`sortOrder` integer DEFAULT 0,
	`isPrimary` integer DEFAULT false,
	FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`specifications` text,
	`brand` text,
	`sku` text,
	`price` real NOT NULL,
	`salePrice` real,
	`categoryId` text,
	`collectionId` text,
	`tags` text,
	`isFeatured` integer DEFAULT false,
	`isBestSeller` integer DEFAULT false,
	`isNewArrival` integer DEFAULT false,
	`isVisible` integer DEFAULT true,
	`externalUrl` text,
	`seoTitle` text,
	`seoDescription` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`impersonatedBy` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`content` text NOT NULL,
	`avatar` text,
	`rating` integer DEFAULT 5,
	`isVisible` integer DEFAULT true,
	`sortOrder` integer DEFAULT 0,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`role` text,
	`banned` integer,
	`banReason` text,
	`banExpires` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
