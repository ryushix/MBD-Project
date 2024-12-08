create database pendonasian;

use pendonasian;

create user 'admin_pendonasian'@'localhost' identified by 'admin123';
grant execute on `pendonasian`.* to 'admin_pendonasian'@'localhost';
flush privileges;

create or replace table users (
	user_id int primary key auto_increment,
	nama varchar(100) not null,
	email varchar(100) not null unique,
	kata_sandi varchar(255) not null,
	informasi_pribadi text not null,
	role enum('admin', 'donatur', 'penerima_manfaat') not null
);

create or replace table total_donasi_donatur (
    donatur_id int primary key,
    total_donasi decimal(10, 2) not null default 0,
    foreign key (donatur_id) references users(user_id)
);

create or replace table program_donasi (
	program_id int primary key auto_increment,
	penerima_id int not null,
	nama_program varchar(150) not null,
	deskripsi_program text null,
	tanggal_mulai date not null,
	tanggal_berakhir date null,
	total_donasi_program decimal(10,
2) default 0,
	foreign key (penerima_id) references users(user_id)
);

create or replace table donasi (
	donasi_id int primary key auto_increment,
	donatur_id int not null,
	program_id int not null,
	jumlah_donasi decimal(10,
2) not null check (jumlah_donasi > 0),
	tanggal_donasi datetime not null default now(),
	status enum('success',
'refund') not null default 'success',
	foreign key (donatur_id) references users(user_id),
	foreign key (program_id) references program_donasi(program_id)
);

create or replace table permintaan_bantuan (
	permintaan_id int primary key auto_increment,
	penerima_id int not null,
	keluhan text not null,
	tanggal_permohonan datetime not null default now(),
	status_permohonan enum('pending',
'approved',
'rejected') not null
	default 'pending',
	foreign key (penerima_id) references users(user_id)
);

-- User Mendaftar Akun dan Melakukan Login
create or replace procedure registerUser (
    in p_nama varchar(100),
    in p_email varchar(100),
    in p_kata_sandi varchar(255),
    in p_informasi_pribadi text,
    in p_role enum('admin', 'donatur', 'penerima_manfaat')
)
begin
    declare admin_count int;
    declare email_exists int;

    start transaction;

    if p_role = 'admin' then
        select count(*) into admin_count
        from users
        where role = 'admin';

        if admin_count > 0 then
            rollback;
            signal sqlstate '45000'
                set message_text = 'Hanya boleh ada satu admin dalam sistem.';
        end if;
    end if;

    select count(*) into email_exists
    from users
    where email = p_email;

    if email_exists > 0 then
        rollback;
        signal sqlstate '45000'
            set message_text = 'Email sudah digunakan oleh pengguna lain.';
    end if;

    set p_kata_sandi = sha2(p_kata_sandi, 256);

    insert into users (nama, email, kata_sandi, informasi_pribadi, role)
    values (p_nama, p_email, p_kata_sandi, p_informasi_pribadi, p_role);

    commit;

    select 'Registrasi berhasil, silakan login.' as message;
end;

create or replace procedure loginUser (
    in p_email varchar(100),
    in p_kata_sandi varchar(255)
)
begin
    declare hashed_password varchar(255);
    declare user_exists int;

    start transaction;

    select count(*)
    into user_exists
    from users
    where email = p_email;

    if user_exists = 0 then
        rollback;
        signal sqlstate '45000'
            set message_text = 'Email tidak terdaftar.';
    end if;

    select kata_sandi
    into hashed_password
    from users
    where email = p_email;

    if hashed_password != sha2(p_kata_sandi, 256) then
        rollback;
        signal sqlstate '45000'
            set message_text = 'Kata sandi salah.';
    end if;

    commit;

    select nama, email, role, 'Login berhasil.' as message
    from users
    where email = p_email;
end;

-- User Authorization
create or replace procedure getUserRole(in p_email varchar(100))
begin
    select role
    from users
    where email = p_email;
end;


-- User Get Personal Data
create or replace view v_personal_data as
select 
    user_id, 
    nama, 
    email,
    informasi_pribadi, 
    role
from users;

create or replace procedure getPersonalData(
    in p_email varchar(100)
)
begin
    declare exit handler for sqlexception
    begin
        signal sqlstate '45000'
        set message_text = 'Terjadi kesalahan saat mengambil data pengguna.';
    end;

    start transaction;
   
    select *
    from v_personal_data
    where email = p_email;
   
    commit;
end;

-- Admin Mengelola Users
create or replace view v_users as
select user_id, nama, informasi_pribadi
from users;

create or replace procedure getUsers()
begin
    declare exit handler for sqlexception
        begin
            rollback;
            signal sqlstate '45000' set message_text = 'Terjadi kesalahan saat mengambil data pengguna';
        end;
       
    start transaction;
   
    select * from v_users;
   
    commit;
end;

create or replace procedure searchUsersByName(in p_nama varchar(100))
begin
    declare exit handler for sqlexception
        begin
            rollback;
            signal sqlstate '45000' set message_text = 'Terjadi kesalahan saat mencari pengguna berdasarkan nama';
        end;

    start transaction;

    select user_id, nama, informasi_pribadi from users
    where nama like concat('%', p_nama, '%');

    commit;
end;

create or replace procedure editUser(
    in p_user_id int, 
    in p_nama varchar(100), 
    in p_informasi_pribadi text)
begin
    declare exit handler for sqlexception
        begin
            rollback;
            signal sqlstate '45000' set message_text = 'Terjadi kesalahan saat mengedit data pengguna';
        end;

    start transaction;

    update users
    set nama = p_nama, informasi_pribadi = p_informasi_pribadi
    where user_id = p_user_id;

    commit;
end;

create or replace procedure deleteUser(in p_user_id int)
begin
    declare exit handler for sqlexception
        begin
            rollback;
            signal sqlstate '45000' set message_text = 'Terjadi kesalahan saat menghapus data pengguna';
        end;

    start transaction;

    delete from users
    where user_id = p_user_id;

    commit;
end;


-- Penerima Manfaat mengajukan permintaan bantuan
create or replace procedure requestAssistance(
    in p_penerima_id int,
    in p_keluhan text
)
begin
    declare exit handler for sqlexception
    begin
        rollback;
        signal sqlstate '45000'
        set message_text = 'Terjadi kesalahan saat memproses permintaan bantuan.';
    end;

    start transaction;

    insert into permintaan_bantuan (penerima_id, keluhan)
    values (p_penerima_id, p_keluhan);

    commit;
end;


-- Penerima manfaat melihat status permintan bantuan
create or replace view v_status_permohonan as
select 
    pb.permintaan_id,
    u.email,
    pb.keluhan,
    pb.tanggal_permohonan,
    pb.status_permohonan
from
    permintaan_bantuan pb
join 
    users u
on 
    pb.penerima_id = u.user_id;

create or replace procedure getRequestStatus (
    in p_email varchar(100)
)
begin
    declare exit HANDLER for sqlexception
    begin
        rollback;
        signal sqlstate '45000'
            set message_text = 'Terjadi kesalahan yang tidak terduga.';
    end;

    start transaction;

    select 
        keluhan, 
        tanggal_permohonan, 
        status_permohonan
    from 
        v_status_permohonan
    where 
        email = p_email;

    commit;
end;
   
   
-- Admin Mengelola Permintaan Bantuan
create or replace view v_permohonan_bantuan as
select 
    pb.permintaan_id,
    u.user_id,
    u.nama,
    pb.keluhan,
    pb.tanggal_permohonan,
    pb.status_permohonan
from 
    permintaan_bantuan pb
join 
    users u
on 
    pb.penerima_id = u.user_id;

create or replace procedure getAllRequests()
begin
    declare exit HANDLER for sqlexception
    begin
        rollback;
        signal sqlstate '45000'
            set message_text = 'Terjadi kesalahan yang tidak terduga.';
    end;

    start transaction;

    select 
        *
    from
        v_permohonan_bantuan;

    commit;
end;

create or replace procedure updateRequestStatus(
    in p_permintaan_id int, 
    in p_status_permohonan enum('pending', 'approved', 'rejected')
)
begin
    declare exit HANDLER for sqlexception
    begin
        rollback;
        signal sqlstate '45000'
            set message_text = 'Terjadi kesalahan yang tidak terduga.';
    end;

    start transaction;

    update permintaan_bantuan
    set status_permohonan = p_status_permohonan
    where permintaan_id = p_permintaan_id;

    commit;
end;


-- Admin Mengelola Program Donasi
create or replace procedure addDonationProgram(
    in p_penerima_id int, 
    in p_nama_program varchar(150), 
    in p_deskripsi_program text, 
    in p_tanggal_mulai date, 
    in p_tanggal_berakhir date
)
begin
    declare exit HANDLER for sqlexception
    begin
        rollback;
        signal sqlstate '45000'
            set message_text = 'Terjadi kesalahan yang tidak terduga.';
    end;

    start transaction;

    insert into program_donasi (penerima_id, nama_program, deskripsi_program, tanggal_mulai, tanggal_berakhir)
    values (p_penerima_id, p_nama_program, p_deskripsi_program, p_tanggal_mulai, p_tanggal_berakhir);

    commit;
end;

create or replace view v_program_donasi as
select 
    pd.program_id,
    u.user_id as penerima_id,
    pd.nama_program,
    pd.deskripsi_program,
    pd.tanggal_mulai,
    pd.tanggal_berakhir,
    pd.total_donasi_program
from 
    program_donasi pd
join 
    users u
on 
    pd.penerima_id = u.user_id;

-- Admin, Donatur, dan Penerima Manfaat dapat melihat program Donasi
create or replace procedure getDonationPrograms()
begin
    declare exit HANDLER for sqlexception
    begin
        rollback;
        signal sqlstate '45000'
            set message_text = 'Terjadi kesalahan saat mengambil data program donasi.';
    end;

    start transaction;

    select 
   		* 
   	from v_program_donasi;

    commit;
end;   

   
-- Donatur Melihat Informasi Penerima Manfaat
create or replace view v_penerima_manfaat as
select 
    user_id, 
    nama, 
    email, 
    informasi_pribadi
from 
    users
where role = "penerima_manfaat";

create or replace procedure getRecipientInfo(
    in p_penerima_id int
)
begin
    declare exit HANDLER for sqlexception
    begin
        rollback;
        signal sqlstate '45000'
            set message_text = 'Terjadi kesalahan saat mengambil data penerima manfaat.';
    end;

    start transaction;

    select
    	*
    from
        v_penerima_manfaat
    where 
        user_id = p_penerima_id;

    commit;
end;


-- Donatur melakukan Donasi
create or replace procedure donate(
    in p_donatur_id int,
    in p_program_id int,
    in p_jumlah_donasi decimal(10, 2)
)
begin
    declare exit HANDLER for sqlexception
    begin
        rollback;
        signal sqlstate '45000' 
        set message_text = 'Terjadi kesalahan saat menyimpan donasi.';
    end;

    start transaction;

    if (select role from users where user_id = p_donatur_id) != 'donatur' then
        signal sqlstate '45000'
        set message_text = 'Hanya donatur yang dapat melakukan donasi.';
    end if;

    insert into donasi (donatur_id, program_id, jumlah_donasi)
    values (p_donatur_id, p_program_id, p_jumlah_donasi);

    commit;
end;

create trigger update_total_donasi_donatur
after insert on donasi
for each row
begin
    insert into total_donasi_donatur (donatur_id, total_donasi)
    values (new.donatur_id, new.jumlah_donasi)
    on duplicate key update total_donasi = total_donasi + new.jumlah_donasi;
end;

create trigger update_total_donasi_program
after insert on donasi
for each row
begin
    update program_donasi
    set total_donasi_program = total_donasi_program + new.jumlah_donasi
    where program_id = new.program_id;
end;


-- Users dapat Melihat Total Donasi Program
create or replace function TotalDonasiProgram(programId int)
returns decimal(10, 2)
deterministic
begin
    declare totalDonasi decimal(10, 2);

    select coalesce(sum(jumlah_donasi), 0)
    into totalDonasi
    from donasi
    where program_id = programId and status = 'success';

    return totalDonasi;
end;

create or replace view v_total_donation_program as
select 
    pd.program_id,
    pd.nama_program,
    TotalDonasi(pd.program_id) as total_donasi
from 
    program_donasi pd;

create or replace procedure getTotalDonationProgram(in input_program_id int)
begin
    declare exit HANDLER for sqlexception
    begin
        rollback;
        signal sqlstate '45000'
        set message_text = 'Terjadi kesalahan saat mengambil data program donasi.';
    end;

    start transaction;

    select * 
    from v_total_donation_program
    where program_id = input_program_id;

    commit;
end;


-- Admin Mengelola Donasi
create or replace view v_donasi as
select 
    donasi_id,
    jumlah_donasi,
    status
from 
    donasi;

create or replace procedure getDonation()
begin
    declare exit HANDLER for sqlexception 
    begin
        rollback;
        signal sqlstate '45000' SET message_text = 'Terjadi kesalahan saat mengambil data donasi.';
    end;

    start transaction;

    select * 
    from v_donasi;

    commit;
end;

create or replace procedure updateDonationStatus(
    in p_donasi_id int,
    in p_status enum('success', 'refund')
)
begin
    declare exit HANDLER for sqlexception
    begin
        rollback;
        signal sqlstate '45000'
        set message_text = 'Terjadi kesalahan saat mengubah status donasi.';
    end;

    start transaction;

    if not exists (select 1 from donasi where donasi_id = p_donasi_id) then
        signal sqlstate '45000'
        set message_text = 'Donasi tidak ditemukan.';
    end if;

    update donasi
    set status = p_status
    where donasi_id = p_donasi_id;

    commit;
end;

create or replace trigger kurangi_total_donasi_donatur
after update on donasi
for each row
begin
    if new.status = 'refund' and old.status != 'refund' then
        update total_donasi_donatur
        set total_donasi = total_donasi - old.jumlah_donasi
        where donatur_id = old.donatur_id;
    end if;
end;

create or replace trigger kurangi_total_donasi_program
after update on donasi
for each row
begin
    if new.status = 'refund' and old.status != 'refund' then
        update program_donasi
        set total_donasi_program = total_donasi_program - old.jumlah_donasi
        where program_id = old.program_id;
    end if;
end;


-- Donatur dapat melihat Riwayat Donasi dan Total Donasi
create or replace procedure getDonationHistory(in donatur_email varchar(100))
begin
    declare donatur_id int;

    declare exit HANDLER for sqlexception
    begin
        rollback;
        signal sqlstate '45000'
        set message_text = 'Terjadi kesalahan saat mengambil riwayat donasi.';
    end;

    start transaction;

    select user_id
    into donatur_id
    from users
    where email = donatur_email and role = 'donatur';

    if donatur_id is null then
        signal sqlstate '45000'
        set message_text = 'Donatur tidak ditemukan.';
    end if;

    select 
        d.donasi_id,
        d.program_id,
        p.nama_program,
        d.jumlah_donasi,
        d.tanggal_donasi,
        d.status
    from donasi d
    join program_donasi p on d.program_id = p.program_id
    where d.donatur_id = donatur_id
    order by d.tanggal_donasi desc;

    commit;
end;

create or replace function TotalDonasiDonatur(donatur int)
returns decimal(10, 2)
deterministic
begin
    declare total decimal(10, 2);

    select coalesce(sum(jumlah_donasi), 0)
    into total
    from donasi
    where donatur_id = donatur and status = 'success';

    return total;
end;

create or replace view v_total_donation_donatur as
select
    u.user_id as donatur_id,
    u.nama,
    u.email,
    TotalDonasiDonatur(u.user_id) as total_donasi
from 
    users u
where 
    u.role = 'donatur'; 
   
create or replace procedure getTotalDonationDonatur(in donatur_email varchar(100))
begin
    declare exit HANDLER for sqlexception
    begin
        rollback;
        signal sqlstate '45000'
        set message_text = 'Terjadi kesalahan saat mengambil total donasi donatur.';
    end;

    start transaction;

    select nama, total_donasi
    from v_total_donation_donatur
    where email = donatur_email;

    commit;
end;
