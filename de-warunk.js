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
import clear from 'console-clear'

import {
    Transaksi
} from './transaksi.js'

import {
    Manajemen
} from './manajemen.js'

import {
    Member,
    Jualan,
    Promo
} from './manajemen-data.js'

import {
    tampilkanJudul,
    tanya
} from './utilitas.js'

class DWTransaksi {
    // "sesi" di sini adalah sesi member
    manajemen
    sesi
    transaksi

    constructor(manajemen) {
        this.manajemen = manajemen
        this.sesi = manajemen.sesiMember
    }

    mulai() {
        if (!this.sesi.valid) {
            if (this.sesi.aktifkanCek("lanjutJikaAda+", "Transaksi baru", null, true)) {
                this.transaksi = new Transaksi(this.manajemen)
            }

            clear()
        }

        if (this.sesi.valid) {
            tampilkanJudul(`Kuy sapa si ${this.sesi.item.nama}`, "kepala", null, "=")
            tampilkanJudul(`${this.transaksi.waktu.toLocaleString("id-ID")}`, "kepala", null, "=")
            tampilkanJudul("Transaksi baru")
            console.log("1. Tambah item ➕️")
            console.log("2. Kurangi item ➖️")
            console.log("3. Proses dan cetak transaksi ✅️")
            console.log("4. Klaim promo 🎁️")
            console.log("5. Lihat riwayat transaksi 📑️")
            console.log("X. Batalkan transaksi ❌️")

            let menu = tanya("👆️ Pilih menu: ")
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
                this.manajemen.klaimPromo()
                break
            case "5":
                this.sesi.item.tampilkanRiwayatTransaksi()
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
    // "sesi" di sini adalah sesi member
    manajemen
    sesi

    constructor(manajemen) {
        this.manajemen = manajemen
        this.sesi = manajemen.sesiMember
    }

    mulai() {
        tampilkanJudul("Member")
        console.log("1. Tambah member ➕️")
        console.log("2. Edit / hapus member ✏️")
        console.log("3. Klaim promo member 🎁️")
        console.log("4. Lihat riwayat transaksi member 📑️")
        console.log("5. Lihat semua daftar member 📑️")
        console.log("0. Kembali 🔙️")

        let menu = tanya("👆️ Pilih menu: ")
        clear()

        switch (menu) {
        case "1":
            this.sesi.tambahItem()
            break
        case "2":
            this.editHapusMember()
            break
        case "3":
            if (this.sesi.aktifkanCek("lanjutJikaAda", "Klaim promo")) {
                clear()
                this.manajemen.klaimPromo()
            } else {
                clear()
            }

            break
        case "4":
            if (this.sesi.aktifkanCek("lanjutJikaAda", "Lihat riwayat transaksi")) {
                clear()
                this.sesi.item.tampilkanRiwayatTransaksi()
            } else {
                clear()
            }

            break
        case "5":
            this.sesi.tampilkanDaftarItem()
            break
        }

        this.manajemen.nonaktifkanSemuaSesi()

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
            let member = this.sesi.item

            tampilkanJudul("Edit / hapus member")
            console.log(`1. Ubah kode member (${member.kode}) 🔶️`)
            console.log(`2. Ubah nama (${member.nama}) 🖐️`)
            console.log(`3. Ubah no. WA (${member.noWA}) 📲️`)
            console.log(`4. Hapus member (${member.nama} [${member.kode}]) ❌️`)
            console.log("0. Kembali 🔙️")

            let menu = tanya("👆️ Pilih menu: ")
            console.log("")

            switch (menu) {
            case "1":
                this.sesi.ubahKodeItem(member.kode)
                break
            case "2":
                member.nama = this.sesi.tanyaDataItem("nama", "Nama member", member.nama)
                break
            case "3":
                member.noWA = this.sesi.tanyaDataItem("noWA", "No. WA member", member.noWA)
                break
            case "4":
                this.sesi.hapusItem(member.kode)
                break
            default:
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
    manajemen
    sesiJualan
    sesiPromo

    constructor(manajemen) {
        this.manajemen = manajemen
        this.sesiJualan = manajemen.sesiJualan
        this.sesiPromo = manajemen.sesiPromo
    }

    mulai() {
        tampilkanJudul("Jualan")
        console.log("1. Tambah jualan ➕️")
        console.log("2. Tambah promo ➕️")
        console.log("3. Edit / hapus jualan ✏️")
        console.log("4. Edit / hapus promo ✏️")
        console.log("5. Lihat semua daftar jualan 📑️")
        console.log("6. Lihat semua daftar promo 📑️")
        console.log("0. Kembali 🔙️")

        let menu = tanya("👆️ Pilih menu: ")
        clear()

        switch (menu) {
        case "1":
            this.sesiJualan.tambahItem()
            break
        case "2":
            this.sesiPromo.tambahItem()
            break
        case "3":
            this.editHapusJualan()
            break
        case "4":
            this.editHapusPromo()
            break
        case "5":
            this.sesiJualan.tampilkanDaftarItem()
            break
        case "6":
            this.sesiPromo.tampilkanDaftarItem()
            break
        }

        this.manajemen.nonaktifkanSemuaSesi()

        if (menu != "0") {
            this.mulai()
        }
    }

    editHapusJualan() {
        if (!this.sesiJualan.valid) {
            this.sesiJualan.aktifkanCek("lanjutJikaAda", "Edit / hapus jualan", null, true)
            clear()
        }

        if (this.sesiJualan.valid) {
            let jualan = this.sesiJualan.item

            tampilkanJudul("Edit / hapus jualan")
            console.log(`1. Ubah kode jualan (${jualan.kode}) 🔶️`)
            console.log(`2. Ubah nama jualan (${jualan.nama}) 🍉️`)
            console.log(`3. Ubah biaya produksi (Rp. ${jualan.biayaProduksi} / hari) 💰️`)
            console.log(`4. Ubah lama produksi (${jualan.lamaProduksi} jam/hari) ⏲️`)
            console.log(`5. Ubah harga jual (Rp. ${jualan.hargaJual}) 💸️`)
            console.log(`6. Ubah persen diskon (${jualan.persenDiskon}% [Rp.${jualan.hargaJual * jualan.persenDiskon / 100}]) 💵️`)
            console.log(`7. Hapus jualan (${jualan.nama} [${jualan.kode}]) ❌️`)
            console.log("0. Kembali 🔙️")

            let menu = tanya("👆️ Pilih menu: ")
            console.log("")

            switch (menu) {
            case "1":
                this.sesiJualan.ubahKodeItem(jualan.kode)
                break
            case "2":
                jualan.nama = this.sesiJualan.tanyaDataItem("nama", "Nama jualan", jualan.nama)
                break
            case "3":
                jualan.biayaProduksi = this.sesiJualan.tanyaDataItem("biayaProduksi", "Biaya produksi", jualan.biayaProduksi)
                break
            case "4":
                jualan.lamaProduksi = this.sesiJualan.tanyaDataItem("lamaProduksi", "Lama produksi", jualan.lamaProduksi)
                break
            case "5":
                jualan.hargaJual = this.sesiJualan.tanyaDataItem("hargaJual", "Harga jual", jualan.hargaJual)
                break
            case "6":
                jualan.persenDiskon = this.sesiJualan.tanyaDataItem("persenDiskon", "Persen diskon", jualan.persenDiskon)
                break
            case "7":
                this.sesiJualan.hapusItem(jualan.kode)
                break
            default:
                clear()
                break
            }

            if (menu != "0") {
                this.editHapusJualan()
            }
        }
    }

    editHapusPromo() {
        if (!this.sesiPromo.valid) {
            this.sesiPromo.aktifkanCek("lanjutJikaAda", "Edit / hapus promo", null, true)
            clear()
        }

        if (this.sesiPromo.valid) {
            let promo = this.sesiPromo.item

            tampilkanJudul("Edit / hapus promo")
            console.log(`1. Ubah kode promo (${promo.kode}) 🔶️`)
            console.log(`2. Ubah nama promo (${promo.nama}) 🎁️`)
            console.log(`3. Ubah poin diharapkan (${promo.poinDiharapkan} poin) 💯️`)
            console.log(`4. Ubah batas akhir (${promo.batasAkhir.toLocaleString()}) 📅️`)
            console.log(`5. Ubah syarat tambahan 👉️📑️`)
            console.log(`   (${promo.syaratTambahan})`)
            console.log(`6. Hapus promo (${promo.nama} [${promo.kode}]) ❌️`)
            console.log("0. Kembali 🔙️")

            let menu = tanya("👆️ Pilih menu: ")
            console.log("")

            switch (menu) {
            case "1":
                this.sesiPromo.ubahKodeItem(promo.kode)
                break
            case "2":
                promo.nama = this.sesiPromo.tanyaDataItem("nama", "Nama promo / hadiah", promo.nama)
                break
            case "3":
                promo.poinDiharapkan = this.sesiPromo.tanyaDataItem("poinDiharapkan", "Poin diharapkan", promo.poinDiharapkan)
                break
            case "4":
                promo.batasAkhir = this.sesiPromo.tanyaDataItem("batasAkhir", "Batas akhir", promo.batasAkhir)
                break
            case "5":
                let jawaban = this.sesiPromo.tanyaDataItem("syaratTambahan", "Syarat tambahan", promo.syaratTambahan)

                if (jawaban == "-") {
                    promo.syaratTambahan = null
                } else {
                    promo.syaratTambahan = jawaban
                }

                break
            case "6":
                this.sesiPromo.hapusItem(promo.kode)
                break
            default:
                clear()
                break
            }

            if (menu != "0") {
                this.editHapusPromo()
            }
        }
    }
}

class DeWarunk {
    dwTransaksi
    dwMember
    dwJualan
    manajemen

    constructor() {
        this.manajemen = new Manajemen()

        let daftarMember = this.manajemen.sesiMember.daftarItem
        daftarMember["RV"] = new Member(["RV", "Rivan", "087767777733"])
        daftarMember["RV"].daftarPromoDiklaim["MW"] = new Promo(["MW", "Mouse Wireless", 120, "2021/4/20", ""])

        let daftarJualan = this.manajemen.sesiJualan.daftarItem
        daftarJualan["KJ"] = new Jualan(
            ["KJ", "Kopi Jahe", 50000, 2, 4000, 10])
        daftarJualan["SB"] = new Jualan(
            ["SB", "Kopi Starbak", 70000, 2, 30000, 5])
        daftarJualan["WJ"] = new Jualan(
            ["WJ", "Wedang Jahe", 30000, 2, 2000, 0])
        daftarJualan["SJ"] = new Jualan(
            ["SJ", "Susu Jahe", 40000, 2, 5000, 0])
        daftarJualan["WB"] = new Jualan(
            ["WB", "Wedang Bajigur", 35000, 3, 5000, 10])
        daftarJualan["MS"] = new Jualan(
            ["MS", "Milkshake", 40000, 3, 10000, 10])

        let daftarPromo = this.manajemen.sesiPromo.daftarItem
        daftarPromo["HB"] = new Promo(["HB", "Headset Bluetooth", 300, "2021/5/20", ""])
        daftarPromo["PL"] = new Promo(["PL", "Payung Lipat", 50, "2021/4/5", ""])
        daftarPromo["LS"] = new Promo(["LS", "Laptop Spek Tinggi", 1000, "2021/5/17", "Ajak temen2mu mampir ke sini, minimal 5 orang"])

        this.dwTransaksi = new DWTransaksi(this.manajemen)
        this.dwMember = new DWMember(this.manajemen)
        this.dwJualan = new DWJualan(this.manajemen)
    }

    mulai() {
        tampilkanJudul("DeWarunk - Kafe Gen-Z")
        console.log("1. Transaksi 💸️")
        console.log("2. Member 👋️")
        console.log("3. Jualan 🥤️")
        console.log("0. Keluar ❌️")

        let menu = tanya("👆️ Pilih menu: ")
        this.manajemen.nonaktifkanSemuaSesi()
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

tampilkanJudul("Memulai DeWarunk...🍊️🍭️☕️")
const apl = new DeWarunk()
clear()
apl.mulai()