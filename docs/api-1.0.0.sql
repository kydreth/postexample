--jpa creates database, this is roughly what is created
create table users (
    id bigserial primary key not null,
    name_first text not null,
    name_last text not null,
    email text unique not null,
    phone text,
    password text not null,
    created_at timestamp without time zone not null default current_timestamp,
    updated_at timestamp without time zone not null default current_timestamp
);
create table statuses (
    id bigserial primary key not null,
    name text unique not null,
    created_at timestamp without time zone not null default current_timestamp,
    updated_at timestamp without time zone not null default current_timestamp
);

create table roles (
    id bigserial primary key not null,
    name text unique not null,
    created_at timestamp without time zone not null default current_timestamp,
    updated_at timestamp without time zone not null default current_timestamp
);

create table user_roles (
    user_id bigint not null,
    role_id bigint not null,
    primary key (user_id, role_id),
    foreign key (user_id) references users (id),
    foreign key (role_id) references roles (id)
);

create table posts (
	id bigserial primary key not null,
	title text not null,
	description text not null,
	businessCase text,
	status_id bigint not null,
	user_id bigint not null,
	created_at timestamp without time zone not null default current_timestamp,
	updated_at timestamp without time zone not null default current_timestamp
);

create table comments (
	id bigserial primary key not null,
	description text not null,
    post_id bigint not null references posts (id),
    user_id bigint not null references users (id),
	created_at timestamp without time zone not null default current_timestamp,
	updated_at timestamp without time zone not null default current_timestamp
);

insert into roles(name, created_at, updated_at) values('ROLE_REGISTERED', current_timestamp, current_timestamp);
insert into roles(name, created_at, updated_at) values('ROLE_AUTHENTICATED', current_timestamp, current_timestamp);
insert into roles(name, created_at, updated_at) values('ROLE_MODERATOR', current_timestamp, current_timestamp);
insert into roles(name, created_at, updated_at) values('ROLE_LEADERSHIP', current_timestamp, current_timestamp);
insert into roles(name, created_at, updated_at) values('ROLE_ADMIN', current_timestamp, current_timestamp);

insert into statuses(name, created_at, updated_at) values('STATUS_DRAFT', current_timestamp, current_timestamp);
insert into statuses(name, created_at, updated_at) values('STATUS_SUBMITTED', current_timestamp, current_timestamp);
insert into statuses(name, created_at, updated_at) values('STATUS_REVIEWED', current_timestamp, current_timestamp);
insert into statuses(name, created_at, updated_at) values('STATUS_IN_PROGRESS', current_timestamp, current_timestamp);
insert into statuses(name, created_at, updated_at) values('STATUS_TESTED', current_timestamp, current_timestamp);
insert into statuses(name, created_at, updated_at) values('STATUS_DEPLOYED', current_timestamp, current_timestamp);
insert into statuses(name, created_at, updated_at) values('STATUS_COMPLETED', current_timestamp, current_timestamp);
insert into statuses(name, created_at, updated_at) values('STATUS_ARCHIVED', current_timestamp, current_timestamp);
