/* transaksi.js
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

/**
 * Modul tentang transaksi, digunakan untuk mengatur transaksi dan menambah
 * hasil proses transaksi ke riwayatTransaksi suatu item Member
 *
 * @module de-warunk/transaksi
 */

import clear from 'console-clear'

import {
    tampilkanJudul,
    konfirmasi,
    tanya,
    jeda
} from './utilitas.js'

/** Kelas untuk menyimpan data item transaksi */
export class ItemTransaksi {
    itemJualan
    banyak
    totalDiskon
    totalHarga

    /**
     * Membuat instansi ItemTransaksi
     *
     * @param {Jualan} itemJualan - Instansi Jualan atau kloningannya
     * @param {integer} banyak - Banyak item pembelian
     * @param {integer} totalDiskon - Total diskon, hasil perhitungan dari harga
     *     item/instansi Jualan
     * @param {integer} totalHarga - Total harga, hasil perhitungan dari total
     *     diskon dan harga item Jualan
     */
    constructor(itemJualan, banyak, totalDiskon, totalHarga) {
        this.itemJualan = itemJualan
        this.banyak = banyak
        this.totalDiskon = totalDiskon
        this.totalHarga = totalHarga
    }
}

/**
 * Kelas untuk menyimpan data transaksi (ke riwayatTransaksi di suatu instansi
 * Member) dan mengolah transaksi itu sendiri
 */
export class Transaksi {
    // "item" di sini adalah ItemTransaksi, sedangkan "itemJualan"
    // adalah item dari daftarJualan dari sesi Jualan, tentunya
    sesiJualan
    sesiMember
    waktu
    daftarItem = []
    totalBelanja
    totalPoin

    /** Membuat instansi Transaksi
     *
     * @param {Manajemen} manajemen - Instansi Manajemen
     */
    constructor(manajemen) {
        this.sesiJualan = manajemen.sesiJualan
        this.sesiMember = manajemen.sesiMember
        this.waktu = new Date()
        this.totalBelanja = 0
        this.totalPoin = 0
    }

    /**
     * Menghitung total diskon dan total harga, dan juga menampilkan teks hasilnya
     *
     * @param {Jualan} itemJualan - Instansi Jualan atau kloningannya
     * @param {integer} banyak - Banyak item pembelian
     * @param {integer} i=0 - Indeks/penomoran. Pilihan:<br>
     *     -1, jangan tampilkan info<br>
     *     0, tampilkan info tanpa penomoran<br>
     *     >0, tampilkan info dengan penomoran
     * @return {int[]} - Total diskon dan total harga
     */
    hitungTotalDiskonHarga(itemJualan, banyak, i = 0) {
        if (!this.sesiMember.valid) {
            throw new Error("sesiMember harus aktif/valid")
        }

        let totalDiskon = itemJualan.hargaJual * itemJualan.persenDiskon / 100
        let totalHarga = (itemJualan.hargaJual - totalDiskon) * banyak

        if (i != -1) {
            let notif = `${itemJualan.nama}`

            if (i >= 1) {
                notif = `${i}. ` + notif

                if (notif.length < 8) {
                    notif += "\t\t"
                } else if (notif.length < 16) {
                    notif += "\t"
                }
            }

            notif += `\tRp.${itemJualan.hargaJual} (diskon Rp.${totalDiskon}) x ${banyak} = Rp.${totalHarga}`

            console.log(notif)
        }

        return [totalDiskon, totalHarga]
    }

    /**
     * Tampilkan menu dan info transaksi (item2 pembelian dan jualan), dan
     * perbarui totalBelanja dan totalPoin
     *
     * @param {boolean} tampilkanItemBelumDibeli=true - Apakah tampilkan item2
     *     yang belum dibeli atau tidak
     * @param {boolean} tampilkanMenuKembali=true - Apakah tampilkan menu kembali
     *     atau tidak
     * @return {String[]} - Daftar kode/indeks itemJualan aslinya sesuai dengan
     *     penomoran yang tampil. Digunakan untuk memilih item di suatu menu
     */
    tampilkanPerbarui(tampilkanItemBelumDibeli = true, tampilkanMenuKembali = true) {
        if (!this.sesiMember.valid) {
            throw new Error("sesiMember harus aktif/valid")
        }

        let i = 1
        let iAsli = [""]
        let n
        this.totalBelanja = 0

        if (tampilkanItemBelumDibeli) {
            tampilkanJudul("Item-item belum dibeli", "kepala", null, "-")
            n = 0

            for (const kode in this.sesiJualan.daftarItem) {
                if (typeof this.daftarItem[kode] == "undefined") {
                    this.hitungTotalDiskonHarga(this.sesiJualan.daftarItem[kode], 0, i)
                    iAsli[i] = kode
                    i++
                    n++
                }
            }

            if (n == 0) {
                console.log("")
                tampilkanJudul("(Item sudah dibeli semua)", "pemberitahuanGagal", null, " ")
                console.log("")
            }
        }

        tampilkanJudul("Item-item sudah dibeli", "kepala", null, "-")
        n = 0

        for (const kode in this.daftarItem) {
            let item = this.daftarItem[kode]

            let totalDiskonHarga = this.hitungTotalDiskonHarga(item.itemJualan, item.banyak, i)
            this.totalBelanja += totalDiskonHarga[1]

            iAsli[i] = kode
            i++
            n++
        }

        if (n == 0) {
            console.log("")
            tampilkanJudul("(Belum ada item yang dibeli)", "pemberitahuanGagal", null, " ")
            console.log("")
        }

        this.totalPoin = parseInt(this.totalBelanja / 1000 / 2)

        if (tampilkanMenuKembali) {
            tampilkanJudul("0. Kembali 🔙️", "polos", "-", null, false)
        } else {
            tampilkanJudul("-", "kepala", null, "-", false)
        }

        tampilkanJudul(`Total belanja kamu: Rp.${this.totalBelanja}`, "kepala", null, "+")
        tampilkanJudul(`Poin belanja kamu: ${this.totalPoin}`, "kepala", null, "+")
        console.log("")

        return iAsli
    }

    /**
     * Tampilkan/jalankan menu tambah (membuat) itemTransaksi dan menambah
     * properti "banyak" di suatu instansi Member
     */
    tambahItem() {
        if (!this.sesiMember.valid) {
            throw new Error("sesiMember harus aktif/valid")
        }

        tampilkanJudul("Tambah item")
        let iAsli = this.tampilkanPerbarui()

        let banyak
        let menu = parseInt(tanya("👆️ Pilih item: "))
        let kodeItem = iAsli[menu]
        let itemJualan = this.sesiJualan.daftarItem[kodeItem]

        if (menu == 0) {
            clear()
        } else if (typeof itemJualan != "undefined") {
            banyak = parseInt(tanya("➡️ Banyaknya yang ditambahkan: "))
            clear()

            if (banyak > 0) {
                if (typeof this.daftarItem[kodeItem] == "undefined") {
                    tampilkanJudul("Item baru", "pemberitahuanSukses", null, "=")
                    let totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak)
                    this.daftarItem[kodeItem] = new ItemTransaksi(itemJualan.duplikat(), banyak, totalDiskonHarga[0], totalDiskonHarga[1])
                } else {
                    let item = this.daftarItem[kodeItem]

                    tampilkanJudul("Dari", "pemberitahuanSukses", null, "=")
                    let totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak, -1)
                    this.hitungTotalDiskonHarga(itemJualan, item.banyak)

                    item.banyak += banyak
                    item.totalDiskon += totalDiskonHarga[0]
                    item.totalHarga += totalDiskonHarga[1]

                    tampilkanJudul("Menjadi", "pemberitahuanSukses", null, "=")
                    this.hitungTotalDiskonHarga(itemJualan, item.banyak)
                }

                tampilkanJudul("Item berhasil ditambahkan", "pemberitahuanSukses", null, "=")
                console.log("\n")
            }

            this.tambahItem()
        } else {
            clear()
            this.tambahItem()
        }
    }

    /** Tampilkan/jalankan menu kurangi/hapus itemTransaksi */
    kurangiItem() {
        if (!this.sesiMember.valid) {
            throw new Error("sesiMember harus aktif/valid")
        }

        tampilkanJudul("Kurangi item")
        let iAsli = this.tampilkanPerbarui(false)

        let banyak
        let menu = parseInt(tanya("👆️ Pilih item: "))
        let kodeItem = iAsli[menu]
        let itemJualan = this.sesiJualan.daftarItem[kodeItem]

        if (menu == 0) {
            clear()
        } else if (typeof itemJualan != "undefined" && typeof this.daftarItem[kodeItem] != "undefined") {
            let item = this.daftarItem[kodeItem]
            banyak = parseInt(tanya("➡️ Banyaknya yang dikurangi: "))
            clear()

            if (banyak > 0 && banyak < item.banyak) {
                tampilkanJudul("Dari", "pemberitahuanSukses", null, "=")
                let totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak, -1)
                this.hitungTotalDiskonHarga(itemJualan, item.banyak)

                item.banyak -= banyak
                item.totalDiskon -= totalDiskonHarga[0]
                item.totalHarga -= totalDiskonHarga[1]

                tampilkanJudul("Menjadi", "pemberitahuanSukses", null, "=")
                this.hitungTotalDiskonHarga(itemJualan, item.banyak)
                tampilkanJudul("Item berhasil dikurangi", "pemberitahuanSukses", null, "=")
                console.log("\n")
            } else if (banyak >= item.banyak) {
                delete this.daftarItem[kodeItem]
                tampilkanJudul(`Item ${itemJualan.nama} (${itemJualan.kode}) berhasil dihapus`, "pemberitahuanSukses", null, "=")
                console.log("\n")
            }

            this.kurangiItem()
        } else {
            clear()
            this.kurangiItem()
        }
    }

    /** Proses dan cetak Transaksi dan menambahkannya ke riwayatTransaksi member */
    prosesCetak() {
        if (!this.sesiMember.valid) {
            throw new Error("sesiMember harus aktif/valid")
        }

        let lanjut

        tampilkanJudul("Proses dan cetak transaksi")
        this.sesiMember.item.bersihkanRiwayatTransaksiLama()
        this.tampilkanPerbarui(false, false)

        if (this.totalBelanja == 0) {
            tampilkanJudul("Tidak ada (item) transaksi untuk diproses", "pemberitahuanGagal", null, " ")
            console.log("")
            jeda()
            clear()
        } else {
            if (konfirmasi()) {
                this.sesiMember.item.poin += this.totalPoin
                this.sesiMember.item.riwayatTransaksi.push(this)

                this.sesiMember.nonaktifkan()

                clear()
                tampilkanJudul("Transaksi berhasil diproses", "pemberitahuanSukses", null, "=")
                console.log("\n")
            } else {
                clear()
            }
        }
    }

    /** Membatalkan transaksi */
    batalkan() {
        if (!this.sesiMember.valid) {
            throw new Error("sesiMember harus aktif/valid")
        }

        let jadi = false
        let lanjut

        if (konfirmasi("Batalkan transaksi")) {
            jadi = true
            this.sesiMember.nonaktifkan()

            clear()
            tampilkanJudul("Transaksi dibatalkan", "pemberitahuanSukses", null, "=")
            console.log("\n")
        } else {
            clear()
        }

        return jadi
    }
}