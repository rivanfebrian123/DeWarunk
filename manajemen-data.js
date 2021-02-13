/* manajemen-data.js
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

// PERHATIAN:
// setiap tipe/kelas di sini wajib memiliki:
// * variabel "kode"
// * variabel "nama"
// * fungsi "tampilkanInfo()"

import input from 'readline-sync'
import clear from 'console-clear'

import {
    inputKonfirmasi,
    jeda
} from './utilitas.js'

export class Member {
    kode
    nama
    noWA
    poin
    riwayatTransaksi = []
    daftarPromoDiklaim = []

    constructor(daftarData) {
        this.kode = daftarData[0]
        this.nama = daftarData[1]
        this.noWA = daftarData[2]
        this.poin = 0
    }

    tampilkanInfo() {
        console.log(`| ${this.kode}  -  ${this.nama}  -  ${this.poin} poin`)
        console.log(`| No. WA: ${this.noWA}`)
    }

    bersihkanKlaimPromoLama() {
        let waktu = new Date()

        for (const kode in this.daftarPromoDiklaim) {
            if (this.daftarPromoDiklaim[kode].batasAkhir < waktu) {
                delete this.daftarPromoDiklaim[kode]
            }
        }
    }

    bersihkanRiwayatTransaksiLama() {
        let banyak = this.riwayatTransaksi.length
        let sisa

        if (banyak > 25) {
            sisa = banyak - 25

            for (let i = 1; i <= sisa; i++) {
                this.riwayatTransaksi.shift()
            }
        }
    }

    tampilkanRiwayatTransaksi() {
        this.bersihkanRiwayatTransaksiLama()

        for (const i in this.riwayatTransaksi) {
            this.riwayatTransaksi[i].tampilkanPerbarui(false, false)
            console.log("")
        }

        jeda()
    }

    ubahNama() {
        this.nama = inputKonfirmasi(this.nama, "Nama member")
    }

    ubahNoWA() {
        this.noWA = inputKonfirmasi(this.noWA, "No. WA member")
    }
}

export class Promo {
    kode
    nama
    poinDiharapkan
    batasAkhir
    syaratTambahan

    constructor(daftarData) {
        this.kode = daftarData[0]
        this.nama = daftarData[1]
        this.poinDiharapkan = daftarData[2]
        this.batasAkhir = daftarData[3]
        this.syaratTambahan = daftarData[4]
    }

    tampilkanInfo() {
        console.log(`| ${this.kode}  -  ${this.nama}`)
        console.log(`| Poin diharapkan: ${this.poinDiharapkan}`)
        console.log(`| Batas waktu akhir: ${this.batasAkhir.toLocaleString("id-ID")}`)

        if (this.syaratTambahan) {
            console.log(`| Syarat tambahan: ${this.syaratTambahan}`)
        }
    }
}

export class Jualan {
    kode
    nama
    biayaProduksi
    lamaProduksi
    hargaJual
    persenDiskon

    constructor(daftarData) {
        this.kode = daftarData[0]
        this.nama = daftarData[1]
        this.biayaProduksi = daftarData[2]
        this.lamaProduksi = daftarData[3]
        this.hargaJual = daftarData[4]
        this.persenDiskon = daftarData[5]
    }

    tampilkanInfo() {
        console.log(`| ${this.kode}  -  ${this.nama}`)
        console.log(`| Harga jual: Rp.${this.hargaJual}    Diskon: ${this.persenDiskon}% (Rp.${this.hargaJual * this.persenDiskon / 100})`)
        console.log(`| Biaya produksi: Rp.${this.biayaProduksi}/hari    Lama produksi: ${this.lamaProduksi} jam/hari`)
    }
}