CREATE TABLE `assignments` (
	`user_id` text NOT NULL,
	`item_number` integer NOT NULL,
	`category` text NOT NULL,
	PRIMARY KEY(`user_id`, `item_number`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	PRIMARY KEY(`user_id`, `name`)
);
