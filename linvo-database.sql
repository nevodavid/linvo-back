create schema linvoapp collate utf8_general_ci;

create table plugins
(
    id int unsigned auto_increment,
    title varchar(256) null,
    script text null,
    website varchar(255) null,
    description text null,
    deleted_at datetime null,
    created_at datetime default CURRENT_TIMESTAMP null,
    updated_at datetime default CURRENT_TIMESTAMP null,
    constraint plugins_id_uindex
        unique (id)
);

alter table plugins
    add primary key (id);

create table plugins_variables
(
    id int auto_increment,
    plugin int unsigned null,
    value varchar(255) null,
    description varchar(255) null,
    updated_at datetime default CURRENT_TIMESTAMP not null,
    created_at datetime default CURRENT_TIMESTAMP not null,
    deleted_at datetime null,
    constraint plugins_variables_id_uindex
        unique (id),
    constraint plugins_variables_plugins_id_fk
        foreign key (plugin) references plugins (id)
);

create index plugins_variables_plugin_index
    on plugins_variables (plugin);

alter table plugins_variables
    add primary key (id);

create table shopify
(
    shop varchar(255) null,
    accessToken varchar(255) null,
    constraint shopify_pk
        unique (shop)
);

create index shopify_shop_index
    on shopify (shop);

create table users
(
    id int auto_increment
        primary key,
    name varchar(255) null,
    email varchar(255) null,
    password varchar(255) null,
    created_at datetime default CURRENT_TIMESTAMP not null,
    deleted_at datetime null,
    updated_at datetime default CURRENT_TIMESTAMP null
);

create table plugin_user
(
    id int auto_increment
        primary key,
    user int null,
    plugin int unsigned null,
    domain varchar(255) null,
    active tinyint(1) default 0 null,
    updated_at datetime null,
    deleted_at datetime null,
    created_at datetime null,
    constraint plugin_user_plugins_id_fk
        foreign key (plugin) references plugins (id),
    constraint plugin_user_users_id_fk
        foreign key (user) references users (id)
);

create table plugin_user_variables
(
    id int auto_increment
        primary key,
    plugin_user int null,
    plugin_variable int null,
    value varchar(255) null,
    created_at datetime default CURRENT_TIMESTAMP not null,
    updated_at datetime default CURRENT_TIMESTAMP not null,
    deleted_at datetime null,
    constraint plugin_user_variables_pk
        unique (plugin_user, plugin_variable),
    constraint plugin_user_variables_plugin_user_id_fk
        foreign key (plugin_user) references plugin_user (id),
    constraint plugin_user_variables_plugins_variables_id_fk
        foreign key (plugin_variable) references plugins_variables (id)
);

