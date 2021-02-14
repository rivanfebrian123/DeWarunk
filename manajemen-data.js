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
// Setiap tipe/kelas di sini wajib mewarisi kelas "Data" dan
// semua constructor itu wajib memiliki parameter "daftarData" yang berupa
// list data hasil parse dari fungsi tanyaDataItem(kodePertanyaan) di fungsi
// tambahItem() di kelas Sesi
//
// Jangan lupa juga untuk memanggil "super(daftarData)" dalam constructor2 itu.
// Omong2, indeks dimulai dari 2 karena index 0 dan satu sudah dipakai untuk
// "kode" dan "nama"
//
// Daftar pertanyaan berupa list dengan indeks sesuai dengan nama variabel
// yang bersangkutan. Isi pertanyaan berformat: TIPE|Isi
//
// Setiap daftarPertanyaan di sini tidak perlu menanyakan kode, karena itu adalah
// urusan Sesi
//
// Kelas2 di sini menggunakan duplikasi data untuk transaksi karena kita
// tidak menggunakan server SQL dan jika kita menggunakan referensi kelas aslinya
// pada daftar item, nanti data akan ikut berubah pada riwayat item jika kita
// mengubah aslinya
import clear from 'console-clear'

import {
    jeda,
    tampilkanJudul
} from './utilitas.js'

class Data {
    kode
    nama
    daftarData

    constructor(daftarData) {
        this.daftarData = daftarData
        this.kode = daftarData[0]
        this.nama = daftarData[1]
    }

    tampilkanInfo() {
        throw new Error("Fungsi 'tampilkanInfo()' harus diimplementasikan")
    }

    duplikat() {
        throw new Error("Fungsi 'duplikat()' harus diimplementasikan")
    }
}

export let daftarPertanyaanMember = []
daftarPertanyaanMember["nama"] = "STR|Nama member: "
daftarPertanyaanMember["noWA"] = "STR|No. WA: "

export class Member extends Data {
    noWA
    poin
    riwayatTransaksi = []
    daftarPromoDiklaim = []

    constructor(daftarData) {
        super(daftarData)
        this.noWA = daftarData[2]
        this.poin = 0
    }

    duplikat() {
        return new Member(this.daftarData)
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
        let n = 0

        tampilkanJudul(`Riwayat transaksi si ${this.nama}`)
        console.log("")

        this.bersihkanRiwayatTransaksiLama()
        n = 0

        for (const i in this.riwayatTransaksi) {
            this.riwayatTransaksi[i].tampilkanPerbarui(false, false)
            console.log("")
            n++
        }

        if (n == 0) {
            tampilkanJudul("(Belum ada riwayat transaksi)", "pemberitahuanGagal", null, " ")
            console.log("")
        }

        jeda()
    }
}

export let daftarPertanyaanPromo = []
daftarPertanyaanPromo["nama"] = "STR|Nama promo/hadiah: "
daftarPertanyaanPromo["poinDiharapkan"] = "INT|Poin diharapkan: "
daftarPertanyaanPromo["batasAkhir"] = "DATE|Batas akhir (TTTT/BB/HH): "
daftarPertanyaanPromo["syaratTambahan"] = "STR|Syarat tambahan (ketik '-' jika tiada): "

export class Promo extends Data {
    poinDiharapkan
    batasAkhir
    syaratTambahan

    constructor(daftarData) {
        super(daftarData)
        this.poinDiharapkan = daftarData[2]
        this.batasAkhir = daftarData[3]

        if (!daftarData[4] || daftarData[4] == "-") {
            this.syaratTambahan = null
        } else {
            this.syaratTambahan = daftarData[4]
        }
    }

    duplikat() {
        return new Promo(this.daftarData)
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

export let daftarPertanyaanJualan = []
daftarPertanyaanJualan["nama"] = "STR|Nama jualan: "
daftarPertanyaanJualan["biayaProduksi"] = "INT|Biaya produksi per hari (Rp.): "
daftarPertanyaanJualan["lamaProduksi"] = "INT|Lama produksi per hari (jam): "
daftarPertanyaanJualan["hargaJual"] = "INT|Harga jual satuan (Rp.): "
daftarPertanyaanJualan["persenDiskon"] = "INT|Persen diskon (%): "

export class Jualan extends Data {
    biayaProduksi
    lamaProduksi
    hargaJual
    persenDiskon

    constructor(daftarData) {
        super(daftarData)
        this.biayaProduksi = daftarData[2]
        this.lamaProduksi = daftarData[3]
        this.hargaJual = daftarData[4]
        this.persenDiskon = daftarData[5]
    }

    duplikat() {
        return new Jualan(this.daftarData)
    }

    tampilkanInfo() {
        console.log(`| ${this.kode}  -  ${this.nama}`)
        console.log(`| Harga jual satuan: Rp.${this.hargaJual}    Diskon: ${this.persenDiskon}% (Rp.${this.hargaJual * this.persenDiskon / 100})`)
        console.log(`| Biaya produksi: Rp.${this.biayaProduksi}/hari    Lama produksi: ${this.lamaProduksi} jam/hari`)
    }
}