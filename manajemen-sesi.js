/* manajemen-sesi.js
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
    tampilkanJudul,
    jeda,
    konfirmasi
} from './utilitas.js'

export class Sesi {
    Tipe
    nama
    valid
    item
    daftarItem = []
    daftarPertanyaan = []
    tag

    constructor(Tipe, nama, daftarPertanyaan) {
        this.Tipe = Tipe
        this.nama = nama
        this.daftarPertanyaan = daftarPertanyaan
        this.valid = false
        this.tag = ""
    }

    aktifkanCek(opsi = "lanjutJikaAda", judul = null, pertanyaan = null, validasiUlang = false) {
        let jadi
        let notif

        do {
            jadi = false
            notif = null

            if (validasiUlang) {
                this.valid = false
            }

            tampilkanJudul(judul)

            if (!pertanyaan) {
                pertanyaan = `Kode ${this.nama.toLowerCase()} (besar kecil huruf berpengaruh): `
            }

            if (opsi == "lanjutJikaAda+") {
                console.log(`Y. Tambah ${this.nama.toLowerCase()}`)
            }

            console.log("X. Batal")
            tampilkanJudul("-", null, "-", false)
            this.tag = input.question(pertanyaan)

            if (this.tag.toLowerCase() == "x") {
                // biarkan saja
            } else if (this.tag == "0") {
                notif = "Input tidak valid, coba lagi"
            } else if (this.tag.toLowerCase() == "y") {
                if (opsi == "lanjutJikaAda+") {
                    console.log("\n")

                    if (this.tambahItem(false)) { //mempengaruhi this.tag
                        jadi = true
                        this.valid = true //paksa, karena fungsi itu tidak memvalidasi
                        this.item = this.daftarItem[this.tag]
                    } else {
                        console.log("\n")
                        this.tag = "" //agar perulangan tidak berhenti jika "x"
                    }
                } else {
                    notif = "Input tidak valid, coba lagi"
                }
            } else if (typeof this.daftarItem[this.tag] == "undefined") {
                if (opsi == "lanjutJikaAda" || opsi == "lanjutJikaAda+") {
                    notif = `Kode ${this.nama.toLowerCase()} tidak ditemukan, coba lagi`
                } else {
                    jadi = true
                }
            } else {
                if (opsi == "lanjutJikaTiada") {
                    notif = `Kode ${this.nama.toLowerCase()} sudah digunakan, coba lagi`
                } else {
                    jadi = true
                    this.valid = true
                    this.item = this.daftarItem[this.tag]
                }
            }

            if (notif) {
                console.log("\n")
                tampilkanJudul(notif, null, "=")
                console.log("")
            }

        } while (!jadi && this.tag.toLowerCase() != "x")

        return jadi
    }

    nonaktifkan() {
        this.item = null
        this.tag = ""
        this.valid = false
    }

    ubahKodeItem(kodeLama) {
        //fungsi ini bersifat mengaktifkan sesi tapi tanpa validasi
        if (this.aktifkanCek("lanjutJikaTiada", `Ubah kode ${this.nama.toLowerCase()}`, `Kode ${this.nama.toLowerCase()} baru (besar kecil huruf berpengaruh): `)) {
            this.daftarItem[this.tag] = this.daftarItem[kodeLama]
            this.item = this.daftarItem[this.tag]
            this.item.kode = this.tag

            delete this.daftarItem[kodeLama]
            clear()

            tampilkanJudul(`Kode ${this.nama.toLowerCase()} berhasil diubah`, null, "=")
            console.log("\n")
        } else {
            clear()
        }
    }

    tambahItem(bersihkanJikaBatal = true) {
        //fungsi ini bersifat mengaktifkan sesi, mengubah tag, dan juga
        //digunakan di this.aktifkanCek()
        let daftarData = []
        let jadi = false

        if (this.aktifkanCek("lanjutJikaTiada", `Tambah ${this.nama.toLowerCase()}`)) {
            daftarData.push(this.tag)

            for (const kode in this.daftarPertanyaan) {
                let jawaban = input.question(this.daftarPertanyaan[kode])

                if (jawaban.toLowerCase() == "x") {
                    jadi = false
                    break
                } else {
                    daftarData.push(jawaban)
                    jadi = true
                }
            }
        }

        if (jadi) {
            this.daftarItem[this.tag] = new this.Tipe(daftarData)
            let item = this.daftarItem[this.tag]

            clear()
            tampilkanJudul(`${this.nama} "${item.nama}" (${item.kode}) berhasil ditambah`, null, "=")
            console.log("\n")
        } else if (bersihkanJikaBatal) {
            clear()
        }

        return jadi
    }

    hapusItem(kodeLama) {
        // wajib diaktivasi terlebih dahulu
        if (konfirmasi(`Hapus ${this.nama.toLowerCase()}`)) {
            let item = this.daftarItem[kodeLama]
            let notif = `${this.nama} "${item.nama}" (${item.kode}) berhasil dihapus`

            delete this.daftarItem[kodeLama]
            this.nonaktifkan()

            clear()
            tampilkanJudul(notif, null, "=")
            console.log("\n")
        } else {
            clear()
        }
    }

    tampilkanDaftarItem() {
        for (const kode in this.daftarItem) {
            this.daftarItem[kode].tampilkanInfo()
            console.log("")
        }

        console.log("")
        jeda()
    }
}