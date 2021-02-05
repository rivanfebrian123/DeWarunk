/* de-warunk-jualan-transaksi.js
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
    konfirmasi
} from './de-warunk-lintas-bidang.js'


export class Promo {
    kode
    poinDiharapkan
    hadiah
    batasAkhir
    syaratTambahan

    constructor(kode, poinDiharapkan, hadiah, batasAkhir, syaratTambahan = "-") {
        this.kode = kode
        this.poinDiharapkan = poinDiharapkan
        this.hadiah = hadiah
        this.batasAkhir = batasAkhir
        this.syaratTambahan = syaratTambahan
    }
}


export class ItemJualan {
    kode
    nama
    biayaProduksi
    lamaProduksi
    hargaJual
    persenDiskon

    constructor(kode, nama, biayaProduksi, lamaProduksi, hargaJual, persenDiskon) {
        this.kode = kode
        this.nama = nama
        this.biayaProduksi = biayaProduksi
        this.lamaProduksi = lamaProduksi
        this.hargaJual = hargaJual
        this.persenDiskon = persenDiskon
    }
}


export class Jualan {
    daftarJualan = []
    daftarPromo = []

    tampilkan() {
        console.log("==========================")
        console.log("Jualanku")
        console.log("==========================")
        console.log("No\t\tKode\t\tNama\t\tBiaya produksi\t\tLama produksi\t\tHarga jual\t\tPersen diskon")
        console.log("------------------------------------------------------------------------------------------")

        for (const [i, item] of this.daftarJualan.entries()) {
            console.log(`${i}\t\t${item.kode}\t\t${item.nama}\t\t${item.biayaProduksi}\t\t${item.lamaProduksi}\t\t${item.hargaJual}\t\t${item.persenDiskon}`)
        }
    }

    bersihkanPromoLama() {
        let waktu = new Date()

        for (const kode in this.daftarPromo) {
            if (this.daftarPromo[kode].batasAkhir < waktu) {
                delete this.daftarPromo[kode]
            }
        }
    }

    tambahJualan() {

    }
}


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
    // istilah "item" di sini adalah item dari kelas ini, sedangkan "itemJualan"
    // adalah item dari kelas Jualan
    jualan
    sesi
    waktu
    daftarItem = []
    totalBelanja = 0
    totalPoin = 0

    constructor(jualan, sesi) {
        this.waktu = new Date()
        this.jualan = jualan
        this.sesi = sesi
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

    tampilkanPerbarui(tampilkanItemBelumDibeli) {
        let i = 1
        let iAsli = [""]
        this.totalBelanja = 0

        if (tampilkanItemBelumDibeli) {
            console.log("---------Item2 belum dibeli-----------")
            for (const kode in this.jualan.daftarJualan) {
                if (typeof this.daftarItem[kode] == "undefined") {
                    this.hitungTotalDiskonHarga(this.jualan.daftarJualan[kode], 0, i)
                    iAsli[i] = kode
                    i++
                }
            }
        }

        console.log("---------Item2 sudah dibeli-----------")
        for (const kode in this.daftarItem) {
            let item = this.daftarItem[kode]

            let totalDiskonHarga = this.hitungTotalDiskonHarga(item.itemJualan, item.banyak, i)
            this.totalBelanja += totalDiskonHarga[1]

            iAsli[i] = kode
            i++
        }

        this.totalPoin = parseInt(this.totalBelanja / 1000 / 2)

        console.log("--------------------------------------")
        console.log("0. Kembali")
        console.log("--------------------------------------")
        console.log(`===Total belanja kamu: Rp.${this.totalBelanja}===`)
        console.log(`===Poin belanja kamu: ${this.totalPoin}===\n`)

        return iAsli
    }

    tambahItem() {
        console.log("======================================")
        console.log("Tambah item")
        console.log("======================================")
        let iAsli = this.tampilkanPerbarui(true)

        let banyak
        let menu = parseInt(input.question("Pilih item: "))
        let kodeItem = iAsli[menu]
        let itemJualan = this.jualan.daftarJualan[kodeItem]

        if (menu == 0) {
            clear()
        } else if (typeof itemJualan != "undefined") {
            banyak = parseInt(input.question("Banyaknya yang ditambahkan: "))
            clear()

            if (banyak > 0) {
                if (typeof this.daftarItem[kodeItem] == "undefined") {
                    console.log("-------------Item baru------------")
                    let totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak)
                    this.daftarItem[kodeItem] = new ItemTransaksi(itemJualan, banyak, totalDiskonHarga[0], totalDiskonHarga[1])
                } else {
                    let item = this.daftarItem[kodeItem]

                    console.log("--------------Dari----------------")
                    let totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak, -1)
                    this.hitungTotalDiskonHarga(itemJualan, item.banyak)

                    item.banyak += banyak
                    item.totalDiskon += totalDiskonHarga[0]
                    item.totalHarga += totalDiskonHarga[1]

                    console.log("-------------Menjadi--------------")
                    this.hitungTotalDiskonHarga(itemJualan, item.banyak)
                }

                console.log("====Item berhasil ditambahkan====\n\n")
            }

            this.tambahItem()
        } else {
            clear()
            this.tambahItem()
        }
    }

    kurangiItem() {
        console.log("=====================")
        console.log("Kurangi item")
        console.log("=====================")
        let iAsli = this.tampilkanPerbarui(false)

        let banyak
        let menu = parseInt(input.question("Pilih item: "))
        let kodeItem = iAsli[menu]
        let itemJualan = this.jualan.daftarJualan[kodeItem]

        if (menu == 0) {
            clear()
        } else if (typeof itemJualan != "undefined" && typeof this.daftarItem[kodeItem] != "undefined") {
            let item = this.daftarItem[kodeItem]
            banyak = parseInt(input.question("Banyaknya yang dikurangi: "))
            clear()

            if (banyak > 0 && banyak < item.banyak) {
                console.log("--------------Dari----------------")
                let totalDiskonHarga = this.hitungTotalDiskonHarga(itemJualan, banyak, -1)
                this.hitungTotalDiskonHarga(itemJualan, item.banyak)

                item.banyak -= banyak
                item.totalDiskon -= totalDiskonHarga[0]
                item.totalHarga -= totalDiskonHarga[1]

                console.log("-------------Menjadi--------------")
                this.hitungTotalDiskonHarga(itemJualan, item.banyak)
                console.log("====Item berhasil dikurangi====\n\n")
            } else if (banyak >= item.banyak) {
                delete this.daftarItem[kodeItem]
                console.log(`====Item ${itemJualan.nama} (${itemJualan.kode}) berhasil dihapus====\n\n`)
            }

            this.kurangiItem()
        } else {
            clear()
            this.kurangiItem()
        }
    }

    prosesCetak() {
        let lanjut

        console.log("==========================")
        console.log("Proses dan cetak transaksi")
        console.log("==========================")
        this.sesi.member.bersihkanRiwayatTransaksiLama()
        this.tampilkanPerbarui(false)

        if (konfirmasi()) {
            this.sesi.member.poin += this.totalPoin
            this.sesi.member.riwayatTransaksi.push(this)

            this.sesi.nonaktifkan()

            clear()
            console.log("====Transaksi berhasil diproses====\n\n")
        } else {
            clear()
        }
    }

    batalkan() {
        let jadi = false
        let lanjut

        if (konfirmasi("Batalkan transaksi")) {
            jadi = true
            this.sesi.nonaktifkan()

            clear()
            console.log("====Transaksi dibatalkan====\n\n")
        } else {
            clear()
        }

        return jadi
    }
}
