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
import clear from 'console-clear'

import {
    tampilkanJudul,
    konfirmasi,
    tanya,
    jeda
} from './utilitas.js'

export class ItemTransaksi {
    itemJualan
    banyak
    totalDiskon
    totalHarga

    constructor(itemJualan, banyak, totalDiskon, totalHarga) {
        this.itemJualan = itemJualan
        this.banyak = banyak
        this.totalDiskon = totalDiskon
        this.totalHarga = totalHarga
    }
}

export class Transaksi {
    // "item" di sini adalah ItemTransaksi, sedangkan "itemJualan"
    // adalah item dari daftarJualan dari sesi Jualan, tentunya
    sesiJualan
    sesiMember
    waktu
    daftarItem = []
    totalBelanja
    totalPoin

    constructor(manajemen) {
        this.sesiJualan = manajemen.sesiJualan
        this.sesiMember = manajemen.sesiMember
        this.waktu = new Date()
        this.totalBelanja = 0
        this.totalPoin = 0
    }

    hitungTotalDiskonHarga(itemJualan, banyak, i = 0) {
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

    tampilkanPerbarui(tampilkanItemBelumDibeli = true, tampilkanMenuKembali = true) {
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

    tambahItem() {
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

    kurangiItem() {
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

    prosesCetak() {
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

    batalkan() {
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