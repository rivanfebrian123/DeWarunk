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
    klaimPromo
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
            if (this.sesi.aktifkanCek("lanjutJikaAda+", "Transaksi baru")) {
                this.transaksi = new Transaksi(this.jualan, this.sesi)
            }

            clear()
        }

        if (this.sesi.valid) {
            console.log(`==Kuy sapa si ${this.sesi.member.nama}!==`)
            console.log(`==${this.transaksi.waktu.toLocaleString("id-ID")}==`)
            console.log("=====================")
            console.log("Transaksi baru")
            console.log("=====================")
            console.log("1. Tambah item")
            console.log("2. Kurangi item")
            console.log("3. Proses dan cetak transaksi") //TODO hanya izinkan jika ada item
            console.log("4. Klaim promo")
            console.log("X. Batalkan transaksi")

            let menu = input.question("Pilih menu: ")
            let jadiBatalkan = false
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
                jadiBatalkan = this.transaksi.batalkan()
                break
            }

            if (!jadiBatalkan) {
                this.mulai()
            }
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
        console.log("===================")
        console.log("Member")
        console.log("===================")
        console.log("1. Tambah member")
        console.log("2. Edit / hapus member")
        console.log("3. Klaim promo member")
        console.log("4. Cek riwayat transaksi member")
        console.log("5. Lihat semua daftar member")
        console.log("0. Kembali")

        let menu = input.question("Pilih menu: ")
        clear()

        switch (menu) {
        case "1":
            this.sesi.tambahMember()
            break
        case "2":
            this.sesi.nonaktifkan()
            this.editHapusMember()
            break
        case "3":
            if (this.sesi.aktifkanCek("lanjutJikaAda", "Klaim promo")) {
                clear()
                klaimPromo(this.sesi.member, this.jualan)
            }

            this.sesi.nonaktifkan()
            break
        case "4":
            console.log("====Fitur belum tersedia=====\n\n")
            break
        case "5":
            console.log("====Fitur belum tersedia=====\n\n")
            break
        }

        if (menu != "0") {
            this.mulai()
        }
    }

    editHapusMember() {
        if (!this.sesi.valid) {
            this.sesi.aktifkanCek("lanjutJikaAda", "Edit / hapus member")
            clear()
        }

        if (this.sesi.valid) {
            console.log("=====================")
            console.log("Edit / hapus member")
            console.log("=====================")
            console.log(`1. Ubah kode member (${this.sesi.member.kode})`)
            console.log(`2. Ubah nama (${this.sesi.member.nama})`)
            console.log(`3. Ubah no. WA (${this.sesi.member.noWA})`)
            console.log(`4. Hapus member (${this.sesi.member.nama} [${this.sesi.member.kode}])`)
            console.log("0. Kembali")

            let notif = ""
            let menu = input.question("Pilih menu: ")
            console.log("")

            switch (menu) {
            case "1":
                this.sesi.ubahKodeMember()
                break
            case "2":
                this.sesi.ubahNamaMember()
                break
            case "3":
                this.sesi.ubahNoWAMember()
                break
            case "4":
                this.sesi.hapusMember()
                break
            case "0":
                this.sesi.nonaktifkan()
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
        console.log("=====================")
        console.log("Jualan")
        console.log("=====================")
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
            console.log("====Fitur belum tersedia=====\n\n")
            break
        case "2":
            console.log("====Fitur belum tersedia=====\n\n")
            break
        case "3":
            console.log("====Fitur belum tersedia=====\n\n")
            break
        case "4":
            console.log("====Fitur belum tersedia=====\n\n")
            break
        case "5":
            console.log("====Fitur belum tersedia=====\n\n")
            break
        case "6":
            console.log("====Fitur belum tersedia=====\n\n")
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

    daftarMember = []
    jualan
    sesi

    constructor() {
        this.daftarMember["RV"] = new Member("RV", "Rivan", "087767777733", 60)
        this.daftarMember["RV"].daftarPromoDiklaim["MW"] = new Promo("MW", 120, "Mouse Wireless", new Date(2021, 4, 20))

        this.sesi = new Sesi(this.daftarMember)
        this.sesi.nonaktifkan()

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
        console.log("=====================")
        console.log("DeWarunk - Kafe Gen-Z")
        console.log("=====================")
        console.log("1. Transaksi")
        console.log("2. Member")
        console.log("3. Jualan")
        console.log("0. Keluar")

        let menu = input.question("Pilih menu: ")
        clear()

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

console.log("\n\nMemulai DeWarunk...")
const apl = new DeWarunk()
clear()
apl.mulai()
