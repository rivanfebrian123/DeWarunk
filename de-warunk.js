/* de-warunk.js
 *
 * Copyright 2021 De Warunk Team <rivanfebrian123@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import input from 'readline-sync'
import clear from 'console-clear'

import {
    Jualan,
    Promo,
    ItemJualan,
    Transaksi
} from './de-warunk-jualan-transaksi.js'

import {
    Sesi,
    Member,
} from './de-warunk-sesi-member.js'

import {
    klaimPromo,
    tampilkanJudul
} from './de-warunk-lintas-bidang.js'

class DWTransaksi {
    sesi
    jualan
    transaksi

    constructor(sesi, jualan) {
        this.sesi = sesi
        this.jualan = jualan
    }

    mulai() {
        if (!this.sesi.valid) {
            if (this.sesi.aktifkanCek("lanjutJikaAda+", "Transaksi baru", null, true)) {
                this.transaksi = new Transaksi(this.jualan, this.sesi)
            }

            clear()
        }

        if (this.sesi.valid) {
            tampilkanJudul(`Kuy sapa si ${this.sesi.member.nama}`, null, "=")
            tampilkanJudul(`${this.transaksi.waktu.toLocaleString("id-ID")}`, null, "=")
            tampilkanJudul("Transaksi baru")
            console.log("1. Tambah item") //TODO tampilkan "(kosong)" jika tiada
            console.log("2. Kurangi item")
            console.log("3. Proses dan cetak transaksi") //TODO hanya izinkan jika ada item
            console.log("4. Klaim promo") //TODO tampilkan "(kosong)" jika tiada
            console.log("X. Batalkan transaksi")

            let menu = input.question("Pilih menu: ")
            clear()

            switch (menu) {
            case "1":
                this.transaksi.tambahItem()
                break
            case "2":
                this.transaksi.kurangiItem()
                break
            case "3":
                this.transaksi.prosesCetak()
                break
            case "4":
                klaimPromo(this.sesi.member, this.jualan)
                break
            case "X":
            case "x":
                this.transaksi.batalkan()
                break
            }

            this.mulai()
        }
    }
}

class DWMember {
    sesi
    jualan

    constructor(sesi, jualan) {
        this.sesi = sesi
        this.jualan = jualan
    }

    mulai() {
        tampilkanJudul("Member")
        console.log("1. Tambah member")
        console.log("2. Edit / hapus member")
        console.log("3. Klaim promo member")
        console.log("4. Lihat riwayat transaksi member") //TODO tampilkan "(kosong)" jika tiada
        console.log("5. Lihat semua daftar member")
        console.log("0. Kembali")

        let menu = input.question("Pilih menu: ")
        clear()

        switch (menu) {
        case "1":
            this.sesi.tambahMember()
            break
        case "2":
            this.editHapusMember()
            break
        case "3":
            if (this.sesi.aktifkanCek("lanjutJikaAda", "Klaim promo")) {
                clear()
                klaimPromo(this.sesi.member, this.jualan)
            } else {
                clear()
            }

            break
        case "4":
            if (this.sesi.aktifkanCek("lanjutJikaAda", "Lihat riwayat transaksi")) {
                clear()
                this.sesi.member.tampilkanRiwayatTransaksi()
            } else {
                clear()
            }

            break
        case "5":
            this.sesi.tampilkanDaftarMember()
            break
        }

        this.sesi.nonaktifkan()

        if (menu != "0") {
            this.mulai()
        }
    }

    editHapusMember() {
        if (!this.sesi.valid) {
            this.sesi.aktifkanCek("lanjutJikaAda", "Edit / hapus member", null, true)
            clear()
        }

        if (this.sesi.valid) {
            tampilkanJudul("Edit / hapus member")
            console.log(`1. Ubah kode member (${this.sesi.member.kode})`)
            console.log(`2. Ubah nama (${this.sesi.member.nama})`)
            console.log(`3. Ubah no. WA (${this.sesi.member.noWA})`)
            console.log(`4. Hapus member (${this.sesi.member.nama} [${this.sesi.member.kode}])`)
            console.log("0. Kembali")

            let menu = input.question("Pilih menu: ")
            console.log("")

            switch (menu) {
            case "1":
                this.sesi.ubahKodeMember(this.sesi.member.kode)
                break
            case "2":
                this.sesi.member.ubahNama()
                break
            case "3":
                this.sesi.member.ubahNoWA()
                break
            case "4":
                this.sesi.hapusMember(this.sesi.member.kode)
                break
            case "0":
                clear()
                break
            }

            if (menu != "0") {
                this.editHapusMember()
            }
        }
    }
}

class DWJualan {
    jualan

    constructor(jualan) {
        this.jualan = jualan
    }

    mulai() {
        tampilkanJudul("Jualan")
        console.log("1. Tambah jualan")
        console.log("2. Edit / hapus jualan")
        console.log("3. Tambah promo")
        console.log("4. Edit / hapus promo")
        console.log("5. Lihat semua daftar jualan")
        console.log("6. Lihat semua daftar promo")
        console.log("0. Kembali")

        let menu = input.question("Pilih menu: ")
        clear()

        switch (menu) {
        case "1":
            tampilkanJudul("Fitur belum tersedia", null, "=")
            console.log("\n")
            break
        case "2":
            tampilkanJudul("Fitur belum tersedia", null, "=")
            console.log("\n")
            break
        case "3":
            tampilkanJudul("Fitur belum tersedia", null, "=")
            console.log("\n")
            break
        case "4":
            tampilkanJudul("Fitur belum tersedia", null, "=")
            console.log("\n")
            break
        case "5":
            this.jualan.tampilkanDaftarJualan()
            break
        case "6":
            this.jualan.tampilkanDaftarPromo()
            break
        }

        if (menu != "0") {
            this.mulai()
        }
    }
}

class DeWarunk {
    dwTransaksi
    dwMember
    dwJualan

    jualan
    sesi

    constructor() {
        this.sesi = new Sesi()
        this.sesi.daftarMember["RV"] = new Member("RV", "Rivan", "087767777733", 70)
        this.sesi.daftarMember["RV"].daftarPromoDiklaim["MW"] = new Promo("MW", 120, "Mouse Wireless", new Date(2021, 4, 20))

        this.jualan = new Jualan()
        this.jualan.daftarJualan["KJ"] = new ItemJualan(
            "KJ", "Kopi Jahe", 50000, 2, 4000, 10)
        this.jualan.daftarJualan["SB"] = new ItemJualan(
            "SB", "Kopi Starbak", 70000, 2, 30000, 5)
        this.jualan.daftarJualan["WJ"] = new ItemJualan(
            "WJ", "Wedang Jahe", 30000, 2, 2000, 0)
        this.jualan.daftarJualan["SJ"] = new ItemJualan(
            "SJ", "Susu Jahe", 40000, 2, 5000, 0)
        this.jualan.daftarJualan["WB"] = new ItemJualan(
            "WB", "Wedang Bajigur", 35000, 3, 5000, 10)
        this.jualan.daftarJualan["MS"] = new ItemJualan(
            "MS", "Milkshake", 40000, 3, 10000, 10)

        this.jualan.daftarPromo["HB"] = new Promo("HB", 300, "Headset Bluetooth", new Date(2021, 5, 20))
        this.jualan.daftarPromo["PL"] = new Promo("PL", 50, "Payung Lipat", new Date(2021, 4, 5))
        this.jualan.daftarPromo["LS"] = new Promo("LS", 1000, "Laptop Spek Tinggi", new Date(2021, 5, 17), "Ajak temen2mu mampir ke sini, minimal 5 orang")

        this.dwTransaksi = new DWTransaksi(this.sesi, this.jualan)
        this.dwMember = new DWMember(this.sesi, this.jualan)
        this.dwJualan = new DWJualan(this.jualan)
    }

    mulai() {
        tampilkanJudul("DeWarunk - Kafe Gen-Z")
        console.log("1. Transaksi")
        console.log("2. Member")
        console.log("3. Jualan")
        console.log("0. Keluar")

        let menu = input.question("Pilih menu: ")
        clear()
        this.sesi.nonaktifkan()

        switch (menu) {
        case "1":
            this.dwTransaksi.mulai()
            break
        case "2":
            this.dwMember.mulai()
            break
        case "3":
            this.dwJualan.mulai()
            break
        }

        if (menu != "0") {
            this.mulai()
        }
    }
}

tampilkanJudul("Memulai DeWarunk...")
const apl = new DeWarunk()
clear()
apl.mulai()
