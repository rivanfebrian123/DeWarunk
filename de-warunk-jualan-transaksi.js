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
    konfirmasi,
    jeda,
    hitungTotalDiskonHarga,
    tampilkanJudul
} from './de-warunk-lintas-bidang.js'

export class Promo {
    kode
    poinDiharapkan
    hadiah
    batasAkhir
    syaratTambahan

    constructor(kode, poinDiharapkan, hadiah, batasAkhir, syaratTambahan = null) {
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

    tampilkanDaftarJualan() {
        for (const kode in this.daftarJualan) {
            let item = this.daftarJualan[kode]

            console.log(`| ${item.kode}  -  ${item.nama}`)
            console.log(`| Harga jual: Rp.${item.hargaJual}    Diskon: ${item.persenDiskon}% (Rp.${item.hargaJual * item.persenDiskon / 100})`)
            console.log(`| Biaya produksi: Rp.${item.biayaProduksi}/hari    Lama produksi: ${item.lamaProduksi} jam/hari\n`)
        }

        jeda()
    }

    tampilkanDaftarPromo() {
        for (const kode in this.daftarPromo) {
            let item = this.daftarPromo[kode]

            console.log(`| ${item.kode}  -  ${item.hadiah}`)
            console.log(`| Poin diharapkan: ${item.poinDiharapkan}`)
            console.log(`| Batas waktu akhir: ${item.batasAkhir.toLocaleString("id-ID")}`)

            if (item.syaratTambahan) {
                console.log(`| Syarat tambahan: ${item.syaratTambahan}`)
            }

            console.log("")
        }

        jeda()
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
    //istilah "item" di sini adalah item dari kelas ini, sedangkan "itemJualan"
    //adalah item dari kelas Jualan
    jualan
    sesi
    waktu
    daftarItem = []
    totalBelanja
    totalPoin

    constructor(jualan, sesi) {
        this.jualan = jualan
        this.sesi = sesi
        this.waktu = new Date()
        this.totalBelanja = 0
        this.totalPoin = 0
    }

    tampilkanPerbarui(tampilkanItemBelumDibeli = true, tampilkanMenuKembali = true) {
        let i = 1
        let iAsli = [""]
        this.totalBelanja = 0

        if (tampilkanItemBelumDibeli) {
            tampilkanJudul("Item-item belum dibeli", null, "-")
            for (const kode in this.jualan.daftarJualan) {
                if (typeof this.daftarItem[kode] == "undefined") {
                    hitungTotalDiskonHarga(this.jualan.daftarJualan[kode], 0, i)
                    iAsli[i] = kode
                    i++
                }
            }
        }

        tampilkanJudul("Item-item sudah dibeli", null, "-")
        for (const kode in this.daftarItem) {
            let item = this.daftarItem[kode]

            let totalDiskonHarga = hitungTotalDiskonHarga(item.itemJualan, item.banyak, i)
            this.totalBelanja += totalDiskonHarga[1]

            iAsli[i] = kode
            i++
        }

        this.totalPoin = parseInt(this.totalBelanja / 1000 / 2)

        if (tampilkanMenuKembali) {
            tampilkanJudul("0. Kembali", "-", null, false)
        } else {
            tampilkanJudul("-", null, "-", false)
        }

        tampilkanJudul(`Total belanja kamu: Rp.${this.totalBelanja}`, null, "+")
        tampilkanJudul(`Poin belanja kamu: ${this.totalPoin}`, null, "+")
        console.log("")

        return iAsli
    }

    tambahItem() {
        tampilkanJudul("Tambah item")
        let iAsli = this.tampilkanPerbarui()

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
                    tampilkanJudul("Item baru", null, "=")
                    let totalDiskonHarga = hitungTotalDiskonHarga(itemJualan, banyak)
                    this.daftarItem[kodeItem] = new ItemTransaksi(itemJualan, banyak, totalDiskonHarga[0], totalDiskonHarga[1])
                } else {
                    let item = this.daftarItem[kodeItem]

                    tampilkanJudul("Dari", null, "=")
                    let totalDiskonHarga = hitungTotalDiskonHarga(itemJualan, banyak, -1)
                    hitungTotalDiskonHarga(itemJualan, item.banyak)

                    item.banyak += banyak
                    item.totalDiskon += totalDiskonHarga[0]
                    item.totalHarga += totalDiskonHarga[1]

                    tampilkanJudul("Menjadi", null, "=")
                    hitungTotalDiskonHarga(itemJualan, item.banyak)
                }

                tampilkanJudul("Item berhasil ditambahkan", null, "=")
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
                tampilkanJudul("Dari", null, "=")
                let totalDiskonHarga = hitungTotalDiskonHarga(itemJualan, banyak, -1)
                hitungTotalDiskonHarga(itemJualan, item.banyak)

                item.banyak -= banyak
                item.totalDiskon -= totalDiskonHarga[0]
                item.totalHarga -= totalDiskonHarga[1]

                tampilkanJudul("Menjadi", null, "=")
                hitungTotalDiskonHarga(itemJualan, item.banyak)
                tampilkanJudul("Item berhasil dikurangi", null, "=")
                console.log("\n")
            } else if (banyak >= item.banyak) {
                delete this.daftarItem[kodeItem]
                tampilkanJudul(`Item ${itemJualan.nama} (${itemJualan.kode}) berhasil dihapus`, null, "=")
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
        this.sesi.member.bersihkanRiwayatTransaksiLama()
        this.tampilkanPerbarui(false, false)

        if (konfirmasi()) {
            this.sesi.member.poin += this.totalPoin
            this.sesi.member.riwayatTransaksi.push(this)

            this.sesi.nonaktifkan()

            clear()
            tampilkanJudul("Transaksi berhasil diproses", null, "=")
            console.log("\n")
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
            tampilkanJudul("Transaksi dibatalkan", null, "=")
            console.log("\n")
        } else {
            clear()
        }

        return jadi
    }
}